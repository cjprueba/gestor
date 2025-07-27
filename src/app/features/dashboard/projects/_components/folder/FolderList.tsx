import { useCarpetaContenido, useCreateCarpeta, useCarpetasProyecto, useRenombrarCarpeta, useMoverCarpeta } from "@/lib/api/hooks/useProjects"
import { useDocumentos } from "@/lib/api/hooks/useDocumentos"
import { useFileSearch, useFolderSearch } from "@/lib/api"
import { Button } from "@/shared/components/design-system/button"
import { Calendar as CalendarComponent } from "@/shared/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/components/ui/dialog"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { cn } from "@/shared/lib/utils"
import { downloadFileFromBase64, createBlobUrlFromBase64, revokeBlobUrl } from "@/shared/lib/file-utils"
import { getStageColor } from "@/shared/utils/stage-colors"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { ArrowLeft, CalendarIcon, FileText, FolderOpen, Plus, Search, Upload } from "lucide-react"
import { useCallback, useEffect, useRef, useState, useMemo } from "react"
import { useQueryClient } from "@tanstack/react-query"
import AlertsPanel from "../alert/AlertPanelList"
import DetailsSheet from "../DetailsSheet"
import { FolderCard } from "./FolderCard"
import MoveFolderDialog from "./MoveFolderDialog"
// import { ProjectDetailsModal } from "./project/ProjectDetailModal"
import RenameFolderDialog from "./RenameFolderDialog"
import { SearchHeader } from "../search-header"
import { DocumentContextMenu } from "../document-context-menu"
import { DocumentPreviewModal } from "../document-preview-modal"
import { DeleteConfirmationDialog } from "./DeleteFolderConfirmationModal"
import type { ProyectoListItem } from "../project/project.types"
import type { CarpetaItem, CreateCarpetaRequest, DocumentoItem } from "./folder.types"

// Tipo extendido para documento con URL de preview temporal
interface DocumentoItemWithPreview extends DocumentoItem {
  previewUrl?: string;
}

interface ProjectViewProps {
  project: ProyectoListItem
  onBack: () => void
  onUpdateProject: (project: ProyectoListItem) => void
}

// Componente para texto animado (cuando los nombres de archivos son muy largos)
interface AnimatedTextProps {
  text: string
  className?: string
}

const AnimatedText = ({ text, className = "" }: AnimatedTextProps) => {
  const [isOverflowing, setIsOverflowing] = useState(false)
  const [shouldAnimate, setShouldAnimate] = useState(false)
  const textRef = useRef<HTMLSpanElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const checkOverflow = () => {
      if (textRef.current && containerRef.current) {
        const textWidth = textRef.current.scrollWidth
        const containerWidth = containerRef.current.clientWidth
        const isOverflow = textWidth > containerWidth
        setIsOverflowing(isOverflow)

        if (isOverflow) {
          const timer = setTimeout(() => {
            setShouldAnimate(true)
          }, 3000)
          return timer
        } else {
          setShouldAnimate(false)
        }
      }
    }

    const cleanup = checkOverflow()
    window.addEventListener('resize', checkOverflow)

    return () => {
      window.removeEventListener('resize', checkOverflow)
      if (cleanup) {
        clearTimeout(cleanup)
      }
    }
  }, [text])

  const animationDuration = shouldAnimate ? `${Math.max(text.length * 0.2, 1)}s` : undefined

  return (
    <div
      ref={containerRef}
      className={cn("overflow-hidden relative w-full", className)}
      onMouseEnter={() => setShouldAnimate(false)}
      onMouseLeave={() => isOverflowing && setTimeout(() => setShouldAnimate(true), 500)}
    >
      <span
        ref={textRef}
        className="text-sm whitespace-nowrap inline-block"
        style={{
          transform: shouldAnimate ? 'translateX(-100%)' : 'translateX(0)',
          transition: shouldAnimate ? `transform ${animationDuration} linear infinite` : 'none',
          animation: shouldAnimate ? `marquee ${animationDuration} linear infinite` : 'none',
        }}
      >
        {text}
      </span>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  )
}

export default function FolderList({ project, onBack }: ProjectViewProps) {
  const queryClient = useQueryClient()

  // Estado para navegación de carpetas
  // const [currentCarpetaId, setCurrentCarpetaId] = useState<number | undefined>(
  //   project.targetFolderId || project.carpeta_raiz_id
  // )

  const [currentCarpetaId, setCurrentCarpetaId] = useState<number | undefined>(project.carpeta_raiz_id)

  const [navigationPath, setNavigationPath] = useState<Array<{ id: number, nombre: string }>>([])

  // Estados para búsqueda avanzada
  const [folderSearchTerm, setFolderSearchTerm] = useState("")
  const [documentSearchTerm, setDocumentSearchTerm] = useState("")
  const [selectedStages, setSelectedStages] = useState<string[]>([])
  const [selectedTiposObra, setSelectedTiposObra] = useState<string[]>([])

  // Estados para modales y diálogos
  const [isProjectDetailsOpen, setIsProjectDetailsOpen] = useState(false)
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [isCreateFolderDialogOpen, setIsCreateFolderDialogOpen] = useState(false)
  const [isDetailsSheetOpen, setIsDetailsSheetOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false)
  const [isMoveDialogOpen, setIsMoveDialogOpen] = useState(false)
  const [selectedFolderForAction, setSelectedFolderForAction] = useState<any>(null)

  // Estados para subir documentos
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [selectedTipoDocumentoId, setSelectedTipoDocumentoId] = useState<number | null>(null)
  // const [selectedFolderId, setSelectedFolderId] = useState<string>("")
  // const [showDestinationSelector, setShowDestinationSelector] = useState(false)
  const [documentConfig, setDocumentConfig] = useState({
    hasAlert: false,
    alertType: "due_date" as "due_date" | "days_after",
    alertDate: "",
    alertDays: 7,
  })

  // Estados para crear carpetas
  const [newFolderName, setNewFolderName] = useState("")
  const [newFolderDescription, setNewFolderDescription] = useState("")
  const [newFolderMinDocs, setNewFolderMinDocs] = useState(3)
  const [showFolderSelector, setShowFolderSelector] = useState(false)
  const [selectedParentFolderId, setSelectedParentFolderId] = useState<number | null>(null)

  // Estado para preview de documento
  const [previewedDocument, setPreviewedDocument] = useState<DocumentoItemWithPreview | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  // Estado para diálogo de confirmación de eliminación
  const [documentToDelete, setDocumentToDelete] = useState<DocumentoItem | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  // Hook para descargar documento
  const { useDownloadDocumentoBase64, useDeleteDocumento, useGetTiposDocumento } = useDocumentos()
  const downloadDocumentoBase64Mutation = useDownloadDocumentoBase64()
  const deleteDocumentoMutation = useDeleteDocumento()
  const { data: tiposDocumento } = useGetTiposDocumento()

  // Hooks de búsqueda con la API (filtrando por proyecto)
  const { data: apiFileResults, isFetching: isSearchingFiles, error: fileSearchError } = useFileSearch(
    documentSearchTerm,
    { proyecto_id: project.id.toString() }
  )
  const { data: apiFolderResults, isFetching: isSearchingFolders } = useFolderSearch(
    folderSearchTerm, // Solo buscar carpetas cuando hay término específico de carpetas
    { proyecto_id: project.id.toString() }
  )

  // Limpiar targetFolderId después de usarlo para evitar interferencias en la navegación
  // useEffect(() => {
  //   if (project.targetFolderId) {
  //     // Limpiar el targetFolderId del proyecto después de usarlo
  //     const projectWithoutTarget = { ...project }
  //     delete projectWithoutTarget.targetFolderId
  //     // Nota: En una implementación real, esto debería actualizar el estado del proyecto padre
  //   }
  // }, [project.targetFolderId])

  // Obtener contenido de la carpeta actual
  const { data: carpetaData, isLoading, error } = useCarpetaContenido(project.carpeta_raiz_id)

  // Obtener carpetas del proyecto para el selector
  const { data: carpetasProyecto } = useCarpetasProyecto(project.id)

  // Hook para crear carpeta
  const createCarpetaMutation = useCreateCarpeta()

  // Hooks para renombrar y mover carpetas
  const renameCarpetaMutation = useRenombrarCarpeta()
  const moveCarpetaMutation = useMoverCarpeta()

  // Hooks para documentos
  const { useUploadDocumentos } = useDocumentos()
  const uploadDocumentosMutation = useUploadDocumentos()

  // Funciones de navegación
  const navigateToFolder = useCallback((carpetaId: number) => {
    console.log("📁 [DEBUG] Navegando a carpeta:", {
      carpetaId,
      currentCarpetaId: project.carpeta_raiz_id,
      isFromSearch: folderSearchTerm ? true : false,
      currentCarpeta: carpetaData?.carpeta?.nombre
    })

    if (project.carpeta_raiz_id) {
      const currentCarpeta = carpetaData?.carpeta
      if (currentCarpeta) {
        setNavigationPath(prev => [...prev, { id: project.carpeta_raiz_id, nombre: currentCarpeta.nombre }])
      }
    }
    setCurrentCarpetaId(carpetaId)

    // Limpiar búsquedas después de navegar
    if (folderSearchTerm || documentSearchTerm) {
      console.log("📁 [DEBUG] Limpiando búsquedas después de navegar")
      setFolderSearchTerm("")
      setDocumentSearchTerm("")
    }
  }, [currentCarpetaId, carpetaData, folderSearchTerm, documentSearchTerm])

  const navigateBack = useCallback(() => {
    if (navigationPath.length > 0) {
      const previousCarpeta = navigationPath[navigationPath.length - 1]
      setCurrentCarpetaId(previousCarpeta.id)
      setNavigationPath(prev => prev.slice(0, -1))
    } else {
      onBack()
    }
  }, [navigationPath, onBack])

  // Determinar qué contenido mostrar basado en el estado de búsqueda
  const getContentToDisplay = () => {
    // Si hay búsqueda de documentos, no mostrar contenido local
    if (documentSearchTerm) {
      return {
        folders: [], // No mostrar carpetas locales durante búsqueda de documentos
        documents: [], // No mostrar documentos locales durante búsqueda de documentos
        showLocalContent: false
      }
    }

    // Si hay búsqueda de carpetas, mostrar resultados de búsqueda en lugar de contenido local
    if (folderSearchTerm) {
      return {
        folders: searchedFolders, // Mostrar resultados de búsqueda de carpetas
        documents: [], // No mostrar documentos durante búsqueda de carpetas
        showLocalContent: true // Mantener la estructura de grid
      }
    }

    // Si no hay búsqueda, mostrar contenido local de la carpeta actual
    const folders = carpetaData?.contenido?.carpetas || []
    const documents = carpetaData?.contenido?.documentos || []

    return {
      folders,
      documents,
      showLocalContent: true
    }
  }

  // Función para limpiar filtros
  const clearAllFilters = () => {
    setFolderSearchTerm("")
    setDocumentSearchTerm("")
    setSelectedStages([])
    setSelectedTiposObra([])
  }

  // Función para obtener carpetas disponibles para el selector
  const getAvailableFolders = () => {
    if (!carpetasProyecto?.data) return []

    const currentCarpeta = carpetaData?.carpeta
    if (!currentCarpeta) {
      // Eliminar duplicados por ID
      const uniqueFolders = carpetasProyecto.data.filter((carpeta, index, self) =>
        index === self.findIndex(c => c.id === carpeta.id)
      )
      return uniqueFolders
    }

    // Filtrar carpetas que están en un nivel jerárquico inferior
    // No mostrar carpetas padre de la carpeta actual
    const filteredFolders = carpetasProyecto.data.filter(carpeta => {
      // Si la carpeta actual no tiene padre, mostrar todas las carpetas del proyecto
      if (!currentCarpeta.carpeta_padre) return true

      // Si la carpeta actual tiene padre, solo mostrar carpetas que no sean padres
      // de la carpeta actual (es decir, carpetas que estén al mismo nivel o inferior)
      return carpeta.id !== currentCarpeta.carpeta_padre.id
    })

    // Eliminar duplicados por ID
    return filteredFolders.filter((carpeta, index, self) =>
      index === self.findIndex(c => c.id === carpeta.id)
    )
  }

  // Función para construir el path de una carpeta
  const getFolderPath = (folderId: number): string => {
    const allFolders = carpetasProyecto?.data || []
    const path: string[] = []

    const buildPath = (id: number): void => {
      const folder = allFolders.find(f => f.id === id)
      if (!folder) return

      path.unshift(folder.nombre)
      if (folder.carpeta_padre_id) {
        buildPath(folder.carpeta_padre_id)
      }
    }

    buildPath(folderId)
    return path.join(" > ")
  }

  // Función para obtener el nombre de la carpeta seleccionada
  const getSelectedFolderName = (): string => {
    if (!selectedParentFolderId) {
      return currentCarpeta?.nombre || "Raíz del proyecto"
    }

    const selectedFolder = carpetasProyecto?.data?.find(f => f.id === selectedParentFolderId)
    return selectedFolder?.nombre || "Carpeta no encontrada"
  }

  // Función para organizar carpetas por secciones jerárquicas
  const getOrganizedFolders = () => {
    const folders = getAvailableFolders()
    const currentCarpeta = carpetaData?.carpeta

    if (!currentCarpeta) {
      // Si estamos en la raíz, organizar por carpetas raíz y sus hijas
      const rootFolders = folders.filter(folder => !folder.carpeta_padre_id)
      const childFolders = folders.filter(folder => folder.carpeta_padre_id)

      return {
        sections: [
          {
            title: "Carpetas raíz",
            folders: rootFolders,
            type: "root"
          },
          ...(childFolders.length > 0 ? [{
            title: "Subcarpetas",
            folders: childFolders,
            type: "children"
          }] : [])
        ]
      }
    }

    // Si estamos en una carpeta específica, organizar por hermanas e hijas
    const siblingFolders = folders.filter(folder =>
      folder.carpeta_padre_id === currentCarpeta.carpeta_padre?.id
    )
    const childFolders = folders.filter(folder =>
      folder.carpeta_padre_id === currentCarpeta.id
    )
    const otherFolders = folders.filter(folder =>
      folder.carpeta_padre_id !== currentCarpeta.carpeta_padre?.id &&
      folder.carpeta_padre_id !== currentCarpeta.id
    )

    const sections = []

    if (siblingFolders.length > 0) {
      sections.push({
        title: "Carpetas hermanas",
        folders: siblingFolders,
        type: "siblings"
      })
    }

    if (childFolders.length > 0) {
      sections.push({
        title: "Carpetas",
        folders: childFolders,
        type: "children"
      })
    }

    if (otherFolders.length > 0) {
      sections.push({
        title: "Subcarpetas",
        folders: otherFolders,
        type: "others"
      })
    }

    return { sections }
  }

  // Funciones para manejo de archivos
  const handleFileUpload = (files: File[]) => {
    const validFiles = files.filter((file) => {
      const validTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "image/jpeg",
        "image/jpg",
        "image/png",
      ]
      return validTypes.includes(file.type) && file.size <= 10 * 1024 * 1024 // 10MB max
    })
    setSelectedFiles((prev) => [...prev, ...validFiles])
  }

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const uploadDocuments = async () => {
    if (selectedFiles.length === 0) return

    if (!selectedTipoDocumentoId) {
      console.error("Debe seleccionar un tipo de documento")
      return
    }

    const currentCarpeta = carpetaData?.carpeta
    const carpetaDestinoId = selectedParentFolderId || currentCarpeta?.id || project.carpeta_raiz_id

    if (!carpetaDestinoId) {
      console.error("No se pudo determinar la carpeta destino")
      return
    }

    try {
      await uploadDocumentosMutation.mutateAsync({
        carpeta_id: carpetaDestinoId,
        archivos: selectedFiles,
        tipo_documento_id: selectedTipoDocumentoId,
        configuracion_alertas: documentConfig.hasAlert ? {
          hasAlert: documentConfig.hasAlert,
          alertType: documentConfig.alertType,
          alertDate: documentConfig.alertDate,
          alertDays: documentConfig.alertDays,
        } : undefined
      })

      // Invalidar queries para refrescar la lista
      queryClient.invalidateQueries({ queryKey: ["carpeta-contenido", currentCarpetaId] })
      queryClient.invalidateQueries({ queryKey: ["carpetas-proyecto", project.id] })

      // Reset estados
      setSelectedFiles([])
      setSelectedTipoDocumentoId(null)
      setSelectedParentFolderId(null)
      setIsUploadDialogOpen(false)
      setDocumentConfig({
        hasAlert: false,
        alertType: "due_date",
        alertDate: "",
        alertDays: 7,
      })
      // setShowDestinationSelector(false)
    } catch (error) {
      console.error("Error al subir documentos:", error)
    }
  }

  // Función para crear carpeta
  const createFolder = async () => {
    if (!newFolderName.trim()) return

    const currentCarpeta = carpetaData?.carpeta
    const carpetaPadreId = selectedParentFolderId || currentCarpeta?.id || project.carpeta_raiz_id

    if (!carpetaPadreId) {
      console.error("No se pudo determinar la carpeta padre")
      return
    }

    const newCarpetaData: CreateCarpetaRequest = {
      nombre: newFolderName.trim(),
      descripcion: newFolderDescription.trim(),
      carpeta_padre_id: carpetaPadreId,
      proyecto_id: project.id,
      etapa_tipo_id: 1, // Por ahora hardcodeado, debería venir del proyecto
      usuario_creador: 1, // Por ahora hardcodeado
      orden_visualizacion: 1, // Por ahora hardcodeado
      max_tamaño_mb: 100, // Por ahora hardcodeado
      tipos_archivo_permitidos: [], // Arrays vacíos como solicitado
      permisos_lectura: [],
      permisos_escritura: [],
    }

    try {
      await createCarpetaMutation.mutateAsync(newCarpetaData)

      // Invalidar queries para refrescar la lista
      queryClient.invalidateQueries({ queryKey: ["carpeta-contenido", currentCarpetaId] })
      queryClient.invalidateQueries({ queryKey: ["carpetas-proyecto", project.id] })

      // Reset estados
      setNewFolderName("")
      setNewFolderDescription("")
      setNewFolderMinDocs(3)
      setSelectedParentFolderId(null)
      setShowFolderSelector(false)
      setIsCreateFolderDialogOpen(false)
    } catch (error) {
      console.error("Error al crear carpeta:", error)
    }
  }

  // Generar alertas mock para el panel de alertas
  const generateMockAlerts = () => {
    const alerts: any[] = []
    const currentCarpeta = carpetaData?.carpeta

    // Ejemplo de alerta por documentos faltantes
    if (currentCarpeta) {
      const totalDocs = carpetaData?.contenido?.documentos?.length || 0
      const minDocs = 3 // Asumiendo 3 documentos mínimos

      if (totalDocs < minDocs) {
        alerts.push({
          id: `missing-${currentCarpeta.id}`,
          type: "missing",
          severity: "high",
          folderId: currentCarpeta.id.toString(),
          folderName: currentCarpeta.nombre,
          folderPath: navigationPath.length > 0
            ? `${project.nombre} > ${navigationPath.map(p => p.nombre).join(" > ")} > ${currentCarpeta.nombre}`
            : `${project.nombre} > ${currentCarpeta.nombre}`,
          message: `Faltan ${minDocs - totalDocs} de ${minDocs} documentos`,
          count: minDocs - totalDocs,
          total: minDocs,
          current: totalDocs,
        })
      }
    }

    return alerts
  }

  // Handlers para acciones de carpetas
  const handleViewDetails = (folder: any) => {
    setSelectedItem(folder)
    setIsDetailsSheetOpen(true)
  }

  const handleConfig = (folder: any) => {
    console.log("Configurar carpeta:", folder)
  }

  const handleEdit = (folder: any) => {
    setSelectedFolderForAction(folder)
    setIsRenameDialogOpen(true)
  }

  const handleDelete = (folder: any) => {
    console.log("Eliminar carpeta:", folder)
    // Aquí se implementaría la lógica de eliminación real
  }

  const handleMove = (folder: any) => {
    setSelectedFolderForAction(folder)
    setIsMoveDialogOpen(true)
  }

  const handleDuplicate = (folder: any) => {
    console.log("Duplicar carpeta:", folder)
  }

  const openProjectDetails = () => {
    setIsProjectDetailsOpen(true)
  }

  // Función para renombrar carpeta
  const handleRenameFolder = async (newName: string) => {
    if (!selectedFolderForAction) return

    const renameData = {
      nuevo_nombre: newName,
      usuario_modificador: 1 // Por ahora hardcodeado
    }

    await renameCarpetaMutation.mutateAsync({
      carpetaId: selectedFolderForAction.id,
      data: renameData
    })

    // Invalidar queries para refrescar la lista
    queryClient.invalidateQueries({ queryKey: ["carpeta-contenido", currentCarpetaId] })
    queryClient.invalidateQueries({ queryKey: ["carpetas-proyecto", project.id] })
  }

  // Función para mover carpeta
  const handleMoveFolder = async (newParentId: number | null) => {
    if (!selectedFolderForAction) return

    const moveData = {
      nueva_carpeta_padre_id: newParentId || project.carpeta_raiz_id || 0,
      usuario_modificador: 1 // Por ahora hardcodeado
    }

    const destinationName = newParentId === (project.carpeta_raiz_id || 0) ?
      "raíz del proyecto" :
      availableFolders.find(f => f.id === newParentId)?.nombre || `ID: ${newParentId}`

    console.log("Moviendo carpeta:", selectedFolderForAction.nombre, "a:", destinationName)

    await moveCarpetaMutation.mutateAsync({
      carpetaId: selectedFolderForAction.id,
      data: moveData
    })

    // Invalidar queries para refrescar la lista
    queryClient.invalidateQueries({ queryKey: ["carpeta-contenido", currentCarpetaId] })
    queryClient.invalidateQueries({ queryKey: ["carpetas-proyecto", project.id] })
  }

  // Handler para ver documento
  const handleViewDocument = (doc: DocumentoItem) => {
    // Usar el nuevo endpoint base64 para obtener el documento
    downloadDocumentoBase64Mutation.mutate(
      { documentoId: doc.id },
      {
        onSuccess: (response) => {
          if (response.success && response.data.base64) {
            // Asegurar que el tipo MIME sea correcto para PDFs
            let mimeType = response.data.type;
            if (doc.tipo_mime === 'application/pdf' && mimeType !== 'application/pdf') {
              mimeType = 'application/pdf';
            }

            // Crear URL temporal para visualización
            const blobUrl = createBlobUrlFromBase64(response.data.base64, mimeType);

            // Crear un documento temporal con la URL para el preview
            const docWithUrl: DocumentoItemWithPreview = {
              ...doc,
              previewUrl: blobUrl
            };

            setPreviewedDocument(docWithUrl);
            setIsPreviewOpen(true);
          }
        },
        onError: (error) => {
          console.error("Error al cargar documento para vista previa:", error);
        }
      }
    );
  }

  // Handler para descargar documento
  const handleDownloadDocument = (doc: DocumentoItem) => {
    // Usar el nuevo endpoint base64 para descargar
    downloadDocumentoBase64Mutation.mutate(
      { documentoId: doc.id },
      {
        onSuccess: (response) => {
          if (response.success && response.data.base64) {
            // Descargar usando la función utilitaria
            downloadFileFromBase64(
              response.data.base64,
              response.data.filename,
              response.data.type
            );
          }
        },
        onError: (error) => {
          console.error("Error al descargar documento:", error);
        }
      }
    );
  }

  // Handler para abrir diálogo de confirmación de eliminación
  const handleDeleteDocument = (doc: DocumentoItem) => {
    setDocumentToDelete(doc)
    setIsDeleteDialogOpen(true)
  }

  // Handler para confirmar eliminación
  const handleConfirmDelete = () => {
    if (!documentToDelete) return

    deleteDocumentoMutation.mutate(
      documentToDelete.id,
      {
        onSuccess: () => {
          // Invalidar queries para refrescar la lista
          queryClient.invalidateQueries({ queryKey: ["carpeta-contenido", currentCarpetaId] })
          queryClient.invalidateQueries({ queryKey: ["carpetas-proyecto", project.id] })

          // Cerrar el modal de preview si está abierto
          if (isPreviewOpen) {
            setIsPreviewOpen(false)
            setPreviewedDocument(null)
          }
          // Cerrar el diálogo de confirmación
          setIsDeleteDialogOpen(false)
          setDocumentToDelete(null)
        },
        onError: (error) => {
          console.error("Error al eliminar documento:", error);
          // Cerrar el diálogo de confirmación en caso de error
          setIsDeleteDialogOpen(false)
          setDocumentToDelete(null)
        }
      }
    );
  }

  // Búsqueda de documentos usando la API
  const searchedDocuments = useMemo(() => {
    if (!documentSearchTerm || !apiFileResults || !apiFileResults.archivos) {
      return []
    }

    // Los resultados ya vienen filtrados por proyecto_id desde la API
    return apiFileResults.archivos.map(file => {
      // Extraer información de carpeta desde s3_path
      const pathParts = file.s3_path.split('/')
      const folderPath = pathParts.length > 2 ? pathParts.slice(-2).join(' - ') : 'Raíz'

      return {
        ...file, // Incluir todos los campos originales primero
        name: file.nombre_archivo,
        uploadedAt: new Date(file.fecha_creacion),
        folderPath,
        carpetaId: file.carpeta_id
      }
    })
  }, [documentSearchTerm, apiFileResults])

  // Búsqueda de carpetas usando la API
  const searchedFolders = useMemo(() => {

    // Manejar diferentes formatos de respuesta de la API
    let foldersArray: any[] = []
    if (Array.isArray(apiFolderResults)) {
      foldersArray = apiFolderResults
    } else if (apiFolderResults && typeof apiFolderResults === 'object') {
      // Si es un objeto, intentar extraer un array de alguna propiedad
      const results = apiFolderResults as any
      if (results.data && Array.isArray(results.data)) {
        foldersArray = results.data
      } else if (results.carpetas && Array.isArray(results.carpetas)) {
        foldersArray = results.carpetas
      } else {
        console.log("📁 [DEBUG] apiFolderResults es objeto pero no contiene array:", apiFolderResults)
        return []
      }
    }

    return foldersArray
  }, [folderSearchTerm, apiFolderResults])

  // Obtener contenido a mostrar
  const { folders: displayedFolders, documents: displayedDocuments, showLocalContent } = getContentToDisplay()
  const currentCarpeta = carpetaData?.carpeta
  const allAlerts = generateMockAlerts()
  const availableFolders = getAvailableFolders()
  const organizedFolders = getOrganizedFolders()

  // Inicializar carpeta destino cuando se abre el modal
  useEffect(() => {
    if (isUploadDialogOpen) {
      setSelectedParentFolderId(currentCarpeta?.id || project.carpeta_raiz_id || null)
    }
  }, [isUploadDialogOpen, currentCarpeta, project.carpeta_raiz_id])

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Cargando carpetas...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-destructive mb-4">Error al cargar las carpetas</p>
            <Button variant="secundario" onClick={() => window.location.reload()}>
              Reintentar
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4">
      {/* Header con botones de acción */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <Button variant="secundario" onClick={navigateBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-2xl font-bold">{project.nombre}</h1>
              <div className="flex items-center gap-2 mt-1">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: project.etapas_registro[0].etapa_tipo.color }}
                />
                <p className="text-sm text-muted-foreground">Etapa: {project.etapas_registro[0].etapa_tipo.nombre}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-row gap-2">
          {/* Botón Subir documento */}
          <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex-1 sm:flex-none">
                <Upload className="w-4 h-4 mr-2" />
                Subir documento
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Subir documento</DialogTitle>
                <DialogDescription>
                  Selecciona la carpeta destino y los archivos que deseas subir
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                {/* Selector de carpeta destino */}
                <div className="mt-3">
                  <Label className="text-sm font-medium">Carpeta destino</Label>
                  <Select
                    value={selectedParentFolderId?.toString() || "current"}
                    onValueChange={(value) => {
                      if (value === "current") {
                        setSelectedParentFolderId(null)
                      } else {
                        setSelectedParentFolderId(value ? parseInt(value) : null)
                      }
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccionar carpeta destino...">
                        {getSelectedFolderName()}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="max-h-80">
                      <SelectItem value="current">
                        {currentCarpeta?.nombre || "Raíz del proyecto"}
                      </SelectItem>

                      {organizedFolders.sections.map((section, sectionIndex) => (
                        <div key={sectionIndex}>
                          {/* Separador de sección */}
                          <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground bg-muted/50 border-b">
                            {section.title}
                          </div>

                          {/* Carpetas de la sección */}
                          {section.folders.map((carpeta) => (
                            <SelectItem
                              key={carpeta.id}
                              value={carpeta.id.toString()}
                              className="pl-6"
                            >
                              <div className="flex flex-col gap-1 w-full">
                                <div className="flex items-center gap-2">
                                  <FolderOpen className="w-3 h-3 text-blue-500 flex-shrink-0" />
                                  <span className="truncate font-medium">{carpeta.nombre}</span>
                                </div>
                                {section.type === "others" && (
                                  <div className="flex items-center gap-1 ml-5">
                                    <span className="text-xs text-muted-foreground truncate">
                                      {getFolderPath(carpeta.id)}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </SelectItem>
                          ))}
                        </div>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Selector de tipo de documento */}
                <div>
                  <Label className="text-sm font-medium">Tipo de documento *</Label>
                  <Select
                    value={selectedTipoDocumentoId?.toString() || ""}
                    onValueChange={(value) => setSelectedTipoDocumentoId(value ? parseInt(value) : null)}
                  >
                    <SelectTrigger className="w-full mt-1">
                      <SelectValue placeholder="Seleccionar tipo de documento..." />
                    </SelectTrigger>
                    <SelectContent>
                      {tiposDocumento?.tipos_documentos?.map((tipo) => (
                        <SelectItem key={tipo.id} value={tipo.id.toString()}>
                          <div className="flex flex-col gap-1">
                            <span className="font-medium">{tipo.nombre}</span>
                            <span className="text-xs text-muted-foreground">{tipo.descripcion}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {/* Zona de arrastrar y soltar */}
                <div
                  className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer"
                  onDragOver={(e) => {
                    e.preventDefault()
                    e.currentTarget.classList.add("border-primary", "bg-primary/5")
                  }}
                  onDragLeave={(e) => {
                    e.currentTarget.classList.remove("border-primary", "bg-primary/5")
                  }}
                  onDrop={(e) => {
                    e.preventDefault()
                    e.currentTarget.classList.remove("border-primary", "bg-primary/5")
                    const files = Array.from(e.dataTransfer.files)
                    handleFileUpload(files)
                  }}
                  onClick={() => document.getElementById("file-input")?.click()}
                >
                  <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm font-medium">Arrastra archivos aquí o haz clic para seleccionar</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Soporta múltiples archivos: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG
                  </p>
                </div>

                {/* Input oculto para selección de archivos */}
                <input
                  id="file-input"
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || [])
                    handleFileUpload(files)
                  }}
                  className="hidden"
                />

                {/* Lista de archivos seleccionados */}
                {selectedFiles.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Archivos seleccionados:</Label>
                    <div className="max-h-32 space-y-1">
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                          <div className="flex items-center space-x-2 min-w-0 flex-1">
                            <FileText className="w-4 h-4 text-blue-500" />
                            <div className="w-2.5 flex-1">
                              <AnimatedText text={file.name} />
                            </div>
                            <span className="text-xs text-muted-foreground">
                              ({(file.size / 1024 / 1024).toFixed(1)} MB)
                            </span>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => removeFile(index)} className="h-6 w-6 p-0">
                            ×
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Configuración de alertas */}
                <div className="border rounded-lg p-3 items-center justify-center">
                  <div className={`flex items-center space-x-2 ${documentConfig.hasAlert ? "mb-3" : ""}`}>
                    <input
                      type="checkbox"
                      id="hasAlert"
                      checked={documentConfig.hasAlert}
                      onChange={(e) => setDocumentConfig({ ...documentConfig, hasAlert: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="hasAlert" className="text-sm font-medium">
                      Configurar alerta para este documento
                    </Label>
                  </div>

                  {documentConfig.hasAlert && (
                    <div className="space-y-3 ml-6">
                      <div>
                        <Label className="text-xs">Tipo de alerta</Label>
                        <Select
                          value={documentConfig.alertType}
                          onValueChange={(value) =>
                            setDocumentConfig({
                              ...documentConfig,
                              alertType: value as "due_date" | "days_after",
                            })
                          }
                        >
                          <SelectTrigger className="w-full mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="due_date">Fecha límite específica</SelectItem>
                            <SelectItem value="days_after">Días desde subida</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {documentConfig.alertType === "due_date" ? (
                        <div>
                          <Label className="text-xs">Fecha límite</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="secundario"
                                className={cn(
                                  "h-8 w-full justify-start text-left font-normal text-xs mt-1",
                                  !documentConfig.alertDate && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-3 w-3" />
                                {documentConfig.alertDate ?
                                  format(new Date(documentConfig.alertDate), "dd/MM/yyyy", { locale: es }) :
                                  <span>Seleccionar fecha</span>
                                }
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <CalendarComponent
                                mode="single"
                                selected={documentConfig.alertDate ? new Date(documentConfig.alertDate) : undefined}
                                onSelect={(date) => {
                                  setDocumentConfig({
                                    ...documentConfig,
                                    alertDate: date ? date.toISOString().split('T')[0] : "",
                                  })
                                }}
                                initialFocus
                                locale={es}
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      ) : (
                        <div>
                          <Label className="text-xs">Días para completar</Label>
                          <Input
                            type="number"
                            min="1"
                            value={documentConfig.alertDays}
                            onChange={(e) =>
                              setDocumentConfig({
                                ...documentConfig,
                                alertDays: Number.parseInt(e.target.value) || 7,
                              })
                            }
                            className="h-8"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex space-x-2">
                  <Button
                    onClick={uploadDocuments}
                    className="flex-1"
                    disabled={selectedFiles.length === 0 || !selectedTipoDocumentoId || uploadDocumentosMutation.isPending}
                  >
                    {uploadDocumentosMutation.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Subiendo...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Subir{" "}
                        {selectedFiles.length > 0
                          ? `${selectedFiles.length} archivo${selectedFiles.length > 1 ? "s" : ""}`
                          : "Documentos"}
                      </>
                    )}
                  </Button>
                  <Button
                    variant="secundario"
                    onClick={() => setIsUploadDialogOpen(false)}
                    disabled={uploadDocumentosMutation.isPending}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Botón Crear carpeta */}
          <Dialog open={isCreateFolderDialogOpen} onOpenChange={setIsCreateFolderDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="secundario" className="flex-1 sm:flex-none">
                <FolderOpen className="w-4 h-4 mr-2" />
                Crear carpeta
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Crear nueva carpeta</DialogTitle>
                <DialogDescription>
                  La carpeta se creará en {currentCarpeta ? `"${currentCarpeta.nombre}"` : "la raíz del proyecto"}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="folderName">Nombre de la carpeta *</Label>
                  <Input
                    id="folderName"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    placeholder="Ej: Documentos Técnicos"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="folderDescription">Descripción</Label>
                  <Input
                    id="folderDescription"
                    value={newFolderDescription}
                    onChange={(e) => setNewFolderDescription(e.target.value)}
                    placeholder="Descripción opcional de la carpeta"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="minDocs">Documentos mínimos requeridos</Label>
                  <Input
                    id="minDocs"
                    type="number"
                    min="1"
                    value={newFolderMinDocs}
                    onChange={(e) => setNewFolderMinDocs(Number.parseInt(e.target.value) || 1)}
                    placeholder="3"
                  />
                  <p className="text-xs text-muted-foreground">
                    Se generará una alerta si la carpeta no alcanza este número de documentos
                  </p>
                </div>

                {/* Selector de carpeta padre */}
                <div className="space-y-2">
                  <Label>Carpeta destino</Label>
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm">
                        <FolderOpen className="w-4 h-4 mr-2 text-blue-500" />
                        <span>
                          Destino: <strong>{getSelectedFolderName()}</strong>
                        </span>
                      </div>
                      <Button
                        variant="secundario"
                        size="sm"
                        onClick={() => setShowFolderSelector(!showFolderSelector)}
                      >
                        Cambiar
                      </Button>
                    </div>
                  </div>

                  {/* Selector de carpeta */}
                  {showFolderSelector && (
                    <div className="mt-3">
                      <Select
                        value={selectedParentFolderId?.toString() || "current"}
                        onValueChange={(value) => {
                          if (value === "current") {
                            setSelectedParentFolderId(null)
                          } else {
                            setSelectedParentFolderId(value ? parseInt(value) : null)
                          }
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Seleccionar carpeta destino...">
                            {getSelectedFolderName()}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent className="max-h-80">
                          <SelectItem value="current">
                            {currentCarpeta?.nombre || "Raíz del proyecto"}
                          </SelectItem>

                          {organizedFolders.sections.map((section, sectionIndex) => (
                            <div key={sectionIndex}>
                              {/* Separador de sección */}
                              <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground bg-muted/50 border-b">
                                {section.title}
                              </div>

                              {/* Carpetas de la sección */}
                              {section.folders.map((carpeta) => (
                                <SelectItem
                                  key={carpeta.id}
                                  value={carpeta.id.toString()}
                                  className="pl-6"
                                >
                                  <div className="flex flex-col gap-1 w-full">
                                    <div className="flex items-center gap-2">
                                      <FolderOpen className="w-3 h-3 text-blue-500 flex-shrink-0" />
                                      <span className="truncate font-medium">{carpeta.nombre}</span>
                                    </div>
                                    {section.type === "others" && (
                                      <div className="flex items-center gap-1 ml-5">
                                        <span className="text-xs text-muted-foreground truncate">
                                          {getFolderPath(carpeta.id)}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </SelectItem>
                              ))}
                            </div>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                <div className="flex space-x-2">
                  <Button
                    onClick={createFolder}
                    className="flex-1"
                    disabled={!newFolderName.trim() || createCarpetaMutation.isPending}
                  >
                    {createCarpetaMutation.isPending ? "Creando..." : "Crear carpeta"}
                  </Button>
                  <Button variant="secundario" onClick={() => setIsCreateFolderDialogOpen(false)} className="flex-1">
                    Cancelar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Breadcrumb de navegación */}
      {navigationPath.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{project.nombre}</span>
            {navigationPath.map((item) => (
              <span key={item.id} className="flex items-center gap-2">
                <span>/</span>
                <span>{item.nombre}</span>
              </span>
            ))}
            {currentCarpeta && (
              <span className="flex items-center gap-2">
                <span>/</span>
                <span className="font-medium text-foreground">{currentCarpeta.nombre}</span>
              </span>
            )}
          </div>
        </div>
      )}

      {/* Search Header - Búsqueda avanzada */}
      <SearchHeader
        projectSearchTerm={folderSearchTerm}
        onProjectSearchChange={setFolderSearchTerm}
        documentSearchTerm={documentSearchTerm}
        onDocumentSearchChange={setDocumentSearchTerm}
        selectedStages={selectedStages}
        onStageFilterChange={setSelectedStages}
        selectedTiposObra={selectedTiposObra}
        onTipoObraFilterChange={setSelectedTiposObra}
        projectResults={searchedFolders.length}
        documentResults={isSearchingFiles ? undefined : searchedDocuments.length}
        context="project-detail"
        onClearFilters={clearAllFilters}
        isLoadingProjects={isSearchingFolders}
        isLoadingDocuments={isSearchingFiles}
      />

      {/* Mostrar error en búsqueda de documentos */}
      {documentSearchTerm && fileSearchError && (
        <Card className="border-red-200 bg-red-50 mt-6">
          <CardHeader>
            <CardTitle className="text-lg text-red-800">Error en la búsqueda</CardTitle>
            <CardDescription className="text-red-600">
              No se pudo completar la búsqueda de documentos. Inténtalo de nuevo más tarde.
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* Mostrar resultados de búsqueda de documentos */}
      {documentSearchTerm && !fileSearchError && searchedDocuments.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Documentos encontrados en el proyecto</CardTitle>
            <CardDescription>
              {searchedDocuments.length} documentos coinciden con "{documentSearchTerm}"
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {searchedDocuments.map((doc) => (
                <div
                  key={`search-${doc.id}`}
                  className="flex items-center justify-between p-2 hover:bg-muted rounded cursor-pointer"
                  onClick={() => {
                    console.log("📄 [DEBUG] Click en documento de búsqueda:", {
                      docName: doc.name,
                      carpetaId: doc.carpetaId,
                      currentCarpetaId,
                      willNavigate: doc.carpetaId && doc.carpetaId !== currentCarpetaId
                    })

                    // Navegar a la carpeta que contiene el documento
                    if (doc.carpetaId && doc.carpetaId !== currentCarpetaId) {
                      console.log("📄 [DEBUG] Navegando a carpeta:", doc.carpetaId)
                      setCurrentCarpetaId(doc.carpetaId)
                      // Resetear el path de navegación ya que estamos saltando directamente
                      setNavigationPath([])
                      // Limpiar búsquedas después de navegar
                      setFolderSearchTerm("")
                      setDocumentSearchTerm("")
                    } else {
                      console.log("📄 [DEBUG] No navegando - ya estamos en la carpeta correcta o no hay carpetaId")
                    }
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <FileText className="w-4 h-4 text-blue-500" />
                    <div>
                      <div className="font-medium">{doc.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {doc.folderPath}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {doc.uploadedAt.toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mostrar mensaje cuando no hay resultados de documentos */}
      {documentSearchTerm && !fileSearchError && !isSearchingFiles && searchedDocuments.length === 0 && (
        <Card className="text-center py-8 mt-6">
          <CardContent>
            <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
            <h3 className="text-lg font-semibold mb-2">No se encontraron documentos</h3>
            <p className="text-muted-foreground mb-4">
              No hay documentos en este proyecto que coincidan con "{documentSearchTerm}"
            </p>
            <Button variant="secundario" onClick={() => setDocumentSearchTerm("")}>
              Limpiar búsqueda
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Panel de Alertas */}
      <div className="mt-6">
        <AlertsPanel
          alerts={allAlerts}
          onNavigateToFolder={(folderId) => {
            console.log("Navegar a carpeta:", folderId)
          }}
          onUploadDocument={() => {
            // setSelectedFolderId(folderId)
            setIsUploadDialogOpen(true)
          }}
        />
      </div>

      {/* Contenido de carpetas y documentos */}
      {showLocalContent && (
        <>
          {/* Indicador de búsqueda activa */}
          {folderSearchTerm && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Search className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">
                    Mostrando resultados de búsqueda para "{folderSearchTerm}"
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFolderSearchTerm("")}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Limpiar búsqueda
                </Button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Carpetas */}
            {displayedFolders.map((folder: CarpetaItem) => (
              <FolderCard
                key={folder.id}
                folder={folder}
                projectStage={project.etapas_registro[0].etapa_tipo.nombre}
                onNavigate={(folderId) => navigateToFolder(folderId)}
                onViewDetails={handleViewDetails}
                onConfig={handleConfig}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onMove={handleMove}
                onDuplicate={handleDuplicate}
                onViewProjectDetails={openProjectDetails}
              />
            ))}

            {/* Documentos */}
            {displayedDocuments.map((doc: any) => (
              <Card key={doc.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-5 h-5 text-green-500" />
                      <CardTitle className="text-lg break-words">{doc.nombre_archivo}</CardTitle>
                    </div>
                    <div className="flex-shrink-0">
                      <DocumentContextMenu
                        document={doc}
                        onView={handleViewDocument}
                        onDownload={handleDownloadDocument}
                        onDelete={handleDeleteDocument}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Tamaño:</span>
                      <span>{doc.tamano ? `${(doc.tamano / 1024).toFixed(1)} KB` : "N/A"}</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Tipo:</span>
                      <span>{doc.extension?.toUpperCase() || "N/A"}</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Subido:</span>
                      <span>
                        {doc.fecha_creacion ?
                          new Date(doc.fecha_creacion).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          }) :
                          "N/A"
                        }
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Estado vacío para contenido local */}
      {showLocalContent && displayedFolders.length === 0 && displayedDocuments.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            {folderSearchTerm ? (
              <>
                <FolderOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No se encontraron carpetas</h3>
                <p className="text-muted-foreground mb-4">
                  No hay carpetas en este proyecto que coincidan con "{folderSearchTerm}"
                </p>
                <Button variant="secundario" onClick={() => setFolderSearchTerm("")}>
                  Limpiar búsqueda
                </Button>
              </>
            ) : (
              <>
                <FolderOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Carpeta vacía</h3>
                <p className="text-muted-foreground mb-4">Esta carpeta no contiene documentos ni subcarpetas</p>
                <Button onClick={() => setIsUploadDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar primer documento
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Modal de detalles del proyecto */}
      {/* <ProjectDetailsModal
        project={project}
        isOpen={isProjectDetailsOpen}
        onClose={() => setIsProjectDetailsOpen(false)}
      /> */}

      {/* Sheet de detalles de carpetas */}
      <DetailsSheet
        isOpen={isDetailsSheetOpen}
        onClose={() => {
          setIsDetailsSheetOpen(false)
          setSelectedItem(null)
        }}
        item={selectedItem}
        type="folder"
        onStageChange={(newStage) => {
          console.log("Cambiar etapa a:", newStage)
          // Aquí se implementaría la lógica para cambiar la etapa
        }}
      />

      {/* Modal para renombrar carpeta */}
      <RenameFolderDialog
        isOpen={isRenameDialogOpen}
        onClose={() => {
          setIsRenameDialogOpen(false)
          setSelectedFolderForAction(null)
        }}
        folder={selectedFolderForAction}
        onRename={handleRenameFolder}
        isLoading={renameCarpetaMutation.isPending}
      />

      {/* Modal para mover carpeta */}
      <MoveFolderDialog
        isOpen={isMoveDialogOpen}
        onClose={() => {
          setIsMoveDialogOpen(false)
          setSelectedFolderForAction(null)
        }}
        folder={selectedFolderForAction}
        onMove={handleMoveFolder}
        isLoading={moveCarpetaMutation.isPending}
        availableFolders={availableFolders}
        getFolderPath={getFolderPath}
        carpetaRaizId={project.carpeta_raiz_id || 0}
      />

      {/* Modal de preview de documento */}
      <DocumentPreviewModal
        document={previewedDocument}
        isOpen={isPreviewOpen}
        onClose={() => {
          // Limpiar URL temporal si existe
          if (previewedDocument?.previewUrl) {
            revokeBlobUrl(previewedDocument.previewUrl);
          }
          setPreviewedDocument(null);
          setIsPreviewOpen(false);
        }}
        onDownload={() => handleDownloadDocument(previewedDocument!)}
        onView={(id) => window.open(`/api/documents/${id}/preview`, "_blank")}
        onDelete={() => handleDeleteDocument(previewedDocument!)}
      />

      {/* Diálogo de confirmación de eliminación */}
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false)
          setDocumentToDelete(null)
        }}
        onConfirm={handleConfirmDelete}
        title="Eliminar documento"
        description="¿Estás seguro de que quieres eliminar este documento? Esta acción no se puede deshacer."
        itemName={documentToDelete?.nombre_archivo || ""}
        isLoading={deleteDocumentoMutation.isPending}
      />
    </div>
  )
}
