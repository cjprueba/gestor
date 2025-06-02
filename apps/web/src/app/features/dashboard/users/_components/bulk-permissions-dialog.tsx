import { File, FileText, FolderOpen, Users } from "lucide-react"
import { useState } from "react"

import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/design-system/button"
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
import { Label } from "@/shared/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"

interface BulkPermissionsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BulkPermissionsDialog({ open, onOpenChange }: BulkPermissionsDialogProps) {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [selectedResource, setSelectedResource] = useState("")
  const [resourceType, setResourceType] = useState<"project" | "contract" | "document" | "">("")
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])
  const [applyToChildren, setApplyToChildren] = useState(true)

  const users = [
    { id: "1", name: "Ana García", role: "Admin" },
    { id: "2", name: "Carlos Rodríguez", role: "Project Manager" },
    { id: "3", name: "María López", role: "User" },
    { id: "4", name: "Juan Pérez", role: "Viewer" },
  ]

  const resources = [
    { id: "proj-1", name: "Proyecto Alpha", type: "project" },
    { id: "proj-2", name: "Proyecto Beta", type: "project" },
    { id: "cont-1", name: "Contrato Principal Alpha", type: "contract", parent: "Proyecto Alpha" },
    { id: "cont-2", name: "Contrato Beta Principal", type: "contract", parent: "Proyecto Beta" },
    { id: "doc-1", name: "Contrato_Alpha_v1.pdf", type: "document", parent: "Contrato Principal Alpha" },
    { id: "doc-2", name: "Contrato_Beta_v2.pdf", type: "document", parent: "Contrato Beta Principal" },
  ]

  const permissions = [
    { key: "view", label: "Ver" },
    { key: "edit", label: "Editar" },
    { key: "download", label: "Descargar" },
    { key: "delete", label: "Eliminar" },
    { key: "share", label: "Compartir" },
  ]

  const handleUserToggle = (userId: string) => {
    setSelectedUsers((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]))
  }

  const handlePermissionToggle = (permission: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permission) ? prev.filter((p) => p !== permission) : [...prev, permission],
    )
  }

  const handleResourceChange = (resourceId: string) => {
    setSelectedResource(resourceId)
    const resource = resources.find((r) => r.id === resourceId)
    if (resource) {
      setResourceType(resource.type as "project" | "contract" | "document")
    }
  }

  const handleSubmit = () => {
    const bulkOperation = {
      users: selectedUsers,
      resource: selectedResource,
      resourceType,
      permissions: selectedPermissions,
      applyToChildren,
    }
    console.log("Bulk permission operation:", bulkOperation)
    onOpenChange(false)
    // Reset form
    setSelectedUsers([])
    setSelectedResource("")
    setResourceType("")
    setSelectedPermissions([])
    setApplyToChildren(true)
  }

  const getResourceIcon = (type: string) => {
    switch (type) {
      case "project":
        return <FolderOpen className="w-4 h-4 text-blue-600" />
      case "contract":
        return <FileText className="w-4 h-4 text-green-600" />
      case "document":
        return <File className="w-4 h-4 text-gray-600" />
      default:
        return null
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Asignación Masiva de Permisos</DialogTitle>
          <DialogDescription>
            Asigna permisos a múltiples usuarios para un recurso específico de manera eficiente.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Step 1: Select Users */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="w-5 h-5" />
                1. Seleccionar Usuarios
              </CardTitle>
              <CardDescription>Elige los usuarios que recibirán los permisos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Checkbox
                      checked={selectedUsers.includes(user.id)}
                      onCheckedChange={() => handleUserToggle(user.id)}
                    />
                    <div className="flex-1">
                      <div className="font-medium">{user.name}</div>
                      <Badge variant="outline" className="text-xs">
                        {user.role}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              {selectedUsers.length > 0 && (
                <div className="mt-3 p-2 bg-blue-50 rounded">
                  <p className="text-sm text-blue-800">{selectedUsers.length} usuario(s) seleccionado(s)</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Step 2: Select Resource */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">2. Seleccionar Recurso</CardTitle>
              <CardDescription>Elige el proyecto, contrato o documento</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="resource">Recurso</Label>
                  <Select value={selectedResource} onValueChange={handleResourceChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un recurso" />
                    </SelectTrigger>
                    <SelectContent>
                      {resources.map((resource) => (
                        <SelectItem key={resource.id} value={resource.id}>
                          <div className="flex items-center gap-2">
                            {getResourceIcon(resource.type)}
                            <span>{resource.name}</span>
                            {resource.parent && (
                              <span className="text-xs text-muted-foreground">({resource.parent})</span>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {resourceType && resourceType !== "document" && (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={applyToChildren}
                      onCheckedChange={(checked) => setApplyToChildren(checked === true)}
                    />
                    <Label className="text-sm">
                      Aplicar permisos a todos los{" "}
                      {resourceType === "project" ? "contratos y documentos" : "documentos"} contenidos
                    </Label>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Step 3: Select Permissions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">3. Seleccionar Permisos</CardTitle>
              <CardDescription>Define qué acciones podrán realizar los usuarios</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {permissions.map((permission) => (
                  <div key={permission.key} className="flex items-center space-x-2 p-3 border rounded-lg">
                    <Checkbox
                      checked={selectedPermissions.includes(permission.key)}
                      onCheckedChange={() => handlePermissionToggle(permission.key)}
                    />
                    <Label className="text-sm">{permission.label}</Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Summary */}
          {selectedUsers.length > 0 && selectedResource && selectedPermissions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Resumen de la Operación</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium">Usuarios afectados:</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedUsers.map((userId) => {
                        const user = users.find((u) => u.id === userId)
                        return (
                          <Badge key={userId} variant="secondary">
                            {user?.name}
                          </Badge>
                        )
                      })}
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Recurso:</Label>
                    <div className="mt-1">
                      <Badge variant="outline">{resources.find((r) => r.id === selectedResource)?.name}</Badge>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Permisos a otorgar:</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedPermissions.map((perm) => (
                        <Badge key={perm} variant="secondary">
                          {permissions.find((p) => p.key === perm)?.label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  {applyToChildren && resourceType !== "document" && (
                    <div className="p-2 bg-yellow-50 rounded border border-yellow-200">
                      <p className="text-sm text-yellow-800">
                        ⚠️ Los permisos se aplicarán también a todos los recursos contenidos
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="secundario" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={selectedUsers.length === 0 || !selectedResource || selectedPermissions.length === 0}
          >
            Aplicar Permisos ({selectedUsers.length} usuarios)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
