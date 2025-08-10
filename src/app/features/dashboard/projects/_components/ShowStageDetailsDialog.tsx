import { useRegiones, useTiposIniciativa, useTiposObras } from "@/lib/api"
import { useEtapaAvanzarInfo, useProyectoDetalle, useUpdateProject } from "@/lib/api/hooks/useProjects"
import { useStageTypeDetail } from "@/lib/api/hooks/useStages"
import { Button } from "@/shared/components/design-system/button"
import { Badge } from "@/shared/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/shared/components/ui/collapsible"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Separator } from "@/shared/components/ui/separator"
import { mapStageTypeToFormFields } from "@/shared/utils/stage-form-mapper"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import { ChevronDown, Edit, Loader2, Save, X } from "lucide-react"
import React, { useMemo, useState } from "react"
import { RegionsMultiSelect, ProvinciasMultiSelect, ComunasMultiSelect } from "@/shared/components/multi-select/geography-multi-select"
import { FormProvider, useForm, useFormContext } from "react-hook-form"
import { toast } from "sonner"
import type { ProyectoListItem } from "./project/project.types"
// Reemplazado por componentes compartidos en `src/shared/components/multi-select/geography-multi-select.tsx`
import { useQueries } from "@tanstack/react-query"
import { ProjectsService } from "@/lib/api/services/projects.service"

dayjs.extend(utc)

// Componente Item para renderizar datos de manera reutilizable
interface ItemProps {
  label: string;
  value: string | number | null | undefined;
  isDate?: boolean;
  isEditing?: boolean;
  fieldKey?: string;
  selectOptions?: { id: number; nombre: string }[];
  selectValue?: number | null;
}

const Item: React.FC<ItemProps> = ({
  label,
  value,
  isDate = false,
  isEditing = false,
  fieldKey,
  selectOptions,
  selectValue
}) => {
  const { register, setValue } = useFormContext<EditFormData>()

  if (!value && !isEditing) return null;

  const displayValue = isDate && value
    ? dayjs(value as string).utc().format('DD/MM/YYYY')
    : value?.toString() || '';

  if (isEditing && selectOptions && fieldKey) {
    return (
      <div className="flex flex-col gap-2">
        <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
        <Select
          value={selectValue?.toString() || ""}
          onValueChange={(value) => {
            setValue(fieldKey as keyof EditFormData, parseInt(value))

            // Cascada legacy removida
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Seleccionar..." />
          </SelectTrigger>
          <SelectContent>
            {selectOptions.map((option) => (
              <SelectItem key={option.id} value={option.id.toString()}>
                {option.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  if (isEditing && fieldKey) {
    return (
      <div className="flex flex-col gap-2">
        <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
        <Input
          type={isDate ? "date" : "text"}
          {...register(fieldKey as keyof EditFormData, {
            setValueAs: isDate ? (value) => {
              // Convertir fecha de formato yyyy-MM-dd a ISO string para el servidor
              if (value) {
                return new Date(value).toISOString()
              }
              return value
            } : undefined
          })}
          className="w-full"
        />
      </div>
    );
  }

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

interface EditFormData {
  tipo_iniciativa_id?: number
  tipo_obra_id?: number
  regiones_ids?: number[]
  provincias_ids?: number[]
  comunas_ids?: number[]
  volumen?: string
  presupuesto_oficial?: string
  bip?: string
  fecha_llamado_licitacion?: string
  fecha_recepcion_ofertas_tecnicas?: string
  fecha_apertura_ofertas_economicas?: string
  fecha_inicio_concesion?: string
  plazo_total_concesion?: string
  decreto_adjudicacion?: string
  sociedad_concesionaria?: string
  inspector_fiscal_id?: number
}

export const ShowStageDetailsDialog = ({
  project,
  isOpen,
  onClose,
}: ShowStageDetailsDialogProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [isEditingLocation, setIsEditingLocation] = useState(false)

  // React Hook Form
  const methods = useForm<EditFormData>()
  const { watch, setValue, reset } = methods
  const watchedFormData = watch()

  // Hook para actualizar proyecto
  const updateProjectMutation = useUpdateProject()

  if (!project) return null

  // Obtener datos del proyecto desde la API
  const { data: proyectoDetalle, isLoading: isLoadingProyecto, refetch: refetchProyecto } = useProyectoDetalle(project.id)

  // Obtener información completa de etapas (incluye etapa actual + anteriores)
  const { data: etapasInfo, isLoading: isLoadingEtapas, refetch: refetchEtapas } = useEtapaAvanzarInfo(project.id)

  // Obtener la etapa actual del proyecto
  const etapaActual = proyectoDetalle?.data?.etapas_registro?.[0]?.etapa_tipo
  const etapaActualId = etapaActual?.id

  // Obtener los campos habilitados para la etapa actual
  const { data: etapaTypeDetail, isLoading: isLoadingEtapaType } = useStageTypeDetail(etapaActualId || null)

  // Mapear los campos habilitados usando stage-form-mapper
  const mappedFields = etapaTypeDetail?.data ? mapStageTypeToFormFields(etapaTypeDetail.data) : { fields: [], hasFields: false, fieldCount: 0 }

  // Hooks para los datos de ubicación (multi-select)
  const { data: regionesData } = useRegiones()
  const regionesIds = Array.isArray(watchedFormData.regiones_ids) ? watchedFormData.regiones_ids : []
  const provinciasQueries = useQueries({
    queries: regionesIds.map((rid) => ({
      queryKey: ["provincias", rid],
      queryFn: () => ProjectsService.getProvincias(rid),
      enabled: !!rid,
      staleTime: 5 * 60 * 1000,
    })),
  })
  const provinciasList = provinciasQueries.flatMap((q) => q.data?.data || [])
  const provinciasIds = Array.isArray(watchedFormData.provincias_ids) ? watchedFormData.provincias_ids : []
  const provinciaIdToRegionId = useMemo(() => {
    const map = new Map<number, number>()
    provinciasList.forEach((p: any) => {
      const rid = p.region_id ?? p.region?.id
      if (rid) map.set(p.id, Number(rid))
    })
    return map
  }, [provinciasList])
  const comunaPairs = provinciasIds
    .map((pid) => ({ provinciaId: pid, regionId: provinciaIdToRegionId.get(pid) }))
    .filter((x) => x.regionId)
  const comunasQueries = useQueries({
    queries: comunaPairs.map(({ regionId, provinciaId }) => ({
      queryKey: ["comunas", regionId, provinciaId],
      queryFn: () => ProjectsService.getComunas(regionId as number, provinciaId as number),
      enabled: !!regionId && !!provinciaId,
      staleTime: 5 * 60 * 1000,
    })),
  })
  const comunasList = comunasQueries.flatMap((q) => q.data?.data || [])
  const { data: tiposIniciativa } = useTiposIniciativa()
  const { data: tiposObra } = useTiposObras()

  if (isLoadingProyecto || isLoadingEtapas || isLoadingEtapaType) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            <span className="ml-2 text-muted-foreground">Cargando detalles del proyecto...</span> {/* TODO: Agregas mismo loader en avanzar etapa */}
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  const proyecto = proyectoDetalle?.data

  // Render helpers
  const renderUbicacion = (etapas: any[]) => {
    const etapaActualVisual = etapas?.[0]
    const regiones = etapaActualVisual?.etapas_regiones || []
    if (!regiones || regiones.length === 0) {
      return <div className="text-sm text-muted-foreground">Sin información de ubicación</div>
    }
    return (
      <div className="space-y-3">
        {regiones.map((reg: any, ridx: number) => {
          const provincias = reg?.etapas_provincias || []
          const comunasCount = provincias.reduce((acc: number, p: any) => acc + ((p?.provincia?.etapas_comunas || []).length || 0), 0)
          return (
            <Collapsible key={`${reg.id}-${ridx}`} defaultOpen={ridx === 0} className="group border rounded p-2">
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full p-0 h-auto hover:bg-transparent focus:bg-transparent active:bg-transparent justify-start text-left"
                >
                  <div className="w-full text-left">
                    <div className="flex items-center justify-between w-full">
                      <h4 className="text-sm font-medium text-gray-800">Región de {reg?.nombre || `${reg?.id}`}</h4>
                      <ChevronDown className="w-4 h-4 text-gray-600 transition-transform duration-300 ease-out group-data-[state=open]:rotate-180" />
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 pl-0 text-left">
                      {provincias.length} provincia(s) · {comunasCount} comuna(s)
                    </div>
                  </div>
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2">
                {provincias.length === 0 ? (
                  <div className="text-xs text-muted-foreground">Sin provincias</div>
                ) : (
                  <div className="space-y-3">
                    {provincias.map((ep: any, pidx: number) => {
                      const comunas = ep?.provincia?.etapas_comunas || []
                      return (
                        <div key={`${reg.id}-prov-${pidx}`} className="rounded p-2">
                          <div className="text-sm font-medium">Provincia: {ep?.provincia?.nombre || '-'}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Comunas: {comunas.map((c: any) => c?.comuna?.nombre).filter(Boolean).join(', ') || '-'}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CollapsibleContent>
            </Collapsible>
          )
        })}
      </div>
    )
  }
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

  // Función para manejar el inicio de la edición
  const handleStartEdit = () => {
    // Inicializar los datos editados con los valores actuales de la etapa actual
    const etapaActualData = etapasParaMostrar[0] // La primera es la actual

    // Función para convertir fecha ISO a formato yyyy-MM-dd para inputs de tipo date
    const formatDateForInput = (dateString: string | null | undefined) => {
      if (!dateString) return undefined
      try {
        return dayjs(dateString).format('YYYY-MM-DD')
      } catch {
        return undefined
      }
    }

    const regiones_ids = (etapaActualData?.etapas_regiones || []).map((r: any) => r.id as number)
    const provincias_ids = (etapaActualData?.etapas_regiones || []).flatMap((r: any) => (r.etapas_provincias || []).map((p: any) => p.provincia?.id as number).filter((x: any) => !!x))
    const comunas_ids = (etapaActualData?.etapas_regiones || []).flatMap((r: any) => (r.etapas_provincias || []).flatMap((p: any) => (p.provincia?.etapas_comunas || []).map((c: any) => c.comuna?.id as number).filter((x: any) => !!x)))

    const formData = {
      tipo_iniciativa_id: etapaActualData?.tipo_iniciativa?.id,
      tipo_obra_id: etapaActualData?.tipo_obra?.id,
      regiones_ids,
      provincias_ids,
      comunas_ids,
      volumen: etapaActualData?.volumen || undefined,
      presupuesto_oficial: etapaActualData?.presupuesto_oficial || undefined,
      bip: etapaActualData?.bip || undefined,
      fecha_llamado_licitacion: formatDateForInput(etapaActualData?.fecha_llamado_licitacion),
      fecha_recepcion_ofertas_tecnicas: formatDateForInput(etapaActualData?.fecha_recepcion_ofertas_tecnicas),
      fecha_apertura_ofertas_economicas: formatDateForInput(etapaActualData?.fecha_apertura_ofertas_economicas),
      fecha_inicio_concesion: formatDateForInput(etapaActualData?.fecha_inicio_concesion),
      plazo_total_concesion: etapaActualData?.plazo_total_concesion || undefined,
      decreto_adjudicacion: etapaActualData?.decreto_adjudicacion || undefined,
      sociedad_concesionaria: etapaActualData?.sociedad_concesionaria || undefined,
      inspector_fiscal_id: etapaActualData?.inspector_fiscal?.id,
    }

    reset(formData)
    setIsEditing(true)
  }

  // Función para cancelar la edición
  const handleCancelEdit = () => {
    setIsEditing(false)
    reset({})
  }

  // Función para guardar los cambios
  const handleSaveEdit = async () => {
    try {
      // Obtener los valores originales de la etapa actual
      const etapaActualData = etapasParaMostrar[0] // La primera es la actual

      // Preparar los datos para enviar al endpoint
      const updateData: any = {}

      // Función para convertir fechas de formato YYYY-MM-DD a ISO string
      const convertDateToISO = (dateString: string | null | undefined) => {
        if (!dateString) return undefined
        try {
          return dayjs(dateString).toISOString()
        } catch {
          return undefined
        }
      }

      // Función para obtener el valor original de un campo
      const getOriginalValue = (key: string) => {
        switch (key) {
          case 'tipo_iniciativa_id':
            return etapaActualData?.tipo_iniciativa?.id
          case 'tipo_obra_id':
            return etapaActualData?.tipo_obra?.id
          // campos legacy de ubicación eliminados
          case 'volumen':
            return etapaActualData?.volumen
          case 'presupuesto_oficial':
            return etapaActualData?.presupuesto_oficial
          case 'bip':
            return etapaActualData?.bip
          case 'fecha_llamado_licitacion':
            return etapaActualData?.fecha_llamado_licitacion ? dayjs(etapaActualData.fecha_llamado_licitacion).format('YYYY-MM-DD') : undefined
          case 'fecha_recepcion_ofertas_tecnicas':
            return etapaActualData?.fecha_recepcion_ofertas_tecnicas ? dayjs(etapaActualData.fecha_recepcion_ofertas_tecnicas).format('YYYY-MM-DD') : undefined
          case 'fecha_apertura_ofertas_economicas':
            return etapaActualData?.fecha_apertura_ofertas_economicas ? dayjs(etapaActualData.fecha_apertura_ofertas_economicas).format('YYYY-MM-DD') : undefined
          case 'fecha_inicio_concesion':
            return etapaActualData?.fecha_inicio_concesion ? dayjs(etapaActualData.fecha_inicio_concesion).format('YYYY-MM-DD') : undefined
          case 'plazo_total_concesion':
            return etapaActualData?.plazo_total_concesion
          case 'decreto_adjudicacion':
            return etapaActualData?.decreto_adjudicacion
          case 'sociedad_concesionaria':
            return etapaActualData?.sociedad_concesionaria
          case 'inspector_fiscal_id':
            return etapaActualData?.inspector_fiscal?.id
          default:
            return undefined
        }
      }

      // Solo incluir campos que hayan cambiado (excluyendo ubicación legacy y arrays)
      Object.entries(watchedFormData).forEach(([key, newValue]) => {
        if (['region_id', 'provincia_id', 'comuna_id', 'regiones_ids', 'provincias_ids', 'comunas_ids'].includes(key)) return
        if (newValue !== undefined && newValue !== null && newValue !== '') {
          const originalValue = getOriginalValue(key)
          if (originalValue !== newValue) {
            if (key.includes('fecha_')) {
              const isoDate = convertDateToISO(newValue as string)
              if (isoDate) updateData[key] = isoDate
            } else {
              updateData[key] = newValue
            }
          }
        }
      })

      // Manejar regiones/provincias/comunas en formato anidado
      const selectedRegionIds = Array.isArray(watchedFormData.regiones_ids) ? watchedFormData.regiones_ids : []
      const selectedProvinciaIds = Array.isArray(watchedFormData.provincias_ids) ? watchedFormData.provincias_ids : []
      const selectedComunaIds = Array.isArray(watchedFormData.comunas_ids) ? watchedFormData.comunas_ids : []

      const provinciasAll = provinciasList
      const comunasAll = comunasList
      const provinciaIdToRegionId = new Map<number, number>()
      provinciasAll.forEach((p: any) => {
        const rid = p.region_id ?? p.region?.id
        if (rid) provinciaIdToRegionId.set(p.id, Number(rid))
      })
      const comunaIdToProvinciaId = new Map<number, number>()
      comunasAll.forEach((c: any) => {
        const pid = c.provincia_id ?? c.provincia?.id
        if (pid) comunaIdToProvinciaId.set(c.id, Number(pid))
      })

      const regionesNested = Array.from(new Set(selectedRegionIds)).map((rid) => {
        const provinciasForRegion = selectedProvinciaIds.filter((pid) => provinciaIdToRegionId.get(pid) === rid)
        const provinciasNested = Array.from(new Set(provinciasForRegion)).map((pid) => {
          const comunasForProvincia = selectedComunaIds.filter((cid) => comunaIdToProvinciaId.get(cid) === pid)
          const comunasNested = Array.from(new Set(comunasForProvincia)).map((cid) => ({ id: cid }))
          return { id: pid, comunas: comunasNested }
        })
        return { id: rid, provincias: provinciasNested }
      })

      // Comparar con valores originales de la etapa actual
      const originalRegionIds = (etapaActualData?.etapas_regiones || []).map((r: any) => r.id as number)
      const originalProvinciaIds = (etapaActualData?.etapas_regiones || []).flatMap((r: any) => (r.etapas_provincias || []).map((p: any) => p.provincia?.id as number).filter((x: any) => !!x))
      const originalComunaIds = (etapaActualData?.etapas_regiones || []).flatMap((r: any) => (r.etapas_provincias || []).flatMap((p: any) => (p.provincia?.etapas_comunas || []).map((c: any) => c.comuna?.id as number).filter((x: any) => !!x)))

      const arraysEqual = (a: number[], b: number[]) => {
        const as = [...new Set(a)].sort((x, y) => x - y)
        const bs = [...new Set(b)].sort((x, y) => x - y)
        if (as.length !== bs.length) return false
        for (let i = 0; i < as.length; i++) if (as[i] !== bs[i]) return false
        return true
      }

      const changedUbicacion = !arraysEqual(selectedRegionIds, originalRegionIds) ||
        !arraysEqual(selectedProvinciaIds, originalProvinciaIds) ||
        !arraysEqual(selectedComunaIds, originalComunaIds)

      if (changedUbicacion) {
        updateData.regiones = regionesNested
      }

      // Agregar el usuario que está realizando la actualización
      updateData.usuario_actualizador = 1 // Por ahora hardcodeado

      // Estructurar los datos dentro de etapas_registro
      const dataToSend = {
        etapas_registro: updateData
      }

      await updateProjectMutation.mutateAsync({
        projectId: project.id,
        data: dataToSend
      })

      // refrescar datos y salir de modo edición local
      await Promise.all([refetchProyecto(), refetchEtapas()])

      // Cerrar modo edición y limpiar formulario
      setIsEditing(false)
      setIsEditingLocation(false)
      reset({})
    } catch (error) {
      console.error("Error al actualizar proyecto:", error)
      toast.error("Error al actualizar el proyecto")
    }
  }


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
        <FormProvider {...methods}>
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl">{proyecto.nombre}</DialogTitle>
            </div>
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

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between w-full">
                  <CardTitle className="text-base">Información de ubicación</CardTitle>
                  {!isEditingLocation ? (
                    <Button
                      variant="secundario"
                      size="sm"
                      onClick={() => setIsEditingLocation(true)}
                      className="flex items-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Editar
                    </Button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="secundario"
                        size="sm"
                        onClick={() => setIsEditingLocation(false)}
                        className="flex items-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        Cancelar
                      </Button>
                      <Button
                        variant="primario"
                        size="sm"
                        onClick={() => handleSaveEdit()}
                        disabled={updateProjectMutation.isPending}
                        className="flex items-center gap-2"
                      >
                        {updateProjectMutation.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Save className="w-4 h-4" />
                        )}
                        {updateProjectMutation.isPending ? "Guardando..." : "Guardar"}
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {!isEditingLocation ? (
                  renderUbicacion(etapasParaMostrar)
                ) : (
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col gap-2">
                      <Label className="text-xs font-medium text-muted-foreground">Región(es)</Label>
                      <RegionsMultiSelect
                        regions={regionesData?.data || []}
                        value={watchedFormData.regiones_ids || []}
                        onChange={(next) => {
                          setValue('regiones_ids', next, { shouldValidate: true })
                          if (next.length === 0) {
                            setValue('provincias_ids', [])
                            setValue('comunas_ids', [])
                          }
                        }}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="text-xs font-medium text-muted-foreground">Provincia(s)</Label>
                      <ProvinciasMultiSelect
                        regiones={regionesData?.data || []}
                        provincias={provinciasList}
                        regionesSeleccionadas={watchedFormData.regiones_ids || []}
                        value={watchedFormData.provincias_ids || []}
                        onChange={(next) => {
                          setValue('provincias_ids', next, { shouldValidate: true })
                          if (next.length === 0) setValue('comunas_ids', [])
                        }}
                        disabled={(watchedFormData.regiones_ids || []).length === 0}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="text-xs font-medium text-muted-foreground">Comuna(s)</Label>
                      <ComunasMultiSelect
                        provincias={provinciasList}
                        comunas={comunasList}
                        provinciasSeleccionadas={watchedFormData.provincias_ids || []}
                        value={watchedFormData.comunas_ids || []}
                        onChange={(next) => setValue('comunas_ids', next, { shouldValidate: true })}
                        disabled={(watchedFormData.provincias_ids || []).length === 0}
                      />
                    </div>
                  </div>
                )}
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
                          <div className="flex items-center justify-between w-full">
                            <CollapsibleTrigger asChild>
                              <Button
                                variant="ghost"
                                className=" p-0 h-auto hover:bg-transparent focus:bg-transparent active:bg-transparent"
                              >
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
                                  <ChevronDown className="w-4 h-4 text-gray-600 transition-transform duration-300 ease-out group-data-[state=open]:rotate-180" />
                                </div>
                              </Button>
                            </CollapsibleTrigger>
                            {isEtapaActual && mappedFields.hasFields && (
                              <div className="flex items-center gap-2 flex-shrink-0">
                                {!isEditing ? (
                                  <Button
                                    variant="secundario"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleStartEdit()
                                    }}
                                    className="flex items-center gap-2"
                                  >
                                    <Edit className="w-4 h-4" />
                                    Editar
                                  </Button>
                                ) : (
                                  <div className="flex items-center gap-2">
                                    <Button
                                      variant="secundario"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleCancelEdit()
                                      }}
                                      className="flex items-center gap-2"
                                    >
                                      <X className="w-4 h-4" />
                                      Cancelar
                                    </Button>
                                    <Button
                                      variant="primario"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleSaveEdit()
                                      }}
                                      disabled={updateProjectMutation.isPending}
                                      className="flex items-center gap-2"
                                    >
                                      {updateProjectMutation.isPending ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                      ) : (
                                        <Save className="w-4 h-4" />
                                      )}
                                      {updateProjectMutation.isPending ? "Guardando..." : "Guardar"}
                                    </Button>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                          <CollapsibleContent className="transition-all duration-500 ease-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-top-4 data-[state=open]:slide-in-from-top-4">
                            <CardTitle className="text-sm ml-2 mt-4">Información de la etapa</CardTitle>  {/* TODO: AGREGAR VISUALIZACION DE REGIONES, PROVINCIAS Y COMUNAS  */}  {/* TODO: Utilizar combobox para seleccionar regiones, provincias y comunas, misma logica que al crear proyecto */}
                          </CollapsibleContent>
                        </CardHeader>

                        <CollapsibleContent>
                          <CardContent>
                            <div className="space-y-6 ml-2">
                              {/* Solo mostrar campos editables para la etapa actual cuando esté en modo edición */}
                              {isEtapaActual && isEditing ? (
                                <div className="space-y-6">
                                  {/* Sección 1: Selects principales (Tipo iniciativa y Tipo obra) - 2 columnas */}
                                  {(etapaTypeDetail?.data?.tipo_iniciativa || etapaTypeDetail?.data?.tipo_obra) && (
                                    <div className="flex flex-row gap-4 ">
                                      {etapaTypeDetail?.data?.tipo_iniciativa && (
                                        <div className="flex flex-col gap-2">
                                          <Label className="text-xs font-medium text-muted-foreground" htmlFor="tipo_iniciativa_id">Tipo de iniciativa</Label>
                                          <Select
                                            value={watchedFormData.tipo_iniciativa_id?.toString() || ""}
                                            onValueChange={(value) => setValue('tipo_iniciativa_id', parseInt(value))}
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
                                      {etapaTypeDetail?.data?.tipo_obra && (
                                        <div className="flex flex-col gap-2">
                                          <Label className="text-xs font-medium text-muted-foreground" htmlFor="tipo_obra_id">Tipo de obra</Label>
                                          <Select
                                            value={watchedFormData.tipo_obra_id?.toString() || ""}
                                            onValueChange={(value) => setValue('tipo_obra_id', parseInt(value))}
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

                                  <Separator />

                                  {/* Sección 3: Campos de texto - 3 columnas */}
                                  {(etapaTypeDetail?.data?.volumen || etapaTypeDetail?.data?.presupuesto_oficial || etapaTypeDetail?.data?.bip ||
                                    etapaTypeDetail?.data?.decreto_adjudicacion || etapaTypeDetail?.data?.plazo_total_concesion ||
                                    etapaTypeDetail?.data?.sociedad_concesionaria || etapaTypeDetail?.data?.inspector_fiscal_id) && (
                                      <div className="grid grid-cols-3 gap-4 ">
                                        {etapaTypeDetail?.data?.volumen && (
                                          <div className="flex flex-col gap-2">
                                            <Label className="text-xs font-medium text-muted-foreground" htmlFor="volumen">Volumen</Label>
                                            <Input
                                              id="volumen"
                                              {...methods.register('volumen')}
                                              placeholder="Ej: 50 km, 1000 m³"
                                              className="w-full"
                                            />
                                          </div>
                                        )}
                                        {etapaTypeDetail?.data?.presupuesto_oficial && (
                                          <div className="flex flex-col gap-2">
                                            <Label className="text-xs font-medium text-muted-foreground" htmlFor="presupuesto_oficial">Presupuesto oficial</Label>
                                            <Input
                                              id="presupuesto_oficial"
                                              {...methods.register('presupuesto_oficial')}
                                              placeholder="Ej: $50.000.000.000"
                                              className="w-full"
                                            />
                                          </div>
                                        )}
                                        {etapaTypeDetail?.data?.bip && (
                                          <div className="flex flex-col gap-2">
                                            <Label className="text-xs font-medium text-muted-foreground" htmlFor="bip">BIP</Label>
                                            <Input
                                              id="bip"
                                              {...methods.register('bip')}
                                              placeholder="Código BIP"
                                              className="w-full"
                                            />
                                          </div>
                                        )}
                                        {etapaTypeDetail?.data?.decreto_adjudicacion && (
                                          <div className="flex flex-col gap-2">
                                            <Label className="text-xs font-medium text-muted-foreground" htmlFor="decreto_adjudicacion">Decreto adjudicación</Label>
                                            <Input
                                              id="decreto_adjudicacion"
                                              {...methods.register('decreto_adjudicacion')}
                                              placeholder="Ej: Decreto N° 123/224"
                                              className="w-full"
                                            />
                                          </div>
                                        )}
                                        {etapaTypeDetail?.data?.plazo_total_concesion && (
                                          <div className="flex flex-col gap-2">
                                            <Label className="text-xs font-medium text-muted-foreground" htmlFor="plazo_total_concesion">Plazo total concesión</Label>
                                            <Input
                                              id="plazo_total_concesion"
                                              {...methods.register('plazo_total_concesion')}
                                              placeholder="Ej: 50 años"
                                              className="w-full"
                                            />
                                          </div>
                                        )}
                                        {etapaTypeDetail?.data?.sociedad_concesionaria && (
                                          <div className="flex flex-col gap-2">
                                            <Label className="text-xs font-medium text-muted-foreground" htmlFor="sociedad_concesionaria">Sociedad concesionaria</Label>
                                            <Input
                                              id="sociedad_concesionaria"
                                              {...methods.register('sociedad_concesionaria')}
                                              placeholder="Ej: Sociedad Concesionaria XYZ SPA"
                                              className="w-full"
                                            />
                                          </div>
                                        )}
                                        {etapaTypeDetail?.data?.inspector_fiscal_id && (
                                          <div className="flex flex-col gap-2">
                                            <Label className="text-xs font-medium text-muted-foreground" htmlFor="inspector_fiscal_id">Inspector fiscal</Label>
                                            <Input
                                              id="inspector_fiscal_id"
                                              {...methods.register('inspector_fiscal_id', { valueAsNumber: true })}
                                              placeholder="ID del inspector fiscal"
                                              className="w-full"
                                            />
                                          </div>
                                        )}
                                      </div>
                                    )}

                                  <Separator />

                                  {/* Sección 4: Campos de fecha - 3 columnas */}
                                  {(etapaTypeDetail?.data?.fecha_llamado_licitacion || etapaTypeDetail?.data?.fecha_recepcion_ofertas_tecnicas ||
                                    etapaTypeDetail?.data?.fecha_apertura_ofertas_economicas || etapaTypeDetail?.data?.fecha_inicio_concesion) && (
                                      <div className="grid grid-cols-3 gap-4">
                                        {etapaTypeDetail?.data?.fecha_llamado_licitacion && (
                                          <div className="flex flex-col gap-2">
                                            <Label className="text-xs font-medium text-muted-foreground" htmlFor="fecha_llamado_licitacion">Fecha llamado a licitación</Label>
                                            <Input
                                              id="fecha_llamado_licitacion"
                                              type="date"
                                              {...methods.register('fecha_llamado_licitacion')}
                                              className="w-full"
                                            />
                                          </div>
                                        )}
                                        {etapaTypeDetail?.data?.fecha_recepcion_ofertas_tecnicas && (
                                          <div className="flex flex-col gap-2">
                                            <Label className="text-xs font-medium text-muted-foreground" htmlFor="fecha_recepcion_ofertas_tecnicas">Fecha recepción ofertas técnicas</Label>
                                            <Input
                                              id="fecha_recepcion_ofertas_tecnicas"
                                              type="date"
                                              {...methods.register('fecha_recepcion_ofertas_tecnicas')}
                                              className="w-full"
                                            />
                                          </div>
                                        )}
                                        {etapaTypeDetail?.data?.fecha_apertura_ofertas_economicas && (
                                          <div className="flex flex-col gap-2">
                                            <Label className="text-xs font-medium text-muted-foreground" htmlFor="fecha_apertura_ofertas_economicas">Fecha apertura ofertas económicas</Label>
                                            <Input
                                              id="fecha_apertura_ofertas_economicas"
                                              type="date"
                                              {...methods.register('fecha_apertura_ofertas_economicas')}
                                              className="w-full"
                                            />
                                          </div>
                                        )}
                                        {etapaTypeDetail?.data?.fecha_inicio_concesion && (
                                          <div className="flex flex-col gap-2">
                                            <Label className="text-xs font-medium text-muted-foreground" htmlFor="fecha_inicio_concesion">Fecha inicio concesión</Label>
                                            <Input
                                              id="fecha_inicio_concesion"
                                              type="date"
                                              {...methods.register('fecha_inicio_concesion')}
                                              className="w-full"
                                            />
                                          </div>
                                        )}
                                      </div>
                                    )}
                                </div>
                              ) : (
                                <div className="space-y-6">
                                  {/* Sección 1: Tipo iniciativa y Tipo obra - 2 columnas */}
                                  {(etapa.tipo_iniciativa || etapa.tipo_obra) && (
                                    <div className="flex flex-row gap-4">
                                      <Item
                                        label="Tipo de iniciativa"
                                        value={etapa.tipo_iniciativa?.nombre}
                                      />
                                      <Item
                                        label="Tipo de obra"
                                        value={etapa.tipo_obra?.nombre}
                                      />
                                    </div>
                                  )}

                                  <Separator />

                                  {/* Sección 3: Campos de texto - 3 columnas */}
                                  {(etapa.volumen || etapa.presupuesto_oficial || etapa.bip ||
                                    etapa.decreto_adjudicacion || etapa.plazo_total_concesion ||
                                    etapa.sociedad_concesionaria || etapa.inspector_fiscal) && (
                                      <div className="grid grid-cols-3 gap-4">
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
                                          label="Decreto adjudicación"
                                          value={etapa.decreto_adjudicacion}
                                        />
                                        <Item
                                          label="Plazo total concesión"
                                          value={etapa.plazo_total_concesion}
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
                                    )}

                                  <Separator />

                                  {/* Sección 4: Campos de fecha - 3 columnas */}
                                  {(etapa.fecha_llamado_licitacion || etapa.fecha_recepcion_ofertas_tecnicas ||
                                    etapa.fecha_apertura_ofertas_economicas || etapa.fecha_inicio_concesion) && (
                                      <div className="grid grid-cols-3 gap-4">
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
                                      </div>
                                    )}
                                </div>
                              )}
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
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
} 