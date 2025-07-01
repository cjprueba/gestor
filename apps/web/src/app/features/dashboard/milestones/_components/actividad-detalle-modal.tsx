import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/shared/components/ui/dialog"
import { Button } from "@/shared/components/design-system/button"
import { Badge } from "@/shared/components/ui/badge"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Calendar, Download, Eye, FileText, FolderOpen, User, Clock, MapPin, ArrowRight } from "lucide-react"
import type { ActividadDocumental, TipoActividad } from "@/shared/types/milestones"

interface ActividadDetalleModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  actividad?: ActividadDocumental | null
}

const getTipoActividadBadgeVariant = (tipo: TipoActividad) => {
  switch (tipo) {
    case "creacion_documento":
      return "default"
    case "subida_archivo":
      return "outline"
    case "actualizacion_documento":
      return "secondary"
    case "eliminacion_documento":
      return "destructive"
    default:
      return "default"
  }
}

const getTipoActividadLabel = (tipo: TipoActividad) => {
  switch (tipo) {
    case "creacion_documento":
      return "Creación de Documento"
    case "subida_archivo":
      return "Subida de Archivo"
    case "actualizacion_documento":
      return "Actualización de Documento"
    case "eliminacion_documento":
      return "Eliminación de Documento"
    default:
      return tipo
  }
}

const formatDate = (dateString: string) => {
  return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: es })
}

const formatDateOnly = (dateString: string) => {
  return format(new Date(dateString), "dd/MM/yyyy", { locale: es })
}

export function ActividadDetalleModal({ open, onOpenChange, actividad }: ActividadDetalleModalProps) {
  if (!actividad) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] md:max-w-[800px] max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-xl md:text-2xl font-semibold">
            Detalle de Actividad Documental
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pr-2">
          {/* Información de la Actividad */}
          <div className="space-y-3">
            <h3 className="text-lg md:text-xl font-medium text-primary">Información de la Actividad</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-muted/30 rounded-lg p-4">
              <div className="flex flex-col">
                <span className="font-medium text-sm text-muted-foreground">Nombre de la Actividad</span>
                <span className="text-base">{actividad.nombre}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-sm text-muted-foreground">Tipo de Actividad</span>
                <div className="mt-1">
                  <Badge variant={getTipoActividadBadgeVariant(actividad.tipoActividad)}>
                    {getTipoActividadLabel(actividad.tipoActividad)}
                  </Badge>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-sm text-muted-foreground">Fecha de Actividad</span>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-base">{formatDate(actividad.fechaActividad)}</span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-sm text-muted-foreground">Estado</span>
                <Badge variant={actividad.estado === 'activo' ? 'default' : 'secondary'} className="w-fit mt-1">
                  {actividad.estado === 'activo' ? 'Activo' : 'Archivado'}
                </Badge>
              </div>
              {actividad.descripcion && (
                <div className="flex flex-col md:col-span-2">
                  <span className="font-medium text-sm text-muted-foreground">Descripción</span>
                  <span className="text-base">{actividad.descripcion}</span>
                </div>
              )}
            </div>
          </div>

          {/* Información del Documento */}
          <div className="space-y-3">
            <h3 className="text-lg md:text-xl font-medium text-primary">Información del Documento</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-muted/30 rounded-lg p-4">
              <div className="flex flex-col">
                <span className="font-medium text-sm text-muted-foreground">Nombre del Documento</span>
                <div className="flex items-center gap-2 mt-1">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-base">{actividad.documento.nombre}</span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-sm text-muted-foreground">Tipo de Documento</span>
                <span className="text-base">{actividad.documento.tipo}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-sm text-muted-foreground">Tamaño</span>
                <span className="text-base">{actividad.documento.tamaño}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-sm text-muted-foreground">Extensión</span>
                <span className="text-base uppercase">{actividad.documento.extension}</span>
              </div>
            </div>
          </div>

          {/* Información del Proyecto y Ubicación */}
          <div className="space-y-3">
            <h3 className="text-lg md:text-xl font-medium text-primary">Proyecto y Ubicación</h3>
            <div className="grid grid-cols-1 gap-3 bg-muted/30 rounded-lg p-4">
              <div className="flex flex-col">
                <span className="font-medium text-sm text-muted-foreground">Proyecto</span>
                <div className="flex items-center gap-2 mt-1">
                  <FolderOpen className="h-4 w-4 text-muted-foreground" />
                  <span className="text-base">{actividad.proyecto.nombre}</span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-sm text-muted-foreground">Carpeta</span>
                <div className="flex items-center gap-2 mt-1">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-base">{actividad.carpeta.rutaCarpeta}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Información de Etapa */}
          <div className="space-y-3">
            <h3 className="text-lg md:text-xl font-medium text-primary">Información de Etapa</h3>
            <div className="bg-muted/30 rounded-lg p-4">
              {actividad.etapaAnterior ? (
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 justify-start">
                    <div className="inline-flex items-center px-2 py-1 rounded border border-button-secondary text-primary-500 bg-background text-xs font-medium  min-h-[24px]">
                      <span className="whitespace-normal break-words text-center leading-tight">
                        {actividad.etapaAnterior}
                      </span>
                    </div>
                    <ArrowRight className="w-3 h-3 flex-shrink-0" />
                    <div className="inline-flex items-center px-2 py-1 rounded bg-primary-500 text-primary-foreground text-xs font-medium  min-h-[24px]">
                      <span className="whitespace-normal break-words text-center leading-tight">
                        {actividad.etapaActual}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col">
                  <span className="font-medium text-sm text-muted-foreground">Etapa Actual</span>
                  <span className="text-base font-medium">{actividad.etapaActual}</span>
                </div>
              )}
            </div>
          </div>

          {/* Información del Usuario */}
          <div className="space-y-3">
            <h3 className="text-lg md:text-xl font-medium text-primary">Usuario Responsable</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-muted/30 rounded-lg p-4">
              <div className="flex flex-col">
                <span className="font-medium text-sm text-muted-foreground">Nombre</span>
                <div className="flex items-center gap-2 mt-1">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-base">{actividad.usuario.name}</span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-sm text-muted-foreground">Email</span>
                <span className="text-base">{actividad.usuario.email}</span>
              </div>
            </div>
          </div>

          {/* Fechas Importantes */}
          <div className="space-y-3">
            <h3 className="text-lg md:text-xl font-medium text-primary">Fechas Importantes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-muted/30 rounded-lg p-4">
              <div className="flex flex-col">
                <span className="font-medium text-sm text-muted-foreground">Fecha de Creación</span>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-base">{formatDate(actividad.createdAt)}</span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-sm text-muted-foreground">Última Actualización</span>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-base">{formatDate(actividad.updatedAt)}</span>
                </div>
              </div>
              {actividad.fechaVencimiento && (
                <div className="flex flex-col md:col-span-2">
                  <span className="font-medium text-sm text-muted-foreground">Fecha de Vencimiento</span>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4 text-orange-500" />
                    <span className="text-base text-orange-600 font-medium">
                      {formatDateOnly(actividad.fechaVencimiento)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Metadatos Técnicos */}

        </div>

        <DialogFooter className="flex flex-col-reverse sm:flex-row justify-between gap-2 mt-6">
          <Button variant="secundario" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
            Cerrar
          </Button>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button variant="secundario" className="w-full sm:w-auto">
              <Eye className="h-4 w-4 mr-2" />
              Ver Archivo
            </Button>
            <Button variant="primario" className="w-full sm:w-auto">
              <Download className="h-4 w-4 mr-2" />
              Descargar
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 