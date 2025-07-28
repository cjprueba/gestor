import { useFormContext } from 'react-hook-form';
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Badge } from "@/shared/components/ui/badge"
import { Separator } from "@/shared/components/ui/separator"
import type { Comuna, InspectorFiscal, Provincia, Region, TipoIniciativa, TipoObra } from '../project/project.types';
import type { CreateProjectFormData } from '../project/project.validations';

interface StageSpecificFieldsStepProps {
  tiposIniciativa: TipoIniciativa[];
  tiposObra: TipoObra[];
  regiones: Region[];
  provincias: Provincia[];
  comunas: Comuna[];
  inspectoresFiscales: InspectorFiscal[];
  stageTypeDetail?: {
    tipo_iniciativa: boolean;
    tipo_obra: boolean;
    region: boolean;
    provincia: boolean;
    comuna: boolean;
    volumen: boolean;
    presupuesto_oficial: boolean;
    bip: boolean;
    fecha_llamado_licitacion: boolean;
    fecha_recepcion_ofertas_tecnicas: boolean;
    fecha_apertura_ofertas_economicas: boolean;
    fecha_inicio_concesion: boolean;
    plazo_total_concesion: boolean;
    decreto_adjudicacion: boolean;
    sociedad_concesionaria: boolean;
    inspector_fiscal_id: boolean;
  };
}

export const StageSpecificFieldsStep: React.FC<StageSpecificFieldsStepProps> = ({
  tiposIniciativa,
  tiposObra,
  regiones,
  provincias,
  comunas,
  inspectoresFiscales,
  stageTypeDetail,
}) => {
  const { register, formState: { errors }, watch, setValue } = useFormContext<CreateProjectFormData>();

  const watchedStepTwo = watch('createProjectStepTwo');

  return (
    <div className="space-y-6">
      <div className="flex gap-1 flex-col">
        <h3 className="text-lg font-semibold">Información del proyecto</h3>
        <Badge variant="outline" className="w-fit">Campos específicos para esta etapa</Badge>
      </div>

      {/* Sección 1: Selects principales (Tipo iniciativa y Tipo obra) - 2 columnas */}
      {(stageTypeDetail?.tipo_iniciativa || stageTypeDetail?.tipo_obra) && (
        <div className="flex flex-row gap-4 mt-8">
          {stageTypeDetail?.tipo_iniciativa && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="tipo_iniciativa_id">Tipo de iniciativa</Label>
              <Select
                value={watchedStepTwo.tipo_iniciativa_id > 0 ? watchedStepTwo.tipo_iniciativa_id.toString() : ""}
                onValueChange={(value) => setValue('createProjectStepTwo.tipo_iniciativa_id', parseInt(value))}
              >
                <SelectTrigger className={`w-40 ${errors.createProjectStepTwo?.tipo_iniciativa_id ? "border-red-500" : ""}`}>
                  <SelectValue placeholder="Seleccionar..." />
                </SelectTrigger>
                <SelectContent>
                  {tiposIniciativa.map((tipo) => (
                    <SelectItem key={tipo.id} value={tipo.id.toString()}>
                      {tipo.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.createProjectStepTwo?.tipo_iniciativa_id && (
                <p className="text-sm text-red-500 mt-1">{errors.createProjectStepTwo.tipo_iniciativa_id.message}</p>
              )}
            </div>
          )}
          {stageTypeDetail?.tipo_obra && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="tipo_obra_id">Tipo de obra</Label>
              <Select
                value={watchedStepTwo.tipo_obra_id > 0 ? watchedStepTwo.tipo_obra_id.toString() : ""}
                onValueChange={(value) => setValue('createProjectStepTwo.tipo_obra_id', parseInt(value))}
              >
                <SelectTrigger className={`w-40 ${errors.createProjectStepTwo?.tipo_obra_id ? "border-red-500" : ""}`}>
                  <SelectValue placeholder="Seleccionar..." />
                </SelectTrigger>
                <SelectContent>
                  {tiposObra.map((tipo) => (
                    <SelectItem key={tipo.id} value={tipo.id.toString()}>
                      {tipo.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.createProjectStepTwo?.tipo_obra_id && (
                <p className="text-sm text-red-500 mt-1">{errors.createProjectStepTwo.tipo_obra_id.message}</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Sección 2: Selects de ubicación (Región, Provincia, Comuna) - 3 columnas */}
      {(stageTypeDetail?.region || stageTypeDetail?.provincia || stageTypeDetail?.comuna) && (
        <div className="grid grid-cols-3 gap-4">
          {stageTypeDetail?.region && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="region_id">Región</Label>
              <Select
                value={watchedStepTwo.region_id > 0 ? watchedStepTwo.region_id.toString() : ""}
                onValueChange={(value) => setValue('createProjectStepTwo.region_id', parseInt(value))}
              >
                <SelectTrigger className={`w-full ${errors.createProjectStepTwo?.region_id ? "border-red-500" : ""}`}>
                  <SelectValue placeholder="Seleccionar..." />
                </SelectTrigger>
                <SelectContent>
                  {regiones.map((region) => (
                    <SelectItem key={region.id} value={region.id.toString()}>
                      {region.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.createProjectStepTwo?.region_id && (
                <p className="text-sm text-red-500 mt-1">{errors.createProjectStepTwo.region_id.message}</p>
              )}
            </div>
          )}
          {stageTypeDetail?.provincia && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="provincia_id">Provincia</Label>
              <Select
                value={watchedStepTwo.provincia_id > 0 ? watchedStepTwo.provincia_id.toString() : ""}
                onValueChange={(value) => setValue('createProjectStepTwo.provincia_id', parseInt(value))}
                disabled={!watchedStepTwo.region_id}
              >
                <SelectTrigger className={`w-full ${errors.createProjectStepTwo?.provincia_id ? "border-red-500" : ""}`}>
                  <SelectValue placeholder="Seleccionar..." />
                </SelectTrigger>
                <SelectContent>
                  {provincias.map((provincia) => (
                    <SelectItem key={provincia.id} value={provincia.id.toString()}>
                      {provincia.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.createProjectStepTwo?.provincia_id && (
                <p className="text-sm text-red-500 mt-1">{errors.createProjectStepTwo.provincia_id.message}</p>
              )}
            </div>
          )}
          {stageTypeDetail?.comuna && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="comuna_id">Comuna</Label>
              <Select
                value={watchedStepTwo.comuna_id > 0 ? watchedStepTwo.comuna_id.toString() : ""}
                onValueChange={(value) => setValue('createProjectStepTwo.comuna_id', parseInt(value))}
                disabled={!watchedStepTwo.provincia_id}
              >
                <SelectTrigger className={`w-full ${errors.createProjectStepTwo?.comuna_id ? "border-red-500" : ""}`}>
                  <SelectValue placeholder="Seleccionar..." />
                </SelectTrigger>
                <SelectContent>
                  {comunas.map((comuna) => (
                    <SelectItem key={comuna.id} value={comuna.id.toString()}>
                      {comuna.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.createProjectStepTwo?.comuna_id && (
                <p className="text-sm text-red-500 mt-1">{errors.createProjectStepTwo.comuna_id.message}</p>
              )}
            </div>
          )}
        </div>
      )}
      <Separator />

      {/* Sección 3: Campos de texto - 3 columnas */}
      {(stageTypeDetail?.volumen || stageTypeDetail?.presupuesto_oficial || stageTypeDetail?.bip ||
        stageTypeDetail?.decreto_adjudicacion || stageTypeDetail?.plazo_total_concesion ||
        stageTypeDetail?.sociedad_concesionaria || stageTypeDetail?.inspector_fiscal_id) && (
          <div className="grid grid-cols-3 gap-4 mt-8">
            {stageTypeDetail?.volumen && (
              <div className="flex flex-col gap-2">
                <Label htmlFor="volumen">Volumen</Label>
                <Input
                  id="volumen"
                  {...register('createProjectStepTwo.volumen')}
                  placeholder="Ej: 50 km, 1000 m³"
                  className="w-full"
                />
              </div>
            )}
            {stageTypeDetail?.presupuesto_oficial && (
              <div className="flex flex-col gap-2">
                <Label htmlFor="presupuesto_oficial">Presupuesto oficial</Label>
                <Input
                  id="presupuesto_oficial"
                  {...register('createProjectStepTwo.presupuesto_oficial')}
                  placeholder="Ej: $50.000.000.000"
                  className="w-full"
                />
              </div>
            )}
            {stageTypeDetail?.bip && (
              <div className="flex flex-col gap-2">
                <Label htmlFor="bip">BIP</Label>
                <Input
                  id="bip"
                  {...register('createProjectStepTwo.bip')}
                  placeholder="Código BIP"
                  className="w-full"
                />
              </div>
            )}
            {stageTypeDetail?.decreto_adjudicacion && (
              <div className="flex flex-col gap-2">
                <Label htmlFor="decreto_adjudicacion">Decreto Adjudicación</Label>
                <Input
                  id="decreto_adjudicacion"
                  {...register('createProjectStepTwo.decreto_adjudicacion')}
                  placeholder="Ej: Decreto N° 123/224"
                  className="w-full"
                />
              </div>
            )}
            {stageTypeDetail?.plazo_total_concesion && (
              <div className="flex flex-col gap-2">
                <Label htmlFor="plazo_total_concesion">Plazo Total Concesión</Label>
                <Input
                  id="plazo_total_concesion"
                  {...register('createProjectStepTwo.plazo_total_concesion')}
                  placeholder="Ej: 50 años"
                  className="w-full"
                />
              </div>
            )}
            {stageTypeDetail?.sociedad_concesionaria && (
              <div className="flex flex-col gap-2">
                <Label htmlFor="sociedad_concesionaria">Sociedad Concesionaria</Label>
                <Input
                  id="sociedad_concesionaria"
                  {...register('createProjectStepTwo.sociedad_concesionaria')}
                  placeholder="Ej: Sociedad Concesionaria XYZ SPA"
                  className="w-full"
                />
              </div>
            )}
            {stageTypeDetail?.inspector_fiscal_id && (
              <div className="flex flex-col gap-2">
                <Label htmlFor="inspector_fiscal_id">Inspector Fiscal</Label>
                <Select
                  value={watchedStepTwo.inspector_fiscal_id && watchedStepTwo.inspector_fiscal_id > 0 ? watchedStepTwo.inspector_fiscal_id.toString() : ""}
                  onValueChange={(value) => setValue('createProjectStepTwo.inspector_fiscal_id', parseInt(value))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccionar inspector..." />
                  </SelectTrigger>
                  <SelectContent>
                    {inspectoresFiscales.map((inspector) => (
                      <SelectItem key={inspector.id} value={inspector.id.toString()}>
                        {inspector.nombre_completo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        )}
      <Separator />

      {/* Sección 4: Campos de fecha - 3 columnas */}
      {(stageTypeDetail?.fecha_llamado_licitacion || stageTypeDetail?.fecha_recepcion_ofertas_tecnicas ||
        stageTypeDetail?.fecha_apertura_ofertas_economicas || stageTypeDetail?.fecha_inicio_concesion) && (
          <div className="grid grid-cols-3 gap-4 mt-8">
            {stageTypeDetail?.fecha_llamado_licitacion && (
              <div className="flex flex-col gap-2">
                <Label htmlFor="fecha_llamado_licitacion">Fecha llamado a licitación</Label>
                <Input
                  id="fecha_llamado_licitacion"
                  type="date"
                  {...register('createProjectStepTwo.fecha_llamado_licitacion')}
                  className="w-full"
                />
              </div>
            )}
            {stageTypeDetail?.fecha_recepcion_ofertas_tecnicas && (
              <div className="flex flex-col gap-2">
                <Label htmlFor="fecha_recepcion_ofertas_tecnicas">Fecha Recepción Ofertas Técnicas</Label>
                <Input
                  id="fecha_recepcion_ofertas_tecnicas"
                  type="date"
                  {...register('createProjectStepTwo.fecha_recepcion_ofertas_tecnicas')}
                  className="w-full"
                />
              </div>
            )}
            {stageTypeDetail?.fecha_apertura_ofertas_economicas && (
              <div className="flex flex-col gap-2">
                <Label htmlFor="fecha_apertura_ofertas_economicas">Fecha Apertura Ofertas Económicas</Label>
                <Input
                  id="fecha_apertura_ofertas_economicas"
                  type="date"
                  {...register('createProjectStepTwo.fecha_apertura_ofertas_economicas')}
                  className="w-full"
                />
              </div>
            )}
            {stageTypeDetail?.fecha_inicio_concesion && (
              <div className="flex flex-col gap-2">
                <Label htmlFor="fecha_inicio_concesion">Fecha Inicio Concesión</Label>
                <Input
                  id="fecha_inicio_concesion"
                  type="date"
                  {...register('createProjectStepTwo.fecha_inicio_concesion')}
                  className="w-full"
                />
              </div>
            )}
          </div>
        )}
    </div>
  )
} 