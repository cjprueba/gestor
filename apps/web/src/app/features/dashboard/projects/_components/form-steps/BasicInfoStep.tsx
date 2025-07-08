import React from "react"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
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


    </div>
  )
} 