import { useMemo, useState } from "react"

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"
import { Textarea } from "@/shared/components/ui/textarea"
import { ETAPAS } from "@/shared/data/project-data"
import type { FolderTemplate, TemplateUsageStats } from "@/shared/types/template-types"
import { Archive, Copy, Edit, Folder, Plus, Search, Tag } from "lucide-react"
import TemplateTreeBuilder from "./template-tree-builder"

interface TemplateManagerProps {
  templates: FolderTemplate[]
  onTemplatesChange: (templates: FolderTemplate[]) => void
  usageStats?: TemplateUsageStats[]
}

export default function TemplateManager({ templates, onTemplatesChange, usageStats = [] }: TemplateManagerProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedEtapas, setSelectedEtapas] = useState<string[]>([])
  const [showInactive, setShowInactive] = useState(false)
  const [sortBy, setSortBy] = useState<"name" | "created" | "modified" | "usage" | "etapas">("modified")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<FolderTemplate | null>(null)
  const [deleteTemplateId, setDeleteTemplateId] = useState<string | null>(null)
  const [isEditingStage, setIsEditingStage] = useState(false)


  // Form states
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    etapas: [] as string[],
    isActive: true,
    tags: [] as string[],
    subfolders: [] as any[],
  })

  const filteredAndSortedTemplates = useMemo(() => {
    const filtered = templates.filter((template) => {
      const matchesSearch =
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesEtapas =
        selectedEtapas.length === 0 || template.etapas.some((etapa) => selectedEtapas.includes(etapa))
      const matchesActive = showInactive || template.isActive

      return matchesSearch && matchesEtapas && matchesActive
    })

    // Sort templates
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "created":
          return b.createdAt.getTime() - a.createdAt.getTime()
        case "modified":
          return b.lastModifiedAt.getTime() - a.lastModifiedAt.getTime()
        case "usage":
          const aUsage = usageStats.find((s) => s.templateId === a.id)?.usageCount || 0
          const bUsage = usageStats.find((s) => s.templateId === b.id)?.usageCount || 0
          return bUsage - aUsage
        case "etapas":
          return b.etapas.length - a.etapas.length // Más etapas primero
        default:
          return 0
      }
    })

    return filtered
  }, [templates, searchTerm, selectedEtapas, showInactive, sortBy, usageStats])

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      etapas: [],
      isActive: true,
      tags: [],
      subfolders: [],
    })
  }

  const handleCreateTemplate = () => {
    if (!formData.name.trim() || formData.etapas.length === 0 || formData.subfolders.length === 0) {
      return
    }

    const newTemplate: FolderTemplate = {
      id: `template-${Date.now()}`,
      name: formData.name,
      description: formData.description || undefined,
      minDocuments: formData.subfolders.reduce((sum, folder) => sum + folder.minDocuments, 0),
      subfolders: formData.subfolders,
      etapas: formData.etapas,
      createdAt: new Date(),
      createdBy: "Usuario Actual",
      lastModifiedAt: new Date(),
      lastModifiedBy: "Usuario Actual",
      isDefault: false,
      isActive: formData.isActive,
      version: 1,
      tags: formData.tags,
    }

    onTemplatesChange([...templates, newTemplate])
    setIsCreateDialogOpen(false)
    resetForm()
  }

  const handleEditTemplate = () => {
    if (!selectedTemplate || !formData.name.trim() || formData.etapas.length === 0) {
      return
    }

    const updatedTemplate: FolderTemplate = {
      ...selectedTemplate,
      name: formData.name,
      description: formData.description || undefined,
      minDocuments: formData.subfolders.reduce((sum, folder) => sum + folder.minDocuments, 0),
      subfolders: formData.subfolders,
      etapas: formData.etapas,
      lastModifiedAt: new Date(),
      lastModifiedBy: "Usuario Actual",
      isActive: formData.isActive,
      version: selectedTemplate.version + 1,
      tags: formData.tags,
    }

    onTemplatesChange(templates.map((t) => (t.id === selectedTemplate.id ? updatedTemplate : t)))
    setIsEditSheetOpen(false)
    setSelectedTemplate(null)
    resetForm()
  }

  const handleDuplicateTemplate = (template: FolderTemplate) => {
    const duplicatedTemplate: FolderTemplate = {
      ...template,
      id: `template-${Date.now()}`,
      name: `${template.name} (Copia)`,
      createdAt: new Date(),
      createdBy: "Usuario Actual",
      lastModifiedAt: new Date(),
      lastModifiedBy: "Usuario Actual",
      isDefault: false,
      version: 1,
    }

    onTemplatesChange([...templates, duplicatedTemplate])
  }

  const handleDeleteTemplate = (templateId: string) => {
    onTemplatesChange(templates.filter((t) => t.id !== templateId))
    setDeleteTemplateId(null)
  }

  const handleToggleActive = (templateId: string) => {
    onTemplatesChange(
      templates.map((t) =>
        t.id === templateId
          ? { ...t, isActive: !t.isActive, lastModifiedAt: new Date(), lastModifiedBy: "Usuario Actual" }
          : t,
      ),
    )
  }

  const openEditSheet = (template: FolderTemplate) => {
    setSelectedTemplate(template)
    setFormData({
      name: template.name,
      description: template.description || "",
      etapas: template.etapas,
      isActive: template.isActive,
      tags: template.tags || [],
      subfolders: template.subfolders,
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


  return (
    <div className="space-y-6">
      {/* Header con estadísticas */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Plantillas de carpetas</h1>
          <p className="text-muted-foreground">Gestiona las plantillas para organizar tus proyectos por etapas</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Nueva plantilla
            </Button>
          </DialogTrigger>

          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Crear nueva plantilla</DialogTitle>
              <DialogDescription>
                Define una nueva plantilla de carpetas que podrá ser utilizada en diferentes etapas de proyecto
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre de la plantilla *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ej: Documentación Legal Completa"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Etapas aplicables *</Label>
                  <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
                    {ETAPAS.map((etapa) => (
                      <div key={etapa} className="flex items-center space-x-2">
                        <Checkbox
                          id={`create-${etapa}`}
                          checked={formData.etapas.includes(etapa)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFormData({ ...formData, etapas: [...formData.etapas, etapa] })
                            } else {
                              setFormData({ ...formData, etapas: formData.etapas.filter((e) => e !== etapa) })
                            }
                          }}
                        />
                        <Label htmlFor={`create-${etapa}`} className="text-sm cursor-pointer">
                          {etapa}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción (Opcional)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe el propósito y contenido de esta plantilla..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Estructura de carpetas *</Label>
                <TemplateTreeBuilder
                  folders={formData.subfolders}
                  onChange={(folders) => setFormData({ ...formData, subfolders: folders })}
                />
              </div>

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
                onClick={handleCreateTemplate}
                disabled={!formData.name.trim() || formData.etapas.length === 0 || formData.subfolders.length === 0}
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
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Ordenar por..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="modified">Última modificación</SelectItem>
                  <SelectItem value="created">Fecha de creación</SelectItem>
                  <SelectItem value="name">Nombre</SelectItem>
                  <SelectItem value="usage">Más utilizadas</SelectItem>
                  <SelectItem value="etapas">Más versátiles</SelectItem>
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

          {/* Etapa filters */}
          <div className="mt-4 space-y-2">
            <Label className="text-sm font-medium">Filtrar por etapas:</Label>
            <div className="flex flex-wrap gap-2">
              {ETAPAS.map((etapa) => (
                <div key={etapa} className="flex items-center space-x-2">
                  <Checkbox
                    id={etapa}
                    checked={selectedEtapas.includes(etapa)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedEtapas([...selectedEtapas, etapa])
                      } else {
                        setSelectedEtapas(selectedEtapas.filter((e) => e !== etapa))
                      }
                    }}
                  />
                  <Label htmlFor={etapa} className="text-sm cursor-pointer">
                    <Badge variant="outline" className={`text-xs ${getEtapaColor(etapa)}`}>
                      {etapa}
                    </Badge>
                  </Label>
                </div>
              ))}
              {selectedEtapas.length > 0 && (
                <Button variant="ghost" size="sm" onClick={() => setSelectedEtapas([])} className="h-6 px-2 text-xs">
                  Limpiar
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Templates Grid */}
      {filteredAndSortedTemplates.length === 0 ? (
        <Card className="text-center py-16 border-dashed border-2">
          <CardContent>
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <Folder className="w-8 h-8 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">No hay plantillas</h3>
                <p className="text-muted-foreground max-w-md">
                  {searchTerm || selectedEtapas.length > 0
                    ? "No se encontraron plantillas con los filtros aplicados"
                    : "Crea tu primera plantilla para comenzar a organizar tus proyectos"}
                </p>
              </div>
              {!searchTerm && selectedEtapas.length === 0 && (
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
          {filteredAndSortedTemplates.map((template) => {
            return (
              <Card
                key={template.id}
                className={`group cursor-pointer transition-all duration-200 ${!template.isActive ? "opacity-60" : ""
                  }`}
                onClick={() => openEditSheet(template)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg font-semibold text-gray-900 flex-1 mr-2">
                      <div className="flex items-start space-x-2">
                        <Folder className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-900 break-words leading-tight">{template.name}</span>
                      </div>
                    </CardTitle>
                    <div className="flex items-start  opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          openEditSheet(template)
                        }}
                        className="p-0 hover:bg-gray-100 rounded-lg"
                      >
                        <Edit className="w-4 h-4 text-gray-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDuplicateTemplate(template)
                        }}
                        className="p-0 hover:bg-gray-100 rounded-lg"
                      >
                        <Copy className="w-4 h-4 text-gray-500" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mt-[-10px]">
                    <div className="flex items-center space-x-1">
                      <Tag className="w-3 h-3 text-gray-500" />
                      <span className="text-xs font-medium text-gray-500">Etapas aplicables:</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {template.etapas.slice(0, 3).map((etapa) => (
                        <Badge key={etapa} className={`text-xs ${getEtapaColor(etapa)}`}>
                          {etapa}
                        </Badge>
                      ))}
                      {template.etapas.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{template.etapas.length - 3} más
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Edit Template Sheet */}
      <Sheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen}>
        <SheetContent className="w-full sm:max-w-2xl flex flex-col h-full">
          <SheetHeader className="flex-shrink-0">
            <SheetTitle className="flex items-center space-x-2">
              <span>Editar plantilla</span>
              {selectedTemplate && selectedTemplate.etapas.length > 1 && (
                <Badge variant="secondary" className="text-xs">
                  <Tag className="w-3 h-3 mr-1" />
                  Multi-etapa
                </Badge>
              )}
            </SheetTitle>
            <SheetDescription>Modifica la configuración y estructura de la plantilla</SheetDescription>
          </SheetHeader>

          {selectedTemplate && (
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
                      <div className="flex items-center space-x-2">
                        {isEditingStage ? (
                          <Input
                            id="edit-name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="max-w-3xs"
                          />
                        ) : (
                          <span>{formData.name}</span>
                        )}
                        <Button variant="ghost" size="sm" onClick={() => setIsEditingStage(true)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-6 mt-8">
                      <Label>Etapas aplicables ({formData.etapas.length} seleccionadas)</Label>
                      <div className="grid grid-cols-1 gap-3 overflow-y-auto">
                        {ETAPAS.map((etapa) => (
                          <div key={etapa} className="flex items-center space-x-2">
                            <Checkbox
                              id={`edit-${etapa}`}
                              checked={formData.etapas.includes(etapa)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setFormData({ ...formData, etapas: [...formData.etapas, etapa] })
                                } else {
                                  setFormData({ ...formData, etapas: formData.etapas.filter((e) => e !== etapa) })
                                }
                              }}
                            />
                            <Label htmlFor={`edit-${etapa}`} className="text-sm cursor-pointer flex-1">
                              <Badge variant="outline" className={`text-xs ${getEtapaColor(etapa)}`}>
                                {etapa}
                              </Badge>
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-10">
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

                  <TabsContent value="structure" className="space-y-4">
                    <TemplateTreeBuilder
                      folders={formData.subfolders}
                      onChange={(folders) => setFormData({ ...formData, subfolders: folders })}
                    />
                  </TabsContent>
                </Tabs>
              </div>

              <div className="flex-shrink-0 flex justify-between p-6 border-t bg-background">
                <div className="flex space-x-2">
                  {selectedTemplate && !selectedTemplate.isDefault && (
                    <Button variant="secundario" onClick={() => handleToggleActive(selectedTemplate.id)}>
                      <Archive className="w-4 h-4 mr-2" />
                      {selectedTemplate.isActive ? "Desactivar" : "Activar"}
                    </Button>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button variant="secundario" onClick={() => setIsEditSheetOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleEditTemplate} disabled={!formData.name.trim() || formData.etapas.length === 0}>
                    Guardar Cambios
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteTemplateId} onOpenChange={() => setDeleteTemplateId(null)}>
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
              onClick={() => deleteTemplateId && handleDeleteTemplate(deleteTemplateId)}
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
