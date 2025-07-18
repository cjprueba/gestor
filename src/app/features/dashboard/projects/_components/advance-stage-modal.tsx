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
import { ChevronRight, Check, Loader2, Folder } from "lucide-react"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import clsx from "clsx"
import type { Project } from "./types"
import { useEffect, useState } from "react"
import { FolderTemplatesStep } from "./form-steps/FolderTemplatesStep"

interface AdvanceStageModalProps {
  project: Project | null
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

// Schema para validación del formulario
const advanceStageSchema = z.object({
  stepOne: z.object({
    tipo_iniciativa_id: z.number().optional(),
    tipo_obra_id: z.number().optional(),
    region_id: z.number().optional(),
    provincia_id: z.number().optional(),
    comuna_id: z.number().optional(),
    volumen: z.string().optional(),
    presupuesto_oficial: z.string().optional(),
    valor_referencia: z.string().optional(),
    bip: z.string().optional(),
    fecha_llamado_licitacion: z.string().optional(),
    fecha_recepcion_ofertas_tecnicas: z.string().optional(),
    fecha_apertura_ofertas_economicas: z.string().optional(),
    decreto_adjudicacion: z.string().optional(),
    sociedad_concesionaria: z.string().optional(),
    fecha_inicio_concesion: z.string().optional(),
    plazo_total_concesion: z.string().optional(),
    inspector_fiscal_id: z.number().optional(),
  }),
  stepTwo: z.object({
    carpetas: z.array(z.any()).optional(),
  }),
})

type AdvanceStageFormData = z.infer<typeof advanceStageSchema>

export const AdvanceStageModal: React.FC<AdvanceStageModalProps> = ({
  project,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [currentStep, setCurrentStep] = useState(1)

  // React Hook Form
  const methods = useForm<AdvanceStageFormData>({
    resolver: zodResolver(advanceStageSchema),
    defaultValues: {
      stepOne: {},
      stepTwo: {
        carpetas: [],
      },
    },
    mode: "onChange",
  })

  const { watch, setValue, reset } = methods

  // Resetear el formulario cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      reset()
      setCurrentStep(1)
    }
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

  const watchedStepOne = watch("stepOne")
  const { data: provinciasData } = useProvincias(watchedStepOne.region_id)
  const { data: comunasData } = useComunas(watchedStepOne.region_id, watchedStepOne.provincia_id)

  // Mutation para cambiar etapa
  const cambiarEtapaMutation = useCambiarEtapa()

  // Interfaz para carpetas anidadas mejorada
  interface CarpetaEstructura {
    id: string
    nombre: string
    tipo: "inicial"
    subcarpetas: CarpetaEstructura[]
    nivel: number
  }

  // Función para convertir carpetas_iniciales a estructura jerárquica
  const getCarpetasEstructura = (): CarpetaEstructura[] => {
    if (!siguienteEtapa?.carpetas_iniciales) {
      return []
    }

    const buildHierarchy = (obj: any, nivel = 0, parentId = ""): CarpetaEstructura[] => {
      return Object.entries(obj).map(([nombre, subcarpetas], index) => {
        const id = parentId ? `${parentId}-${index}` : `${index}`

        return {
          id,
          nombre,
          tipo: "inicial" as const,
          subcarpetas: subcarpetas && typeof subcarpetas === "object" && Object.keys(subcarpetas).length > 0
            ? buildHierarchy(subcarpetas, nivel + 1, id)
            : [],
          nivel
        }
      })
    }

    return buildHierarchy(siguienteEtapa.carpetas_iniciales)
  }

  // Función legacy para compatibilidad con FolderTemplatesStep
  // const getCarpetasIniciales = () => {
  //   const estructura = getCarpetasEstructura()
  //   const carpetasArray: Array<{ nombre: string; tipo: string }> = []

  //   const flattenCarpetas = (carpetas: CarpetaEstructura[], parentPath = "") => {
  //     carpetas.forEach(carpeta => {
  //       const fullPath = parentPath ? `${parentPath} > ${carpeta.nombre}` : carpeta.nombre
  //       carpetasArray.push({ nombre: fullPath, tipo: "inicial" })

  //       if (carpeta.subcarpetas.length > 0) {
  //         flattenCarpetas(carpeta.subcarpetas, fullPath)
  //       }
  //     })
  //   }

  //   flattenCarpetas(estructura)
  //   return carpetasArray
  // }

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Detalles de la nueva etapa"
      case 2:
        return "Carpetas de la etapa"
      default:
        return "Avanzar etapa"
    }
  }

  const getDialogWidth = () => {
    switch (currentStep) {
      case 1:
        return "max-w-2xl sm:max-w-2xl"
      case 2:
        return "max-w-3xl sm:max-w-3xl"
      default:
        return "max-w-2xl"
    }
  }

  // Función para validar si los campos requeridos están completos
  const validateRequiredFields = (): boolean => {
    const stepOneData = watch("stepOne")

    if (!siguienteEtapa) return false

    // Validar campos obligatorios específicos de la siguiente etapa
    if (siguienteEtapa.tipo_iniciativa && !stepOneData.tipo_iniciativa_id) {
      return false
    }

    if (siguienteEtapa.tipo_obra && !stepOneData.tipo_obra_id) {
      return false
    }

    if (siguienteEtapa.region && !stepOneData.region_id) {
      return false
    }

    if (siguienteEtapa.provincia && !stepOneData.provincia_id) {
      return false
    }

    if (siguienteEtapa.comuna && !stepOneData.comuna_id) {
      return false
    }

    return true
  }

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 1:
        // Validar campos requeridos según la siguiente etapa
        return validateRequiredFields()

      case 2:
        // Validación para carpetas - siempre permitir continuar
        // ya que las carpetas iniciales se crean automáticamente
        return true

      default:
        return false
    }
  }

  const onSubmit = async (data: AdvanceStageFormData) => {
    if (!project || !siguienteEtapa) return

    // Construir objeto con solo los campos habilitados para esta etapa
    const submitData: any = {
      etapa_tipo_id: siguienteEtapa.id,
      usuario_creador: 1, // TODO: Obtener del contexto de usuario
      inspector_fiscal_id: 1,
    }

    // Solo incluir campos que están habilitados en la siguiente etapa
    const stepOneData = data.stepOne

    if (siguienteEtapa.tipo_iniciativa && stepOneData.tipo_iniciativa_id) {
      submitData.tipo_iniciativa_id = stepOneData.tipo_iniciativa_id
    }

    if (siguienteEtapa.tipo_obra && stepOneData.tipo_obra_id) {
      submitData.tipo_obra_id = stepOneData.tipo_obra_id
    }

    if (siguienteEtapa.region && stepOneData.region_id) {
      submitData.region_id = stepOneData.region_id
    }

    if (siguienteEtapa.provincia && stepOneData.provincia_id) {
      submitData.provincia_id = stepOneData.provincia_id
    }

    if (siguienteEtapa.comuna && stepOneData.comuna_id) {
      submitData.comuna_id = stepOneData.comuna_id
    }

    if (siguienteEtapa.volumen && stepOneData.volumen) {
      submitData.volumen = stepOneData.volumen
    }

    if (siguienteEtapa.presupuesto_oficial && stepOneData.presupuesto_oficial) {
      submitData.presupuesto_oficial = stepOneData.presupuesto_oficial
    }

    if (siguienteEtapa.valor_referencia && stepOneData.valor_referencia) {
      submitData.valor_referencia = stepOneData.valor_referencia
    }

    if (siguienteEtapa.bip && stepOneData.bip) {
      submitData.bip = stepOneData.bip
    }

    // Convertir fechas a formato ISO solo si están habilitadas y tienen valor
    if (siguienteEtapa.fecha_llamado_licitacion && stepOneData.fecha_llamado_licitacion) {
      submitData.fecha_llamado_licitacion = dayjs(stepOneData.fecha_llamado_licitacion).toISOString()
    }

    if (siguienteEtapa.fecha_recepcion_ofertas_tecnicas && stepOneData.fecha_recepcion_ofertas_tecnicas) {
      submitData.fecha_recepcion_ofertas_tecnicas = dayjs(stepOneData.fecha_recepcion_ofertas_tecnicas).toISOString()
    }

    if (siguienteEtapa.fecha_apertura_ofertas_economicas && stepOneData.fecha_apertura_ofertas_economicas) {
      submitData.fecha_apertura_ofertas_economicas = dayjs(stepOneData.fecha_apertura_ofertas_economicas).toISOString()
    }

    if (siguienteEtapa.decreto_adjudicacion && stepOneData.decreto_adjudicacion) {
      submitData.decreto_adjudicacion = stepOneData.decreto_adjudicacion
    }

    if (siguienteEtapa.sociedad_concesionaria && stepOneData.sociedad_concesionaria) {
      submitData.sociedad_concesionaria = stepOneData.sociedad_concesionaria
    }

    if (siguienteEtapa.fecha_inicio_concesion && stepOneData.fecha_inicio_concesion) {
      submitData.fecha_inicio_concesion = dayjs(stepOneData.fecha_inicio_concesion).toISOString()
    }

    if (siguienteEtapa.plazo_total_concesion && stepOneData.plazo_total_concesion) {
      submitData.plazo_total_concesion = stepOneData.plazo_total_concesion
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

  const handleCloseDialog = () => {
    reset()
    setCurrentStep(1)
    onClose()
  }

  const handleAdvanceStage = async () => {
    // Validar campos requeridos antes de enviar
    if (!validateRequiredFields()) {
      console.error("Campos requeridos faltantes")
      return
    }

    const formData = methods.getValues()
    await onSubmit(formData)
  }

  // Renderizar campos de la siguiente etapa con react-hook-form
  const renderSiguienteEtapaFields = () => {
    if (!mappedFields.hasFields) return null
    return (
      <form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col gap-6">
        {/* Fila de selects principales */}
        <div className="flex flex-row gap-4 mt-2">
          {siguienteEtapa?.tipo_iniciativa && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="tipo_iniciativa_id">Tipo de iniciativa</Label>
              <Select
                value={watchedStepOne.tipo_iniciativa_id?.toString() || ""}
                onValueChange={(value) => setValue('stepOne.tipo_iniciativa_id', parseInt(value))}
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
                value={watchedStepOne.tipo_obra_id?.toString() || ""}
                onValueChange={(value) => setValue('stepOne.tipo_obra_id', parseInt(value))}
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
                value={watchedStepOne.region_id?.toString() || ""}
                onValueChange={(value) => {
                  setValue('stepOne.region_id', parseInt(value))
                  setValue('stepOne.provincia_id', undefined)
                  setValue('stepOne.comuna_id', undefined)
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
                value={watchedStepOne.provincia_id?.toString() || ""}
                onValueChange={(value) => {
                  setValue('stepOne.provincia_id', parseInt(value))
                  setValue('stepOne.comuna_id', undefined)
                }}
                disabled={!watchedStepOne.region_id}
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
                value={watchedStepOne.comuna_id?.toString() || ""}
                onValueChange={(value) => setValue('stepOne.comuna_id', parseInt(value))}
                disabled={!watchedStepOne.provincia_id}
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
                {...methods.register('stepOne.volumen')}
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
                {...methods.register('stepOne.presupuesto_oficial')}
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
              {...methods.register('stepOne.bip')}
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
              {...methods.register('stepOne.fecha_llamado_licitacion')}
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
              {...methods.register('stepOne.fecha_recepcion_ofertas_tecnicas')}
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
              {...methods.register('stepOne.fecha_apertura_ofertas_economicas')}
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
              {...methods.register('stepOne.fecha_inicio_concesion')}
              className="max-w-3xs"
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
              className="max-w-3xs"
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
              className="max-w-3xs"
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
              className="max-w-3xs"
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

  // Componente para renderizar carpetas anidadas de manera visual
  const CarpetasAnidadasDisplay: React.FC<{ carpetas: CarpetaEstructura[] }> = ({ carpetas }) => {
    const renderCarpeta = (carpeta: CarpetaEstructura) => (
      <div key={carpeta.id} className="relative">
        {/* Carpeta principal */}
        <div className={`flex items-center space-x-3 p-3 border rounded-lg bg-gray-50 ${carpeta.nivel > 0 ? 'ml-6' : ''}`}>
          <div className="flex items-center space-x-2 flex-1">
            <div className="w-4 h-4 bg-blue-100 rounded flex items-center justify-center">
              <Folder className="w-3 h-3 text-blue-600" />
            </div>
            <span className="text-sm font-medium">{carpeta.nombre}</span>
          </div>
          <Badge variant="outline" className="text-xs">
            {carpeta.nivel === 0 ? 'Principal' : 'Subcarpeta'}
          </Badge>
        </div>

        {/* Líneas de conexión para subcarpetas */}
        {carpeta.subcarpetas.length > 0 && (
          <div className="relative">
            {/* Línea vertical */}
            <div className={`absolute left-3 top-0 bottom-0 w-px bg-gray-300 ${carpeta.nivel > 0 ? 'ml-6' : ''}`} />

            {/* Subcarpetas */}
            <div className="mt-2 space-y-2">
              {carpeta.subcarpetas.map((subcarpeta) => (
                <div key={subcarpeta.id} className="relative">
                  {/* Línea horizontal */}
                  <div className={`absolute left-3 top-5 w-4 h-px bg-gray-300 ${carpeta.nivel > 0 ? 'ml-6' : ''}`} />
                  {renderCarpeta(subcarpeta)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )

    return (
      <div className="space-y-3">
        {carpetas.map((carpeta) => renderCarpeta(carpeta))}
      </div>
    )
  }

  // Usar directamente FolderTemplatesStep para mantener consistencia visual

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
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
        )
      case 2:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Carpetas de la nueva etapa</span>
              {etapaAvanzarInfo?.data?.siguiente_etapa?.nombre && (
                <Badge variant="secondary" className="ml-2">
                  {etapaAvanzarInfo.data.siguiente_etapa.nombre}
                </Badge>
              )}
            </div>

            <div className="text-sm text-muted-foreground">
              Las siguientes carpetas se crearán automáticamente según la configuración de la nueva etapa.
            </div>

            {/* Mostrar carpetas iniciales con estructura jerárquica */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-900">Carpetas incluidas automáticamente:</h4>
              <CarpetasAnidadasDisplay carpetas={getCarpetasEstructura()} />
            </div>

            {/* Separador */}
            <div className="border-t"></div>

            {/* Sección para carpetas personalizadas */}
            <div className="space-y-4">

              <FolderTemplatesStep carpetasIniciales={[]} />
            </div>
          </div>
        )
      default:
        return null
    }
  }

  if (!project) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleCloseDialog}>
      <DialogContent className={`${getDialogWidth()} max-h-[90vh] overflow-y-auto`}>
        <DialogHeader className="flex flex-col justify-between">
          <DialogTitle className="flex items-center space-x-2">
            <span>{getStepTitle()}</span>
            <Badge variant="outline">Paso {currentStep} de 2</Badge>
          </DialogTitle>
          <DialogDescription>
            <div className="text-sm text-muted-foreground">
              {project?.name && (
                <span className="font-medium block mb-2">Proyecto: {project.name}</span>
              )}
              {currentStep === 1 && "Completa los campos requeridos para la nueva etapa"}
              {currentStep === 2 && "Revisa y configura las carpetas de la nueva etapa"}
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-center items-center w-full my-6">
          {[1, 2].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={clsx(
                  "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium border-2",
                  step < currentStep && "bg-primary-500 border-primary-500 text-white",
                  step === currentStep && "bg-primary-500 border-primary-500 text-white",
                  step > currentStep && "bg-primary-100 border-primary-100 text-white"
                )}
              >
                {step < currentStep ? (
                  <Check className="h-5 w-5" />
                ) : (
                  step
                )}
              </div>
              {step !== 2 && (
                <div
                  className={clsx(
                    "w-20 h-0.5 mx-2",
                    step < currentStep && "bg-blue-600",
                    step === currentStep && "bg-blue-600",
                    step > currentStep && "bg-gray-200"
                  )}
                />
              )}
            </div>
          ))}
        </div>

        <FormProvider {...methods}>
          <div className="space-y-6">{renderStepContent()}</div>
        </FormProvider>

        {/* Información de etapas anteriores - solo mostrar en el paso 1 */}
        {currentStep === 1 && (
          <>
            <Separator />
            {renderEtapasAnteriores()}
          </>
        )}

        <div className="flex justify-between pt-6 border-t">
          <Button
            variant="secundario"
            onClick={() => {
              if (currentStep > 1) {
                setCurrentStep(currentStep - 1);
              } else {
                handleCloseDialog();
              }
            }}
          >
            {currentStep > 1 ? "Anterior" : "Cancelar"}
          </Button>

          <div className="flex space-x-2">
            {currentStep < 2 ? (
              <Button
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={!canProceedToNextStep()}
              >
                Siguiente
              </Button>
            ) : (
              <Button
                onClick={handleAdvanceStage}
                className="w-full"
                disabled={cambiarEtapaMutation.isPending || !canProceedToNextStep()}
              >
                {cambiarEtapaMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Avanzando etapa...
                  </>
                ) : (
                  "Avanzar etapa"
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 