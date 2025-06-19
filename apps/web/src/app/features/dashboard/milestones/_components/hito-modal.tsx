import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog"
import { Button } from "@/shared/components/design-system/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Textarea } from "@/shared/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Calendar } from "@/shared/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon, Flag } from "lucide-react"
import { cn } from "@/shared/lib/utils"
import type { Hito } from "@/shared/types/milestones"

interface HitoModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  hito?: Hito | null
  onSave: (hitoData: Partial<Hito>) => void
}

export function HitoModal({ open, onOpenChange, hito, onSave }: HitoModalProps) {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    fechaVencimiento: "",
    periodo: "" as Hito["periodo"] | "",
    proyecto: {
      id: "",
      nombre: "",
      tipo: "" as "concesión" | "Proyecto" | "Contrato" | "",
    },
    hitoContractual: "",
    responsable: "",
    fechaEntrega: "",
  })
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (hito) {
      setFormData({
        nombre: hito.nombre,
        descripcion: hito.descripcion || "",
        fechaVencimiento: hito.fechaVencimiento,
        periodo: hito.periodo,
        proyecto: hito.proyecto,
        hitoContractual: hito.hitoContractual,
        responsable: hito.responsable || "",
        fechaEntrega: hito.fechaEntrega || "",
      })
      setDate(hito.fechaVencimiento ? new Date(hito.fechaVencimiento) : undefined)
    } else {
      setFormData({
        nombre: "",
        descripcion: "",
        fechaVencimiento: "",
        periodo: "",
        proyecto: {
          id: "",
          nombre: "",
          tipo: "",
        },
        hitoContractual: "",
        responsable: "",
        fechaEntrega: "",
      })
      setDate(undefined)
    }
    setErrors({})
  }, [hito, open])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre del hito es requerido"
    }

    if (!formData.fechaVencimiento) {
      newErrors.fechaVencimiento = "La fecha de vencimiento es requerida"
    }

    if (!formData.periodo) {
      newErrors.periodo = "El periodo es requerido"
    }

    if (!formData.proyecto.id) {
      newErrors.proyecto = "El proyecto es requerido"
    }

    if (!formData.hitoContractual.trim()) {
      newErrors.hitoContractual = "El hito contractual es requerido"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      onSave(formData as Partial<Hito>)
      onOpenChange(false)
    }
  }

  const handleDateChange = (date: Date | undefined) => {
    setDate(date)
    if (date) {
      setFormData({
        ...formData,
        fechaVencimiento: format(date, "yyyy-MM-dd"),
      })
    }
  }

  // Datos de ejemplo para los selects
  const proyectos = [
    { id: "1", nombre: "concesión 1", tipo: "concesión" as const },
    { id: "2", nombre: "Proyecto", tipo: "Proyecto" as const },
    { id: "3", nombre: "Contrato", tipo: "Contrato" as const },
  ]

  const responsables = [
    { id: "1", nombre: "Juan Pérez" },
    { id: "2", nombre: "María González" },
    { id: "3", nombre: "Carlos Rodríguez" },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] md:max-w-[700px] max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Flag className="h-4 w-4 sm:h-5 sm:w-5" />
            {hito ? "Editar actividad" : "Crear nuevo registro de actividad"}
          </DialogTitle>
          <DialogDescription className="text-sm">
            {hito
              ? "Modifica los detalles del registro de actividad"
              : "Crea un nuevo registro de actividad relacionado a un proyecto, contrato o concesión"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Sección superior con fecha y responsable */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fecha" className="font-bold">
                Fecha
              </Label>
              <div className="flex space-x-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="secundario"
                      className={cn(
                        "w-full justify-start text-left font-normal text-sm sm:text-base",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "dd/MM/yyyy", { locale: es }) : <span>Seleccionar fecha</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={date} onSelect={handleDateChange} initialFocus locale={es} />
                  </PopoverContent>
                </Popover>
              </div>
              {errors.fechaVencimiento && <p className="text-sm text-red-500">{errors.fechaVencimiento}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="responsable" className="font-bold">
                Responsable
              </Label>
              <div className="flex space-x-2">
                <Select
                  value={formData.responsable}
                  onValueChange={(value) => setFormData({ ...formData, responsable: value })}
                >
                  <SelectTrigger className={cn(
                    "text-sm sm:text-base",
                    errors.responsable ? "border-red-500" : ""
                  )}>
                    <SelectValue placeholder="Seleccionar responsable" />
                  </SelectTrigger>
                  <SelectContent>
                    {responsables.map((resp) => (
                      <SelectItem key={resp.id} value={resp.id}>
                        {resp.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Tipo de Hito */}
          <div className="space-y-2">
            <Label htmlFor="tipoHito" className="font-bold text-sm sm:text-base">
              Tipo de Actividad
            </Label>
            <Select
              value={formData.proyecto.id}
              onValueChange={(value) => {
                const proyecto = proyectos.find((p) => p.id === value)
                if (proyecto) {
                  setFormData({
                    ...formData,
                    proyecto: {
                      id: proyecto.id,
                      nombre: proyecto.nombre,
                      tipo: proyecto.tipo,
                    },
                  })
                }
              }}
            >
              <SelectTrigger className={cn(errors.proyecto ? "border-red-500" : "")}>
                <SelectValue placeholder="Seleccionar tipo de actividad" />
              </SelectTrigger>
              <SelectContent>
                {proyectos.map((proyecto) => (
                  <SelectItem key={proyecto.id} value={proyecto.id}>
                    {`${proyecto.tipo} - ${proyecto.nombre}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.proyecto && <p className="text-sm text-red-500">{errors.proyecto}</p>}
          </div>

          {/* Fecha de Vencimiento */}
          <div className="space-y-2">
            <Label htmlFor="fechaVencimiento" className="font-bold">
              Fecha Vencimiento
            </Label>
            <div className="flex space-x-2">
              <Input
                id="fechaVencimiento"
                placeholder="Fecha de vencimiento"
                value={
                  formData.fechaVencimiento
                    ? format(new Date(formData.fechaVencimiento), "dd/MM/yyyy", { locale: es })
                    : ""
                }
                readOnly
                className={cn(errors.fechaVencimiento ? "border-red-500" : "")}
              />
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="iconoSecundario" size="icon">
                    <CalendarIcon className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={date} onSelect={handleDateChange} initialFocus locale={es} />
                </PopoverContent>
              </Popover>
            </div>
            {errors.fechaVencimiento && <p className="text-sm text-red-500">{errors.fechaVencimiento}</p>}
          </div>

          {/* Nombre del Hito */}
          <div className="space-y-2">
            <Label htmlFor="nombre" className="font-bold">
              Nombre de la actividad
            </Label>
            <Input
              id="nombre"
              placeholder="Nombre del hito"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className={cn(
                "text-sm sm:text-base",
                errors.nombre ? "border-red-500" : ""
              )}
            />
            {errors.nombre && <p className="text-sm text-red-500">{errors.nombre}</p>}
          </div>

          {/* Descripción del Hito */}
          <div className="space-y-2">
            <Label htmlFor="descripcion" className="font-bold">
              Descripción de la actividad
            </Label>
            <Textarea
              id="descripcion"
              placeholder="Descripción de la actividad"
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              rows={3}
              className="text-sm sm:text-base resize-none"
            />
          </div>

          {/* Periodo */}
          <div className="space-y-2">
            <Label htmlFor="periodo" className="font-bold">
              Fecha de entrega
            </Label>
            <Select
              value={formData.periodo}
              onValueChange={(value) => setFormData({ ...formData, periodo: value as Hito["periodo"] })}
            >
              <SelectTrigger className={cn(
                "text-sm sm:text-base",
                errors.periodo ? "border-red-500" : ""
              )}>
                <SelectValue placeholder="Seleccionar periodo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mensual">Mensual</SelectItem>
                <SelectItem value="trimestral">Trimestral</SelectItem>
                <SelectItem value="semestral">Semestral</SelectItem>
                <SelectItem value="anual">Anual</SelectItem>
              </SelectContent>
            </Select>
            {errors.periodo && <p className="text-sm text-red-500">{errors.periodo}</p>}
          </div>

          {/* Hito Contractual */}
          {/* <div className="space-y-2">
            <Label htmlFor="hitoContractual" className="font-bold">
              Hito Contractual
            </Label>
            <Input
              id="hitoContractual"
              placeholder="Referencia contractual del hito"
              value={formData.hitoContractual}
              onChange={(e) => setFormData({ ...formData, hitoContractual: e.target.value })}
              className={cn(
                "text-sm sm:text-base",
                errors.hitoContractual ? "border-red-500" : ""
              )}
            />
            {errors.hitoContractual && <p className="text-sm text-red-500">{errors.hitoContractual}</p>}
          </div> */}

          {/* Documentos Asociados */}
          <div className="space-y-2">
            <Label className="font-bold text-sm sm:text-base">Documentos Asociados</Label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between border rounded-md p-2 gap-2 sm:gap-0">
              <span className="text-sm text-muted-foreground">Ningún archivo seleccionado</span>
              <Button variant="secundario" size="sm" className="w-full sm:w-auto">
                Elegir archivos
              </Button>
            </div>
            <Button variant="primario" size="sm" className="w-full sm:w-auto">Subir Documentos</Button>
          </div>
        </div>

        <DialogFooter className="flex gap-2 flex-col sm:flex-row ">
          <Button
            variant="secundario"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button
            variant="primario"
            onClick={handleSubmit}
          >
            {hito ? "Actualizar Hito" : "Crear Hito"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
