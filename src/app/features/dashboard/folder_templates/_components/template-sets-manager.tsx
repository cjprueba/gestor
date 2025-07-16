import { Button } from "@/shared/components/design-system/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog"
import { Badge } from "@/shared/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Checkbox } from "@/shared/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/components/ui/dialog"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/shared/components/ui/sheet"
import { Switch } from "@/shared/components/ui/switch"
import { Textarea } from "@/shared/components/ui/textarea"
import { ETAPAS } from "@/shared/data/project-data"
import type { FolderTemplate, TemplateSet } from "@/shared/types/template-types"
import { Archive, Copy, Edit, Folder, Plus, Search, Trash2 } from "lucide-react"
import { useMemo, useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/shared/components/ui/tabs"
import TemplateSetStructureEditor from "./template-set-structure-editor"

interface TemplateSetsManagerProps {
  templateSets: TemplateSet[]
  onTemplateSetsChange: (templateSets: TemplateSet[]) => void
  availableTemplates: FolderTemplate[]
}

export default function TemplateSetsManager({
  templateSets,
  onTemplateSetsChange,
  availableTemplates
}: TemplateSetsManagerProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedEtapa, setSelectedEtapa] = useState<string>("all")
  const [showInactive, setShowInactive] = useState(false)
  const [sortBy, setSortBy] = useState<"name" | "created" | "modified" | "etapa" | "size">("modified")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false)
  const [selectedTemplateSet, setSelectedTemplateSet] = useState<TemplateSet | null>(null)
  const [deleteTemplateSetId, setDeleteTemplateSetId] = useState<string | null>(null)

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    etapa: "",
    isActive: true,
    selectedTemplateIds: [] as string[],
    folders: [] as FolderTemplate[],
  })

  const filteredAndSortedTemplateSets = useMemo(() => {
    const filtered = templateSets.filter((templateSet) => {
      const matchesSearch =
        templateSet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        templateSet.description?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesEtapa = selectedEtapa === "all" || templateSet.etapa === selectedEtapa
      const matchesActive = showInactive || templateSet.isActive

      return matchesSearch && matchesEtapa && matchesActive
    })

    // Sort template sets
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "created":
          return b.createdAt.getTime() - a.createdAt.getTime()
        case "modified":
          return a.createdAt.getTime() - b.createdAt.getTime() // Mock modified date
        case "etapa":
          return a.etapa.localeCompare(b.etapa)
        case "size":
          return b.folders.length - a.folders.length
        default:
          return 0
      }
    })

    return filtered
  }, [templateSets, searchTerm, selectedEtapa, showInactive, sortBy])

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      etapa: "",
      isActive: true,
      selectedTemplateIds: [],
      folders: [],
    })
  }

  const handleCreateTemplateSet = () => {
    if (!formData.name.trim() || !formData.etapa || formData.folders.length === 0) {
      return
    }

    const newTemplateSet: TemplateSet = {
      id: `set-${Date.now()}`,
      name: formData.name,
      description: formData.description || undefined,
      etapa: formData.etapa,
      folders: formData.folders,
      createdAt: new Date(),
      createdBy: "Usuario Actual",
      isDefault: false,
      isActive: formData.isActive,
    }

    onTemplateSetsChange([...templateSets, newTemplateSet])
    setIsCreateDialogOpen(false)
    resetForm()
  }

  const handleEditTemplateSet = () => {
    if (!selectedTemplateSet || !formData.name.trim() || !formData.etapa) {
      return
    }

    const updatedTemplateSet: TemplateSet = {
      ...selectedTemplateSet,
      name: formData.name,
      description: formData.description || undefined,
      etapa: formData.etapa,
      folders: formData.folders,
      isActive: formData.isActive,
    }

    onTemplateSetsChange(templateSets.map((ts) => (ts.id === selectedTemplateSet.id ? updatedTemplateSet : ts)))
    setIsEditSheetOpen(false)
    setSelectedTemplateSet(null)
    resetForm()
  }

  const handleDuplicateTemplateSet = (templateSet: TemplateSet) => {
    const duplicatedTemplateSet: TemplateSet = {
      ...templateSet,
      id: `set-${Date.now()}`,
      name: `${templateSet.name} (Copia)`,
      createdAt: new Date(),
      createdBy: "Usuario Actual",
      isDefault: false,
    }

    onTemplateSetsChange([...templateSets, duplicatedTemplateSet])
  }

  const handleDeleteTemplateSet = (templateSetId: string) => {
    onTemplateSetsChange(templateSets.filter((ts) => ts.id !== templateSetId))
    setDeleteTemplateSetId(null)
  }

  const handleToggleActive = (templateSetId: string) => {
    onTemplateSetsChange(
      templateSets.map((ts) =>
        ts.id === templateSetId ? { ...ts, isActive: !ts.isActive } : ts
      )
    )
  }

  const openEditSheet = (templateSet: TemplateSet) => {
    setSelectedTemplateSet(templateSet)
    setFormData({
      name: templateSet.name,
      description: templateSet.description || "",
      etapa: templateSet.etapa,
      isActive: templateSet.isActive,
      selectedTemplateIds: templateSet.folders.map(f => f.id),
      folders: [...templateSet.folders],
    })
    setIsEditSheetOpen(true)
  }

  const getEtapaColor = (etapa: string) => {
    const colors = {
      "Cartera de proyectos": "bg-blue-100 text-blue-800 border-blue-300",
      "Proyectos en Licitación": "bg-yellow-100 text-yellow-800 border-yellow-300",
      "Concesiones en Operación": "bg-green-100 text-green-800 border-green-300",
      "Concesiones en Construcción": "bg-orange-100 text-orange-800 border-orange-300",
      "Concesiones en Operación y Construcción": "bg-purple-100 text-purple-800 border-purple-300",
      "Concesiones Finalizadas": "bg-gray-100 text-gray-800 border-gray-300",
    }
    return colors[etapa as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-300"
  }

  const getTemplatesForEtapa = (etapa: string) => {
    return availableTemplates.filter(template => template.etapas.includes(etapa))
  }

  // Sincronizar cambios entre las pestañas
  const handleTemplateSelection = (templateId: string, checked: boolean) => {
    if (checked) {
      const template = availableTemplates.find(t => t.id === templateId)
      if (template && !formData.folders.find(f => f.id === templateId)) {
        setFormData({
          ...formData,
          selectedTemplateIds: [...formData.selectedTemplateIds, templateId],
          folders: [...formData.folders, template]
        })
      }
    } else {
      setFormData({
        ...formData,
        selectedTemplateIds: formData.selectedTemplateIds.filter(id => id !== templateId),
        folders: formData.folders.filter(f => f.id !== templateId)
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header con estadísticas */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            Plantillas agrupadas por etapa
          </h2>
          <p className="text-muted-foreground">Conjuntos predefinidos de carpetas para aplicar rápidamente a nuevos proyectos</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Nueva plantilla
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Crear nueva plantilla</DialogTitle>
              <DialogDescription>
                Define un conjunto de carpetas que se aplicará automáticamente a proyectos de una etapa específica
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre de la plantilla *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ej: Paquete Completo Licitación"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="etapa">Etapa objetivo *</Label>
                  <Select value={formData.etapa} onValueChange={(value) => {
                    // Al cambiar etapa, limpiar carpetas seleccionadas que no apliquen
                    const templatesForNewEtapa = availableTemplates.filter(t => t.etapas.includes(value))
                    const validFolders = formData.folders.filter(f =>
                      templatesForNewEtapa.some(t => t.id === f.id)
                    )
                    setFormData({
                      ...formData,
                      etapa: value,
                      selectedTemplateIds: validFolders.map(f => f.id),
                      folders: validFolders
                    })
                  }}>
                    <SelectTrigger>
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

                <div className="space-y-2">
                  <Label htmlFor="description">Descripción (Opcional)</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe el propósito y contenido de esta plantilla..."
                    rows={2}
                  />
                </div>
              </div>

              {formData.etapa && (
                <div className="space-y-2">
                  <Label>Carpetas incluidas ({formData.folders.length} seleccionadas)</Label>
                  <div className="border rounded-lg p-4 max-h-60 overflow-y-auto">
                    <div className="grid grid-cols-1 gap-2">
                      {getTemplatesForEtapa(formData.etapa).map((template) => (
                        <div key={template.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`create-template-${template.id}`}
                            checked={formData.selectedTemplateIds.includes(template.id)}
                            onCheckedChange={(checked) => handleTemplateSelection(template.id, !!checked)}
                          />
                          <Label htmlFor={`create-template-${template.id}`} className="text-sm cursor-pointer flex-1">
                            <div className="flex items-center gap-2">
                              <Folder className="w-4 h-4 text-blue-500" />
                              <span>{template.name}</span>
                              {template.isDefault && (
                                <Badge variant="outline" className="text-xs">Default</Badge>
                              )}
                            </div>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formData.folders.length} carpetas seleccionadas
                  </p>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
                <Label htmlFor="active">Plantilla activa</Label>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button variant="secundario" onClick={() => setIsCreateDialogOpen(false)}>
                Cancelar
              </Button>
              <Button
                onClick={handleCreateTemplateSet}
                disabled={!formData.name.trim() || !formData.etapa || formData.folders.length === 0}
              >
                Crear plantilla
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar plantillas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Select value={selectedEtapa} onValueChange={setSelectedEtapa}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filtrar por etapa" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las etapas</SelectItem>
                  {ETAPAS.map((etapa) => (
                    <SelectItem key={etapa} value={etapa}>
                      {etapa}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Ordenar por..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="modified">Más recientes</SelectItem>
                  <SelectItem value="created">Fecha de creación</SelectItem>
                  <SelectItem value="name">Nombre</SelectItem>
                  <SelectItem value="etapa">Etapa</SelectItem>
                  <SelectItem value="size">Más completas</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center space-x-2">
                <Switch id="show-inactive" checked={showInactive} onCheckedChange={setShowInactive} />
                <Label htmlFor="show-inactive" className="text-sm">
                  Mostrar inactivas
                </Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Template Sets Grid */}
      {filteredAndSortedTemplateSets.length === 0 ? (
        <Card className="text-center py-16 border-dashed border-2">
          <CardContent>
            <div className="flex flex-col items-center space-y-4">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">No hay plantillas</h3>
                <p className="text-muted-foreground max-w-md">
                  {searchTerm || selectedEtapa !== "all"
                    ? "No se encontraron plantillas con los filtros aplicados"
                    : "Crea tu primera plantilla agrupada para comenzar"}
                </p>
              </div>
              {!searchTerm && selectedEtapa === "all" && (
                <Button onClick={() => setIsCreateDialogOpen(true)} size="lg">
                  <Plus className="w-4 h-4 mr-2" />
                  Crear primera plantilla
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedTemplateSets.map((templateSet) => (
            <Card
              key={templateSet.id}
              className={`group cursor-pointer transition-all duration-200 hover:shadow-lg ${!templateSet.isActive ? "opacity-60" : ""}`}
              onClick={() => openEditSheet(templateSet)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg font-semibold text-gray-900 flex-1 mr-2">
                    <div className="flex items-start space-x-2">
                      <span className="text-gray-900 break-words leading-tight">{templateSet.name}</span>
                      {templateSet.isDefault && (
                        <Badge variant="secondary" className="text-xs">Default</Badge>
                      )}
                    </div>
                  </CardTitle>
                  <div className="flex items-start opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        openEditSheet(templateSet)
                      }}
                      className="p-1 hover:bg-gray-100 rounded-lg"
                    >
                      <Edit className="w-4 h-4 text-gray-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDuplicateTemplateSet(templateSet)
                      }}
                      className="p-1 hover:bg-gray-100 rounded-lg"
                    >
                      <Copy className="w-4 h-4 text-gray-500" />
                    </Button>
                    {!templateSet.isDefault && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          setDeleteTemplateSetId(templateSet.id)
                        }}
                        className="p-1 hover:bg-gray-100 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Etapa:</span>
                    <Badge className={`text-xs ${getEtapaColor(templateSet.etapa)}`}>
                      {templateSet.etapa}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Carpetas incluidas:</span>
                    <span className="font-medium">{templateSet.folders.length}</span>
                  </div>
                  <div className="space-y-2">
                    <span className="text-xs text-muted-foreground">Vista previa:</span>
                    <div className="text-xs text-gray-600 max-h-16 overflow-y-auto">
                      {templateSet.folders.slice(0, 4).map((folder) => (
                        <div key={folder.id} className="flex items-center gap-1">
                          <Folder className="w-3 h-3 text-gray-400" />
                          <span className="truncate">{folder.name}</span>
                        </div>
                      ))}
                      {templateSet.folders.length > 4 && (
                        <div className="text-xs text-muted-foreground mt-1">
                          +{templateSet.folders.length - 4} carpetas más
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Template Set Sheet */}
      <Sheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen}>
        <SheetContent className="w-full sm:max-w-2xl flex flex-col h-full">
          <SheetHeader className="flex-shrink-0">
            <SheetTitle className="flex items-center space-x-2">
              <span>Editar plantilla</span>
              {selectedTemplateSet && selectedTemplateSet.isDefault && (
                <Badge variant="secondary" className="text-xs">Default</Badge>
              )}
            </SheetTitle>
            <SheetDescription>Modifica la configuración y carpetas incluidas en la plantilla</SheetDescription>
          </SheetHeader>

          {selectedTemplateSet && (
            <>
              <div className="flex-1 overflow-y-auto py-6">
                <Tabs defaultValue="general" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="structure">Estructura</TabsTrigger>
                  </TabsList>

                  <TabsContent value="general" className="space-y-4 p-6">
                    <div className="space-y-2">
                      <Label htmlFor="edit-name">Nombre de la plantilla</Label>
                      <Input
                        id="edit-name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="edit-etapa">Etapa objetivo</Label>
                      <Select
                        value={formData.etapa}
                        onValueChange={(value) => {
                          // Al cambiar etapa, limpiar carpetas seleccionadas que no apliquen
                          const templatesForNewEtapa = availableTemplates.filter(t => t.etapas.includes(value))
                          const validFolders = formData.folders.filter(f =>
                            templatesForNewEtapa.some(t => t.id === f.id)
                          )
                          setFormData({
                            ...formData,
                            etapa: value,
                            selectedTemplateIds: validFolders.map(f => f.id),
                            folders: validFolders
                          })
                        }}
                      >
                        <SelectTrigger>
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

                    <div className="space-y-2">
                      <Label htmlFor="edit-description">Descripción</Label>
                      <Textarea
                        id="edit-description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={2}
                      />
                    </div>

                    {formData.etapa && (
                      <div className="space-y-2">
                        <Label>Carpetas incluidas ({formData.folders.length} seleccionadas)</Label>
                        <div className="border rounded-lg p-4 max-h-60 overflow-y-auto">
                          <div className="grid grid-cols-1 gap-2">
                            {getTemplatesForEtapa(formData.etapa).map((template) => (
                              <div key={template.id} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`edit-template-${template.id}`}
                                  checked={formData.selectedTemplateIds.includes(template.id)}
                                  onCheckedChange={(checked) => handleTemplateSelection(template.id, !!checked)}
                                />
                                <Label htmlFor={`edit-template-${template.id}`} className="text-sm cursor-pointer flex-1">
                                  <div className="flex items-center gap-2">
                                    <Folder className="w-4 h-4 text-blue-500" />
                                    <span>{template.name}</span>
                                    {template.isDefault && (
                                      <Badge variant="outline" className="text-xs">Default</Badge>
                                    )}
                                  </div>
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label htmlFor="edit-active">Estado de la plantilla</Label>
                        <p className="text-sm text-muted-foreground">
                          Las plantillas inactivas no aparecen en la selección de nuevos proyectos
                        </p>
                      </div>
                      <Switch
                        id="edit-active"
                        checked={formData.isActive}
                        onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="structure" className="space-y-4 p-6">
                    <TemplateSetStructureEditor
                      folders={formData.folders}
                      onChange={(folders) => setFormData({
                        ...formData,
                        folders,
                        selectedTemplateIds: folders.map(f => f.id)
                      })}
                      etapa={formData.etapa}
                    />
                  </TabsContent>
                </Tabs>
              </div>

              <div className="flex-shrink-0 flex justify-between p-6 border-t bg-background">
                <div className="flex space-x-2">
                  {selectedTemplateSet && !selectedTemplateSet.isDefault && (
                    <Button variant="secundario" onClick={() => handleToggleActive(selectedTemplateSet.id)}>
                      <Archive className="w-4 h-4 mr-2" />
                      {selectedTemplateSet.isActive ? "Desactivar" : "Activar"}
                    </Button>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button variant="secundario" onClick={() => setIsEditSheetOpen(false)}>
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleEditTemplateSet}
                    disabled={!formData.name.trim() || !formData.etapa || formData.folders.length === 0}
                  >
                    Guardar Cambios
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteTemplateSetId} onOpenChange={() => setDeleteTemplateSetId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar plantilla?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La plantilla será eliminada permanentemente y ya no estará disponible
              para nuevos proyectos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteTemplateSetId && handleDeleteTemplateSet(deleteTemplateSetId)}
              className="bg-red-600 hover:bg-red-700"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
} 