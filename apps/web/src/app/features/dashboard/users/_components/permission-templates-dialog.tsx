

import { Copy,Edit, LayoutTemplateIcon as Template, Plus, Trash2 } from "lucide-react"
import { useState } from "react"

import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Checkbox } from "@/shared/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"
import { Textarea } from "@/shared/components/ui/textarea"

interface PermissionTemplatesDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PermissionTemplatesDialog({ open, onOpenChange }: PermissionTemplatesDialogProps) {
  const [selectedTab, setSelectedTab] = useState("templates")
  const [selectedTemplate, setSelectedTemplate] = useState("")
  const [newTemplateName, setNewTemplateName] = useState("")
  const [newTemplateDescription, setNewTemplateDescription] = useState("")
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])

  const templates = [
    {
      id: "template-1",
      name: "Auditor Externo",
      description: "Acceso de solo lectura a documentos específicos para auditorías",
      permissions: ["view", "download"],
      resourceTypes: ["document"],
      usage: 5,
    },
    {
      id: "template-2",
      name: "Colaborador de Proyecto",
      description: "Acceso completo a un proyecto específico y sus recursos",
      permissions: ["view", "edit", "download", "share"],
      resourceTypes: ["project", "contract", "document"],
      usage: 12,
    },
    {
      id: "template-3",
      name: "Revisor de Contratos",
      description: "Puede ver y comentar contratos, pero no editarlos",
      permissions: ["view", "download"],
      resourceTypes: ["contract", "document"],
      usage: 8,
    },
    {
      id: "template-4",
      name: "Gestor de Documentos",
      description: "Puede gestionar documentos dentro de contratos asignados",
      permissions: ["view", "edit", "download", "delete", "share"],
      resourceTypes: ["document"],
      usage: 3,
    },
  ]

  const permissions = [
    { key: "view", label: "Ver", description: "Puede visualizar el recurso" },
    { key: "edit", label: "Editar", description: "Puede modificar el recurso" },
    { key: "download", label: "Descargar", description: "Puede descargar archivos" },
    { key: "delete", label: "Eliminar", description: "Puede eliminar el recurso" },
    { key: "share", label: "Compartir", description: "Puede compartir con otros usuarios" },
    { key: "approve", label: "Aprobar", description: "Puede aprobar cambios o documentos" },
  ]

  const resourceTypes = [
    { key: "project", label: "Proyectos" },
    { key: "contract", label: "Contratos" },
    { key: "document", label: "Documentos" },
  ]

  const handlePermissionToggle = (permission: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permission) ? prev.filter((p) => p !== permission) : [...prev, permission],
    )
  }

  const handleCreateTemplate = () => {
    const newTemplate = {
      name: newTemplateName,
      description: newTemplateDescription,
      permissions: selectedPermissions,
    }
    console.log("Creating template:", newTemplate)
    // Reset form
    setNewTemplateName("")
    setNewTemplateDescription("")
    setSelectedPermissions([])
  }

  const handleApplyTemplate = () => {
    console.log("Applying template:", selectedTemplate)
    onOpenChange(false)
  }

  const getPermissionBadge = (permission: string) => {
    const colors = {
      view: "bg-blue-100 text-blue-800",
      edit: "bg-green-100 text-green-800",
      download: "bg-purple-100 text-purple-800",
      delete: "bg-red-100 text-red-800",
      share: "bg-orange-100 text-orange-800",
      approve: "bg-yellow-100 text-yellow-800",
    }
    return (
      <Badge variant="outline" className={colors[permission as keyof typeof colors]}>
        {permissions.find((p) => p.key === permission)?.label}
      </Badge>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Template className="w-5 h-5" />
            Plantillas de Permisos
          </DialogTitle>
          <DialogDescription>
            Crea y gestiona plantillas de permisos reutilizables para asignaciones rápidas.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="templates">Plantillas Existentes</TabsTrigger>
            <TabsTrigger value="create">Crear Plantilla</TabsTrigger>
          </TabsList>

          <TabsContent value="templates" className="space-y-4">
            {/* Template Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Seleccionar Plantilla</CardTitle>
                <CardDescription>Elige una plantilla para aplicar a usuarios seleccionados</CardDescription>
              </CardHeader>
              <CardContent>
                <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una plantilla" />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name} - {template.description}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Templates List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {templates.map((template) => (
                <Card
                  key={template.id}
                  className={`cursor-pointer transition-all ${
                    selectedTemplate === template.id ? "ring-2 ring-blue-500" : ""
                  }`}
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-base">{template.name}</CardTitle>
                        <CardDescription className="text-sm">{template.description}</CardDescription>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-xs font-medium">Permisos incluidos:</Label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {template.permissions.map((permission) => getPermissionBadge(permission))}
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs font-medium">Tipos de recurso:</Label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {template.resourceTypes.map((type) => (
                            <Badge key={type} variant="secondary" className="text-xs">
                              {resourceTypes.find((rt) => rt.key === type)?.label}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">Usado en {template.usage} asignaciones</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="create" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Nueva Plantilla</CardTitle>
                <CardDescription>Define una nueva plantilla de permisos reutilizable</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="template-name">Nombre de la Plantilla *</Label>
                    <Input
                      id="template-name"
                      value={newTemplateName}
                      onChange={(e) => setNewTemplateName(e.target.value)}
                      placeholder="Ej: Revisor de Contratos"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="template-description">Descripción</Label>
                    <Textarea
                      id="template-description"
                      value={newTemplateDescription}
                      onChange={(e) => setNewTemplateDescription(e.target.value)}
                      placeholder="Describe el propósito y alcance de esta plantilla..."
                      rows={3}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Permisos Incluidos</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {permissions.map((permission) => (
                      <div key={permission.key} className="flex items-start space-x-3 p-3 border rounded-lg">
                        <Checkbox
                          checked={selectedPermissions.includes(permission.key)}
                          onCheckedChange={() => handlePermissionToggle(permission.key)}
                        />
                        <div className="flex-1">
                          <Label className="text-sm font-medium">{permission.label}</Label>
                          <p className="text-xs text-muted-foreground">{permission.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedPermissions.length > 0 && (
                  <div className="p-3 bg-blue-50 rounded border border-blue-200">
                    <Label className="text-sm font-medium">Vista previa de permisos:</Label>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {selectedPermissions.map((permission) => getPermissionBadge(permission))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          {selectedTab === "templates" ? (
            <Button onClick={handleApplyTemplate} disabled={!selectedTemplate}>
              Aplicar Plantilla
            </Button>
          ) : (
            <Button onClick={handleCreateTemplate} disabled={!newTemplateName || selectedPermissions.length === 0}>
              <Plus className="w-4 h-4 mr-2" />
              Crear Plantilla
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
