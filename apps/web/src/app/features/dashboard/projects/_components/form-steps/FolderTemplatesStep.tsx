import React, { useState } from "react"
import { Button } from "@/shared/components/design-system/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Checkbox } from "@/shared/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/components/ui/dialog"
import { Plus, FolderIcon, Folder, InfoIcon } from "lucide-react"
import { PLANTILLAS_CARPETAS } from "@/shared/data/project-data"
import type { ProjectFormData, FolderStructure, FolderConfig } from "../types"

interface FolderTemplatesStepProps {
  formData: ProjectFormData
  selectedFolders: string[]
  folderConfigs: Record<string, FolderConfig>
  customFolders: FolderStructure[]
  useCustomTemplates: boolean
  showFolderTemplates: boolean
  onSetSelectedFolders: (folders: string[]) => void
  onSetFolderConfigs: (configs: Record<string, FolderConfig>) => void
  onSetUseCustomTemplates: (useCustom: boolean) => void
  onSetShowFolderTemplates: (show: boolean) => void
  onCreateCustomFolder: (folderName: string) => void
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

  const handleCreateCustomFolder = () => {
    if (!newFolderName.trim()) return
    onCreateCustomFolder(newFolderName)
    setNewFolderName("")
    setIsCreateFolderDialogOpen(false)
  }

  const handleFolderToggle = (folder: string) => {
    if (selectedFolders.includes(folder)) {
      onSetSelectedFolders(selectedFolders.filter((f) => f !== folder))
      const newConfigs = { ...folderConfigs }
      delete newConfigs[folder]
      onSetFolderConfigs(newConfigs)
    } else {
      onSetSelectedFolders([...selectedFolders, folder])
      onSetFolderConfigs({
        ...folderConfigs,
        [folder]: { minDocs: 3, daysLimit: 30 },
      })
    }
  }

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
                  <Button onClick={handleCreateCustomFolder} className="w-full">
                    Crear carpeta
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {customFolders.length > 0 && (
        <div className="space-y-4">
          <h5 className="font-medium text-sm">Carpetas Personalizadas Creadas:</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {customFolders.map((folder) => (
              <div
                key={folder.id}
                className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <Checkbox
                  id={`custom-${folder.id}`}
                  checked={selectedFolders.includes(folder.id)}
                  onCheckedChange={() => handleFolderToggle(folder.id)}
                />
                <div className="flex items-center space-x-2 flex-1">
                  <Folder className="w-4 h-4 text-blue-500" />
                  <label htmlFor={`custom-${folder.id}`} className="text-sm font-medium cursor-pointer flex-1">
                    {folder.name}
                  </label>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-blue-50 p-3 rounded-lg w-fit">
            <div className="text-sm">
              <strong>Carpetas seleccionadas:</strong> {customFolders.length}
            </div>
          </div>
        </div>
      )}
    </div>
  )

  const renderTemplateMode = () => {
    // Obtener carpetas de la plantilla
    const templateFolders: string[] = formData.etapa in PLANTILLAS_CARPETAS
      ? [...(PLANTILLAS_CARPETAS as any)[formData.etapa]]
      : []

    // Mostrar todas las carpetas personalizadas creadas, sin filtrar por selección
    const customFoldersToShow = customFolders

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {templateFolders.map((folder) => (
            <div
              key={folder}
              className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
            >
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
        {/* <Button variant="ghost" size="sm" onClick={() => onSetShowFolderTemplates(!showFolderTemplates)}>
          {showFolderTemplates ? "Ocultar" : "Mostrar"} Opciones
        </Button> */}
      </div>


      {showFolderTemplates && (
        <div className="space-y-4">
          {useCustomTemplates ? renderCustomTemplateMode() : renderTemplateMode()}
        </div>
      )}
    </div>
  )
} 