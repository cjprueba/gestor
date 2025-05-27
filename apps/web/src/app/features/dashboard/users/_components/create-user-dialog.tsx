import type React from "react"

import { useState } from "react"
import { Button } from "@/shared/components/ui/button"
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
import { Switch } from "@/shared/components/ui/switch"
import { Badge } from "@/shared/components/ui/badge"
import { X } from "lucide-react"

interface CreateUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateUserDialog({ open, onOpenChange }: CreateUserDialogProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    department: "",
    phone: "",
    notes: "",
    sendWelcomeEmail: true,
    requirePasswordChange: true,
  })
  const [selectedProjects, setSelectedProjects] = useState<string[]>([])

  const projects = ["Proyecto Alpha", "Proyecto Beta", "Proyecto Gamma", "Proyecto Delta"]

  const roles = [
    { value: "admin", label: "Admin" },
    { value: "project-manager", label: "Project Manager" },
    { value: "user", label: "User" },
    { value: "viewer", label: "Viewer" },
  ]

  const handleProjectToggle = (project: string) => {
    setSelectedProjects((prev) => (prev.includes(project) ? prev.filter((p) => p !== project) : [...prev, project]))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí iría la lógica para crear el usuario
    console.log("Creating user:", { ...formData, projects: selectedProjects })
    onOpenChange(false)
    // Reset form
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      role: "",
      department: "",
      phone: "",
      notes: "",
      sendWelcomeEmail: true,
      requirePasswordChange: true,
    })
    setSelectedProjects([])
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Usuario</DialogTitle>
          <DialogDescription>Completa la información para crear un nuevo usuario en el sistema.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información Personal */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Información Personal</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Nombre *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, firstName: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Apellido *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, lastName: e.target.value }))}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Departamento</Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) => setFormData((prev) => ({ ...prev, department: e.target.value }))}
                />
              </div>
            </div>
          </div>

          {/* Rol y Permisos */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Rol y Permisos</h3>
            <div className="space-y-2">
              <Label htmlFor="role">Rol *</Label>
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
              <Label>Proyectos Asignados</Label>
              <div className="border rounded-md p-3 space-y-2">
                {projects.map((project) => (
                  <div key={project} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={project}
                      checked={selectedProjects.includes(project)}
                      onChange={() => handleProjectToggle(project)}
                      className="rounded"
                    />
                    <Label htmlFor={project} className="text-sm font-normal">
                      {project}
                    </Label>
                  </div>
                ))}
              </div>
              {selectedProjects.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {selectedProjects.map((project) => (
                    <Badge key={project} variant="secondary" className="text-xs">
                      {project}
                      <button
                        type="button"
                        onClick={() => handleProjectToggle(project)}
                        className="ml-1 hover:bg-gray-300 rounded-full"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Configuración */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Configuración</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enviar email de bienvenida</Label>
                  <p className="text-sm text-muted-foreground">
                    El usuario recibirá un email con las credenciales de acceso
                  </p>
                </div>
                <Switch
                  checked={formData.sendWelcomeEmail}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, sendWelcomeEmail: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Requerir cambio de contraseña</Label>
                  <p className="text-sm text-muted-foreground">
                    El usuario deberá cambiar la contraseña en el primer acceso
                  </p>
                </div>
                <Switch
                  checked={formData.requirePasswordChange}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, requirePasswordChange: checked }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notas</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                placeholder="Notas adicionales sobre el usuario..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Crear Usuario</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
