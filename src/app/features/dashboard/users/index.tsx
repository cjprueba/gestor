import { Calendar, Edit, Mail, MoreHorizontal, Plus, Search, Shield, UserPlus, Users } from "lucide-react"
import { useState } from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar"
import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/design-system/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import { Input } from "@/shared/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"

import { BulkPermissionsDialog } from "./_components/bulk-permissions-dialog"
import { CreateUserDialog } from "./_components/create-user-dialog"
import { EditUserDialog } from "./_components/edit-user-dialog"
import { InviteUserDialog } from "./_components/invite-user-dialog"
import { RolePermissionsDialog } from "./_components/role-permission-dialog"
import { UserDetailsDialog } from "./_components/user-detail-dialog"

const roles = [
  {
    id: "admin",
    name: "Admin",
    description: "Acceso completo al sistema",
    userCount: 1,
    permissions: ["all"],
  },
  {
    id: "project-manager",
    name: "Project Manager",
    description: "Gestión de proyectos y contratos",
    userCount: 1,
    permissions: ["projects.manage", "contracts.manage", "documents.view"],
  },
  {
    id: "user",
    name: "User",
    description: "Acceso a documentos asignados",
    userCount: 1,
    permissions: ["documents.view", "documents.download"],
  },
  {
    id: "viewer",
    name: "Viewer",
    description: "Solo visualización",
    userCount: 1,
    permissions: ["documents.view"],
  },
]

export default function UsersManagementPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [createUserOpen, setCreateUserOpen] = useState(false)
  const [inviteUserOpen, setInviteUserOpen] = useState(false)
  const [editUserOpen, setEditUserOpen] = useState(false)
  const [rolePermissionsOpen, setRolePermissionsOpen] = useState(false)
  const [userDetailsOpen, setUserDetailsOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [selectedRoleForEdit, setSelectedRoleForEdit] = useState<any>(null)
  const [bulkPermissionsOpen, setBulkPermissionsOpen] = useState(false)

  const [users] = useState([
    {
      id: 1,
      name: "María García",
      email: "maria@empresa.com",
      role: "Administrador",
      status: "Activo",
      lastLogin: "2024-01-15",
      filesCount: 245,
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: 2,
      name: "Carlos López",
      email: "carlos@empresa.com",
      role: "Editor",
      status: "Activo",
      lastLogin: "2024-01-14",
      filesCount: 156,
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: 3,
      name: "Ana Martín",
      email: "ana@empresa.com",
      role: "Visualizador",
      status: "Inactivo",
      lastLogin: "2024-01-10",
      filesCount: 89,
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: 4,
      name: "Roberto Silva",
      email: "roberto@empresa.com",
      role: "Editor",
      status: "Activo",
      lastLogin: "2024-01-15",
      filesCount: 312,
      avatar: "/placeholder.svg?height=32&width=32",
    },
  ])

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "Administrador":
        return "default"
      case "Editor":
        return "secondary"
      case "Visualizador":
        return "outline"
      default:
        return "outline"
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    return status === "Activo" ? "outline" : "destructive"
  }

  return (
    <>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        {/* Header de la página */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-row justify-between items-center mt-6">
            <h1 className="text-3xl font-bold tracking-tight">Gestión de Usuarios</h1>
            <Button variant="primario" onClick={() => setCreateUserOpen(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              Crear Usuario
            </Button>
          </div>

          <p className="text-muted-foreground">Administra usuarios, roles y permisos de la plataforma</p>

        </div>

        {/* Estadísticas rápidas */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuarios Activos</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.filter((u) => u.status === "Activo").length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Administradores</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.filter((u) => u.role === "Administrador").length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Invitaciones Pendientes</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="space-y-4">
          <TabsList className="gap-4 flex justify-center items-center">
            <TabsTrigger value="users" className="flex items-center whitespace-nowrap">Usuarios</TabsTrigger>
            <TabsTrigger value="roles" className="flex items-center whitespace-nowrap">Roles y Permisos</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">

            {/* Users Table */}
            <Card>
              <CardHeader>
                <CardTitle>Lista de Usuarios</CardTitle>
                <CardDescription>Gestiona todos los usuarios de la plataforma</CardDescription>
                <div className="flex items-center space-x-2">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar usuarios..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                  <Button variant="secundario">
                    <Plus className="mr-2 h-4 w-4" />
                    Filtros
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Usuario</TableHead>
                      <TableHead>Rol</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Último Acceso</TableHead>
                      <TableHead>Archivos</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-2">
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
                          <Badge variant={getRoleBadgeVariant(user.role)}>{user.role}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(user.status)}>{user.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="mr-1 h-3 w-3" />
                            {user.lastLogin}
                          </div>
                        </TableCell>
                        <TableCell>{user.filesCount}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="iconoSecundario" className="">
                                <span className="sr-only">Abrir menú</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                              <DropdownMenuItem>Ver perfil</DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedUser(user)
                                  setEditUserOpen(true)
                                }}
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem>Cambiar rol</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">Desactivar usuario</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="roles" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Roles del Sistema</CardTitle>
                <CardDescription>Gestiona los roles y sus permisos asociados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {roles.map((role) => (
                    <Card key={role.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{role.name}</CardTitle>
                            <CardDescription className="text-sm">{role.description}</CardDescription>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedRoleForEdit(role)
                              setRolePermissionsOpen(true)
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Usuarios:</span>
                            <span className="font-medium">{role.userCount}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Permisos:</span>
                            <span className="font-medium">{role.permissions.length}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <BulkPermissionsDialog open={bulkPermissionsOpen} onOpenChange={setBulkPermissionsOpen} />
      <CreateUserDialog open={createUserOpen} onOpenChange={setCreateUserOpen} />
      <InviteUserDialog open={inviteUserOpen} onOpenChange={setInviteUserOpen} />
      <EditUserDialog open={editUserOpen} onOpenChange={setEditUserOpen} user={selectedUser} />
      <RolePermissionsDialog
        open={rolePermissionsOpen}
        onOpenChange={setRolePermissionsOpen}
        role={selectedRoleForEdit}
      />
      <UserDetailsDialog open={userDetailsOpen} onOpenChange={setUserDetailsOpen} user={selectedUser} />
    </>
  )
}
