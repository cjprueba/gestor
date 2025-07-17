import React from "react"
import { useFormContext } from 'react-hook-form';
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { AlertTriangle, CalendarDays } from "lucide-react"
import type { CreateProjectFormData } from "@/shared/types/project-types"

interface ProjectAlertsStepProps {
  // Este paso se mantiene simple ya que las alertas se configuran después de crear el proyecto
}

export const ProjectAlertsStep: React.FC<ProjectAlertsStepProps> = () => {
  const { register, formState: { } } = useFormContext<CreateProjectFormData>();

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 text-orange-500" />
          <h4 className="font-medium">Alertas del proyecto</h4>
        </div>
        <p className="text-sm text-muted-foreground">
          Configura alertas a nivel del proyecto para fechas límite importantes
        </p>
      </div>

      <div className="flex flex-row gap-4 my-8">
        <div className="flex flex-col gap-2">
          <Label htmlFor="alertaFechaLimite">Fecha límite de alerta</Label>
          <Input
            id="alertaFechaLimite"
            type="date"
            {...register('createProjectStepTwo.fecha_llamado_licitacion')}
            className="max-w-3xs"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="alertaDescripcion">Descripción de la Alerta</Label>
          <Input
            id="alertaDescripcion"
            {...register('createProjectStepTwo.valor_referencia')}
            placeholder="Ej: Entrega de documentos finales"
            className="max-w-3xs"
          />
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg mt-12">
        <div className="flex items-start space-x-2">
          <CalendarDays className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h5 className="font-medium text-blue-900">Configuración de alertas</h5>
            <p className="text-sm text-blue-700 mt-1">
              Las alertas del proyecto se aplicarán a nivel general. También podrás configurar alertas específicas para
              cada carpeta y documento después de crear el proyecto.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 