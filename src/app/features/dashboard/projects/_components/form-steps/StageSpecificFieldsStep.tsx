import { useFormContext } from 'react-hook-form';
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Badge } from "@/shared/components/ui/badge"
import type { CreateProjectFormData } from "@/shared/types/project-types"
import type { TipoIniciativa, TipoObra, Region, Provincia, Comuna, InspectorFiscal } from "@/shared/types/project-types"

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

  const renderCommonFields = () => (
    <div className="flex flex-col gap-6">
      <div className="flex flex-row gap-4 mt-2">
        {stageTypeDetail?.tipo_iniciativa && (
          <div className="flex flex-col gap-2">
            <Label htmlFor="tipo_iniciativa_id">Tipo de iniciativa</Label>
            <Select
              value={watchedStepTwo.tipo_iniciativa_id > 0 ? watchedStepTwo.tipo_iniciativa_id.toString() : ""}
              onValueChange={(value) => setValue('createProjectStepTwo.tipo_iniciativa_id', parseInt(value))}
            >
              <SelectTrigger className={errors.createProjectStepTwo?.tipo_iniciativa_id ? "border-red-500" : ""}>
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
              <SelectTrigger className={errors.createProjectStepTwo?.tipo_obra_id ? "border-red-500" : ""}>
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

      {/* Cascada de ubicación */}
      <div className="flex flex-row gap-4">
        {stageTypeDetail?.region && (
          <div className="flex flex-col gap-2">
            <Label htmlFor="region_id">Región</Label>
            <Select
              value={watchedStepTwo.region_id > 0 ? watchedStepTwo.region_id.toString() : ""}
              onValueChange={(value) => setValue('createProjectStepTwo.region_id', parseInt(value))}
            >
              <SelectTrigger className={errors.createProjectStepTwo?.region_id ? "border-red-500" : ""}>
                <SelectValue placeholder="Seleccionar región..." />
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
              <SelectTrigger className={errors.createProjectStepTwo?.provincia_id ? "border-red-500" : ""}>
                <SelectValue placeholder="Seleccionar provincia..." />
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
              <SelectTrigger className={errors.createProjectStepTwo?.comuna_id ? "border-red-500" : ""}>
                <SelectValue placeholder="Seleccionar comuna..." />
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

      <div className="flex flex-row gap-12">
        {stageTypeDetail?.volumen && (
          <div className="flex flex-col gap-2">
            <Label htmlFor="volumen">Volumen</Label>
            <Input
              id="volumen"
              {...register('createProjectStepTwo.volumen')}
              placeholder="Ej: 50 km, 1000 m³"
              className="max-w-3xs"
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
              className="max-w-3xs"
            />
          </div>
        )}
      </div>

      {/* Campos específicos según la etapa */}
      {stageTypeDetail?.bip && (
        <div className="flex flex-col gap-2">
          <Label htmlFor="bip">BIP</Label>
          <Input
            id="bip"
            {...register('createProjectStepTwo.bip')}
            placeholder="Código BIP"
            className="max-w-3xs"
          />
        </div>
      )}

      {stageTypeDetail?.fecha_llamado_licitacion && (
        <div className="flex flex-col gap-2">
          <Label htmlFor="fecha_llamado_licitacion">Fecha llamado a licitación</Label>
          <Input
            id="fecha_llamado_licitacion"
            type="date"
            {...register('createProjectStepTwo.fecha_llamado_licitacion')}
            className="max-w-3xs"
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
            className="max-w-3xs"
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
            className="max-w-3xs"
          />
        </div>
      )}

      {stageTypeDetail?.decreto_adjudicacion && (
        <div className="flex flex-col gap-2">
          <Label htmlFor="decreto_adjudicacion">Decreto Adjudicación</Label>
          <Input
            id="decreto_adjudicacion"
            {...register('createProjectStepTwo.decreto_adjudicacion')}
            placeholder="Número de decreto"
            className="max-w-3xs"
          />
        </div>
      )}

      {stageTypeDetail?.sociedad_concesionaria && (
        <div className="flex flex-col gap-2">
          <Label htmlFor="sociedad_concesionaria">Sociedad Concesionaria</Label>
          <Input
            id="sociedad_concesionaria"
            {...register('createProjectStepTwo.sociedad_concesionaria')}
            placeholder="Nombre de la sociedad"
            className="max-w-3xs"
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
            className="max-w-3xs"
          />
        </div>
      )}

      {stageTypeDetail?.plazo_total_concesion && (
        <div className="flex flex-col gap-2">
          <Label htmlFor="plazo_total_concesion">Plazo total concesión</Label>
          <Input
            id="plazo_total_concesion"
            {...register('createProjectStepTwo.plazo_total_concesion')}
            placeholder="Ej: 30 años"
            className="max-w-3xs"
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
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar inspector..." />
            </SelectTrigger>
            <SelectContent>
              {inspectoresFiscales.map((inspector) => (
                <SelectItem key={inspector.id} value={inspector.id.toString()}>
                  {inspector.nombre} {inspector.apellido}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  )

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <Badge variant="outline">Campos específicos para esta etapa</Badge>
        </div>
        <h3 className="text-lg font-medium mb-4">Información del Proyecto</h3>
        {renderCommonFields()}
      </div>
    </div>
  )
} 