

import type React from "react"
import { useEffect, useState } from "react"

import { Button } from "@/shared/components/design-system/button"
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
import { Textarea } from "@/shared/components/ui/textarea"

import { ResourcePermissionsDialog } from "./resource-permissions-dialog"

interface EditUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: any
}

export function EditUserDialog({ open, onOpenChange, user }: EditUserDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    status: "",
    department: "",
    phone: "",
    notes: "",
  })
  const [selectedProjects, setSelectedProjects] = useState<string[]>([])
  const [resourcePermissionsOpen, setResourcePermissionsOpen] = useState(false)

  // const projects = ["Proyecto Alpha", "Proyecto Beta", "Proyecto Gamma", "Proyecto Delta"]

  const roles = [
    { value: "admin", label: "Admin" },
    { value: "project-manager", label: "Project Manager" },
    { value: "user", label: "User" },
    { value: "viewer", label: "Viewer" },
  ]

  const statuses = [
    { value: "active", label: "Activo" },
    { value: "inactive", label: "Inactivo" },
    { value: "pending", label: "Pendiente" },
  ]

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        role: user.role?.toLowerCase().replace(" ", "-") || "",
        status: user.status || "",
        department: user.department || "",
        phone: user.phone || "",
        notes: user.notes || "",
      })
      setSelectedProjects(user.projects || [])
    }
  }, [user])

  // const handleProjectToggle = (project: string) => {
  //   setSelectedProjects((prev) => (prev.includes(project) ? prev.filter((p) => p !== project) : [...prev, project]))
  // }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí iría la lógica para actualizar el usuario
    console.log("Updating user:", { ...formData, projects: selectedProjects })
    onOpenChange(false)
  }

  if (!user) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Usuario</DialogTitle>
          <DialogDescription>Modifica la información del usuario seleccionado.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información Personal */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Información Personal</h3>
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nombre Completo *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email *</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Teléfono</Label>
                <Input
                  id="edit-phone"
                  value={formData.phone}
                  onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-department">Departamento</Label>
                <Input
                  id="edit-department"
                  value={formData.department}
                  onChange={(e) => setFormData((prev) => ({ ...prev, department: e.target.value }))}
                />
              </div>
            </div>
          </div>

          {/* Rol y Estado */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Rol y Estado</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-role">Rol *</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, role: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un rol" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Estado *</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Acceso a Recursos</Label>
              <Button
                type="button"
                variant="outline"
                onClick={() => setResourcePermissionsOpen(true)}
                className="w-full"
              >
                Configurar Permisos Específicos
              </Button>
              <p className="text-sm text-muted-foreground">
                Configura acceso granular a proyectos, contratos y documentos específicos
              </p>
            </div>
          </div>

          {/* Notas */}
          <div className="space-y-2">
            <Label htmlFor="edit-notes">Notas</Label>
            <Textarea
              id="edit-notes"
              value={formData.notes}
              onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
              placeholder="Notas adicionales sobre el usuario..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Guardar Cambios</Button>
          </DialogFooter>
        </form>
      </DialogContent>
      <ResourcePermissionsDialog open={resourcePermissionsOpen} onOpenChange={setResourcePermissionsOpen} user={user} />
    </Dialog>
  )
}
