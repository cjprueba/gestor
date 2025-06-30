import { Button } from "@/shared/components/design-system/button"
import { Badge } from "@/shared/components/ui/badge"
import { Calendar as CalendarComponent } from "@/shared/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { useProjectNavigationContext } from "@/shared/contexts/ProjectNavigationContext"
import { cn } from "@/shared/lib/utils"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { ArrowLeft, Calendar, CalendarIcon, FileText, Folder, FolderOpen, Plus, Upload } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import AlertsPanel from "./alerts-panel"
import ContextMenu from "./context-menu"
import DetailsSheet from "./details-sheet"
import DocumentConfigDialog from "./document-config-dialog"

interface Project {
  id: string
  name: string
  // description: string
  createdAt: Date
  structure: FolderStructure
  etapa: string
  projectData?: any
  metadata?: any
}

interface FolderStructure {
  id: string
  name: string
  minDocuments: number
  documents: Document[]
  subfolders: FolderStructure[]
  parentId?: string
  daysLimit?: number
}

interface Document {
  id: string
  name: string
  uploadedAt: Date
  dueDate?: Date
  hasCustomAlert?: boolean
  alertConfig?: any
}

interface ProjectViewProps {
  project: Project
  onBack: () => void
  onUpdateProject: (project: Project) => void
}

// Componente para texto animado
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
          // Esperar 3 segundos antes de iniciar la animación
          const timer = setTimeout(() => {
            setShouldAnimate(true)
          }, 3000)

          // Retornar función para limpiar solo este timer
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

export default function ProjectView({ project, onBack, onUpdateProject }: ProjectViewProps) {
  const { navigateToFolder, currentPath } = useProjectNavigationContext()
  const [detailsSheetOpen, setDetailsSheetOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [selectedItemType, setSelectedItemType] = useState<"project" | "folder" | "document">("project")

  // Estado local para sincronizar con el contexto
  const [localCurrentPath, setLocalCurrentPath] = useState<string[]>(currentPath)
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  // const [newDocumentName, setNewDocumentName] = useState("")
  // const [newDocumentDueDate, setNewDocumentDueDate] = useState("")
  const [selectedFolderId, setSelectedFolderId] = useState<string>("")
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false)
  const [configFolderId, setConfigFolderId] = useState("")
  const [configMinDocs, setConfigMinDocs] = useState(3)
  const [configDaysLimit, setConfigDaysLimit] = useState<number | undefined>()

  // Estados para crear carpetas
  const [isCreateFolderDialogOpen, setIsCreateFolderDialogOpen] = useState(false)
  const [newFolderName, setNewFolderName] = useState("")
  const [newFolderMinDocs, setNewFolderMinDocs] = useState(3)

  // Agregar estados para configuración de documentos
  const [documentConfig, setDocumentConfig] = useState({
    hasAlert: false,
    alertType: "due_date" as "due_date" | "days_after",
    alertDate: "",
    alertDays: 7,
  })
  const [showDestinationSelector, setShowDestinationSelector] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  // Sincronizar el estado local con el contexto
  useEffect(() => {
    setLocalCurrentPath(currentPath)
  }, [currentPath])

  const getCurrentFolder = (): FolderStructure => {
    if (localCurrentPath.length === 0) return project.structure

    let current = project.structure
    for (const pathSegment of localCurrentPath) {
      const found = current.subfolders.find((f) => f.id === pathSegment)
      if (found) current = found
    }
    return current
  }

  const navigateToFolderLocal = (folderId: string) => {
    const newPath = [...localCurrentPath, folderId]
    setLocalCurrentPath(newPath)

    // Encontrar los nombres de las carpetas
    const folderNames: string[] = []
    let current = project.structure

    for (const pathId of newPath) {
      const found = current.subfolders.find((f) => f.id === pathId)
      if (found) {
        folderNames.push(found.name)
        current = found
      }
    }

    // Actualizar el contexto
    navigateToFolder(newPath, folderNames)
  }

  // const navigateToRoot = () => {
  //   setLocalCurrentPath([])
  //   navigateToFolder([], [])
  // }

  const handleBackNavigation = () => {
    if (localCurrentPath.length === 0) {
      // Si estamos en la raíz del proyecto, salir del proyecto
      onBack()
    } else {
      // Si estamos en una subcarpeta, navegar hacia atrás
      const newPath = localCurrentPath.slice(0, -1)
      setLocalCurrentPath(newPath)

      // Calcular los nombres de las carpetas para el nuevo path
      const folderNames: string[] = []
      let current = project.structure

      for (const pathId of newPath) {
        const found = current.subfolders.find((f) => f.id === pathId)
        if (found) {
          folderNames.push(found.name)
          current = found
        }
      }

      // Actualizar el contexto
      navigateToFolder(newPath, folderNames)
    }
  }

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

  const uploadDocuments = () => {
    if (selectedFiles.length === 0) return

    const targetFolderId = selectedFolderId || getCurrentFolder().id

    selectedFiles.forEach((file) => {
      let dueDate: Date | undefined

      if (documentConfig.hasAlert) {
        if (documentConfig.alertType === "due_date" && documentConfig.alertDate) {
          dueDate = new Date(documentConfig.alertDate)
        } else if (documentConfig.alertType === "days_after") {
          dueDate = new Date()
          dueDate.setDate(dueDate.getDate() + documentConfig.alertDays)
        }
      }

      const newDoc: Document = {
        id: `${Date.now()}-${Math.random()}`,
        name: file.name,
        uploadedAt: new Date(),
        dueDate,
        hasCustomAlert: documentConfig.hasAlert,
        alertConfig: documentConfig.hasAlert ? documentConfig : undefined,
      }

      const updateFolder = (folder: FolderStructure): FolderStructure => {
        if (folder.id === targetFolderId) {
          return { ...folder, documents: [...folder.documents, newDoc] }
        }
        return {
          ...folder,
          subfolders: folder.subfolders.map(updateFolder),
        }
      }

      const updatedProject = {
        ...project,
        structure: updateFolder(project.structure),
      }

      onUpdateProject(updatedProject)
    })

    // Reset estados
    setSelectedFiles([])
    // setNewDocumentName("")
    setSelectedFolderId("")
    setIsUploadDialogOpen(false)
    setDocumentConfig({
      hasAlert: false,
      alertType: "due_date",
      alertDate: "",
      alertDays: 7,
    })
    setShowDestinationSelector(false)
  }

  // const addDocument = () => {
  //   if (!newDocumentName.trim()) return

  //   const targetFolderId = selectedFolderId || getCurrentFolder().id
  //   const newDocument: Document = {
  //     id: Date.now().toString(),
  //     name: newDocumentName,
  //     uploadedAt: new Date(),
  //     ...(documentConfig.hasAlert && {
  //       hasCustomAlert: true,
  //       alertConfig: documentConfig,
  //       dueDate:
  //         documentConfig.alertType === "due_date" && documentConfig.alertDate
  //           ? new Date(documentConfig.alertDate)
  //           : documentConfig.alertType === "days_after"
  //             ? new Date(Date.now() + documentConfig.alertDays * 24 * 60 * 60 * 1000)
  //             : undefined,
  //     }),
  //   }

  //   const updateFolder = (folder: FolderStructure): FolderStructure => {
  //     if (folder.id === targetFolderId) {
  //       return { ...folder, documents: [...folder.documents, newDocument] }
  //     }
  //     return { ...folder, subfolders: folder.subfolders.map(updateFolder) }
  //   }

  //   const updatedProject = { ...project, structure: updateFolder(project.structure) }
  //   onUpdateProject(updatedProject)
  //   setNewDocumentName("")
  //   setSelectedFolderId("")
  //   setDocumentConfig({
  //     hasAlert: false,
  //     alertType: "due_date",
  //     alertDate: "",
  //     alertDays: 7,
  //   })
  //   setIsUploadDialogOpen(false)
  // }

  // Función para crear carpeta
  const createFolder = () => {
    if (!newFolderName.trim()) return

    const newFolder: FolderStructure = {
      id: `folder-${Date.now()}`,
      name: newFolderName,
      minDocuments: newFolderMinDocs,
      documents: [],
      subfolders: [],
      parentId: getCurrentFolder().id,
    }

    const updateFolder = (folder: FolderStructure): FolderStructure => {
      if (folder.id === getCurrentFolder().id) {
        return { ...folder, subfolders: [...folder.subfolders, newFolder] }
      }
      return { ...folder, subfolders: folder.subfolders.map(updateFolder) }
    }

    const updatedProject = { ...project, structure: updateFolder(project.structure) }
    onUpdateProject(updatedProject)
    setNewFolderName("")
    setNewFolderMinDocs(3)
    setIsCreateFolderDialogOpen(false)
  }

  // const updateFolderMinDocs = (folderId: string, minDocs: number) => {
  //   const updateFolder = (folder: FolderStructure): FolderStructure => {
  //     if (folder.id === folderId) {
  //       return { ...folder, minDocuments: minDocs }
  //     }
  //     return {
  //       ...folder,
  //       subfolders: folder.subfolders.map(updateFolder),
  //     }
  //   }

  //   const updatedProject = {
  //     ...project,
  //     structure: updateFolder(project.structure),
  //   }

  //   onUpdateProject(updatedProject)
  // }

  const openConfigDialog = (folder: FolderStructure) => {
    setConfigFolderId(folder.id)
    setConfigMinDocs(folder.minDocuments)
    setConfigDaysLimit(folder.daysLimit)
    setIsConfigDialogOpen(true)
  }

  const saveConfig = () => {
    const updateFolder = (folder: FolderStructure): FolderStructure => {
      if (folder.id === configFolderId) {
        return {
          ...folder,
          minDocuments: configMinDocs,
          daysLimit: configDaysLimit,
        }
      }
      return {
        ...folder,
        subfolders: folder.subfolders.map(updateFolder),
      }
    }

    const updatedProject = {
      ...project,
      structure: updateFolder(project.structure),
    }

    onUpdateProject(updatedProject)
    setIsConfigDialogOpen(false)
  }

  const getFolderAlerts = (folder: FolderStructure, parentPath: string[] = []) => {
    const alerts = []
    const currentPath = [...parentPath, folder.name]

    // Alerta por documentos faltantes
    if (folder.documents.length < folder.minDocuments) {
      alerts.push({
        id: `missing-${folder.id}`,
        type: "missing",
        severity: "high",
        folderId: folder.id,
        folderName: folder.name,
        folderPath: currentPath.join(" > "),
        message: `Faltan ${folder.minDocuments - folder.documents.length} de ${folder.minDocuments} documentos`,
        count: folder.minDocuments - folder.documents.length,
        total: folder.minDocuments,
        current: folder.documents.length,
      })
    }

    // Alertas por fechas vencidas
    const overdueDocs = folder.documents.filter((doc) => doc.dueDate && doc.dueDate < new Date())

    overdueDocs.forEach((doc) => {
      alerts.push({
        id: `overdue-${doc.id}`,
        type: "overdue",
        severity: "critical",
        folderId: folder.id,
        folderName: folder.name,
        folderPath: currentPath.join(" > "),
        documentName: doc.name,
        message: `"${doc.name}" venció el ${doc.dueDate?.toLocaleDateString()}`,
        dueDate: doc.dueDate,
        daysOverdue: Math.floor((new Date().getTime() - (doc.dueDate?.getTime() || 0)) / (1000 * 60 * 60 * 24)),
      })
    })

    return alerts
  }

  const getAllAlerts = (folder: FolderStructure, parentPath: string[] = []): any[] => {
    let alerts = getFolderAlerts(folder, parentPath)
    folder.subfolders.forEach((subfolder) => {
      alerts = [...alerts, ...getAllAlerts(subfolder, [...parentPath, folder.name])]
    })
    return alerts
  }

  const currentFolder = getCurrentFolder()
  const allAlerts = getAllAlerts(project.structure)

  const getCurrentParentFolder = (): FolderStructure | null => {
    if (localCurrentPath.length <= 1) return project.structure

    let current = project.structure
    for (let i = 0; i < localCurrentPath.length - 1; i++) {
      const found = current.subfolders.find((f) => f.id === localCurrentPath[i])
      if (found) current = found
    }
    return current
  }

  const findPathToFolder = (structure: FolderStructure, targetId: string): string[] | null => {
    const search = (folder: FolderStructure, path: string[]): string[] | null => {
      if (folder.id === targetId) return path

      for (const subfolder of folder.subfolders) {
        const result = search(subfolder, [...path, subfolder.id])
        if (result) return result
      }
      return null
    }

    return search(structure, [])
  }

  const handleStageChange = (newStage: string) => {
    const updatedProject = {
      ...project,
      etapa: newStage,
      metadata: {
        ...project.metadata,
        lastModifiedAt: new Date(),
        lastModifiedBy: "Usuario Actual",
        history: [
          {
            id: Date.now().toString(),
            timestamp: new Date(),
            userId: "user-1",
            userName: "Usuario Actual",
            action: "stage_changed" as const,
            details: {
              field: "etapa",
              oldValue: project.etapa,
              newValue: newStage,
            },
          },
          ...(project.metadata?.history || []),
        ],
      },
    }
    onUpdateProject(updatedProject)
  }

  const openDetails = (item: any, type: "project" | "folder" | "document") => {
    setSelectedItem(item)
    setSelectedItemType(type)
    setDetailsSheetOpen(true)
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <Button variant="secundario" onClick={handleBackNavigation}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        </div>

        <div className="flex flex-row gap-2">
          <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex-1 sm:flex-none">
                <Upload className="w-4 h-4 mr-2" />
                Subir documento
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>
                  {localCurrentPath.length > 0 ? `Subir a: ${currentFolder.name}` : "Subir documento"}
                </DialogTitle>
                <DialogDescription>
                  {localCurrentPath.length > 0
                    ? `Los documentos se agregarán a la carpeta "${currentFolder.name}"`
                    : "Selecciona la carpeta destino para tus documentos"}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                {/* <div className="space-y-2">
                  <Label htmlFor="docName">Nombre del documento</Label>
                  <Input
                    id="docName"
                    value={newDocumentName}
                    onChange={(e) => setNewDocumentName(e.target.value)}
                    placeholder="Ej: Plano Arquitectónico Principal"
                  />
                </div> */}
                <div className="space-y-4">
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

                  {/* Selector de destino mejorado */}
                  {localCurrentPath.length > 0 ? (
                    <div className="bg-muted p-3 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm">
                          <Folder className="w-4 h-4 mr-2 text-blue-500" />
                          <span>
                            Destino: <strong>{currentFolder.name}</strong>
                          </span>
                        </div>
                        <Button
                          variant="secundario"
                          size="sm"
                          onClick={() => setShowDestinationSelector(!showDestinationSelector)}
                        >
                          Cambiar
                        </Button>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Documentos actuales: {currentFolder.documents.length} / {currentFolder.minDocuments} mínimos
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label htmlFor="folder">Carpeta Destino</Label>
                      <Select value={selectedFolderId} onValueChange={setSelectedFolderId}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Seleccionar carpeta..." />
                        </SelectTrigger>
                        <SelectContent>
                          {project.structure.subfolders.map((folder) => (
                            <div key={folder.id}>
                              <SelectItem value={folder.id}>{folder.name}</SelectItem>
                              {folder.subfolders.map((subfolder) => (
                                <SelectItem key={subfolder.id} value={subfolder.id}>
                                  {folder.name} / {subfolder.name}
                                </SelectItem>
                              ))}
                            </div>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Selector alternativo cuando se hace clic en "Cambiar" */}
                  {showDestinationSelector && localCurrentPath.length > 0 && (
                    <div className="mt-4">
                      <Label htmlFor="alternativeFolder" className="mb-3 block">Cambiar Destino</Label>
                      <Select value={selectedFolderId || "keep-current"} onValueChange={(value) => {
                        setSelectedFolderId(value === "keep-current" ? "" : value)
                      }}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Mantener carpeta actual" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="keep-current">Mantener carpeta actual</SelectItem>
                          {/* Mostrar solo carpetas del mismo nivel y subcarpetas */}
                          {getCurrentParentFolder()?.subfolders.map((folder) => (
                            <SelectItem key={folder.id} value={folder.id}>
                              {folder.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}


                </div>

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
                    disabled={selectedFiles.length === 0 || (localCurrentPath.length === 0 && !selectedFolderId)}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Subir{" "}
                    {selectedFiles.length > 0
                      ? `${selectedFiles.length} archivo${selectedFiles.length > 1 ? "s" : ""}`
                      : "Documentos"}
                  </Button>
                  <Button variant="secundario" onClick={() => setIsUploadDialogOpen(false)}>
                    Cancelar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

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
                  La carpeta se creará en {localCurrentPath.length > 0 ? `"${currentFolder.name}"` : "la raíz del proyecto"}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="folderName">Nombre de la carpeta</Label>
                  <Input
                    id="folderName"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    placeholder="Ej: Documentos Técnicos"
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
                <div className="flex space-x-2">
                  <Button onClick={createFolder} className="flex-1" disabled={!newFolderName.trim()}>
                    Crear carpeta
                  </Button>
                  <Button variant="secundario" onClick={() => setIsCreateFolderDialogOpen(false)} className="flex-1">
                    Cancelar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isConfigDialogOpen} onOpenChange={setIsConfigDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Configurar Carpeta</DialogTitle>
                <DialogDescription>Ajusta las alertas y requisitos para esta carpeta</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="minDocs">Documentos Mínimos Requeridos</Label>
                  <Input
                    id="minDocs"
                    type="number"
                    min="0"
                    value={configMinDocs}
                    onChange={(e) => setConfigMinDocs(Number.parseInt(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label htmlFor="daysLimit">Días Límite para Completar (Opcional)</Label>
                  <Input
                    id="daysLimit"
                    type="number"
                    min="1"
                    placeholder="30"
                    value={configDaysLimit || ""}
                    onChange={(e) => setConfigDaysLimit(e.target.value ? Number.parseInt(e.target.value) : undefined)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Si se establece, se generará una alerta si no se completan los documentos mínimos en este tiempo
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button onClick={saveConfig} className="flex-1">
                    Guardar Configuración
                  </Button>
                  <Button variant="secundario" onClick={() => setIsConfigDialogOpen(false)} className="flex-1">
                    Cancelar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Breadcrumb Navigation */}
      {/* <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem className="hidden lg:block">
            <BreadcrumbPage className="text-muted-foreground font-bold text-md">Proyecto</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator />

          {breadcrumbPath.map((item, index) => (
            <div key={item.id} className="flex items-center">
              {index > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem className="hidden lg:block px-1">
                {index === breadcrumbPath.length - 1 ? (
                  <BreadcrumbPage>{item.name}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    onClick={() => {
                      if (index === 0) navigateToRoot()
                      else setLocalCurrentPath(localCurrentPath.slice(0, index))
                    }}
                    className="cursor-pointer"
                  >
                    {item.name}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </div>
          ))}
        </BreadcrumbList>
      </Breadcrumb> */}

      {/* Alerts Panel */}
      <AlertsPanel
        alerts={allAlerts}
        onNavigateToFolder={(folderId) => {
          // Navegar a la carpeta específica
          const pathToFolder = findPathToFolder(project.structure, folderId)
          if (pathToFolder) {
            setLocalCurrentPath(pathToFolder)
          }
        }}
        onUploadDocument={(folderId) => {
          // Abrir diálogo de subida con carpeta preseleccionada
          setSelectedFolderId(folderId)
          setIsUploadDialogOpen(true)
        }}
      />

      {/* Folder Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentFolder.subfolders.map((folder) => {
          // const folderAlerts = getFolderAlerts(folder)
          const totalDocs =
            folder.documents.length + folder.subfolders.reduce((acc, sub) => acc + sub.documents.length, 0)

          return (
            <Card key={folder.id} className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-2 flex-1" onClick={() => navigateToFolderLocal(folder.id)}>
                    <Folder className="w-5 h-5 text-blue-500" />
                    <CardTitle className="text-lg">{folder.name}</CardTitle>
                  </div>
                  <div className="flex items-center space-x-2">
                    {/* {folderAlerts.length > 0 && <Badge variant="destructive">{folderAlerts.length}</Badge>} */}
                    <ContextMenu
                      type="folder"
                      item={folder}
                      onViewDetails={() => openDetails(folder, "folder")}
                      onConfig={() => openConfigDialog(folder)}
                      onEdit={() => {
                        /* Implementar edición */
                      }}
                      onDelete={() => {
                        /* Implementar eliminación */
                      }}
                      onDuplicate={() => {
                        /* Implementar duplicación */
                      }}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Documentos:</span>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-sm font-semibold ${folder.documents.length < folder.minDocuments ? "text-red-600" : "text-emerald-600"
                          }`}
                      >
                        {folder.documents.length}
                      </span>
                      <span className="text-sm text-gray-400">/</span>
                      <span className="text-sm text-gray-500">{folder.minDocuments} mín.</span>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Total (con subcarpetas):</span>
                    <span>{totalDocs}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Subcarpetas:</span>
                    <span>{folder.subfolders.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}

        {/* Documents in current folder */}
        {currentFolder.documents.map((doc) => (
          <Card key={doc.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-green-500" />
                  <CardTitle className="text-lg">{doc.name}</CardTitle>
                </div>
                <DocumentConfigDialog
                  document={doc}
                  onUpdate={(updatedDoc) => {
                    const updateFolder = (folder: FolderStructure): FolderStructure => {
                      if (folder.documents.some((d) => d.id === updatedDoc.id)) {
                        return {
                          ...folder,
                          documents: folder.documents.map((d) => (d.id === updatedDoc.id ? updatedDoc : d)),
                        }
                      }
                      return {
                        ...folder,
                        subfolders: folder.subfolders.map(updateFolder),
                      }
                    }

                    const updatedProject = {
                      ...project,
                      structure: updateFolder(project.structure),
                    }

                    onUpdateProject(updatedProject)
                  }}
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4 mr-2" />
                  Subido: {doc.uploadedAt.toLocaleDateString()}
                </div>
                {doc.dueDate && (
                  <div
                    className={`flex items-center text-sm ${doc.dueDate < new Date() ? "text-destructive" : "text-muted-foreground"
                      }`}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Vence: {doc.dueDate.toLocaleDateString()}
                    {doc.hasCustomAlert && (
                      <Badge variant="outline" className="ml-2 text-xs">
                        Alerta personalizada
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty state */}
      {currentFolder.subfolders.length === 0 && currentFolder.documents.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Folder className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Carpeta vacía</h3>
            <p className="text-muted-foreground mb-4">Esta carpeta no contiene documentos ni subcarpetas</p>
            <Button onClick={() => setIsUploadDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Agregar primer documento
            </Button>
          </CardContent>
        </Card>
      )}

      <DetailsSheet
        isOpen={detailsSheetOpen}
        onClose={() => setDetailsSheetOpen(false)}
        item={selectedItem}
        type={selectedItemType}
        onStageChange={selectedItemType === "project" ? handleStageChange : undefined}
        onUpdate={(updatedItem) => {
          if (selectedItemType === "project") {
            onUpdateProject(updatedItem)
          }
          // Implementar actualización para folders y documents
        }}
      />
    </div>
  )
}
