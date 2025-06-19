"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/shared/components/design-system/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog"
import { Calendar } from "@/shared/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/shared/components/ui/collapsible"
import { Plus, FolderOpen, AlertTriangle, Calendar as CalendarIcon, FileText, ChevronDown, ChevronUp } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/shared/lib/utils"
import ProjectView from "./_components/project-view"

interface Project {
  id: string
  name: string
  description: string
  createdAt: Date
  structure: FolderStructure
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
}

const defaultStructure: FolderStructure[] = [
  {
    id: "arch",
    name: "Arquitectura",
    minDocuments: 3,
    documents: [],
    subfolders: [
      { id: "arch-plans", name: "Planos", minDocuments: 2, documents: [], subfolders: [], parentId: "arch" },
      { id: "arch-specs", name: "Especificaciones", minDocuments: 1, documents: [], subfolders: [], parentId: "arch" },
    ],
  },
  {
    id: "const",
    name: "Construcción",
    minDocuments: 3,
    documents: [],
    subfolders: [
      { id: "const-permits", name: "Permisos", minDocuments: 2, documents: [], subfolders: [], parentId: "const" },
      { id: "const-materials", name: "Materiales", minDocuments: 1, documents: [], subfolders: [], parentId: "const" },
    ],
  },
  {
    id: "legal",
    name: "Documentación Legal",
    minDocuments: 3,
    documents: [],
    subfolders: [
      { id: "legal-contracts", name: "Contratos", minDocuments: 1, documents: [], subfolders: [], parentId: "legal" },
      { id: "legal-licenses", name: "Licencias", minDocuments: 2, documents: [], subfolders: [], parentId: "legal" },
    ],
  },
  {
    id: "budget",
    name: "Presupuesto",
    minDocuments: 3,
    documents: [],
    subfolders: [
      {
        id: "budget-estimates",
        name: "Estimaciones",
        minDocuments: 1,
        documents: [],
        subfolders: [],
        parentId: "budget",
      },
      { id: "budget-invoices", name: "Facturas", minDocuments: 2, documents: [], subfolders: [], parentId: "budget" },
    ],
  },
  {
    id: "schedule",
    name: "Cronograma",
    minDocuments: 3,
    documents: [],
    subfolders: [
      {
        id: "schedule-timeline",
        name: "Línea de Tiempo",
        minDocuments: 1,
        documents: [],
        subfolders: [],
        parentId: "schedule",
      },
      {
        id: "schedule-milestones",
        name: "Hitos",
        minDocuments: 1,
        documents: [],
        subfolders: [],
        parentId: "schedule",
      },
    ],
  },
]

interface FolderConfig {
  minDocs: number
  daysLimit?: number
}

interface FolderConfigCardProps {
  folder: FolderStructure
  isSelected: boolean
  config: FolderConfig
  onToggle: () => void
  onConfigChange: (config: FolderConfig) => void
  onSubfolderAdd: (subfolderName: string) => void
  onSubfolderEdit: (subfolderId: string, newName: string) => void
  onSubfolderRemove: (subfolderId: string) => void
}

const FolderConfigCard: React.FC<FolderConfigCardProps> = ({
  folder,
  isSelected,
  config,
  onToggle,
  onConfigChange,
  onSubfolderAdd,
  onSubfolderEdit,
  onSubfolderRemove,
}) => {
  const [newSubfolderName, setNewSubfolderName] = useState("")
  const [isEditingSubfolder, setIsEditingSubfolder] = useState<string | null>(null)
  const [editedSubfolderName, setEditedSubfolderName] = useState("")
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined)
  const [isSubfoldersExpanded, setIsSubfoldersExpanded] = useState(false)

  return (
    <div className="border rounded-lg p-4">
      <div className={`flex items-center space-x-3 ${isSelected ? "mb-0" : ""}`}>
        <input type="checkbox" id={folder.id} checked={isSelected} onChange={onToggle} className="w-4 h-4" />
        <label htmlFor={folder.id} className="font-medium cursor-pointer">
          {folder.name}
        </label>
      </div>

      {isSelected && (
        <div className="ml-2 md:ml-6 mt-4 space-y-4 p-2 md:p-4 rounded-lg bg-muted/30">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs">Documentos mínimos</Label>
              <Input
                type="number"
                min="0"
                value={config.minDocs}
                onChange={(e) =>
                  onConfigChange({
                    ...config,
                    minDocs: Number.parseInt(e.target.value) || 0,
                  })
                }
                className="h-8 mt-1"
              />
            </div>
            <div>
              <Label className="text-xs">Fecha límite</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="secundario"
                    className={cn(
                      "h-8 w-full justify-start text-left font-normal text-xs mt-1",
                      !dueDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-3 w-3" />
                    {dueDate ? format(dueDate, "dd/MM/yyyy", { locale: es }) : <span>Seleccionar fecha</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={(date) => {
                      setDueDate(date)
                      onConfigChange({
                        ...config,
                        daysLimit: date ? Math.ceil((date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : undefined,
                      })
                    }}
                    initialFocus
                    locale={es}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <Collapsible open={isSubfoldersExpanded} onOpenChange={setIsSubfoldersExpanded}>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center justify-between w-full p-2 hover:bg-accent/50 rounded-md -ml-1 md:-ml-2"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-medium text-foreground">
                    Gestionar subcarpetas ({folder.subfolders.length})
                  </span>
                </div>
                {isSubfoldersExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>

            <CollapsibleContent className="ml-2 md:ml-4 pl-2 md:pl-4 border-l-1 border-muted-foreground/20">
              <div className="space-y-3 mt-3">
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-foreground">Agregar nueva subcarpeta:</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="text"
                      placeholder="Escribe el nombre de la subcarpeta..."
                      value={newSubfolderName}
                      onChange={(e) => setNewSubfolderName(e.target.value)}
                      className="h-8 text-xs"
                    />
                    <Button
                      variant="primario"
                      size="sm"
                      onClick={() => {
                        onSubfolderAdd(newSubfolderName)
                        setNewSubfolderName("")
                      }}
                      disabled={!newSubfolderName.trim()}
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Crear
                    </Button>
                  </div>
                </div>

                {folder.subfolders.length > 0 && (
                  <div className="space-y-2 mt-4">
                    <div className="text-xs font-medium text-muted-foreground">Subcarpetas existentes:</div>
                    <div className="space-y-2">
                      {folder.subfolders.map((subfolder) => (
                        <div
                          key={subfolder.id}
                          className="flex items-center justify-between p-3 bg-background rounded-lg border border-border hover:bg-accent/50 transition-colors shadow-sm"
                        >
                          {isEditingSubfolder === subfolder.id ? (
                            <Input
                              type="text"
                              value={editedSubfolderName}
                              onChange={(e) => setEditedSubfolderName(e.target.value)}
                              className="h-8 text-xs flex-1 mr-3"
                            />
                          ) : (
                            <div className="text-xs font-medium flex-1">{subfolder.name}</div>
                          )}

                          {isEditingSubfolder === subfolder.id ? (
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="primario"
                                size="sm"
                                onClick={() => {
                                  onSubfolderEdit(subfolder.id, editedSubfolderName)
                                  setIsEditingSubfolder(null)
                                }}
                                className="h-8 px-3 text-xs"
                              >
                                Guardar
                              </Button>
                              <Button
                                variant="secundario"
                                size="sm"
                                onClick={() => setIsEditingSubfolder(null)}
                                className="h-8 px-3 text-xs"
                              >
                                Cancelar
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="primario"
                                size="sm"
                                onClick={() => {
                                  setIsEditingSubfolder(subfolder.id)
                                  setEditedSubfolderName(subfolder.name)
                                }}
                                className="h-8 px-3 text-xs"
                              >
                                Editar
                              </Button>
                              <Button
                                variant="secundario"
                                size="sm"
                                onClick={() => onSubfolderRemove(subfolder.id)}
                                className="h-8 px-3 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                              >
                                Eliminar
                              </Button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      )}
    </div>
  )
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newProjectName, setNewProjectName] = useState("")
  const [newProjectDescription, setNewProjectDescription] = useState("")
  const [selectedFolders, setSelectedFolders] = useState<string[]>([])
  const [folderConfigs, setFolderConfigs] = useState<Record<string, { minDocs: number; daysLimit?: number }>>(
    defaultStructure.reduce(
      (acc, folder) => ({
        ...acc,
        [folder.id]: { minDocs: folder.minDocuments },
      }),
      {},
    ),
  )

  // Agregar después de los estados existentes
  const [customFolders, setCustomFolders] = useState<FolderStructure[]>([])
  const [isCreateFolderDialogOpen, setIsCreateFolderDialogOpen] = useState(false)
  const [newFolderName, setNewFolderName] = useState("")
  const [defaultStructureState, setDefaultStructureState] = useState<FolderStructure[]>(defaultStructure)
  // const [editingFolderId, setEditingFolderId] = useState<string | null>(null)

  // Función para crear carpeta personalizada
  const createCustomFolder = () => {
    if (!newFolderName.trim()) return

    const newFolder: FolderStructure = {
      id: `custom-${Date.now()}`,
      name: newFolderName,
      minDocuments: 3,
      documents: [],
      subfolders: [],
    }

    setCustomFolders([...customFolders, newFolder])
    setSelectedFolders([...selectedFolders, newFolder.id])
    setFolderConfigs({
      ...folderConfigs,
      [newFolder.id]: { minDocs: 3 },
    })
    setNewFolderName("")
    setIsCreateFolderDialogOpen(false)
  }

  // Función para agregar subcarpeta
  const addSubfolder = (parentId: string, subfolderName: string) => {
    if (!subfolderName.trim()) return

    const newSubfolder = {
      id: `${parentId}-sub-${Date.now()}`,
      name: subfolderName,
      minDocuments: 1,
      documents: [],
      subfolders: [],
      parentId: parentId,
    }

    // Actualizar carpetas personalizadas
    const updateFolders = (folders: FolderStructure[]): FolderStructure[] => {
      return folders.map((folder) => {
        if (folder.id === parentId) {
          return { ...folder, subfolders: [...folder.subfolders, newSubfolder] }
        }
        return folder
      })
    }

    // Actualizar customFolders
    setCustomFolders(updateFolders(customFolders))

    // Actualizar defaultStructure si es una carpeta del template
    const isDefaultFolder = defaultStructure.some(folder => folder.id === parentId)
    if (isDefaultFolder) {
      setDefaultStructureState(updateFolders(defaultStructureState))
    }
  }

  // Función para eliminar subcarpeta
  const removeSubfolder = (parentId: string, subfolderId: string) => {
    // Función para eliminar subcarpeta de una lista de carpetas
    const updateFolders = (folders: FolderStructure[]): FolderStructure[] => {
      return folders.map((folder) => {
        if (folder.id === parentId) {
          return {
            ...folder,
            subfolders: folder.subfolders.filter((subfolder) => subfolder.id !== subfolderId)
          }
        }
        return folder
      })
    }

    // Actualizar customFolders
    setCustomFolders(updateFolders(customFolders))

    // Actualizar defaultStructure si es una carpeta del template
    const isDefaultFolder = defaultStructure.some(folder => folder.id === parentId)
    if (isDefaultFolder) {
      setDefaultStructureState(updateFolders(defaultStructureState))
    }
  }

  // Función para editar subcarpeta
  const editSubfolder = (parentId: string, subfolderId: string, newName: string) => {
    if (!newName.trim()) return

    // Función para editar subcarpeta de una lista de carpetas
    const updateFolders = (folders: FolderStructure[]): FolderStructure[] => {
      return folders.map((folder) => {
        if (folder.id === parentId) {
          return {
            ...folder,
            subfolders: folder.subfolders.map((subfolder) =>
              subfolder.id === subfolderId ? { ...subfolder, name: newName } : subfolder
            )
          }
        }
        return folder
      })
    }

    // Actualizar customFolders
    setCustomFolders(updateFolders(customFolders))

    // Actualizar defaultStructure si es una carpeta del template
    const isDefaultFolder = defaultStructure.some(folder => folder.id === parentId)
    if (isDefaultFolder) {
      setDefaultStructureState(updateFolders(defaultStructureState))
    }
  }

  // Combinar carpetas del template con personalizadas
  const allFolders = [...defaultStructureState, ...customFolders]

  const createProject = () => {
    if (!newProjectName.trim()) return

    const selectedStructure = allFolders
      .filter((folder) => selectedFolders.includes(folder.id))
      .map((folder) => ({
        ...folder,
        minDocuments: folderConfigs[folder.id]?.minDocs || folder.minDocuments,
        daysLimit: folderConfigs[folder.id]?.daysLimit,
      }))

    const newProject: Project = {
      id: Date.now().toString(),
      name: newProjectName,
      description: newProjectDescription,
      createdAt: new Date(),
      structure: {
        id: "root",
        name: newProjectName,
        minDocuments: 0,
        documents: [],
        subfolders: selectedStructure,
      },
    }

    setProjects([...projects, newProject])
    setNewProjectName("")
    setNewProjectDescription("")
    setSelectedFolders([])
    setFolderConfigs(
      defaultStructure.reduce(
        (acc, folder) => ({
          ...acc,
          [folder.id]: { minDocs: folder.minDocuments },
        }),
        {},
      ),
    )
    setIsCreateDialogOpen(false)
  }

  const getTotalAlerts = (folder: FolderStructure): number => {
    let alerts = 0

    // Alertas por documentos faltantes
    if (folder.documents.length < folder.minDocuments) {
      alerts++
    }

    // Alertas por fechas vencidas
    const overdueDocs = folder.documents.filter((doc) => doc.dueDate && doc.dueDate < new Date())
    alerts += overdueDocs.length

    // Alertas de subcarpetas
    folder.subfolders.forEach((subfolder) => {
      alerts += getTotalAlerts(subfolder)
    })

    return alerts
  }

  if (selectedProject) {
    return (
      <ProjectView
        project={selectedProject}
        onBack={() => setSelectedProject(null)}
        onUpdateProject={(updatedProject) => {
          setProjects(projects.map((p) => (p.id === updatedProject.id ? updatedProject : p)))
          setSelectedProject(updatedProject)
        }}
      />
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col space-y-4 mb-8 md:flex-row md:justify-between md:items-center md:space-y-0">
        <div>
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-bold">Gestión de proyectos</h1>
            <div className="md:hidden">
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Nuevo <span className="hidden md:inline">{" proyecta"}</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md sm:max-w-lg md:max-w-3xl lg:max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0">
                    <div className="flex flex-col gap-2 flex-1">
                      <DialogTitle>Crear nuevo proyecto</DialogTitle>
                      <DialogDescription>
                        Personaliza la estructura base y configuración de alertas para tu proyecto
                      </DialogDescription>
                    </div>
                    <div className="flex items-center gap-3 md:flex-col md:gap-2 md:ml-auto md:mr-10">
                      <Button onClick={createProject} disabled={selectedFolders.length === 0 || !newProjectName.trim()}>
                        Crear proyecto
                      </Button>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        Haz seleccionado {selectedFolders.length} carpetas
                      </span>
                    </div>
                  </DialogHeader>
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nombre del proyecto</Label>
                        <Input
                          id="name"
                          value={newProjectName}
                          onChange={(e) => setNewProjectName(e.target.value)}
                          placeholder="Ej: Edificio Residencial Centro"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">Descripción (opcional)</Label>
                        <Input
                          id="description"
                          value={newProjectDescription}
                          onChange={(e) => setNewProjectDescription(e.target.value)}
                          placeholder="Breve descripción del proyecto"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium">Seleccionar carpetas</h4>
                        <Dialog open={isCreateFolderDialogOpen} onOpenChange={setIsCreateFolderDialogOpen}>
                          <DialogTrigger asChild>
                            <Button variant="primario" size="sm">
                              <Plus className="w-4 h-4 mr-1" />
                              Nueva carpeta
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>Crear carpeta</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="folderName">Nombre de la carpeta</Label>
                                <Input
                                  id="folderName"
                                  value={newFolderName}
                                  onChange={(e) => setNewFolderName(e.target.value)}
                                  placeholder="Ej: Documentación Técnica"
                                />
                              </div>
                              <Button onClick={createCustomFolder} className="w-full">
                                Crear carpeta
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>

                      <div className="space-y-3">
                        {allFolders.map((folder) => (
                          <FolderConfigCard
                            key={folder.id}
                            folder={folder}
                            isSelected={selectedFolders.includes(folder.id)}
                            config={folderConfigs[folder.id] || { minDocs: folder.minDocuments }}
                            onToggle={() => {
                              if (selectedFolders.includes(folder.id)) {
                                setSelectedFolders(selectedFolders.filter((id) => id !== folder.id))
                              } else {
                                setSelectedFolders([...selectedFolders, folder.id])
                              }
                            }}
                            onConfigChange={(config) =>
                              setFolderConfigs({
                                ...folderConfigs,
                                [folder.id]: config,
                              })
                            }
                            onSubfolderAdd={(subfolderName) => addSubfolder(folder.id, subfolderName)}
                            onSubfolderEdit={(subfolderId, newName) => editSubfolder(folder.id, subfolderId, newName)}
                            onSubfolderRemove={(subfolderId) => removeSubfolder(folder.id, subfolderId)}
                          />
                        ))}
                      </div>
                    </div>

                    <Button onClick={createProject} className="w-full" disabled={selectedFolders.length === 0 || !newProjectName.trim()}>
                      Crear proyecto ({selectedFolders.length} carpetas seleccionadas)
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <p className="text-muted-foreground mt-2">
            Administra tus proyectos con estructura de carpetas automática y alertas inteligentes
          </p>
        </div>

        <div className="hidden md:block">
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Nuevo proyecto
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md sm:max-w-lg md:max-w-3xl lg:max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0">
                <div className="flex flex-col gap-2 flex-1">
                  <DialogTitle>Crear nuevo proyecto</DialogTitle>
                  <DialogDescription>
                    Personaliza la estructura base y configuración de alertas para tu proyecto
                  </DialogDescription>
                </div>
                <div className="flex items-center gap-3 md:flex-col md:gap-2 md:ml-auto md:mr-10">
                  <Button onClick={createProject} disabled={selectedFolders.length === 0 || !newProjectName.trim()}>
                    Crear proyecto
                  </Button>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    Haz seleccionado {selectedFolders.length} carpetas
                  </span>
                </div>
              </DialogHeader>
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre del proyecto</Label>
                    <Input
                      id="name"
                      value={newProjectName}
                      onChange={(e) => setNewProjectName(e.target.value)}
                      placeholder="Ej: Edificio Residencial Centro"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Descripción (opcional)</Label>
                    <Input
                      id="description"
                      value={newProjectDescription}
                      onChange={(e) => setNewProjectDescription(e.target.value)}
                      placeholder="Breve descripción del proyecto"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium">Seleccionar carpetas</h4>
                    <Dialog open={isCreateFolderDialogOpen} onOpenChange={setIsCreateFolderDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="primario" size="sm">
                          <Plus className="w-4 h-4 mr-1" />
                          Nueva carpeta
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Crear carpeta</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="folderName">Nombre de la carpeta</Label>
                            <Input
                              id="folderName"
                              value={newFolderName}
                              onChange={(e) => setNewFolderName(e.target.value)}
                              placeholder="Ej: Documentación Técnica"
                            />
                          </div>
                          <Button onClick={createCustomFolder} className="w-full">
                            Crear carpeta
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="space-y-3">
                    {allFolders.map((folder) => (
                      <FolderConfigCard
                        key={folder.id}
                        folder={folder}
                        isSelected={selectedFolders.includes(folder.id)}
                        config={folderConfigs[folder.id] || { minDocs: folder.minDocuments }}
                        onToggle={() => {
                          if (selectedFolders.includes(folder.id)) {
                            setSelectedFolders(selectedFolders.filter((id) => id !== folder.id))
                          } else {
                            setSelectedFolders([...selectedFolders, folder.id])
                          }
                        }}
                        onConfigChange={(config) =>
                          setFolderConfigs({
                            ...folderConfigs,
                            [folder.id]: config,
                          })
                        }
                        onSubfolderAdd={(subfolderName) => addSubfolder(folder.id, subfolderName)}
                        onSubfolderEdit={(subfolderId, newName) => editSubfolder(folder.id, subfolderId, newName)}
                        onSubfolderRemove={(subfolderId) => removeSubfolder(folder.id, subfolderId)}
                      />
                    ))}
                  </div>
                </div>

                <Button onClick={createProject} className="w-full" disabled={selectedFolders.length === 0 || !newProjectName.trim()}>
                  Crear proyecto ({selectedFolders.length} carpetas seleccionadas)
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {projects.length === 0 ? (
        <Card className="text-center py-12 h-full">
          <CardContent>
            <FolderOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No hay proyectos</h3>
            <p className="text-muted-foreground mb-4">
              Crea tu primer proyecto para comenzar a organizar tus documentos
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Crear primer proyecto
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {projects.map((project) => {
            const totalAlerts = getTotalAlerts(project.structure)
            const totalFolders = project.structure.subfolders.length
            const totalDocuments = project.structure.subfolders.reduce(
              (acc, folder) =>
                acc +
                folder.documents.length +
                folder.subfolders.reduce((subAcc, subfolder) => subAcc + subfolder.documents.length, 0),
              0,
            )

            return (
              <Card
                key={project.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedProject(project)}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      {project.description && <CardDescription className="mt-1">{project.description}</CardDescription>}
                    </div>
                    {totalAlerts > 0 && (
                      <div className="flex items-center text-destructive">
                        <AlertTriangle className="w-4 h-4 mr-1" />
                        <span className="text-sm font-medium">{totalAlerts}</span>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <FolderOpen className="w-4 h-4 mr-2" />
                      {totalFolders} carpetas principales
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <FileText className="w-4 h-4 mr-2" />
                      {totalDocuments} documentos totales
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      Creado {project.createdAt.toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
