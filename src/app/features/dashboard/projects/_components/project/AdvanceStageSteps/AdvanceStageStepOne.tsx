import TagStage from "@/shared/components/TagStage"
import type { AvanzarEtapaResponse } from "@/app/features/dashboard/projects/_components/project/project.types"
import { Label } from "@/shared/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { useComunas, useProvincias, useRegiones, useTiposIniciativa, useTiposObras } from "@/lib/api"
import { mapStageTypeToFormFields } from "@/shared/utils/stage-form-mapper"
import { Input } from "@/shared/components/ui/input"
import { Separator } from "@/shared/components/ui/separator"
import { useFormContext } from "react-hook-form"
import type { AdvanceStageFormData } from "../project.validations"

interface AdvanceStageStepOneProps {
  etapaAvanzarInfo: AvanzarEtapaResponse | null
  isLoading: boolean
  error: Error | null
}

const AdvanceStageStepOne = ({ etapaAvanzarInfo, isLoading, error }: AdvanceStageStepOneProps) => {
  const methods = useFormContext<AdvanceStageFormData>()

  const { watch, setValue } = methods

  const watchedStepOne = watch("stepOne")

  const { data: regionesData } = useRegiones()
  const { data: provinciasData } = useProvincias(watchedStepOne.region_id)
  const { data: comunasData } = useComunas(watchedStepOne.region_id, watchedStepOne.provincia_id)
  const { data: tiposIniciativa } = useTiposIniciativa()
  const { data: tiposObra } = useTiposObras()

  const siguienteEtapa = etapaAvanzarInfo?.data?.siguiente_etapa
  const mappedFields = siguienteEtapa ? mapStageTypeToFormFields(siguienteEtapa) : { fields: [], hasFields: false, fieldCount: 0 }


  // React Hook Form



  // Renderizar campos de la siguiente etapa con react-hook-form
  const renderSiguienteEtapaFields = () => {
    if (!mappedFields.hasFields) return null
    return (
      <div className="space-y-6">
        {/* Sección 1: Selects principales (Tipo iniciativa y Tipo obra) - 2 columnas */}
        {(siguienteEtapa?.tipo_iniciativa || siguienteEtapa?.tipo_obra) && (
          <div className="flex flex-row gap-4 mt-8">
            {siguienteEtapa?.tipo_iniciativa && (
              <div className="flex flex-col gap-2">
                <Label htmlFor="tipo_iniciativa_id">Tipo de iniciativa</Label>
                <Select
                  value={watchedStepOne.tipo_iniciativa_id?.toString() || ""}
                  onValueChange={(value) => setValue('stepOne.tipo_iniciativa_id', parseInt(value))}
                >
                  <SelectTrigger className="w-40">
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
                  value={watchedStepOne.tipo_obra_id?.toString() || ""}
                  onValueChange={(value) => setValue('stepOne.tipo_obra_id', parseInt(value))}
                  disabled
                >
                  <SelectTrigger className="w-auto min-w-[200px]">
                    <SelectValue placeholder="Seleccionar..." />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposObra?.map((tipo) => (
                      <SelectItem key={tipo.id} value={tipo.id.toString()}>
                        {tipo.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        )}

        {/* Sección 2: Selects de ubicación (Región, Provincia, Comuna) - 3 columnas */}
        {(siguienteEtapa?.region || siguienteEtapa?.provincia || siguienteEtapa?.comuna) && (
          <div className="grid grid-cols-3 gap-4">
            {siguienteEtapa?.region && (
              <div className="flex flex-col gap-2">
                <Label htmlFor="region_id">Región</Label>
                <Select
                  value={watchedStepOne.region_id?.toString() || ""}
                  onValueChange={(value) => {
                    setValue('stepOne.region_id', parseInt(value))
                    setValue('stepOne.provincia_id', undefined)
                    setValue('stepOne.comuna_id', undefined)
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccionar..." />
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
                  value={watchedStepOne.provincia_id?.toString() || ""}
                  onValueChange={(value) => {
                    setValue('stepOne.provincia_id', parseInt(value))
                    setValue('stepOne.comuna_id', undefined)
                  }}
                  disabled={!watchedStepOne.region_id}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccionar..." />
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
                  value={watchedStepOne.comuna_id?.toString() || ""}
                  onValueChange={(value) => setValue('stepOne.comuna_id', parseInt(value))}
                  disabled={!watchedStepOne.provincia_id}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccionar..." />
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
        )}
        <Separator />
        {/* Sección 3: Campos de texto - 3 columnas */}
        {(siguienteEtapa?.volumen || siguienteEtapa?.presupuesto_oficial || siguienteEtapa?.bip ||
          siguienteEtapa?.decreto_adjudicacion || siguienteEtapa?.plazo_total_concesion ||
          siguienteEtapa?.sociedad_concesionaria || siguienteEtapa?.inspector_fiscal_id) && (
            <div className="grid grid-cols-3 gap-4 mt-8">
              {siguienteEtapa?.volumen && (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="volumen">Volumen</Label>
                  <Input
                    id="volumen"
                    {...methods.register('stepOne.volumen')}
                    placeholder="Ej: 50 km, 1000 m³"
                    className="w-full"
                  />
                </div>
              )}
              {siguienteEtapa?.presupuesto_oficial && (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="presupuesto_oficial">Presupuesto oficial</Label>
                  <Input
                    id="presupuesto_oficial"
                    {...methods.register('stepOne.presupuesto_oficial')}
                    placeholder="Ej: $50.000.000.000"
                    className="w-full"
                  />
                </div>
              )}
              {siguienteEtapa?.bip && (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="bip">BIP</Label>
                  <Input
                    id="bip"
                    {...methods.register('stepOne.bip')}
                    placeholder="Código BIP"
                    className="w-full"
                  />
                </div>
              )}
              {siguienteEtapa?.decreto_adjudicacion && (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="decreto_adjudicacion">Decreto Adjudicación</Label>
                  <Input
                    id="decreto_adjudicacion"
                    {...methods.register('stepOne.decreto_adjudicacion')}
                    placeholder="Ej: Decreto N° 123/224"
                    className="w-full"
                  />
                </div>
              )}
              {siguienteEtapa?.plazo_total_concesion && (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="plazo_total_concesion">Plazo Total Concesión</Label>
                  <Input
                    id="plazo_total_concesion"
                    {...methods.register('stepOne.plazo_total_concesion')}
                    placeholder="Ej: 50 años"
                    className="w-full"
                  />
                </div>
              )}
              {siguienteEtapa?.sociedad_concesionaria && (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="sociedad_concesionaria">Sociedad Concesionaria</Label>
                  <Input
                    id="sociedad_concesionaria"
                    {...methods.register('stepOne.sociedad_concesionaria')}
                    placeholder="Ej: Sociedad Concesionaria XYZ SPA"
                    className="w-full"
                  />
                </div>
              )}
              {siguienteEtapa?.inspector_fiscal_id && (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="inspector_fiscal_id">Inspector Fiscal</Label>
                  <Input
                    id="inspector_fiscal_id"
                    {...methods.register('stepOne.inspector_fiscal_id', { valueAsNumber: true })}
                    placeholder="ID del inspector fiscal"
                    className="w-full"
                  />
                </div>
              )}
            </div>
          )}
        <Separator />

        {/* Sección 4: Campos de fecha - 3 columnas */}
        {(siguienteEtapa?.fecha_llamado_licitacion || siguienteEtapa?.fecha_recepcion_ofertas_tecnicas ||
          siguienteEtapa?.fecha_apertura_ofertas_economicas || siguienteEtapa?.fecha_inicio_concesion) && (
            <div className="grid grid-cols-3 gap-4 mt-8">
              {siguienteEtapa?.fecha_llamado_licitacion && (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="fecha_llamado_licitacion">Fecha llamado a licitación</Label>
                  <Input
                    id="fecha_llamado_licitacion"
                    type="date"
                    {...methods.register('stepOne.fecha_llamado_licitacion')}
                    className="w-full"
                  />
                </div>
              )}
              {siguienteEtapa?.fecha_recepcion_ofertas_tecnicas && (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="fecha_recepcion_ofertas_tecnicas">Fecha Recepción Ofertas Técnicas</Label>
                  <Input
                    id="fecha_recepcion_ofertas_tecnicas"
                    type="date"
                    {...methods.register('stepOne.fecha_recepcion_ofertas_tecnicas')}
                    className="w-full"
                  />
                </div>
              )}
              {siguienteEtapa?.fecha_apertura_ofertas_economicas && (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="fecha_apertura_ofertas_economicas">Fecha Apertura Ofertas Económicas</Label>
                  <Input
                    id="fecha_apertura_ofertas_economicas"
                    type="date"
                    {...methods.register('stepOne.fecha_apertura_ofertas_economicas')}
                    className="w-full"
                  />
                </div>
              )}
              {siguienteEtapa?.fecha_inicio_concesion && (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="fecha_inicio_concesion">Fecha Inicio Concesión</Label>
                  <Input
                    id="fecha_inicio_concesion"
                    type="date"
                    {...methods.register('stepOne.fecha_inicio_concesion')}
                    className="w-full"
                  />
                </div>
              )}
            </div>
          )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-1 flex-col">
        <h3 className="text-lg font-semibold">Completa los campos de la siguiente etapa</h3>
        {etapaAvanzarInfo?.data?.siguiente_etapa?.nombre && (
          <TagStage etapa={etapaAvanzarInfo.data.siguiente_etapa.nombre} size="xs" />
        )}
      </div>
      {isLoading && <div>Cargando información de la etapa...</div>}
      {error && <div className="text-red-500">Error al cargar información de la etapa</div>}
      {!error && !isLoading && (
        renderSiguienteEtapaFields()
      )}
    </div>
  )
}

export default AdvanceStageStepOne;