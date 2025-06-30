import React from "react"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { ETAPAS } from "@/shared/data/project-data"
import type { ProjectFormData } from "../types"

interface BasicInfoStepProps {
  formData: ProjectFormData
  errors: Record<string, string>
  onUpdateFormData: (field: keyof ProjectFormData, value: string) => void
}

export const BasicInfoStep: React.FC<BasicInfoStepProps> = ({
  formData,
  errors,
  onUpdateFormData,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="nombre">Nombre del Proyecto *</Label>
        <Input
          id="nombre"
          value={formData.nombre}
          onChange={(e) => onUpdateFormData("nombre", e.target.value)}
          placeholder="Ej: Autopista Central Norte"
          className={`max-w-3xs ${errors.nombre ? "border-red-500" : ""}`}
        />
        {errors.nombre && <p className="text-sm text-red-500 mt-1">{errors.nombre}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="etapa">Etapa del Proyecto *</Label>
        <Select value={formData.etapa} onValueChange={(value) => onUpdateFormData("etapa", value)}>
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
    </div>
  )
} 