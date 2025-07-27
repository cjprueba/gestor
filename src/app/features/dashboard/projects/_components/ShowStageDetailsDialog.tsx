import { useEtapaAvanzarInfo, useProyectoDetalle } from "@/lib/api/hooks/useProjects"
import { Button } from "@/shared/components/design-system/button"
import { Badge } from "@/shared/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/shared/components/ui/collapsible"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Separator } from "@/shared/components/ui/separator"
import dayjs from "dayjs"
import { ChevronDown, Loader2 } from "lucide-react"
import React from "react"
import type { ProyectoListItem } from "./project/project.types"

// Componente Item para renderizar datos de manera reutilizable
interface ItemProps {
  label: string;
  value: string | number | null | undefined;
  isDate?: boolean;
}

const Item: React.FC<ItemProps> = ({ label, value, isDate = false }) => {
  if (!value) return null;

  const displayValue = isDate
    ? dayjs(value as string).format('DD/MM/YYYY')
    : value.toString();

  return (
    <div className="flex flex-col gap-2">
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      <Input value={displayValue} readOnly className="bg-gray-50" />
    </div>
  );
};

interface ShowStageDetailsDialogProps {
  project: ProyectoListItem
  isOpen: boolean
  onClose: () => void
}

export const ShowStageDetailsDialog = ({
  project,
  isOpen,
  onClose,
}: ShowStageDetailsDialogProps) => {

  if (!project) return null

  // Obtener datos del proyecto desde la API
  const { data: proyectoDetalle, isLoading: isLoadingProyecto } = useProyectoDetalle(project.id)

  // Obtener información completa de etapas (incluye etapa actual + anteriores)
  const { data: etapasInfo, isLoading: isLoadingEtapas } = useEtapaAvanzarInfo(project.id)

  if (isLoadingProyecto || isLoadingEtapas) {
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

  // Obtener todas las etapas desde la información de avanzar
  // Nota: etapas_anteriores incluye TODAS las etapas incluyendo la actual (primera posición)
  const todasLasEtapas = etapasInfo?.data?.etapas_anteriores || []

  // Si no tenemos etapas de avanzar, fallback a las etapas del detalle del proyecto
  const etapasParaMostrar = todasLasEtapas.length > 0 ? todasLasEtapas : proyecto.etapas_registro


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
            {etapasParaMostrar?.map((etapa: any, index: number) => {
              const isEtapaActual = index === 0; // La primera etapa es la actual

              return (
                <div key={etapa.id} className="space-y-4">
                  <Collapsible defaultOpen={isEtapaActual} className="group">
                    <Card>
                      <CardHeader>
                        <CollapsibleTrigger asChild>
                          <Button
                            variant="ghost"
                            className="w-full p-0 h-auto hover:bg-transparent focus:bg-transparent active:bg-transparent"
                          >
                            <div className="flex items-center justify-between w-full">
                              <div className="flex items-center gap-2">
                                <div
                                  className="py-2 px-3 rounded-md flex items-center gap-2 cursor-pointer hover:opacity-90 transition-opacity duration-200"
                                  style={{ backgroundColor: etapa.etapa_tipo?.color || '#6b7280' }}
                                >
                                  <h4 className="text-sm font-medium text-white">{etapa.etapa_tipo?.nombre}</h4>
                                  {isEtapaActual && (
                                    <Badge variant="secondary" className="text-xs bg-white text-gray-800">
                                      Actual
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <ChevronDown className="w-4 h-4 text-gray-600 transition-transform duration-300 ease-out group-data-[state=open]:rotate-180 mr-2" />
                            </div>
                          </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="transition-all duration-500 ease-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-top-4 data-[state=open]:slide-in-from-top-4">
                          <CardTitle className="text-sm ml-2 mt-4">Información de la etapa</CardTitle>
                        </CollapsibleContent>
                      </CardHeader>

                      <CollapsibleContent>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-2">
                            <Item
                              label="Tipo de iniciativa"
                              value={etapa.tipo_iniciativa?.nombre}
                            />
                            <Item
                              label="Tipo de obra"
                              value={etapa.tipo_obra?.nombre}
                            />
                            <Item
                              label="Región"
                              value={etapa.region?.nombre}
                            />
                            <Item
                              label="Provincia"
                              value={etapa.provincia?.nombre}
                            />
                            <Item
                              label="Comuna"
                              value={etapa.comuna?.nombre}
                            />
                            <Item
                              label="Volumen"
                              value={etapa.volumen}
                            />
                            <Item
                              label="Presupuesto oficial"
                              value={etapa.presupuesto_oficial}
                            />
                            <Item
                              label="BIP"
                              value={etapa.bip}
                            />
                            <Item
                              label="Valor referencia"
                              value={etapa.valor_referencia}
                            />
                            <Item
                              label="Fecha llamado a licitación"
                              value={etapa.fecha_llamado_licitacion}
                              isDate={true}
                            />
                            <Item
                              label="Fecha recepción ofertas técnicas"
                              value={etapa.fecha_recepcion_ofertas_tecnicas}
                              isDate={true}
                            />
                            <Item
                              label="Fecha apertura ofertas económicas"
                              value={etapa.fecha_apertura_ofertas_economicas}
                              isDate={true}
                            />
                            <Item
                              label="Fecha inicio concesión"
                              value={etapa.fecha_inicio_concesion}
                              isDate={true}
                            />
                            <Item
                              label="Plazo total concesión"
                              value={etapa.plazo_total_concesion}
                            />
                            <Item
                              label="Decreto adjudicación"
                              value={etapa.decreto_adjudicacion}
                            />
                            <Item
                              label="Sociedad concesionaria"
                              value={etapa.sociedad_concesionaria}
                            />
                            <Item
                              label="Inspector fiscal"
                              value={etapa.inspector_fiscal?.nombre_completo}
                            />
                          </div>
                        </CardContent>
                      </CollapsibleContent>
                    </Card>
                  </Collapsible>
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