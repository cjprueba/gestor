import { useProyectoDetalle } from "@/lib/api/hooks/useProjects"
import { Badge } from "@/shared/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog"
import { Label } from "@/shared/components/ui/label"
import { Separator } from "@/shared/components/ui/separator"
import { Input } from "@/shared/components/ui/input"
import { Loader2 } from "lucide-react"
import React from "react"
import type { Project } from "./project/project.types"

interface ShowStageDetailsDialogProps {
  project: Project | null
  isOpen: boolean
  onClose: () => void
}

export const ShowStageDetailsDialog: React.FC<ShowStageDetailsDialogProps> = ({
  project,
  isOpen,
  onClose,
}) => {

  if (!project) return null

  // Obtener datos del proyecto desde la API
  const { data: proyectoDetalle, isLoading: isLoadingProyecto } = useProyectoDetalle(parseInt(project.id))

  if (isLoadingProyecto) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            <span className="ml-2 text-muted-foreground">Cargando detalles del proyecto...</span>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  const proyecto = proyectoDetalle?.data
  if (!proyecto) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
          <div className="text-center py-12">
            <p className="text-muted-foreground">No se pudieron cargar los detalles del proyecto</p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{proyecto.nombre}</DialogTitle>
          <div className="flex items-center gap-2">
            {proyecto.etapas_registro?.map((etapa) => (
              <Badge
                key={etapa.id}
                variant="secondary"
                style={{
                  backgroundColor: '#e5e7eb',
                  color: '#374151'
                }}
              >
                {etapa.etapa_tipo.nombre}
              </Badge>
            ))}
            <span className="text-sm text-muted-foreground">
              Creado el {new Date(proyecto.created_at).toLocaleDateString()}
            </span>
          </div>
          <DialogDescription>
            Detalles completos del proyecto
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2 space-y-6">
          {/* Información de la organización */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Información organizacional</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col gap-2">
                  <Label className="text-xs font-medium text-muted-foreground">División</Label>
                  <Input
                    value={proyecto.division?.nombre || 'No especificado'}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="text-xs font-medium text-muted-foreground">Departamento</Label>
                  <Input
                    value={proyecto.departamento?.nombre || 'No especificado'}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="text-xs font-medium text-muted-foreground">Unidad</Label>
                  <Input
                    value={proyecto.unidad?.nombre || 'No especificado'}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Campos por etapa */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Información por etapa</h3>
            {proyecto.etapas_registro?.map((etapa, index) => {
              return (
                <div key={etapa.id} className="space-y-4">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-2 bg-primary-500 rounded-md p-2 w-fit">
                        <h4 className="text-sm font-medium text-white">{etapa.etapa_tipo.nombre}</h4>
                        {etapa.activa && (
                          <Badge variant="secondary" className="text-xs bg-white text-primary-500 font-bold">
                            Activa
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-sm ml-2 mt-1">Información de la etapa</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-2">
                        {etapa.tipo_iniciativa && (
                          <div className="flex flex-col gap-2">
                            <Label className="text-xs font-medium text-muted-foreground">Tipo de iniciativa</Label>
                            <Input
                              value={etapa.tipo_iniciativa.nombre}
                              readOnly
                              className="bg-gray-50"
                            />
                          </div>
                        )}
                        {etapa.tipo_obra && (
                          <div className="flex flex-col gap-2">
                            <Label className="text-xs font-medium text-muted-foreground">Tipo de obra</Label>
                            <Input
                              value={etapa.tipo_obra.nombre}
                              readOnly
                              className="bg-gray-50"
                            />
                          </div>
                        )}
                        {etapa.region && (
                          <div className="flex flex-col gap-2">
                            <Label className="text-xs font-medium text-muted-foreground">Región</Label>
                            <Input
                              value={etapa.region.nombre}
                              readOnly
                              className="bg-gray-50"
                            />
                          </div>
                        )}
                        {etapa.provincia && (
                          <div className="flex flex-col gap-2">
                            <Label className="text-xs font-medium text-muted-foreground">Provincia</Label>
                            <Input
                              value={etapa.provincia.nombre}
                              readOnly
                              className="bg-gray-50"
                            />
                          </div>
                        )}
                        {etapa.comuna && (
                          <div className="flex flex-col gap-2">
                            <Label className="text-xs font-medium text-muted-foreground">Comuna</Label>
                            <Input
                              value={etapa.comuna.nombre}
                              readOnly
                              className="bg-gray-50"
                            />
                          </div>
                        )}
                        {etapa.volumen && (
                          <div className="flex flex-col gap-2">
                            <Label className="text-xs font-medium text-muted-foreground">Volumen</Label>
                            <Input
                              value={etapa.volumen}
                              readOnly
                              className="bg-gray-50"
                            />
                          </div>
                        )}
                        {etapa.presupuesto_oficial && (
                          <div className="flex flex-col gap-2">
                            <Label className="text-xs font-medium text-muted-foreground">Presupuesto oficial</Label>
                            <Input
                              value={etapa.presupuesto_oficial}
                              readOnly
                              className="bg-gray-50"
                            />
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {index < proyecto.etapas_registro.length - 1 && <Separator />}
                </div>
              )
            })}
          </div>

          {/* Información del creador */}
          <Separator />
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Información del Sistema</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label className="text-xs font-medium text-muted-foreground">Creado por</Label>
                  <Input
                    value={proyecto.creador?.nombre_completo || 'No especificado'}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="text-xs font-medium text-muted-foreground">Fecha de creación</Label>
                  <Input
                    value={new Date(proyecto.created_at).toLocaleDateString('es-CL', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
} 