import type React from "react"
import { useEffect, useState } from "react"

import { Button } from "@/shared/components/design-system/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card"
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
import { Separator } from "@/shared/components/ui/separator"
import { Switch } from "@/shared/components/ui/switch"
import { Textarea } from "@/shared/components/ui/textarea"

interface RolePermissionsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  role: any
}

export function RolePermissionsDialog({ open, onOpenChange, role }: RolePermissionsDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  })
  const [permissions, setPermissions] = useState<Record<string, boolean>>({})

  const permissionCategories = [
    {
      name: "Proyectos",
      permissions: [
        { key: "projects.view", label: "Ver proyectos", description: "Puede visualizar la lista de proyectos" },
        { key: "projects.create", label: "Crear proyectos", description: "Puede crear nuevos proyectos" },
        { key: "projects.edit", label: "Editar proyectos", description: "Puede modificar proyectos existentes" },
        { key: "projects.delete", label: "Eliminar proyectos", description: "Puede eliminar proyectos" },
        {
          key: "projects.manage",
          label: "Gestionar proyectos",
          description: "Acceso completo a la gestión de proyectos",
        },
      ],
    },
    {
      name: "Contratos",
      permissions: [
        { key: "contracts.view", label: "Ver contratos", description: "Puede visualizar contratos" },
        { key: "contracts.create", label: "Crear contratos", description: "Puede crear nuevos contratos" },
        { key: "contracts.edit", label: "Editar contratos", description: "Puede modificar contratos" },
        { key: "contracts.delete", label: "Eliminar contratos", description: "Puede eliminar contratos" },
        { key: "contracts.approve", label: "Aprobar contratos", description: "Puede aprobar contratos" },
      ],
    },
    {
      name: "Documentos",
      permissions: [
        { key: "documents.view", label: "Ver documentos", description: "Puede visualizar documentos" },
        { key: "documents.upload", label: "Subir documentos", description: "Puede subir nuevos documentos" },
        { key: "documents.download", label: "Descargar documentos", description: "Puede descargar documentos" },
        { key: "documents.edit", label: "Editar documentos", description: "Puede modificar documentos" },
        { key: "documents.delete", label: "Eliminar documentos", description: "Puede eliminar documentos" },
        {
          key: "documents.share",
          label: "Compartir documentos",
          description: "Puede compartir documentos con otros usuarios",
        },
      ],
    },
    {
      name: "Usuarios",
      permissions: [
        { key: "users.view", label: "Ver usuarios", description: "Puede visualizar la lista de usuarios" },
        { key: "users.create", label: "Crear usuarios", description: "Puede crear nuevos usuarios" },
        { key: "users.edit", label: "Editar usuarios", description: "Puede modificar usuarios existentes" },
        { key: "users.delete", label: "Eliminar usuarios", description: "Puede eliminar usuarios" },
        { key: "users.invite", label: "Invitar usuarios", description: "Puede enviar invitaciones a nuevos usuarios" },
      ],
    },
    {
      name: "Sistema",
      permissions: [
        {
          key: "system.settings",
          label: "Configuración del sistema",
          description: "Acceso a configuraciones generales",
        },
        { key: "system.audit", label: "Logs de auditoría", description: "Puede ver logs y auditorías del sistema" },
        { key: "system.backup", label: "Respaldos", description: "Puede gestionar respaldos del sistema" },
        { key: "system.reports", label: "Reportes", description: "Puede generar y ver reportes del sistema" },
      ],
    },
  ]

  useEffect(() => {
    if (role) {
      setFormData({
        name: role.name || "",
        description: role.description || "",
      })

      // Initialize permissions based on role
      const initialPermissions: Record<string, boolean> = {}
      permissionCategories.forEach((category) => {
        category.permissions.forEach((permission) => {
          initialPermissions[permission.key] = role.permissions?.includes(permission.key) || false
        })
      })
      setPermissions(initialPermissions)
    }
  }, [role])

  const handlePermissionChange = (permissionKey: string, checked: boolean) => {
    setPermissions((prev) => ({
      ...prev,
      [permissionKey]: checked,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const enabledPermissions = Object.entries(permissions)
      .filter(([_, enabled]) => enabled)
      .map(([key, _]) => key)

    console.log("Updating role:", { ...formData, permissions: enabledPermissions })
    onOpenChange(false)
  }

  if (!role) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Configurar Rol y Permisos</DialogTitle>
          <DialogDescription>Define los permisos y configuraciones para el rol seleccionado.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información del Rol */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Información del Rol</h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role-name">Nombre del Rol *</Label>
                <Input
                  id="role-name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role-description">Descripción</Label>
                <Textarea
                  id="role-description"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe las responsabilidades de este rol..."
                  rows={2}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Permisos */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Permisos del Sistema</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {permissionCategories.map((category) => (
                <Card key={category.name}>
                  <CardHeader>
                    <CardTitle className="text-base">{category.name}</CardTitle>
                    <CardDescription>Permisos relacionados con {category.name.toLowerCase()}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {category.permissions.map((permission) => (
                      <div key={permission.key} className="flex items-start justify-between space-x-2">
                        <div className="space-y-0.5 flex-1">
                          <Label htmlFor={permission.key} className="text-sm font-medium">
                            {permission.label}
                          </Label>
                          <p className="text-xs text-muted-foreground">{permission.description}</p>
                        </div>
                        <Switch
                          id={permission.key}
                          checked={permissions[permission.key] || false}
                          onCheckedChange={(checked) => handlePermissionChange(permission.key, checked)}
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="secundario" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Guardar Configuración</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
