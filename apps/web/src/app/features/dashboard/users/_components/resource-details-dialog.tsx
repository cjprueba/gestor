import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar"
import { Badge } from "@/shared/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog"
import { Progress } from "@/shared/components/ui/progress"
import { MOCK_ACTIVIDADES_DOCUMENTALES, MOCK_USERS } from "@/shared/data"
import { Activity, Clock, Download, Edit, Eye, File, FileText, FolderOpen, Share, Users } from "lucide-react"

interface ResourceDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  resource: any
}

export function ResourceDetailsDialog({ open, onOpenChange, resource }: ResourceDetailsDialogProps) {
  if (!resource) return null

  // Usar datos mock centralizados
  const mockUsers = MOCK_USERS.slice(0, 3).map(user => ({
    id: user.id,
    name: user.name,
    avatar: user.avatar,
    permissions: user.permissions.slice(0, 2), // Tomar solo los primeros 2 permisos
  }))

  // Usar actividades documentales centralizadas como actividad del recurso
  const mockActivity = MOCK_ACTIVIDADES_DOCUMENTALES.slice(0, 4).map(actividad => ({
    action: `${actividad.nombre} - ${actividad.tipoActividad}`,
    user: actividad.usuario.name,
    time: new Date(actividad.fechaActividad).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }),
  }))

  const getResourceIcon = () => {
    switch (resource.type) {
      case "project":
        return <FolderOpen className="w-8 h-8 text-blue-600" />
      case "contract":
        return <FileText className="w-8 h-8 text-green-600" />
      case "document":
        return <File className="w-8 h-8 text-gray-600" />
      default:
        return <File className="w-8 h-8 text-gray-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    const colors = {
      active: "bg-green-100 text-green-800",
      planning: "bg-blue-100 text-blue-800",
      approved: "bg-green-100 text-green-800",
      draft: "bg-yellow-100 text-yellow-800",
      negotiation: "bg-orange-100 text-orange-800",
    }
    return (
      <Badge variant="outline" className={colors[status as keyof typeof colors]}>
        {status === "active"
          ? "Activo"
          : status === "planning"
            ? "Planificación"
            : status === "approved"
              ? "Aprobado"
              : status === "draft"
                ? "Borrador"
                : "Negociación"}
      </Badge>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            {getResourceIcon()}
            <div>
              <div>{resource.name}</div>
              <div className="text-sm font-normal text-muted-foreground">
                Detalles del{" "}
                {resource.type === "project" ? "proyecto" : resource.type === "contract" ? "contrato" : "documento"}
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Información General</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Nombre:</label>
                  <p className="text-sm text-muted-foreground">{resource.name}</p>
                </div>
                {resource.description && (
                  <div>
                    <label className="text-sm font-medium">Descripción:</label>
                    <p className="text-sm text-muted-foreground">{resource.description}</p>
                  </div>
                )}
                {resource.status && (
                  <div>
                    <label className="text-sm font-medium">Estado:</label>
                    <div className="mt-1">{getStatusBadge(resource.status)}</div>
                  </div>
                )}
                {resource.owner && (
                  <div>
                    <label className="text-sm font-medium">Propietario:</label>
                    <p className="text-sm text-muted-foreground">{resource.owner}</p>
                  </div>
                )}
                {resource.value && (
                  <div>
                    <label className="text-sm font-medium">Valor:</label>
                    <p className="text-sm text-muted-foreground">{resource.value}</p>
                  </div>
                )}
                {resource.size && (
                  <div>
                    <label className="text-sm font-medium">Tamaño:</label>
                    <p className="text-sm text-muted-foreground">{resource.size}</p>
                  </div>
                )}
                {resource.type && resource.type === "document" && (
                  <div>
                    <label className="text-sm font-medium">Tipo de archivo:</label>
                    <p className="text-sm text-muted-foreground">{resource.type.toUpperCase()}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium">Fecha de creación:</label>
                  <p className="text-sm text-muted-foreground">{resource.created || resource.modified}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Access Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="w-5 h-5" />
                Estadísticas de Acceso
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{resource.userCount || 0}</div>
                  <div className="text-sm text-muted-foreground">Usuarios con acceso</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">47</div>
                  <div className="text-sm text-muted-foreground">Visualizaciones este mes</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">12</div>
                  <div className="text-sm text-muted-foreground">Descargas este mes</div>
                </div>
              </div>

              {/* Usage Progress */}
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Visualizaciones</span>
                    <span>75%</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Descargas</span>
                    <span>45%</span>
                  </div>
                  <Progress value={45} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Compartidos</span>
                    <span>30%</span>
                  </div>
                  <Progress value={30} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Users with Access */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="w-5 h-5" />
                Usuarios con Acceso
              </CardTitle>
              <CardDescription>Lista de usuarios que tienen permisos sobre este recurso</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
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
                        <div className="font-medium text-sm">{user.name}</div>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {user.permissions.map((perm) => {
                        const icons = {
                          view: <Eye className="w-3 h-3" />,
                          edit: <Edit className="w-3 h-3" />,
                          download: <Download className="w-3 h-3" />,
                          share: <Share className="w-3 h-3" />,
                        }
                        return (
                          <Badge key={perm} variant="outline" className="text-xs flex items-center gap-1">
                            {icons[perm as keyof typeof icons]}
                            {perm}
                          </Badge>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Actividad Reciente
              </CardTitle>
              <CardDescription>Últimas acciones realizadas sobre este recurso</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">por {activity.user}</p>
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
        </div>
      </DialogContent>
    </Dialog>
  )
}
