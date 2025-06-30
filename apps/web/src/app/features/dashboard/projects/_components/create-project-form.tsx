import { Button } from "@/shared/components/design-system/button"
import { Badge } from "@/shared/components/ui/badge"
import { Checkbox } from "@/shared/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import {
  COMUNAS,
  ETAPAS,
  PLANTILLAS_CARPETAS,
  PROVINCIAS,
  REGIONES,
  ROLES_INSPECTOR,
  TIPOS_INICIATIVA,
  TIPOS_OBRA,
} from "@/shared/data/project-data"
import { AlertTriangle, CalendarDays, Folder, FolderIcon, Loader2, Plus } from "lucide-react"
import { useEffect, useState } from "react"

interface ProjectFormData {
  // Campos básicos
  nombre: string
  etapa: string
  descripcion?: string

  // Campos comunes
  tipoIniciativa?: string
  tipoObra?: string
  region?: string
  provincia?: string
  comuna?: string
  volumen?: string
  presupuestoOficial?: string

  // Fechas específicas por etapa
  llamadoLicitacion?: string
  plazoConcesion?: string
  fechaLlamadoLicitacion?: string
  fechaRecepcionOfertas?: string
  fechaAperturaOfertas?: string

  // Campos de concesiones
  decretoAdjudicacion?: string
  sociedadConcesionaria?: string
  inicioPlazoConcesion?: string
  plazoTotalConcesion?: string
  inspectorFiscal?: string

  // Campos específicos
  valorReferencia?: string

  // Alertas del proyecto
  alertaFechaLimite?: string
  alertaDescripcion?: string
}

interface CreateProjectFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (projectData: ProjectFormData, selectedFolders: string[], folderConfigs: Record<string, any>) => void
}

export default function CreateProjectForm({ isOpen, onClose, onSubmit }: CreateProjectFormProps) {
  const [formData, setFormData] = useState<ProjectFormData>({
    nombre: "",
    etapa: "",
    descripcion: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)

  // Estados para cascadas de ubicación
  const [provinciasDisponibles, setProvinciasDisponibles] = useState<Array<{ id: string; nombre: string }>>([])
  const [comunasDisponibles, setComunasDisponibles] = useState<Array<{ id: string; nombre: string }>>([])

  // Estados para plantillas de carpetas
  const [selectedFolders, setSelectedFolders] = useState<string[]>([])
  const [folderConfigs, setFolderConfigs] = useState<Record<string, any>>({})
  const [showFolderTemplates, setShowFolderTemplates] = useState(true)
  const [useCustomTemplates, setUseCustomTemplates] = useState(false)

  // Efecto para actualizar provincias cuando cambia la región
  useEffect(() => {
    if (formData.region) {
      const provincias = PROVINCIAS[formData.region] || []
      setProvinciasDisponibles(provincias)
      setFormData((prev) => ({ ...prev, provincia: "", comuna: "" }))
      setComunasDisponibles([])
    }
  }, [formData.region])

  // Efecto para actualizar comunas cuando cambia la provincia
  useEffect(() => {
    if (formData.provincia) {
      const comunas = COMUNAS[formData.provincia] || []
      setComunasDisponibles(comunas)
      setFormData((prev) => ({ ...prev, comuna: "" }))
    }
  }, [formData.provincia])

  // Efecto para inicializar carpetas cuando cambia la etapa
  useEffect(() => {
    if (formData.etapa) {
      // Aquí cargarías los templates desde tu estado global o API
      // Por ahora usamos los templates por defecto
      const carpetasEtapa = PLANTILLAS_CARPETAS[formData.etapa as keyof typeof PLANTILLAS_CARPETAS] || []

      if (!useCustomTemplates) {
        setSelectedFolders([...carpetasEtapa])
        const configs = carpetasEtapa.reduce(
          (acc, folder) => ({
            ...acc,
            [folder]: { minDocs: 3, daysLimit: 30 },
          }),
          {},
        )
        setFolderConfigs(configs)
      }
    }
  }, [formData.etapa, useCustomTemplates])

  const updateFormData = (field: keyof ProjectFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Limpiar error del campo cuando se actualiza
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Validaciones básicas
    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre del proyecto es obligatorio"
    }

    if (!formData.etapa) {
      newErrors.etapa = "Debe seleccionar una etapa"
    }

    // Validaciones específicas por etapa
    if (formData.etapa && formData.etapa !== "Cartera de proyectos") {
      if (!formData.tipoIniciativa) {
        newErrors.tipoIniciativa = "Tipo de iniciativa es obligatorio"
      }

      if (!formData.tipoObra) {
        newErrors.tipoObra = "Tipo de obra es obligatorio"
      }

      if (!formData.region) {
        newErrors.region = "Región es obligatoria"
      }

      if (!formData.provincia) {
        newErrors.provincia = "Provincia es obligatoria"
      }

      if (!formData.comuna) {
        newErrors.comuna = "Comuna es obligatoria"
      }
    }

    // Validaciones de fechas
    const dateFields = [
      "fechaLlamadoLicitacion",
      "fechaRecepcionOfertas",
      "fechaAperturaOfertas",
      "inicioPlazoConcesion",
      "alertaFechaLimite",
    ]
    dateFields.forEach((field) => {
      const value = formData[field as keyof ProjectFormData]
      if (value && !isValidDate(value)) {
        newErrors[field] = "Formato de fecha inválido (dd-mm-yyyy)"
      }
    })

    // Validación de año
    if (formData.llamadoLicitacion && !isValidYear(formData.llamadoLicitacion)) {
      newErrors.llamadoLicitacion = "Formato de año inválido (YYYY)"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isValidDate = (dateString: string): boolean => {
    const regex = /^\d{2}-\d{2}-\d{4}$/
    if (!regex.test(dateString)) return false

    const [day, month, year] = dateString.split("-").map(Number)
    const date = new Date(year, month - 1, day)
    return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day
  }

  const isValidYear = (yearString: string): boolean => {
    const regex = /^\d{4}$/
    return regex.test(yearString)
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsLoading(true)
    try {
      // Simular delay de creación
      await new Promise((resolve) => setTimeout(resolve, 1500))
      onSubmit(formData, selectedFolders, folderConfigs)
      onClose()
      // Reset form
      setFormData({ nombre: "", etapa: "", descripcion: "" })
      setCurrentStep(1)
    } catch (error) {
      console.error("Error creating project:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderBasicInfo()
      case 2:
        return renderStageSpecificFields()
      case 3:
        return renderFolderTemplates()
      case 4:
        return renderProjectAlerts()
      default:
        return renderBasicInfo()
    }
  }

  const renderBasicInfo = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="nombre">Nombre del Proyecto *</Label>
        <Input
          id="nombre"
          value={formData.nombre}
          onChange={(e) => updateFormData("nombre", e.target.value)}
          placeholder="Ej: Autopista Central Norte"
          className={errors.nombre ? "border-red-500" : ""}
        />
        {errors.nombre && <p className="text-sm text-red-500 mt-1">{errors.nombre}</p>}
      </div>

      <div>
        <Label htmlFor="etapa">Etapa del Proyecto *</Label>
        <Select value={formData.etapa} onValueChange={(value) => updateFormData("etapa", value)}>
          <SelectTrigger className={errors.etapa ? "border-red-500" : ""}>
            <SelectValue placeholder="Seleccionar etapa..." />
          </SelectTrigger>
          <SelectContent>
            {ETAPAS.map((etapa) => (
              <SelectItem key={etapa} value={etapa}>
                {etapa}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.etapa && <p className="text-sm text-red-500 mt-1">{errors.etapa}</p>}
      </div>

      {/* <div>
        <Label htmlFor="descripcion">Descripción (Opcional)</Label>
        <Textarea
          id="descripcion"
          value={formData.descripcion || ""}
          onChange={(e) => updateFormData("descripcion", e.target.value)}
          placeholder="Breve descripción del proyecto..."
          rows={3}
        />
      </div> */}
    </div>
  )

  const renderStageSpecificFields = () => {
    if (!formData.etapa) return null

    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2 mb-4">
          <Badge variant="outline">{formData.etapa}</Badge>
          <span className="text-sm text-muted-foreground">Campos específicos para esta etapa</span>
        </div>

        {renderCommonFields()}
        {renderStageSpecificFieldsByType()}
      </div>
    )
  }

  const renderCommonFields = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="tipoIniciativa">Tipo de Iniciativa *</Label>
          <Select
            value={formData.tipoIniciativa || ""}
            onValueChange={(value) => updateFormData("tipoIniciativa", value)}
          >
            <SelectTrigger className={errors.tipoIniciativa ? "border-red-500" : ""}>
              <SelectValue placeholder="Seleccionar..." />
            </SelectTrigger>
            <SelectContent>
              {TIPOS_INICIATIVA.map((tipo) => (
                <SelectItem key={tipo} value={tipo}>
                  {tipo}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.tipoIniciativa && <p className="text-sm text-red-500 mt-1">{errors.tipoIniciativa}</p>}
        </div>

        <div>
          <Label htmlFor="tipoObra">Tipo de Obra *</Label>
          <Select value={formData.tipoObra || ""} onValueChange={(value) => updateFormData("tipoObra", value)}>
            <SelectTrigger className={errors.tipoObra ? "border-red-500" : ""}>
              <SelectValue placeholder="Seleccionar..." />
            </SelectTrigger>
            <SelectContent>
              {(TIPOS_OBRA[formData.etapa as keyof typeof TIPOS_OBRA] || []).map((tipo) => (
                <SelectItem key={tipo} value={tipo}>
                  {tipo}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.tipoObra && <p className="text-sm text-red-500 mt-1">{errors.tipoObra}</p>}
        </div>
      </div>

      {/* Cascada de ubicación */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="region">Región *</Label>
          <Select value={formData.region || ""} onValueChange={(value) => updateFormData("region", value)}>
            <SelectTrigger className={errors.region ? "border-red-500" : ""}>
              <SelectValue placeholder="Seleccionar región..." />
            </SelectTrigger>
            <SelectContent>
              {REGIONES.map((region) => (
                <SelectItem key={region.id} value={region.id}>
                  {region.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.region && <p className="text-sm text-red-500 mt-1">{errors.region}</p>}
        </div>

        <div>
          <Label htmlFor="provincia">Provincia *</Label>
          <Select
            value={formData.provincia || ""}
            onValueChange={(value) => updateFormData("provincia", value)}
            disabled={!formData.region}
          >
            <SelectTrigger className={errors.provincia ? "border-red-500" : ""}>
              <SelectValue placeholder="Seleccionar provincia..." />
            </SelectTrigger>
            <SelectContent>
              {provinciasDisponibles.map((provincia) => (
                <SelectItem key={provincia.id} value={provincia.id}>
                  {provincia.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.provincia && <p className="text-sm text-red-500 mt-1">{errors.provincia}</p>}
        </div>

        <div>
          <Label htmlFor="comuna">Comuna *</Label>
          <Select
            value={formData.comuna || ""}
            onValueChange={(value) => updateFormData("comuna", value)}
            disabled={!formData.provincia}
          >
            <SelectTrigger className={errors.comuna ? "border-red-500" : ""}>
              <SelectValue placeholder="Seleccionar comuna..." />
            </SelectTrigger>
            <SelectContent>
              {comunasDisponibles.map((comuna) => (
                <SelectItem key={comuna.id} value={comuna.id}>
                  {comuna.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.comuna && <p className="text-sm text-red-500 mt-1">{errors.comuna}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="volumen">Volumen</Label>
          <Input
            id="volumen"
            value={formData.volumen || ""}
            onChange={(e) => updateFormData("volumen", e.target.value)}
            placeholder="Ej: 50 km, 1000 m³"
          />
        </div>

        <div>
          <Label htmlFor="presupuestoOficial">Presupuesto Oficial</Label>
          <Input
            id="presupuestoOficial"
            value={formData.presupuestoOficial || ""}
            onChange={(e) => updateFormData("presupuestoOficial", e.target.value)}
            placeholder="Ej: $50.000.000.000"
          />
        </div>
      </div>
    </>
  )

  const renderStageSpecificFieldsByType = () => {
    switch (formData.etapa) {
      case "Cartera de proyectos":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="llamadoLicitacion">Llamado a Licitación (Año)</Label>
              <Input
                id="llamadoLicitacion"
                value={formData.llamadoLicitacion || ""}
                onChange={(e) => updateFormData("llamadoLicitacion", e.target.value)}
                placeholder="YYYY"
                maxLength={4}
                className={errors.llamadoLicitacion ? "border-red-500" : ""}
              />
              {errors.llamadoLicitacion && <p className="text-sm text-red-500 mt-1">{errors.llamadoLicitacion}</p>}
            </div>

            <div>
              <Label htmlFor="plazoConcesion">Plazo de la Concesión</Label>
              <Input
                id="plazoConcesion"
                value={formData.plazoConcesion || ""}
                onChange={(e) => updateFormData("plazoConcesion", e.target.value)}
                placeholder="dd-mm-yyyy"
                className={errors.plazoConcesion ? "border-red-500" : ""}
              />
              {errors.plazoConcesion && <p className="text-sm text-red-500 mt-1">{errors.plazoConcesion}</p>}
            </div>
          </div>
        )

      case "Proyectos en Licitación":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fechaLlamadoLicitacion">Fecha de Llamado a Licitación</Label>
              <Input
                id="fechaLlamadoLicitacion"
                value={formData.fechaLlamadoLicitacion || ""}
                onChange={(e) => updateFormData("fechaLlamadoLicitacion", e.target.value)}
                placeholder="dd-mm-yyyy"
                className={errors.fechaLlamadoLicitacion ? "border-red-500" : ""}
              />
              {errors.fechaLlamadoLicitacion && (
                <p className="text-sm text-red-500 mt-1">{errors.fechaLlamadoLicitacion}</p>
              )}
            </div>

            <div>
              <Label htmlFor="fechaRecepcionOfertas">Fecha de Recepción de Ofertas</Label>
              <Input
                id="fechaRecepcionOfertas"
                value={formData.fechaRecepcionOfertas || ""}
                onChange={(e) => updateFormData("fechaRecepcionOfertas", e.target.value)}
                placeholder="dd-mm-yyyy"
                className={errors.fechaRecepcionOfertas ? "border-red-500" : ""}
              />
              {errors.fechaRecepcionOfertas && (
                <p className="text-sm text-red-500 mt-1">{errors.fechaRecepcionOfertas}</p>
              )}
            </div>

            <div>
              <Label htmlFor="fechaAperturaOfertas">Fecha de Apertura de Ofertas Económicas</Label>
              <Input
                id="fechaAperturaOfertas"
                value={formData.fechaAperturaOfertas || ""}
                onChange={(e) => updateFormData("fechaAperturaOfertas", e.target.value)}
                placeholder="dd-mm-yyyy"
                className={errors.fechaAperturaOfertas ? "border-red-500" : ""}
              />
              {errors.fechaAperturaOfertas && (
                <p className="text-sm text-red-500 mt-1">{errors.fechaAperturaOfertas}</p>
              )}
            </div>
          </div>
        )

      case "Concesiones en Operación":
      case "Concesiones en Construcción":
      case "Concesiones en Operación y Construcción":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fechaLlamadoLicitacion">Fecha de Llamado a Licitación</Label>
                <Input
                  id="fechaLlamadoLicitacion"
                  value={formData.fechaLlamadoLicitacion || ""}
                  onChange={(e) => updateFormData("fechaLlamadoLicitacion", e.target.value)}
                  placeholder="dd-mm-yyyy"
                  className={errors.fechaLlamadoLicitacion ? "border-red-500" : ""}
                />
                {errors.fechaLlamadoLicitacion && (
                  <p className="text-sm text-red-500 mt-1">{errors.fechaLlamadoLicitacion}</p>
                )}
              </div>

              <div>
                <Label htmlFor="fechaRecepcionOfertas">Fecha de Recepción de Ofertas</Label>
                <Input
                  id="fechaRecepcionOfertas"
                  value={formData.fechaRecepcionOfertas || ""}
                  onChange={(e) => updateFormData("fechaRecepcionOfertas", e.target.value)}
                  placeholder="dd-mm-yyyy"
                  className={errors.fechaRecepcionOfertas ? "border-red-500" : ""}
                />
                {errors.fechaRecepcionOfertas && (
                  <p className="text-sm text-red-500 mt-1">{errors.fechaRecepcionOfertas}</p>
                )}
              </div>

              <div>
                <Label htmlFor="fechaAperturaOfertas">Fecha de Apertura de Ofertas</Label>
                <Input
                  id="fechaAperturaOfertas"
                  value={formData.fechaAperturaOfertas || ""}
                  onChange={(e) => updateFormData("fechaAperturaOfertas", e.target.value)}
                  placeholder="dd-mm-yyyy"
                  className={errors.fechaAperturaOfertas ? "border-red-500" : ""}
                />
                {errors.fechaAperturaOfertas && (
                  <p className="text-sm text-red-500 mt-1">{errors.fechaAperturaOfertas}</p>
                )}
              </div>

              <div>
                <Label htmlFor="decretoAdjudicacion">Decreto de Adjudicación</Label>
                <Input
                  id="decretoAdjudicacion"
                  value={formData.decretoAdjudicacion || ""}
                  onChange={(e) => updateFormData("decretoAdjudicacion", e.target.value)}
                  placeholder="Número de decreto"
                />
              </div>

              <div>
                <Label htmlFor="sociedadConcesionaria">Sociedad Concesionaria</Label>
                <Input
                  id="sociedadConcesionaria"
                  value={formData.sociedadConcesionaria || ""}
                  onChange={(e) => updateFormData("sociedadConcesionaria", e.target.value)}
                  placeholder="Nombre de la sociedad"
                />
              </div>

              <div>
                <Label htmlFor="inicioPlazoConcesion">Inicio de Plazo de Concesión</Label>
                <Input
                  id="inicioPlazoConcesion"
                  value={formData.inicioPlazoConcesion || ""}
                  onChange={(e) => updateFormData("inicioPlazoConcesion", e.target.value)}
                  placeholder="dd-mm-yyyy"
                  className={errors.inicioPlazoConcesion ? "border-red-500" : ""}
                />
                {errors.inicioPlazoConcesion && (
                  <p className="text-sm text-red-500 mt-1">{errors.inicioPlazoConcesion}</p>
                )}
              </div>

              <div>
                <Label htmlFor="plazoTotalConcesion">Plazo Total de la Concesión</Label>
                <Input
                  id="plazoTotalConcesion"
                  value={formData.plazoTotalConcesion || ""}
                  onChange={(e) => updateFormData("plazoTotalConcesion", e.target.value)}
                  placeholder="Ej: 25 años"
                />
              </div>

              <div>
                <Label htmlFor="inspectorFiscal">Inspector/a Fiscal (Opcional)</Label>
                <Select
                  value={formData.inspectorFiscal || ""}
                  onValueChange={(value) => updateFormData("inspectorFiscal", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar rol..." />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLES_INSPECTOR.map((rol) => (
                      <SelectItem key={rol} value={rol}>
                        {rol}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )

      case "Concesiones Finalizadas":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="valorReferencia">Valor de Referencia</Label>
                <Input
                  id="valorReferencia"
                  value={formData.valorReferencia || ""}
                  onChange={(e) => updateFormData("valorReferencia", e.target.value)}
                  placeholder="Valor de referencia"
                />
              </div>

              <div>
                <Label htmlFor="fechaLlamadoLicitacion">Fecha de Llamado a Licitación</Label>
                <Input
                  id="fechaLlamadoLicitacion"
                  value={formData.fechaLlamadoLicitacion || ""}
                  onChange={(e) => updateFormData("fechaLlamadoLicitacion", e.target.value)}
                  placeholder="dd-mm-yyyy"
                  className={errors.fechaLlamadoLicitacion ? "border-red-500" : ""}
                />
                {errors.fechaLlamadoLicitacion && (
                  <p className="text-sm text-red-500 mt-1">{errors.fechaLlamadoLicitacion}</p>
                )}
              </div>

              <div>
                <Label htmlFor="decretoAdjudicacion">Decreto de Adjudicación</Label>
                <Input
                  id="decretoAdjudicacion"
                  value={formData.decretoAdjudicacion || ""}
                  onChange={(e) => updateFormData("decretoAdjudicacion", e.target.value)}
                  placeholder="Número de decreto"
                />
              </div>

              <div>
                <Label htmlFor="sociedadConcesionaria">Sociedad Concesionaria</Label>
                <Input
                  id="sociedadConcesionaria"
                  value={formData.sociedadConcesionaria || ""}
                  onChange={(e) => updateFormData("sociedadConcesionaria", e.target.value)}
                  placeholder="Nombre de la sociedad"
                />
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const renderFolderTemplates = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium">Plantillas de carpetas</h4>
          <p className="text-sm text-muted-foreground">Selecciona las carpetas base para tu proyecto según la etapa</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="secundario" size="sm" onClick={() => setUseCustomTemplates(!useCustomTemplates)}>
            <FolderIcon className="w-4 h-4 mr-2" />
            {useCustomTemplates ? "Templates Por Defecto" : "Templates Personalizados"}
          </Button>
          <Button variant="secundario" size="sm" onClick={() => setShowFolderTemplates(!showFolderTemplates)}>
            {showFolderTemplates ? "Ocultar Plantillas" : "Mostrar Plantillas"}
          </Button>
        </div>
      </div>

      {showFolderTemplates && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {(PLANTILLAS_CARPETAS[formData.etapa as keyof typeof PLANTILLAS_CARPETAS] || []).map((folder) => (
            <div key={folder} className="flex items-center space-x-3 p-3 border rounded-lg">
              <Checkbox
                id={folder}
                checked={selectedFolders.includes(folder)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedFolders([...selectedFolders, folder])
                    setFolderConfigs({
                      ...folderConfigs,
                      [folder]: { minDocs: 3, daysLimit: 30 },
                    })
                  } else {
                    setSelectedFolders(selectedFolders.filter((f) => f !== folder))
                    const newConfigs = { ...folderConfigs }
                    delete newConfigs[folder]
                    setFolderConfigs(newConfigs)
                  }
                }}
              />
              <div className="flex items-center space-x-2">
                <Folder className="w-4 h-4 text-blue-500" />
                <label htmlFor={folder} className="text-sm font-medium cursor-pointer">
                  {folder}
                </label>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center space-x-2 pt-2">
        <Plus className="w-4 h-4" />
        <Button variant="ghost" size="sm">
          Agregar Carpeta Personalizada
        </Button>
      </div>

      <div className="text-sm text-muted-foreground">
        <strong>Carpetas seleccionadas:</strong> {selectedFolders.length}
      </div>
    </div>
  )

  const renderProjectAlerts = () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <AlertTriangle className="w-5 h-5 text-orange-500" />
        <h4 className="font-medium">Alertas del Proyecto</h4>
      </div>

      <p className="text-sm text-muted-foreground">
        Configura alertas a nivel del proyecto para fechas límite importantes
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="alertaFechaLimite">Fecha Límite de Alerta</Label>
          <Input
            id="alertaFechaLimite"
            value={formData.alertaFechaLimite || ""}
            onChange={(e) => updateFormData("alertaFechaLimite", e.target.value)}
            placeholder="dd-mm-yyyy"
            className={errors.alertaFechaLimite ? "border-red-500" : ""}
          />
          {errors.alertaFechaLimite && <p className="text-sm text-red-500 mt-1">{errors.alertaFechaLimite}</p>}
        </div>

        <div>
          <Label htmlFor="alertaDescripcion">Descripción de la Alerta</Label>
          <Input
            id="alertaDescripcion"
            value={formData.alertaDescripcion || ""}
            onChange={(e) => updateFormData("alertaDescripcion", e.target.value)}
            placeholder="Ej: Entrega de documentos finales"
          />
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex items-start space-x-2">
          <CalendarDays className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h5 className="font-medium text-blue-900">Configuración de Alertas</h5>
            <p className="text-sm text-blue-700 mt-1">
              Las alertas del proyecto se aplicarán a nivel general. También podrás configurar alertas específicas para
              cada carpeta y documento después de crear el proyecto.
            </p>
          </div>
        </div>
      </div>
    </div>
  )

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Información básica"
      case 2:
        return "Detalles del proyecto"
      case 3:
        return "Plantillas de carpetas"
      case 4:
        return "Alertas del proyecto"
      default:
        return "Crear proyecto"
    }
  }

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 1:
        return formData.nombre.trim() && formData.etapa
      case 2:
        return true // Las validaciones se harán en el submit final
      case 3:
        return selectedFolders.length > 0
      case 4:
        return true
      default:
        return false
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <span>{getStepTitle()}</span>
            <Badge variant="outline">Paso {currentStep} de 4</Badge>
          </DialogTitle>
          <DialogDescription>
            {currentStep === 1 && "Ingresa la información básica del proyecto"}
            {currentStep === 2 && "Completa los detalles específicos según la etapa seleccionada"}
            {currentStep === 3 && "Selecciona las carpetas base para organizar tu proyecto"}
            {currentStep === 4 && "Configura alertas importantes para el proyecto"}
          </DialogDescription>
        </DialogHeader>

        {/* Progress indicator */}
        <div className="flex items-center space-x-2 mb-6">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step <= currentStep ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
              >
                {step}
              </div>
              {step < 4 && <div className={`w-12 h-0.5 ${step < currentStep ? "bg-primary" : "bg-muted"}`} />}
            </div>
          ))}
        </div>

        <div className="space-y-6">{renderStepContent()}</div>

        <div className="flex justify-between pt-6 border-t">
          <Button
            variant="secundario"
            onClick={() => {
              if (currentStep > 1) {
                setCurrentStep(currentStep - 1)
              } else {
                onClose()
              }
            }}
          >
            {currentStep > 1 ? "Anterior" : "Cancelar"}
          </Button>

          <div className="flex space-x-2">
            {currentStep < 4 ? (
              <Button onClick={() => setCurrentStep(currentStep + 1)} disabled={!canProceedToNextStep()}>
                Siguiente
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isLoading || !canProceedToNextStep()}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creando Proyecto...
                  </>
                ) : (
                  "Crear Proyecto"
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
