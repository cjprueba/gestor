"use client"

import React, { useState } from "react"
import { Button } from "@/shared/components/design-system/button"
import { Badge } from "@/shared/components/ui/badge"
import { Checkbox } from "@/shared/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/components/ui/dialog"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Plus, FolderIcon, Folder, InfoIcon, Filter } from "lucide-react"
import { PLANTILLAS_CARPETAS, ETAPAS } from "@/shared/data/project-data"
import { DEFAULT_FOLDER_TEMPLATES } from "@/shared/data/projects"
import type { ProjectFormData, FolderStructure, FolderConfig } from "../types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"

interface FolderTemplatesStepProps {
  formData: ProjectFormData
  selectedFolders: string[]
  folderConfigs: Record<string, FolderConfig>
  customFolders: FolderStructure[]
  useCustomTemplates: boolean
  showFolderTemplates: boolean
  onSetSelectedFolders: (folders: string[]) => void
  onSetFolderConfigs: (configs: Record<string, FolderConfig>) => void
  onSetUseCustomTemplates: (use: boolean) => void
  onSetShowFolderTemplates: (show: boolean) => void
  onCreateCustomFolder: (name: string, minDocs: number) => void
}

export const FolderTemplatesStep: React.FC<FolderTemplatesStepProps> = ({
  formData,
  selectedFolders,
  folderConfigs,
  customFolders,
  useCustomTemplates,
  showFolderTemplates,
  onSetSelectedFolders,
  onSetFolderConfigs,
  onSetUseCustomTemplates,
  onCreateCustomFolder,
}) => {
  const [isCreateFolderDialogOpen, setIsCreateFolderDialogOpen] = useState(false)
  const [newFolderName, setNewFolderName] = useState("")
  const [selectedEtapa, setSelectedEtapa] = useState<string>(formData.etapa || "")
  const [selectedTemplate, setSelectedTemplate] = useState<string>("plantillas_principales")
  const [availableFolders, setAvailableFolders] = useState<string[]>([])
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

  // Obtener todas las plantillas disponibles (combinando todas las etapas)
  const getAllFolders = (): string[] => {
    const allFolders = new Set<string>()

    // Agregar carpetas de PLANTILLAS_CARPETAS de todas las etapas
    Object.values(PLANTILLAS_CARPETAS).forEach(folders => {
      folders.forEach(folder => allFolders.add(folder))
    })

    // Agregar carpetas de DEFAULT_FOLDER_TEMPLATES de todas las etapas  
    Object.values(DEFAULT_FOLDER_TEMPLATES).forEach(folders => {
      folders.forEach(folder => allFolders.add(folder))
    })

    return Array.from(allFolders).sort()
  }

  // Obtener carpetas default al cargar
  // const getDefaultFolders = (): string[] => {
  //   // Combinar todas las carpetas únicas de todas las etapas
  //   const allFolders = new Set<string>()

  //   // Agregar carpetas de PLANTILLAS_CARPETAS
  //   Object.values(PLANTILLAS_CARPETAS).forEach(folders => {
  //     folders.forEach(folder => allFolders.add(folder))
  //   })

  //   // Agregar carpetas de DEFAULT_FOLDER_TEMPLATES
  //   Object.values(DEFAULT_FOLDER_TEMPLATES).forEach(folders => {
  //     folders.forEach(folder => allFolders.add(folder))
  //   })

  //   return Array.from(allFolders).sort()
  // }

  // Obtener carpetas por etapa seleccionada
  const getFoldersByEtapa = (etapa: string): string[] => {
    const plantillasCarpetas = PLANTILLAS_CARPETAS[etapa as keyof typeof PLANTILLAS_CARPETAS] || []
    const defaultCarpetas = DEFAULT_FOLDER_TEMPLATES[etapa as keyof typeof DEFAULT_FOLDER_TEMPLATES] || []

    // Combinar ambas fuentes y eliminar duplicados
    const combinedFolders = [...[...plantillasCarpetas], ...[...defaultCarpetas]]
    return Array.from(new Set(combinedFolders)).sort()
  }

  // Obtener carpetas por plantilla seleccionada
  const getFoldersByTemplate = (template: string): string[] => {
    switch (template) {
      case "plantillas_principales":
        return getAllFolders() // Ahora carga todas las plantillas
      case "plantillas_etapa":
        return selectedEtapa ? getFoldersByEtapa(selectedEtapa) : []
      case "plantillas_secundarias":
        return [...(DEFAULT_FOLDER_TEMPLATES["Cartera de proyectos"] || [])]
      default:
        return getAllFolders() // Por defecto, mostrar todas las plantillas
    }
  }

  // Actualizar carpetas disponibles cuando cambia la selección de etapa o plantilla
  const updateAvailableFolders = () => {
    let folders: string[] = []

    if (selectedTemplate === "plantillas_etapa" && selectedEtapa) {
      folders = getFoldersByEtapa(selectedEtapa)
    } else {
      folders = getFoldersByTemplate(selectedTemplate)
    }

    setAvailableFolders(folders)
  }

  // Efecto para inicializar carpetas default al cargar
  React.useEffect(() => {
    if (!selectedEtapa && formData.etapa) {
      setSelectedEtapa(formData.etapa)
    }
    updateAvailableFolders()
  }, [formData.etapa, selectedEtapa])

  // Efecto para actualizar carpetas cuando cambian los selectores
  React.useEffect(() => {
    updateAvailableFolders()
  }, [selectedEtapa, selectedTemplate, formData.etapa])

  // Función para manejar el toggle de carpetas
  const handleFolderToggle = (folderName: string) => {
    if (selectedFolders.includes(folderName)) {
      // Remover carpeta
      onSetSelectedFolders(selectedFolders.filter((f) => f !== folderName))
      const newConfigs = { ...folderConfigs }
      delete newConfigs[folderName]
      onSetFolderConfigs(newConfigs)
    } else {
      // Agregar carpeta
      onSetSelectedFolders([...selectedFolders, folderName])
      onSetFolderConfigs({
        ...folderConfigs,
        [folderName]: { minDocs: 3, daysLimit: 30 },
      })
    }
  }

  // Función para crear carpeta personalizada
  const handleCreateCustomFolder = () => {
    if (!newFolderName.trim()) return

    onCreateCustomFolder(newFolderName.trim(), 3)
    setNewFolderName("")
    setIsCreateFolderDialogOpen(false)
  }

  // Función para seleccionar todas las carpetas disponibles
  const handleSelectAllFolders = () => {
    const foldersToAdd = availableFolders.filter(folder => !selectedFolders.includes(folder))
    const newSelectedFolders = [...selectedFolders, ...foldersToAdd]

    const newConfigs = { ...folderConfigs }
    foldersToAdd.forEach(folder => {
      newConfigs[folder] = { minDocs: 3, daysLimit: 30 }
    })

    onSetSelectedFolders(newSelectedFolders)
    onSetFolderConfigs(newConfigs)
  }

  // Función para deseleccionar todas las carpetas disponibles
  // const handleDeselectAllFolders = () => {
  //   const foldersToRemove = availableFolders.filter(folder => selectedFolders.includes(folder))
  //   const newSelectedFolders = selectedFolders.filter(folder => !foldersToRemove.includes(folder))

  //   const newConfigs = { ...folderConfigs }
  //   foldersToRemove.forEach(folder => {
  //     delete newConfigs[folder]
  //   })

  //   onSetSelectedFolders(newSelectedFolders)
  //   onSetFolderConfigs(newConfigs)
  // }

  const renderCustomTemplateMode = () => (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-green-200 bg-green-50 p-6 rounded-lg">
        <div className="text-center">
          <Plus className="w-12 h-12 mx-auto text-green-600 mb-3" />
          <h3 className="font-medium text-green-900 mb-2">Crear carpetas personalizadas</h3>
          <p className="text-sm text-green-700 mb-4">
            En este modo puedes crear carpetas específicas para este proyecto, sin usar plantillas predefinidas.
            Ideal cuando tienes necesidades muy específicas.
          </p>
          <div className="flex items-center justify-center space-x-2">
            <Button variant="secundario" size="sm" onClick={() => onSetUseCustomTemplates(false)}>
              <FolderIcon className="w-4 h-4 mr-2" />
              Cambiar a plantillas
            </Button>
          </div>
        </div>
      </div>

      {/* Lista de carpetas personalizadas creadas */}
      {customFolders.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Carpetas personalizadas creadas:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {customFolders.map((folder) => (
              <div
                key={folder.id}
                className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <Checkbox
                  id={folder.id}
                  checked={selectedFolders.includes(folder.id)}
                  onCheckedChange={() => handleFolderToggle(folder.id)}
                />
                <div className="flex items-center space-x-2 flex-1">
                  <Folder className="w-4 h-4 text-green-500" />
                  <label htmlFor={folder.id} className="text-sm font-medium cursor-pointer flex-1">
                    {folder.name}
                  </label>
                  <Badge variant="outline" className="text-xs">
                    Min: {folder.minDocuments}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Botón para crear nueva carpeta */}
      <div className="flex items-center justify-center pt-4">
        <Dialog open={isCreateFolderDialogOpen} onOpenChange={setIsCreateFolderDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="primario" size="sm">
              <Plus className="w-4 h-4 mr-1" />
              Nueva carpeta personalizada
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Crear carpeta personalizada</DialogTitle>
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
              <Button onClick={handleCreateCustomFolder} className="w-full">
                Crear carpeta
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )

  const renderTemplateMode = () => {
    // Obtener todas las plantillas disponibles (nuevo comportamiento)
    const templateFolders: string[] = getAllFolders()

    // Mostrar todas las carpetas personalizadas creadas
    const customFoldersToShow = customFolders

    return (
      <div className="space-y-4">
        {/* Nuevos filtros avanzados - colapsables */}
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-blue-600" />
              <h4 className="font-medium text-blue-800 text-sm">Filtros avanzados</h4>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="text-xs"
            >
              {showAdvancedFilters ? "Ocultar" : "Mostrar"} opciones
            </Button>
          </div>

          {showAdvancedFilters && (
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Selector de Plantilla */}
              <div className="space-y-2">
                <Label htmlFor="template-select" className="text-xs">Seleccionar plantilla</Label>
                <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                  <SelectTrigger id="template-select" className="h-8 text-sm">
                    <SelectValue placeholder="Selecciona una plantilla" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="plantillas_principales">Todas las plantillas</SelectItem>
                    <SelectItem value="plantillas_etapa">Carpetas por etapa específica</SelectItem>
                    <SelectItem value="plantillas_secundarias">Plantillas para Cartera de proyectos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Selector de Etapa (solo visible cuando se selecciona "plantillas_etapa") */}
              {selectedTemplate === "plantillas_etapa" && (
                <div className="space-y-2">
                  <Label htmlFor="etapa-select" className="text-xs">Seleccionar etapa</Label>
                  <Select value={selectedEtapa} onValueChange={setSelectedEtapa}>
                    <SelectTrigger id="etapa-select" className="h-8 text-sm">
                      <SelectValue placeholder="Selecciona una etapa" />
                    </SelectTrigger>
                    <SelectContent>
                      {ETAPAS.map((etapa) => (
                        <SelectItem key={etapa} value={etapa}>
                          {etapa}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Lista principal de carpetas - comportamiento original mejorado */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-medium">Seleccionar carpetas</h4>
            {/* Controles de selección masiva para carpetas filtradas */}
            {availableFolders.length > 0 && availableFolders.length !== templateFolders.length && (
              <div className="flex gap-2">
                <Button
                  variant="secundario"
                  size="sm"
                  onClick={handleSelectAllFolders}
                  disabled={availableFolders.every(folder => selectedFolders.includes(folder))}
                  className="text-xs"
                >
                  Seleccionar todas filtradas
                </Button>
              </div>
            )}
          </div>

          {/* Mostrar carpetas según el filtro seleccionado o las de la etapa por defecto */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Carpetas principales (de la etapa o filtradas) */}
            {(selectedTemplate !== "plantillas_principales" ? availableFolders : templateFolders).map((folder) => (
              <div key={folder} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                <Checkbox
                  id={folder}
                  checked={selectedFolders.includes(folder)}
                  onCheckedChange={() => handleFolderToggle(folder)}
                />
                <div className="flex items-center space-x-2 flex-1">
                  <Folder className="w-4 h-4 text-blue-500" />
                  <label htmlFor={folder} className="text-sm font-medium cursor-pointer flex-1">
                    {folder}
                  </label>
                </div>
              </div>
            ))}

            {/* Carpetas personalizadas */}
            {customFoldersToShow.map((folder) => (
              <div
                key={folder.id}
                className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors bg-green-50 border-green-200"
              >
                <Checkbox
                  id={`template-custom-${folder.id}`}
                  checked={selectedFolders.includes(folder.id)}
                  onCheckedChange={() => handleFolderToggle(folder.id)}
                />
                <div className="flex items-center space-x-2 flex-1">
                  <Folder className="w-4 h-4 text-green-600" />
                  <label htmlFor={`template-custom-${folder.id}`} className="text-sm font-medium cursor-pointer flex-1">
                    {folder.name} <span className="text-xs text-green-600">(personalizada)</span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sección de resumen y opciones adicionales - original */}
        <div className="flex flex-row border-t pt-4">
          <div className="bg-blue-50 p-3 rounded-lg w-fit h-fit">
            <div className="text-sm">
              <strong>Carpetas seleccionadas:</strong> {selectedFolders.length}
              {selectedFolders.length === 0 && (
                <span className="text-destructive ml-2">⚠ Debes seleccionar al menos una carpeta</span>
              )}
            </div>
          </div>
          <div className="ml-auto">
            <div className="flex items-center gap-6 mb-2">
              <span className="text-sm font-medium">¿Necesitas carpetas adicionales?</span>
              <Dialog open={isCreateFolderDialogOpen} onOpenChange={setIsCreateFolderDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="primario" size="sm">
                    <Plus className="w-4 h-4 mr-1" />
                    Nueva carpeta
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Crear carpeta personalizada</DialogTitle>
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
                    <Button onClick={handleCreateCustomFolder} className="w-full">
                      Crear carpeta
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <p className="text-xs text-muted-foreground">
              Puedes combinar plantillas con carpetas personalizadas para este proyecto
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      {/* Sección informativa original */}
      <div className="bg-yellow-50 p-4 rounded-lg border border-warning-200">
        <div className="flex items-start space-x-3">
          <InfoIcon className="w-6 h-6 text-warning-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-warning-600 mb-2">Opciones para organizar tu proyecto</h3>
            <div className="text-sm text-warning-800 space-y-2">
              <p>
                <strong className="text-warning-400">Opción 1:</strong> Usa plantillas predefinidas según la etapa de tu proyecto (recomendado para
                comenzar rápido)
              </p>
              <p>
                <strong className="text-warning-400">Opción 2:</strong> Crea carpetas personalizadas una por una para este proyecto específico
              </p>
              <p>
                <strong className="text-warning-400">Opción 3:</strong> Combina ambas - usa algunas plantillas y agrega carpetas personalizadas
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Selector de modo */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium">Configuración de carpetas</h4>
          <p className="text-sm text-muted-foreground">
            {useCustomTemplates
              ? "Modo personalizado: Crea carpetas específicas para este proyecto"
              : "Modo plantillas: Selecciona carpetas predefinidas disponibles"}
          </p>
        </div>
        <div className="flex items-center">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="useCustomTemplates"
              checked={useCustomTemplates}
              onCheckedChange={(checked) => onSetUseCustomTemplates(!!checked)}
            />
            <Label htmlFor="useCustomTemplates" className="text-sm font-medium cursor-pointer">
              Modo personalizado
            </Label>
          </div>
        </div>
      </div>

      {/* Mostrar opciones según el modo */}
      {showFolderTemplates && (
        <div className="space-y-4">
          {useCustomTemplates ? renderCustomTemplateMode() : renderTemplateMode()}
        </div>
      )}
    </div>
  )
} 