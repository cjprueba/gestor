import { Download, Edit, Eye, Search, Share, Shield, Trash2, UserPlus, X } from "lucide-react"
import { useEffect, useState } from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar"
import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/design-system/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"
import { MOCK_USERS } from "@/shared/data"

interface ResourcePermissionsPanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  resource: any
}

// Usar datos mock centralizados
const allUsers = MOCK_USERS

const permissionTypes = [
  { key: "view", label: "Ver", icon: Eye, color: "text-blue-600" },
  { key: "edit", label: "Editar", icon: Edit, color: "text-green-600" },
  { key: "download", label: "Descargar", icon: Download, color: "text-purple-600" },
  { key: "delete", label: "Eliminar", icon: Trash2, color: "text-red-600" },
  { key: "share", label: "Compartir", icon: Share, color: "text-orange-600" },
]

export function ResourcePermissionsPanel({ open, onOpenChange, resource }: ResourcePermissionsPanelProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTab, setSelectedTab] = useState("current")
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [newUserPermissions, setNewUserPermissions] = useState<Record<string, string[]>>({})
  const [currentPermissions, setCurrentPermissions] = useState<Record<string, string[]>>({})

  // Mock current permissions for the resource usando IDs de usuarios centralizados
  useEffect(() => {
    if (resource) {
      // Simulate existing permissions usando IDs correctos de MOCK_USERS
      const mockPermissions: Record<string, string[]> = {
        "1": ["view", "edit", "download"], // Ana García
        "2": ["view", "download"], // Carlos Rodríguez  
        "3": ["view"], // María López
      }
      setCurrentPermissions(mockPermissions)
    }
  }, [resource])

  // const filteredUsers = allUsers.filter(
  //   (user) =>
  //     user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     user.department.toLowerCase().includes(searchTerm.toLowerCase()),
  // )

  const usersWithAccess = allUsers.filter((user) => currentPermissions[user.id])
  const usersWithoutAccess = allUsers.filter((user) => !currentPermissions[user.id])

  const handleUserSelection = (userId: string) => {
    setSelectedUsers((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]))
  }

  const handlePermissionChange = (userId: string, permission: string, granted: boolean) => {
    if (selectedTab === "current") {
      setCurrentPermissions((prev) => {
        const userPerms = prev[userId] || []
        if (granted) {
          return {
            ...prev,
            [userId]: [...userPerms.filter((p) => p !== permission), permission],
          }
        } else {
          return {
            ...prev,
            [userId]: userPerms.filter((p) => p !== permission),
          }
        }
      })
    } else {
      setNewUserPermissions((prev) => {
        const userPerms = prev[userId] || []
        if (granted) {
          return {
            ...prev,
            [userId]: [...userPerms.filter((p) => p !== permission), permission],
          }
        } else {
          return {
            ...prev,
            [userId]: userPerms.filter((p) => p !== permission),
          }
        }
      })
    }
  }

  const handleBulkPermissionAssign = (permission: string) => {
    selectedUsers.forEach((userId) => {
      handlePermissionChange(userId, permission, true)
    })
  }

  const handleRemoveUserAccess = (userId: string) => {
    setCurrentPermissions((prev) => {
      const newPerms = { ...prev }
      delete newPerms[userId]
      return newPerms
    })
  }

  const handleAddSelectedUsers = () => {
    const newPerms = { ...currentPermissions }
    selectedUsers.forEach((userId) => {
      if (newUserPermissions[userId]) {
        newPerms[userId] = newUserPermissions[userId]
      }
    })
    setCurrentPermissions(newPerms)
    setSelectedUsers([])
    setNewUserPermissions({})
    setSelectedTab("current")
  }

  const handleSave = () => {
    console.log("Saving permissions for resource:", resource?.id, currentPermissions)
    onOpenChange(false)
  }

  if (!resource) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Gestionar Permisos - {resource.name}
          </DialogTitle>
          <DialogDescription>
            Configura quién puede acceder a este {resource.type} y qué acciones pueden realizar.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="current">Usuarios con Acceso ({usersWithAccess.length})</TabsTrigger>
              <TabsTrigger value="add">Agregar Usuarios ({usersWithoutAccess.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="current" className="flex-1 overflow-hidden flex flex-col space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar usuarios con acceso..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>

              {/* Current Users Table */}
              <div className="flex-1 overflow-y-auto border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Usuario</TableHead>
                      <TableHead>Departamento</TableHead>
                      <TableHead className="text-center">Ver</TableHead>
                      <TableHead className="text-center">Editar</TableHead>
                      <TableHead className="text-center">Descargar</TableHead>
                      <TableHead className="text-center">Eliminar</TableHead>
                      <TableHead className="text-center">Compartir</TableHead>
                      <TableHead className="text-center">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {usersWithAccess
                      .filter(
                        (user) =>
                          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.department.toLowerCase().includes(searchTerm.toLowerCase()),
                      )
                      .map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                                <AvatarFallback>
                                  {user.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{user.name}</div>
                                <div className="text-sm text-muted-foreground">{user.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{user.department}</Badge>
                          </TableCell>
                          {permissionTypes.map((perm) => (
                            <TableCell key={perm.key} className="text-center">
                              <Checkbox
                                checked={currentPermissions[user.id]?.includes(perm.key) || false}
                                onCheckedChange={(checked) =>
                                  handlePermissionChange(user.id, perm.key, checked as boolean)
                                }
                              />
                            </TableCell>
                          ))}
                          <TableCell className="text-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveUserAccess(user.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="add" className="flex-1 overflow-hidden flex flex-col space-y-4">
              {/* Search and Bulk Actions */}
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar usuarios para agregar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>

                {selectedUsers.length > 0 && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">
                        Acciones Masivas ({selectedUsers.length} usuarios seleccionados)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {permissionTypes.map((perm) => (
                          <Button
                            key={perm.key}
                            variant="secundario"
                            size="sm"
                            onClick={() => handleBulkPermissionAssign(perm.key)}
                          >
                            <perm.icon className={`w-4 h-4 mr-1 ${perm.color}`} />
                            {perm.label}
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Available Users Table */}
              <div className="flex-1 overflow-y-auto border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={selectedUsers.length === usersWithoutAccess.length}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedUsers(usersWithoutAccess.map((u) => u.id))
                            } else {
                              setSelectedUsers([])
                            }
                          }}
                        />
                      </TableHead>
                      <TableHead>Usuario</TableHead>
                      <TableHead>Departamento</TableHead>
                      <TableHead className="text-center">Ver</TableHead>
                      <TableHead className="text-center">Editar</TableHead>
                      <TableHead className="text-center">Descargar</TableHead>
                      <TableHead className="text-center">Eliminar</TableHead>
                      <TableHead className="text-center">Compartir</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {usersWithoutAccess
                      .filter(
                        (user) =>
                          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.department.toLowerCase().includes(searchTerm.toLowerCase()),
                      )
                      .map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedUsers.includes(user.id)}
                              onCheckedChange={() => handleUserSelection(user.id)}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                                <AvatarFallback>
                                  {user.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{user.name}</div>
                                <div className="text-sm text-muted-foreground">{user.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{user.department}</Badge>
                          </TableCell>
                          {permissionTypes.map((perm) => (
                            <TableCell key={perm.key} className="text-center">
                              <Checkbox
                                checked={newUserPermissions[user.id]?.includes(perm.key) || false}
                                onCheckedChange={(checked) =>
                                  handlePermissionChange(user.id, perm.key, checked as boolean)
                                }
                              />
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>

              {selectedUsers.length > 0 && (
                <div className="flex justify-end">
                  <Button onClick={handleAddSelectedUsers}>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Agregar {selectedUsers.length} Usuario{selectedUsers.length !== 1 ? "s" : ""}
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter>
          <Button type="button" variant="secundario" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Guardar Cambios</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
