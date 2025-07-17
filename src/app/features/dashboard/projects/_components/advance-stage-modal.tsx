import { useCambiarEtapa, useComunas, useEtapaAvanzarInfo, useProvincias, useRegiones, useTiposIniciativa, useTiposObra } from "@/lib/api/hooks/useProjects"
import { Button } from "@/shared/components/design-system/button"
import { Badge } from "@/shared/components/ui/badge"
import { Card, CardContent } from "@/shared/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/shared/components/ui/collapsible"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Separator } from "@/shared/components/ui/separator"
import { mapStageTypeToFormFields } from "@/shared/utils/stage-form-mapper"
import dayjs from "dayjs"
import { ChevronRight } from "lucide-react"
import { useForm } from "react-hook-form"
import type { Project } from "./types"
import { useEffect } from "react"

interface AdvanceStageModalProps {
  project: Project | null
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

interface FormData {
  tipo_iniciativa_id?: number;
  tipo_obra_id?: number;
  region_id?: number;
  provincia_id?: number;
  comuna_id?: number;
  volumen?: string;
  presupuesto_oficial?: string;
  valor_referencia?: string;
  bip?: string;
  fecha_llamado_licitacion?: string;
  fecha_recepcion_ofertas_tecnicas?: string;
  fecha_apertura_ofertas_economicas?: string;
  decreto_adjudicacion?: string;
  sociedad_concesionaria?: string;
  fecha_inicio_concesion?: string;
  plazo_total_concesion?: string;
  inspector_fiscal_id?: number;
}

export const AdvanceStageModal: React.FC<AdvanceStageModalProps> = ({
  project,
  isOpen,
  onClose,
  onSuccess,
}) => {
  // React Hook Form
  const { register, handleSubmit, watch, setValue, reset } = useForm<FormData>()
  const watchedValues = watch()

  // Resetear el formulario cuando se abre el modal
  useEffect(() => {
    reset()
  }, [isOpen, reset])

  // Obtener detalles de la siguiente etapa y etapa actual desde el endpoint correcto
  const { data: etapaAvanzarInfo, isLoading, error } = useEtapaAvanzarInfo(project ? parseInt(project.id) : undefined)

  // Obtener campos de la siguiente etapa usando el util
  const siguienteEtapa = etapaAvanzarInfo?.data?.siguiente_etapa
  const mappedFields = siguienteEtapa ? mapStageTypeToFormFields(siguienteEtapa) : { fields: [], hasFields: false, fieldCount: 0 }

  // Hooks de datos
  const { data: tiposIniciativa } = useTiposIniciativa()
  const { data: tiposObra } = useTiposObra(siguienteEtapa?.id)
  const { data: regionesData } = useRegiones()
  const { data: provinciasData } = useProvincias(watchedValues.region_id)
  const { data: comunasData } = useComunas(watchedValues.region_id, watchedValues.provincia_id)
  // const { data: inspectoresFiscales } = useInspectoresFiscales() // Comentado temporalmente


  // Obtener detalles de la siguiente etapa y etapa actual desde el endpoint correcto
  const cambiarEtapaMutation = useCambiarEtapa()

  const onSubmit = async (data: FormData) => {
    if (!project || !siguienteEtapa) return

    // Construir objeto con solo los campos habilitados para esta etapa
    const submitData: any = {
      etapa_tipo_id: siguienteEtapa.id,
      usuario_creador: 1, // TODO: Obtener del contexto de usuario
      inspector_fiscal_id: 1,
    }

    // Solo incluir campos que están habilitados en la siguiente etapa
    if (siguienteEtapa.tipo_iniciativa && data.tipo_iniciativa_id) {
      submitData.tipo_iniciativa_id = data.tipo_iniciativa_id
    }

    if (siguienteEtapa.tipo_obra && data.tipo_obra_id) {
      submitData.tipo_obra_id = data.tipo_obra_id
    }

    if (siguienteEtapa.region && data.region_id) {
      submitData.region_id = data.region_id
    }

    if (siguienteEtapa.provincia && data.provincia_id) {
      submitData.provincia_id = data.provincia_id
    }

    if (siguienteEtapa.comuna && data.comuna_id) {
      submitData.comuna_id = data.comuna_id
    }

    if (siguienteEtapa.volumen && data.volumen) {
      submitData.volumen = data.volumen
    }

    if (siguienteEtapa.presupuesto_oficial && data.presupuesto_oficial) {
      submitData.presupuesto_oficial = data.presupuesto_oficial
    }

    if (siguienteEtapa.valor_referencia && data.valor_referencia) {
      submitData.valor_referencia = data.valor_referencia
    }

    if (siguienteEtapa.bip && data.bip) {
      submitData.bip = data.bip
    }

    // Convertir fechas a formato ISO solo si están habilitadas y tienen valor
    if (siguienteEtapa.fecha_llamado_licitacion && data.fecha_llamado_licitacion) {
      submitData.fecha_llamado_licitacion = dayjs(data.fecha_llamado_licitacion).toISOString()
    }

    if (siguienteEtapa.fecha_recepcion_ofertas_tecnicas && data.fecha_recepcion_ofertas_tecnicas) {
      submitData.fecha_recepcion_ofertas_tecnicas = dayjs(data.fecha_recepcion_ofertas_tecnicas).toISOString()
    }

    if (siguienteEtapa.fecha_apertura_ofertas_economicas && data.fecha_apertura_ofertas_economicas) {
      submitData.fecha_apertura_ofertas_economicas = dayjs(data.fecha_apertura_ofertas_economicas).toISOString()
    }

    if (siguienteEtapa.decreto_adjudicacion && data.decreto_adjudicacion) {
      submitData.decreto_adjudicacion = data.decreto_adjudicacion
    }

    if (siguienteEtapa.sociedad_concesionaria && data.sociedad_concesionaria) {
      submitData.sociedad_concesionaria = data.sociedad_concesionaria
    }

    if (siguienteEtapa.fecha_inicio_concesion && data.fecha_inicio_concesion) {
      submitData.fecha_inicio_concesion = dayjs(data.fecha_inicio_concesion).toISOString()
    }

    if (siguienteEtapa.plazo_total_concesion && data.plazo_total_concesion) {
      submitData.plazo_total_concesion = data.plazo_total_concesion
    }

    console.log("Datos a enviar:", submitData)

    try {
      await cambiarEtapaMutation.mutateAsync({
        proyectoId: parseInt(project.id),
        data: submitData,
      })

      onSuccess?.()
      onClose()
    } catch (error) {
      console.error("Error al cambiar etapa:", error)
    }
  }

  // Renderizar campos de la siguiente etapa con react-hook-form
  const renderSiguienteEtapaFields = () => {
    if (!mappedFields.hasFields) return null
    return (
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        {/* Fila de selects principales */}
        <div className="flex flex-row gap-4 mt-2">
          {siguienteEtapa?.tipo_iniciativa && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="tipo_iniciativa_id">Tipo de iniciativa</Label>
              <Select
                value={watchedValues.tipo_iniciativa_id?.toString() || ""}
                onValueChange={(value) => setValue('tipo_iniciativa_id', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar..." />
                </SelectTrigger>
                <SelectContent>
                  {tiposIniciativa?.data?.map((tipo) => (
                    <SelectItem key={tipo.id} value={tipo.id.toString()}>
                      {tipo.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          {siguienteEtapa?.tipo_obra && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="tipo_obra_id">Tipo de obra</Label>
              <Select
                value={watchedValues.tipo_obra_id?.toString() || ""}
                onValueChange={(value) => setValue('tipo_obra_id', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar..." />
                </SelectTrigger>
                <SelectContent>
                  {tiposObra?.data?.map((tipo) => (
                    <SelectItem key={tipo.id} value={tipo.id.toString()}>
                      {tipo.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        {/* Cascada de ubicación */}
        <div className="flex flex-row gap-4">
          {siguienteEtapa?.region && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="region_id">Región</Label>
              <Select
                value={watchedValues.region_id?.toString() || ""}
                onValueChange={(value) => {
                  setValue('region_id', parseInt(value))
                  setValue('provincia_id', undefined)
                  setValue('comuna_id', undefined)
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar región..." />
                </SelectTrigger>
                <SelectContent>
                  {regionesData?.data?.map((region) => (
                    <SelectItem key={region.id} value={region.id.toString()}>
                      {region.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          {siguienteEtapa?.provincia && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="provincia_id">Provincia</Label>
              <Select
                value={watchedValues.provincia_id?.toString() || ""}
                onValueChange={(value) => {
                  setValue('provincia_id', parseInt(value))
                  setValue('comuna_id', undefined)
                }}
                disabled={!watchedValues.region_id}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar provincia..." />
                </SelectTrigger>
                <SelectContent>
                  {provinciasData?.data?.map((provincia) => (
                    <SelectItem key={provincia.id} value={provincia.id.toString()}>
                      {provincia.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          {siguienteEtapa?.comuna && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="comuna_id">Comuna</Label>
              <Select
                value={watchedValues.comuna_id?.toString() || ""}
                onValueChange={(value) => setValue('comuna_id', parseInt(value))}
                disabled={!watchedValues.provincia_id}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar comuna..." />
                </SelectTrigger>
                <SelectContent>
                  {comunasData?.data?.map((comuna) => (
                    <SelectItem key={comuna.id} value={comuna.id.toString()}>
                      {comuna.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        {/* Campos de texto, fechas y otros */}
        <div className="flex flex-row gap-12">
          {siguienteEtapa?.volumen && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="volumen">Volumen</Label>
              <Input
                id="volumen"
                {...register('volumen')}
                placeholder="Ej: 50 km, 1000 m³"
                className="max-w-3xs"
              />
            </div>
          )}
          {siguienteEtapa?.presupuesto_oficial && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="presupuesto_oficial">Presupuesto oficial</Label>
              <Input
                id="presupuesto_oficial"
                {...register('presupuesto_oficial')}
                placeholder="Ej: $50.000.000.000"
                className="max-w-3xs"
              />
            </div>
          )}
        </div>
        {siguienteEtapa?.bip && (
          <div className="flex flex-col gap-2">
            <Label htmlFor="bip">BIP</Label>
            <Input
              id="bip"
              {...register('bip')}
              placeholder="Código BIP"
              className="max-w-3xs"
            />
          </div>
        )}
        {siguienteEtapa?.fecha_llamado_licitacion && (
          <div className="flex flex-col gap-2">
            <Label htmlFor="fecha_llamado_licitacion">Fecha llamado a licitación</Label>
            <Input
              id="fecha_llamado_licitacion"
              type="date"
              {...register('fecha_llamado_licitacion')}
              className="max-w-3xs"
            />
          </div>
        )}
        {siguienteEtapa?.fecha_recepcion_ofertas_tecnicas && (
          <div className="flex flex-col gap-2">
            <Label htmlFor="fecha_recepcion_ofertas_tecnicas">Fecha Recepción Ofertas Técnicas</Label>
            <Input
              id="fecha_recepcion_ofertas_tecnicas"
              type="date"
              {...register('fecha_recepcion_ofertas_tecnicas')}
              className="max-w-3xs"
            />
          </div>
        )}
        {siguienteEtapa?.fecha_apertura_ofertas_economicas && (
          <div className="flex flex-col gap-2">
            <Label htmlFor="fecha_apertura_ofertas_economicas">Fecha Apertura Ofertas Económicas</Label>
            <Input
              id="fecha_apertura_ofertas_economicas"
              type="date"
              {...register('fecha_apertura_ofertas_economicas')}
              className="max-w-3xs"
            />
          </div>
        )}
        {siguienteEtapa?.fecha_inicio_concesion && (
          <div className="flex flex-col gap-2">
            <Label htmlFor="fecha_inicio_concesion">Fecha Inicio Concesión</Label>
            <Input
              id="fecha_inicio_concesion"
              type="date"
              {...register('fecha_inicio_concesion')}
              className="max-w-3xs"
            />
          </div>
        )}
        {siguienteEtapa?.plazo_total_concesion && (
          <div className="flex flex-col gap-2">
            <Label htmlFor="plazo_total_concesion">Plazo Total Concesión</Label>
            <Input
              id="plazo_total_concesion"
              {...register('plazo_total_concesion')}
              placeholder="Ej: 50 años"
              className="max-w-3xs"
            />
          </div>
        )}
        {siguienteEtapa?.decreto_adjudicacion && (
          <div className="flex flex-col gap-2">
            <Label htmlFor="decreto_adjudicacion">Decreto Adjudicación</Label>
            <Input
              id="decreto_adjudicacion"
              {...register('decreto_adjudicacion')}
              placeholder="Ej: Decreto N° 123/224"
              className="max-w-3xs"
            />
          </div>
        )}
        {siguienteEtapa?.sociedad_concesionaria && (
          <div className="flex flex-col gap-2">
            <Label htmlFor="sociedad_concesionaria">Sociedad Concesionaria</Label>
            <Input
              id="sociedad_concesionaria"
              {...register('sociedad_concesionaria')}
              placeholder="Ej: Sociedad Concesionaria XYZ SPA"
              className="max-w-3xs"
            />
          </div>
        )}
        {siguienteEtapa?.inspector_fiscal_id && (
          <div className="flex flex-col gap-2">
            <Label htmlFor="inspector_fiscal_id">Inspector Fiscal</Label>
            <Input
              id="inspector_fiscal_id"
              {...register('inspector_fiscal_id', { valueAsNumber: true })}
              placeholder="ID del inspector fiscal"
              className="max-w-3xs"
            />
          </div>
        )}
      </form>
    )
  }

  // Reemplazar renderEtapasAnteriores para mostrar todas las etapas anteriores
  const renderEtapasAnteriores = () => {
    const etapas = etapaAvanzarInfo?.data?.etapas_anteriores || []
    if (!etapas.length) return null
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">Detalles de etapas anteriores</h3>
        </div>
        {etapas.map((etapa) => (
          <Collapsible key={etapa.id}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                <span className="text-sm font-medium flex items-center gap-2">
                  <span>Etapa: {etapa.etapa_tipo?.nombre}</span>
                  {etapa.etapa_tipo?.color && (
                    <div className="w-4 h-4" style={{ backgroundColor: etapa.etapa_tipo.color }} />
                  )}
                </span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {etapa.tipo_iniciativa?.nombre && (
                      <div className="flex flex-col gap-2">
                        <Label className="text-xs font-medium text-muted-foreground">Tipo de iniciativa</Label>
                        <Input value={etapa.tipo_iniciativa.nombre} readOnly className="bg-gray-50" />
                      </div>
                    )}
                    {etapa.tipo_obra?.nombre && (
                      <div className="flex flex-col gap-2">
                        <Label className="text-xs font-medium text-muted-foreground">Tipo de obra</Label>
                        <Input value={etapa.tipo_obra.nombre} readOnly className="bg-gray-50" />
                      </div>
                    )}
                    {etapa.region?.nombre && (
                      <div className="flex flex-col gap-2">
                        <Label className="text-xs font-medium text-muted-foreground">Región</Label>
                        <Input value={etapa.region.nombre} readOnly className="bg-gray-50" />
                      </div>
                    )}
                    {etapa.provincia?.nombre && (
                      <div className="flex flex-col gap-2">
                        <Label className="text-xs font-medium text-muted-foreground">Provincia</Label>
                        <Input value={etapa.provincia.nombre} readOnly className="bg-gray-50" />
                      </div>
                    )}
                    {etapa.comuna?.nombre && (
                      <div className="flex flex-col gap-2">
                        <Label className="text-xs font-medium text-muted-foreground">Comuna</Label>
                        <Input value={etapa.comuna.nombre} readOnly className="bg-gray-50" />
                      </div>
                    )}
                    {etapa.volumen && (
                      <div className="flex flex-col gap-2">
                        <Label className="text-xs font-medium text-muted-foreground">Volumen</Label>
                        <Input value={etapa.volumen} readOnly className="bg-gray-50" />
                      </div>
                    )}
                    {etapa.presupuesto_oficial && (
                      <div className="flex flex-col gap-2">
                        <Label className="text-xs font-medium text-muted-foreground">Presupuesto oficial</Label>
                        <Input value={etapa.presupuesto_oficial} readOnly className="bg-gray-50" />
                      </div>
                    )}
                    {etapa.valor_referencia && (
                      <div className="flex flex-col gap-2">
                        <Label className="text-xs font-medium text-muted-foreground">Valor referencia</Label>
                        <Input value={etapa.valor_referencia} readOnly className="bg-gray-50" />
                      </div>
                    )}
                    {etapa.bip && (
                      <div className="flex flex-col gap-2">
                        <Label className="text-xs font-medium text-muted-foreground">BIP</Label>
                        <Input value={etapa.bip} readOnly className="bg-gray-50" />
                      </div>
                    )}
                    {etapa.fecha_llamado_licitacion && (
                      <div className="flex flex-col gap-2">
                        <Label className="text-xs font-medium text-muted-foreground">Fecha llamado a licitación</Label>
                        <Input value={dayjs(etapa.fecha_llamado_licitacion).format('DD/MM/YYYY')} readOnly className="bg-gray-50" />
                      </div>
                    )}
                    {etapa.fecha_recepcion_ofertas_tecnicas && (
                      <div className="flex flex-col gap-2">
                        <Label className="text-xs font-medium text-muted-foreground">Fecha recepción ofertas técnicas</Label>
                        <Input value={etapa.fecha_recepcion_ofertas_tecnicas} readOnly className="bg-gray-50" />
                      </div>
                    )}
                    {etapa.fecha_apertura_ofertas_economicas && (
                      <div className="flex flex-col gap-2">
                        <Label className="text-xs font-medium text-muted-foreground">Fecha apertura ofertas económicas</Label>
                        <Input value={etapa.fecha_apertura_ofertas_economicas} readOnly className="bg-gray-50" />
                      </div>
                    )}
                    {etapa.fecha_inicio_concesion && (
                      <div className="flex flex-col gap-2">
                        <Label className="text-xs font-medium text-muted-foreground">Fecha inicio concesión</Label>
                        <Input value={etapa.fecha_inicio_concesion} readOnly className="bg-gray-50" />
                      </div>
                    )}
                    {etapa.plazo_total_concesion && (
                      <div className="flex flex-col gap-2">
                        <Label className="text-xs font-medium text-muted-foreground">Plazo total concesión</Label>
                        <Input value={etapa.plazo_total_concesion} readOnly className="bg-gray-50" />
                      </div>
                    )}
                    {etapa.decreto_adjudicacion && (
                      <div className="flex flex-col gap-2">
                        <Label className="text-xs font-medium text-muted-foreground">Decreto adjudicación</Label>
                        <Input value={etapa.decreto_adjudicacion} readOnly className="bg-gray-50" />
                      </div>
                    )}
                    {etapa.sociedad_concesionaria && (
                      <div className="flex flex-col gap-2">
                        <Label className="text-xs font-medium text-muted-foreground">Sociedad concesionaria</Label>
                        <Input value={etapa.sociedad_concesionaria} readOnly className="bg-gray-50" />
                      </div>
                    )}
                    {etapa.inspector_fiscal?.nombre_completo && (
                      <div className="flex flex-col gap-2">
                        <Label className="text-xs font-medium text-muted-foreground">Inspector fiscal</Label>
                        <Input value={etapa.inspector_fiscal.nombre_completo} readOnly className="bg-gray-50" />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    )
  }

  if (!project) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Avanzar a siguiente etapa</DialogTitle>
          <DialogDescription className="flex flex-col gap-2">
            {project?.name && (
              <span className="font-medium">Proyecto: {project.name}</span>
            )}
            Completa los campos requeridos para avanzar el proyecto a la siguiente etapa
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2 space-y-6">
          {/* Campos de la siguiente etapa */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Campos de la siguiente etapa</span>
              {etapaAvanzarInfo?.data?.siguiente_etapa?.nombre && (
                <Badge variant="secondary" className="ml-2">
                  {etapaAvanzarInfo.data.siguiente_etapa.nombre}
                </Badge>
              )}
            </div>
            {isLoading && <div>Cargando información de la etapa...</div>}
            {error && <div className="text-red-500">Error al cargar información de la etapa</div>}
            {renderSiguienteEtapaFields()}
          </div>

          <Separator />

          {/* Información de etapas anteriores */}
          {renderEtapasAnteriores()}

          {/* Botones de acción */}
          <div className="flex justify-end gap-2">
            <Button variant="secundario" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              variant="primario"
              onClick={handleSubmit(onSubmit)}
              disabled={cambiarEtapaMutation.isPending}
            >
              {cambiarEtapaMutation.isPending ? "Avanzando..." : "Avanzar etapa"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 