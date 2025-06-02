

import { Download, Edit, Eye, Search, Share, Trash2, UserPlus } from "lucide-react"
import { useState } from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar"
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
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"

interface QuickPermissionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  resource: any
}

// Mock users data
const allUsers = [
  {
    id: "1",
    name: "Ana García",
    email: "ana.garcia@empresa.com",
    role: "Admin",
    department: "IT",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "2",
    name: "Carlos Rodríguez",
    email: "carlos.rodriguez@empresa.com",
    role: "Project Manager",
    department: "Operaciones",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "3",
    name: "María López",
    email: "maria.lopez@empresa.com",
    role: "User",
    department: "Finanzas",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "4",
    name: "Juan Pérez",
    email: "juan.perez@empresa.com",
    role: "Viewer",
    department: "Legal",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "5",
    name: "Laura Martín",
    email: "laura.martin@empresa.com",
    role: "User",
    department: "RRHH",
    avatar: "/placeholder.svg?height=32&width=32",
  },
]

const permissionPresets = [
  {
    id: "viewer",
    name: "Solo Lectura",
    description: "Puede ver y descargar",
    permissions: ["view", "download"],
    color: "bg-blue-100 text-blue-800",
  },
  {
    id: "editor",
    name: "Editor",
    description: "Puede ver, editar y descargar",
    permissions: ["view", "edit", "download"],
    color: "bg-green-100 text-green-800",
  },
  {
    id: "collaborator",
    name: "Colaborador",
    description: "Puede ver, editar, descargar y compartir",
    permissions: ["view", "edit", "download", "share"],
    color: "bg-purple-100 text-purple-800",
  },
  {
    id: "manager",
    name: "Gestor",
    description: "Acceso completo",
    permissions: ["view", "edit", "download", "share", "delete"],
    color: "bg-orange-100 text-orange-800",
  },
]

export function QuickPermissionDialog({ open, onOpenChange, resource }: QuickPermissionDialogProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [selectedPreset, setSelectedPreset] = useState("")
  const [customPermissions, setCustomPermissions] = useState<string[]>([])

  const filteredUsers = allUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleUserToggle = (userId: string) => {
    setSelectedUsers((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]))
  }

  const handlePresetSelect = (presetId: string) => {
    setSelectedPreset(presetId)
    const preset = permissionPresets.find((p) => p.id === presetId)
    if (preset) {
      setCustomPermissions(preset.permissions)
    }
  }

  const handleCustomPermissionToggle = (permission: string) => {
    setCustomPermissions((prev) =>
      prev.includes(permission) ? prev.filter((p) => p !== permission) : [...prev, permission],
    )
    setSelectedPreset("") // Clear preset when customizing
  }

  const handleAssign = () => {
    const assignment = {
      resource: resource?.id,
      users: selectedUsers,
      permissions: customPermissions,
      preset: selectedPreset,
    }
    console.log("Quick permission assignment:", assignment)
    onOpenChange(false)
    // Reset form
    setSelectedUsers([])
    setSelectedPreset("")
    setCustomPermissions([])
    setSearchTerm("")
  }

  const permissionIcons = {
    view: Eye,
    edit: Edit,
    download: Download,
    share: Share,
    delete: Trash2,
  }

  if (!resource) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Asignación Rápida de Acceso
          </DialogTitle>
          <DialogDescription>
            Asigna acceso rápido a {resource?.name} usando plantillas predefinidas o permisos personalizados.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Step 1: Select Users */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">1. Seleccionar Usuarios</CardTitle>
              <CardDescription>Elige los usuarios que recibirán acceso</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar usuarios..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-colors ${selectedUsers.includes(user.id) ? "bg-blue-50 border-blue-200" : "hover:bg-gray-50"
                      }`}
                    onClick={() => handleUserToggle(user.id)}
                  >
                    <Checkbox checked={selectedUsers.includes(user.id)} onChange={() => { }} />
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback>
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{user.name}</div>
                      <div className="text-xs text-muted-foreground">{user.department}</div>
                    </div>
                  </div>
                ))}
              </div>

              {selectedUsers.length > 0 && (
                <div className="p-3 bg-blue-50 rounded border border-blue-200">
                  <p className="text-sm text-blue-800 font-medium">
                    {selectedUsers.length} usuario{selectedUsers.length !== 1 ? "s" : ""} seleccionado
                    {selectedUsers.length !== 1 ? "s" : ""}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Step 2: Select Permission Level */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">2. Nivel de Acceso</CardTitle>
              <CardDescription>Elige un nivel predefinido o personaliza los permisos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Preset Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {permissionPresets.map((preset) => (
                  <div
                    key={preset.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedPreset === preset.id
                        ? "ring-2 ring-blue-500 bg-blue-50"
                        : "hover:bg-gray-50 hover:border-gray-300"
                      }`}
                    onClick={() => handlePresetSelect(preset.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{preset.name}</h4>
                      <Badge variant="outline" className={preset.color}>
                        {preset.permissions.length} permisos
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{preset.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {preset.permissions.map((perm) => {
                        const Icon = permissionIcons[perm as keyof typeof permissionIcons]
                        return (
                          <div key={perm} className="flex items-center gap-1 text-xs">
                            <Icon className="w-3 h-3" />
                            <span className="capitalize">{perm}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Custom Permissions */}
              <div className="border-t pt-4">
                <Label className="text-sm font-medium">Permisos Personalizados</Label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-2">
                  {Object.entries(permissionIcons).map(([perm, Icon]) => (
                    <div
                      key={perm}
                      className={`flex items-center space-x-2 p-3 border rounded-lg cursor-pointer transition-colors ${customPermissions.includes(perm) ? "bg-green-50 border-green-200" : "hover:bg-gray-50"
                        }`}
                      onClick={() => handleCustomPermissionToggle(perm)}
                    >
                      <Checkbox checked={customPermissions.includes(perm)} onChange={() => { }} />
                      <Icon className="w-4 h-4" />
                      <span className="text-sm capitalize">{perm}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Summary */}
          {selectedUsers.length > 0 && customPermissions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Resumen de Asignación</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium">Recurso:</Label>
                    <p className="text-sm text-muted-foreground">{resource?.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Usuarios ({selectedUsers.length}):</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedUsers.map((userId) => {
                        const user = allUsers.find((u) => u.id === userId)
                        return (
                          <Badge key={userId} variant="secondary">
                            {user?.name}
                          </Badge>
                        )
                      })}
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Permisos ({customPermissions.length}):</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {customPermissions.map((perm) => {
                        const Icon = permissionIcons[perm as keyof typeof permissionIcons]
                        return (
                          <Badge key={perm} variant="outline" className="flex items-center gap-1">
                            <Icon className="w-3 h-3" />
                            <span className="capitalize">{perm}</span>
                          </Badge>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleAssign} disabled={selectedUsers.length === 0 || customPermissions.length === 0}>
            Asignar Acceso ({selectedUsers.length} usuarios)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
