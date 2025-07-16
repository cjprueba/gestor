import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { REGIONES, TIPOS_INICIATIVA, TIPOS_OBRA_POR_ETAPA } from "@/shared/data"
import React from "react"
import type { ProjectFormData } from "../types"

interface StageSpecificFieldsStepProps {
  formData: ProjectFormData
  errors: Record<string, string>
  provinciasDisponibles: Array<{ id: string; nombre: string }>
  comunasDisponibles: Array<{ id: string; nombre: string }>
  onUpdateFormData: (field: keyof ProjectFormData, value: string) => void
}

export const StageSpecificFieldsStep: React.FC<StageSpecificFieldsStepProps> = ({
  formData,
  errors,
  provinciasDisponibles,
  comunasDisponibles,
  onUpdateFormData,
}) => {
  const renderCommonFields = () => (
    <div className="flex flex-col gap-6">
      <div className="flex flex-row gap-4 mt-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="tipoIniciativa">Tipo de Iniciativa *</Label>
          <Select
            value={formData.tipoIniciativa || ""}
            onValueChange={(value) => onUpdateFormData("tipoIniciativa", value)}
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

        <div className="flex flex-col gap-2">
          <Label htmlFor="tipoObra">Tipo de Obra *</Label>
          <Select value={formData.tipoObra || ""} onValueChange={(value) => onUpdateFormData("tipoObra", value)}>
            <SelectTrigger className={errors.tipoObra ? "border-red-500" : ""}>
              <SelectValue placeholder="Seleccionar..." />
            </SelectTrigger>
            <SelectContent>
              {(TIPOS_OBRA_POR_ETAPA["Cartera de proyectos"] || []).map((tipo) => (
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
      <div className="flex flex-row gap-4 ">
        <div className="flex flex-col gap-2">
          <Label htmlFor="region">Región *</Label>
          <Select value={formData.region || ""} onValueChange={(value) => onUpdateFormData("region", value)}>
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

        <div className="flex flex-col gap-2">
          <Label htmlFor="provincia">Provincia *</Label>
          <Select
            value={formData.provincia || ""}
            onValueChange={(value) => onUpdateFormData("provincia", value)}
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

        <div className="flex flex-col gap-2">
          <Label htmlFor="comuna">Comuna *</Label>
          <Select
            value={formData.comuna || ""}
            onValueChange={(value) => onUpdateFormData("comuna", value)}
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

      <div className="flex flex-row gap-12">
        <div className="flex flex-col gap-2">
          <Label htmlFor="volumen">Volumen</Label>
          <Input
            id="volumen"
            value={formData.volumen || ""}
            onChange={(e) => onUpdateFormData("volumen", e.target.value)}
            placeholder="Ej: 50 km, 1000 m³"
            className="max-w-3xs"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="presupuestoOficial">Presupuesto Oficial</Label>
          <Input
            id="presupuestoOficial"
            value={formData.presupuestoOficial || ""}
            onChange={(e) => onUpdateFormData("presupuestoOficial", e.target.value)}
            placeholder="Ej: $50.000.000.000"
            className="max-w-3xs"
          />
        </div>
      </div>
    </div>
  )

  // Campos específicos para "Cartera de proyectos"
  const renderCarteraFields = () => (
    <div className="flex flex-row gap-12">
      <div className="flex flex-col gap-2">
        <Label htmlFor="llamadoLicitacion">Llamado a Licitación (Año)</Label>
        <Input
          id="llamadoLicitacion"
          value={formData.llamadoLicitacion || ""}
          onChange={(e) => onUpdateFormData("llamadoLicitacion", e.target.value)}
          placeholder="YYYY"
          maxLength={4}
          className={`max-w-3xs ${errors.llamadoLicitacion ? "border-red-500" : ""}`}
        />
        {errors.llamadoLicitacion && <p className="text-sm text-red-500 mt-1">{errors.llamadoLicitacion}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="plazoConcesion">Plazo de la Concesión</Label>
        <Input
          id="plazoConcesion"
          value={formData.plazoConcesion || ""}
          onChange={(e) => onUpdateFormData("plazoConcesion", e.target.value)}
          placeholder="dd-mm-yyyy"
          className={`max-w-3xs ${errors.plazoConcesion ? "border-red-500" : ""}`}
        />
        {errors.plazoConcesion && <p className="text-sm text-red-500 mt-1">{errors.plazoConcesion}</p>}
      </div>
    </div>
  )

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium mb-4">Información del Proyecto</h3>
        {renderCommonFields()}
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Campos Específicos - Cartera de Proyectos</h3>
        {renderCarteraFields()}
      </div>
    </div>
  )
} 