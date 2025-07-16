import { Activity, Building, Calendar, Clock,FolderOpen, Mail, Phone, Shield, User } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar"
import { Badge } from "@/shared/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog"
import { Separator } from "@/shared/components/ui/separator"

interface UserDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: any
}

export function UserDetailsDialog({ open, onOpenChange, user }: UserDetailsDialogProps) {
  if (!user) return null

  const getStatusBadge = (status: string) => {
    const colors = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-gray-100 text-gray-800",
      pending: "bg-yellow-100 text-yellow-800",
    }
    return (
      <Badge variant="outline" className={colors[status as keyof typeof colors]}>
        {status === "active" ? "Activo" : status === "inactive" ? "Inactivo" : "Pendiente"}
      </Badge>
    )
  }

  const getRoleBadge = (role: string) => {
    const colors = {
      Admin: "bg-red-100 text-red-800",
      "Project Manager": "bg-blue-100 text-blue-800",
      User: "bg-green-100 text-green-800",
      Viewer: "bg-gray-100 text-gray-800",
    }
    return (
      <Badge variant="outline" className={colors[role as keyof typeof colors]}>
        {role}
      </Badge>
    )
  }

  // Mock activity data
  const recentActivity = [
    { action: "Descargó documento", item: "Contrato_Alpha_v2.pdf", time: "Hace 2 horas" },
    { action: "Subió documento", item: "Propuesta_Beta.docx", time: "Hace 1 día" },
    { action: "Accedió al proyecto", item: "Proyecto Alpha", time: "Hace 2 días" },
    { action: "Editó contrato", item: "Contrato Beta", time: "Hace 3 días" },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalles del Usuario</DialogTitle>
          <DialogDescription>Información completa y actividad del usuario seleccionado.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header con información básica */}
          <div className="flex items-start space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
              <AvatarFallback className="text-lg">
                {user.name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">{user.name}</h2>
                <div className="flex gap-2">
                  {getRoleBadge(user.role)}
                  {getStatusBadge(user.status)}
                </div>
              </div>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <Separator />

          {/* Información de contacto y detalles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Información Personal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{user.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{user.phone || "No especificado"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{user.department || "No especificado"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Último acceso: {user.lastLogin}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Permisos y Acceso
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium">Rol del sistema:</p>
                  <p className="text-sm text-muted-foreground">{user.role}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Estado de la cuenta:</p>
                  <p className="text-sm text-muted-foreground">
                    {user.status === "active"
                      ? "Cuenta activa"
                      : user.status === "inactive"
                        ? "Cuenta inactiva"
                        : "Pendiente de activación"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Fecha de creación:</p>
                  <p className="text-sm text-muted-foreground">15 de enero, 2024</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Proyectos asignados */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FolderOpen className="w-5 h-5" />
                Proyectos Asignados
              </CardTitle>
              <CardDescription>Proyectos a los que el usuario tiene acceso</CardDescription>
            </CardHeader>
            <CardContent>
              {user.projects && user.projects.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {user.projects.map((project: string, index: number) => (
                    <Badge key={index} variant="secondary">
                      {project}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No tiene proyectos asignados</p>
              )}
            </CardContent>
          </Card>

          {/* Actividad reciente */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Actividad Reciente
              </CardTitle>
              <CardDescription>Últimas acciones realizadas por el usuario</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">{activity.item}</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {activity.time}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Documentos Accedidos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">47</div>
                <p className="text-xs text-muted-foreground">Este mes</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Documentos Subidos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">Este mes</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Tiempo en Sistema</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">Meses</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
