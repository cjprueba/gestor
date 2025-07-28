import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import type { CreateProjectFormData } from "../project/project.validations";
import React from "react";
import { useFormContext } from 'react-hook-form';

interface BasicInfoStepProps {
  stageTypes: Array<{ id: number; nombre: string; descripcion: string; color: string | null }>;
}

export const BasicInfoStep: React.FC<BasicInfoStepProps> = ({ }) => {
  const { register, formState: { errors }, watch } = useFormContext<CreateProjectFormData>();
  watch('createProjectStepOne.etapa');

  return (
    <div className="space-y-4 flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="nombre">Nombre del Proyecto *</Label>
        <Input
          id="nombre"
          {...register('createProjectStepOne.nombre')}
          placeholder="Ej: Autopista Central Norte"
          className={`max-w-3xs ${errors.createProjectStepOne?.nombre ? "border-red-500" : ""}`}
        />
        {errors.createProjectStepOne?.nombre && (
          <p className="text-sm text-red-500 mt-1">{errors.createProjectStepOne.nombre.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="etapa">Etapa del Proyecto</Label>
        <Badge variant="outline">
          Cartera de proyectos
        </Badge>
      </div>
    </div>
  )
} 