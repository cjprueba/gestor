import { useCarpetaContenido, useCreateCarpeta, useCarpetasProyecto, useRenombrarCarpeta, useMoverCarpeta } from "@/lib/api/hooks/useProjects"
import { useDocumentos } from "@/lib/api/hooks/useDocumentos"
import { Button } from "@/shared/components/design-system/button"
import { Calendar as CalendarComponent } from "@/shared/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/components/ui/dialog"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { cn } from "@/shared/lib/utils"
import type { CarpetaItem, CreateCarpetaRequest } from "@/shared/types/project-types"
import { getStageColor } from "@/shared/utils/stage-colors"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { ArrowLeft, CalendarIcon, FileText, FolderOpen, Plus, Search, Upload } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"
import AlertsPanel from "./alerts-panel"
import DetailsSheet from "./details-sheet"
import { FolderCard } from "./folder-card"
import MoveFolderDialog from "./move-folder-dialog"
import { ProjectDetailsModal } from "./project-details-modal"
import RenameFolderDialog from "./rename-folder-dialog"
import { SearchHeader } from "./search-header"
import type { Project } from "./types"
import { DocumentContextMenu } from "./document-context-menu"
import { DocumentPreviewModal } from "./document-preview-modal"
import type { DocumentoItem } from "@/shared/types/project-types"

interface ProjectViewProps {
  project: Project
  onBack: () => void
  onUpdateProject: (project: Project) => void
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

export default function ProjectView({ project, onBack }: ProjectViewProps) {
  // Estado para navegación de carpetas
  const [currentCarpetaId, setCurrentCarpetaId] = useState<number | undefined>(
    project.carpeta_raiz_id
  )
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
  const [previewedDocument, setPreviewedDocument] = useState<DocumentoItem | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  // Hook para descargar documento
  const { useDownloadDocumento } = useDocumentos()
  const downloadDocumentoMutation = useDownloadDocumento()

  // Obtener contenido de la carpeta actual
  const { data: carpetaData, isLoading, error } = useCarpetaContenido(currentCarpetaId)

  // Obtener carpetas del proyecto para el selector
  const { data: carpetasProyecto } = useCarpetasProyecto(parseInt(project.id))

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
    if (currentCarpetaId) {
      const currentCarpeta = carpetaData?.carpeta
      if (currentCarpeta) {
        setNavigationPath(prev => [...prev, { id: currentCarpetaId, nombre: currentCarpeta.nombre }])
      }
    }
    setCurrentCarpetaId(carpetaId)
  }, [currentCarpetaId, carpetaData])

  const navigateBack = useCallback(() => {
    if (navigationPath.length > 0) {
      const previousCarpeta = navigationPath[navigationPath.length - 1]
      setCurrentCarpetaId(previousCarpeta.id)
      setNavigationPath(prev => prev.slice(0, -1))
    } else {
      onBack()
    }
  }, [navigationPath, onBack])

  // Función para obtener carpetas y documentos filtrados
  const getFilteredContent = () => {
    const folders = carpetaData?.contenido?.carpetas || []
    const documents = carpetaData?.contenido?.documentos || []

    let filteredFolders = [...folders]
    let filteredDocuments = [...documents]

    // Filtrado inteligente: mostrar solo el tipo que se está buscando
    if (folderSearchTerm && !documentSearchTerm) {
      filteredFolders = folders.filter((folder: CarpetaItem) =>
        folder.nombre.toLowerCase().includes(folderSearchTerm.toLowerCase())
      )
      filteredDocuments = []
    } else if (documentSearchTerm && !folderSearchTerm) {
      filteredDocuments = documents.filter((doc: any) =>
        doc.nombre.toLowerCase().includes(documentSearchTerm.toLowerCase())
      )
      filteredFolders = []
    } else if (folderSearchTerm && documentSearchTerm) {
      filteredFolders = folders.filter((folder: CarpetaItem) =>
        folder.nombre.toLowerCase().includes(folderSearchTerm.toLowerCase())
      )
      filteredDocuments = documents.filter((doc: any) =>
        doc.nombre.toLowerCase().includes(documentSearchTerm.toLowerCase())
      )
    }

    return {
      folders: filteredFolders,
      documents: filteredDocuments,
      folderResults: filteredFolders.length,
      documentResults: filteredDocuments.length
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
        configuracion_alertas: documentConfig.hasAlert ? {
          hasAlert: documentConfig.hasAlert,
          alertType: documentConfig.alertType,
          alertDate: documentConfig.alertDate,
          alertDays: documentConfig.alertDays,
        } : undefined
      })

      // Reset estados
      setSelectedFiles([])
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
      proyecto_id: parseInt(project.id),
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
            ? `${project.name} > ${navigationPath.map(p => p.nombre).join(" > ")} > ${currentCarpeta.nombre}`
            : `${project.name} > ${currentCarpeta.nombre}`,
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
  }

  // Handler para ver documento
  const handleViewDocument = (doc: DocumentoItem) => {
    setPreviewedDocument(doc)
    setIsPreviewOpen(true)
  }

  // Handler para descargar documento
  const handleDownloadDocument = (doc: DocumentoItem) => {
    downloadDocumentoMutation.mutate(doc.id)
  }

  // Obtener contenido filtrado
  const { folders: filteredFolders, documents: filteredDocuments, folderResults, documentResults } = getFilteredContent()
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
              <h1 className="text-2xl font-bold">{project.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: getStageColor(project.etapa) }}
                />
                <p className="text-sm text-muted-foreground">Etapa: {project.etapa}</p>
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
                    disabled={selectedFiles.length === 0 || !selectedParentFolderId || uploadDocumentosMutation.isPending}
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
            <span>{project.name}</span>
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
        projectResults={folderResults}
        documentResults={documentResults}
        context="project-detail"
        onClearFilters={clearAllFilters}
      />

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Carpetas */}
        {filteredFolders.map((folder) => (
          <FolderCard
            key={folder.id}
            folder={folder}
            projectStage={project.etapa}
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
        {filteredDocuments.map((doc) => (
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

      {/* Estado vacío */}
      {filteredFolders.length === 0 && filteredDocuments.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            {folderSearchTerm || documentSearchTerm ? (
              <>
                <Search className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No se encontraron resultados</h3>
                <p className="text-muted-foreground mb-4">
                  No hay carpetas o documentos que coincidan con tu búsqueda
                </p>
                <Button onClick={clearAllFilters} variant="secundario">
                  Limpiar filtros
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
      <ProjectDetailsModal
        project={project}
        isOpen={isProjectDetailsOpen}
        onClose={() => setIsProjectDetailsOpen(false)}
      />

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
        onClose={() => setIsPreviewOpen(false)}
        onDownload={() => handleDownloadDocument(previewedDocument!)}
        onView={(id) => window.open(`/api/documents/${id}/preview`, "_blank")}
      />
    </div>
  )
}
