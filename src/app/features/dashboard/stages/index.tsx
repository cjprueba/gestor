import { MOCK_STAGE_FORMS } from "@/shared/data/stage-forms-mock"
import { useStages } from "@/lib/api"
import type { ProjectStage, Stage, StageForm } from "@/shared/types/stage-types"
import { useEffect, useState } from "react"
import StageManager from "./_components/stage-manager"

export default function StagesPage() {
  const [forms, setForms] = useState<StageForm[]>([])

  // Obtener etapas de la API
  const { data: etapasData } = useStages({
    limit: 100
  });

  // Convertir datos de la API al formato esperado por StageManager
  const stages: ProjectStage[] = etapasData?.data?.map((stage: Stage) => ({
    id: stage.id.toString(),
    name: stage.name || '',
    description: stage.description || '',
    color: stage.color || '#3B82F6',
    order: stage.order,
    isDefault: false,
    isActive: stage.isActive,
    createdAt: new Date(),
    createdBy: 'Usuario Actual',
    lastModifiedAt: new Date(),
    lastModifiedBy: 'Usuario Actual',
  })) || [];

  // Inicializar formularios mock
  useEffect(() => {
    setForms(MOCK_STAGE_FORMS)
  }, [])

  // if (isLoading) {
  //   return <div className="p-6">Cargando etapas...</div>;
  // }

  // if (error) {
  //   return <div className="p-6">Error al cargar etapas: {error.message}</div>;
  // }

  return (
    <StageManager
      stages={stages}
      forms={forms}
      // onStagesChange={() => {
      //   // Aquí podrías implementar la lógica para actualizar etapas
      //   console.log('Etapas actualizadas');
      // }}
      onFormsChange={setForms}
    />
  )
}
