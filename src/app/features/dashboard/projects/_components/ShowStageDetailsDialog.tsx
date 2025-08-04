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
import { useComunas, useProvincias, useRegiones, useTiposIniciativa, useTiposObras } from "@/lib/api"
import { mapStageTypeToFormFields } from "@/shared/utils/stage-form-mapper"
import dayjs from "dayjs"
import { ChevronDown, Edit, Loader2, Save, X } from "lucide-react"
import React, { useState } from "react"
import { useForm, FormProvider, useFormContext } from "react-hook-form"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"
import type { ProyectoListItem } from "./project/project.types"

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
    ? dayjs(value as string).format('DD/MM/YYYY')
    : value?.toString() || '';

  if (isEditing && selectOptions && fieldKey) {
    return (
      <div className="flex flex-col gap-2">
        <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
        <Select
          value={selectValue?.toString() || ""}
          onValueChange={(value) => {
            setValue(fieldKey as keyof EditFormData, parseInt(value))

            // Manejar cascada para ubicación
            if (fieldKey === 'region_id') {
              setValue('provincia_id', undefined)
              setValue('comuna_id', undefined)
            } else if (fieldKey === 'provincia_id') {
              setValue('comuna_id', undefined)
            }
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
  region_id?: number
  provincia_id?: number
  comuna_id?: number
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
  const queryClient = useQueryClient()

  // React Hook Form
  const methods = useForm<EditFormData>()
  const { watch, setValue, reset } = methods
  const watchedFormData = watch()

  // Hook para actualizar proyecto
  const updateProjectMutation = useUpdateProject()

  if (!project) return null

  // Obtener datos del proyecto desde la API
  const { data: proyectoDetalle, isLoading: isLoadingProyecto } = useProyectoDetalle(project.id)

  // Obtener información completa de etapas (incluye etapa actual + anteriores)
  const { data: etapasInfo, isLoading: isLoadingEtapas } = useEtapaAvanzarInfo(project.id)

  // Obtener la etapa actual del proyecto
  const etapaActual = proyectoDetalle?.data?.etapas_registro?.[0]?.etapa_tipo
  const etapaActualId = etapaActual?.id

  // Obtener los campos habilitados para la etapa actual
  const { data: etapaTypeDetail, isLoading: isLoadingEtapaType } = useStageTypeDetail(etapaActualId || null)

  // Mapear los campos habilitados usando stage-form-mapper
  const mappedFields = etapaTypeDetail?.data ? mapStageTypeToFormFields(etapaTypeDetail.data) : { fields: [], hasFields: false, fieldCount: 0 }

  // Hooks para los datos de los selects
  const { data: regionesData } = useRegiones()
  const { data: provinciasData } = useProvincias(watchedFormData.region_id)
  const { data: comunasData } = useComunas(watchedFormData.region_id, watchedFormData.provincia_id)
  const { data: tiposIniciativa } = useTiposIniciativa()
  const { data: tiposObra } = useTiposObras()

  if (isLoadingProyecto || isLoadingEtapas || isLoadingEtapaType) {
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

    const formData = {
      tipo_iniciativa_id: etapaActualData?.tipo_iniciativa?.id,
      tipo_obra_id: etapaActualData?.tipo_obra?.id,
      region_id: etapaActualData?.region?.id,
      provincia_id: etapaActualData?.provincia?.id,
      comuna_id: etapaActualData?.comuna?.id,
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
          case 'region_id':
            return etapaActualData?.region?.id
          case 'provincia_id':
            return etapaActualData?.provincia?.id
          case 'comuna_id':
            return etapaActualData?.comuna?.id
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

      // Solo incluir campos que hayan cambiado
      Object.entries(watchedFormData).forEach(([key, newValue]) => {
        if (newValue !== undefined && newValue !== null && newValue !== '') {
          const originalValue = getOriginalValue(key)

          // Solo incluir si el valor cambió
          if (originalValue !== newValue) {
            // Convertir fechas a formato ISO
            if (key.includes('fecha_')) {
              const isoDate = convertDateToISO(newValue as string)
              if (isoDate) {
                updateData[key] = isoDate
              }
            } else {
              updateData[key] = newValue
            }
          }
        }
      })

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

      // Invalidar las queries para refrescar los datos
      await queryClient.invalidateQueries({ queryKey: ["proyecto", project.id] })
      await queryClient.invalidateQueries({ queryKey: ["etapa-avanzar-info", project.id] })
      await queryClient.invalidateQueries({ queryKey: ["proyectos"] })

      // Cerrar modo edición y limpiar formulario
      setIsEditing(false)
      reset({})

      // Mostrar mensaje de éxito
      toast.success("Proyecto actualizado exitosamente")
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
                            <CardTitle className="text-sm ml-2 mt-4">Información de la etapa</CardTitle>
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
                                          >
                                            <SelectTrigger className="w-40">
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
                                  {(etapaTypeDetail?.data?.region || etapaTypeDetail?.data?.provincia || etapaTypeDetail?.data?.comuna) && (
                                    <div className="grid grid-cols-3 gap-4">
                                      {etapaTypeDetail?.data?.region && (
                                        <div className="flex flex-col gap-2">
                                          <Label className="text-xs font-medium text-muted-foreground" htmlFor="region_id">Región</Label>
                                          <Select
                                            value={watchedFormData.region_id?.toString() || ""}
                                            onValueChange={(value) => {
                                              setValue('region_id', parseInt(value))
                                              setValue('provincia_id', undefined)
                                              setValue('comuna_id', undefined)
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
                                      {etapaTypeDetail?.data?.provincia && (
                                        <div className="flex flex-col gap-2">
                                          <Label className="text-xs font-medium text-muted-foreground" htmlFor="provincia_id">Provincia</Label>
                                          <Select
                                            value={watchedFormData.provincia_id?.toString() || ""}
                                            onValueChange={(value) => {
                                              setValue('provincia_id', parseInt(value))
                                              setValue('comuna_id', undefined)
                                            }}
                                            disabled={!watchedFormData.region_id}
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
                                      {etapaTypeDetail?.data?.comuna && (
                                        <div className="flex flex-col gap-2">
                                          <Label className="text-xs font-medium text-muted-foreground" htmlFor="comuna_id">Comuna</Label>
                                          <Select
                                            value={watchedFormData.comuna_id?.toString() || ""}
                                            onValueChange={(value) => setValue('comuna_id', parseInt(value))}
                                            disabled={!watchedFormData.provincia_id}
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
                                            <Label className="text-xs font-medium text-muted-foreground" htmlFor="decreto_adjudicacion">Decreto Adjudicación</Label>
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
                                            <Label className="text-xs font-medium text-muted-foreground" htmlFor="plazo_total_concesion">Plazo Total Concesión</Label>
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
                                            <Label className="text-xs font-medium text-muted-foreground" htmlFor="sociedad_concesionaria">Sociedad Concesionaria</Label>
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
                                            <Label className="text-xs font-medium text-muted-foreground" htmlFor="inspector_fiscal_id">Inspector Fiscal</Label>
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
                                            <Label className="text-xs font-medium text-muted-foreground" htmlFor="fecha_recepcion_ofertas_tecnicas">Fecha Recepción Ofertas Técnicas</Label>
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
                                            <Label className="text-xs font-medium text-muted-foreground" htmlFor="fecha_apertura_ofertas_economicas">Fecha Apertura Ofertas Económicas</Label>
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
                                            <Label className="text-xs font-medium text-muted-foreground" htmlFor="fecha_inicio_concesion">Fecha Inicio Concesión</Label>
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

                                  {/* Sección 2: Ubicación - 3 columnas */}
                                  {(etapa.region || etapa.provincia || etapa.comuna) && (
                                    <div className="grid grid-cols-3 gap-4">
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