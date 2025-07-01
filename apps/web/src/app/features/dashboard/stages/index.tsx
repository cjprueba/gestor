"use client"

import { MOCK_STAGE_FORMS, MOCK_PROJECT_STAGES } from "@/shared/data/stage-forms-mock"
import type { ProjectStage, StageForm } from "@/shared/types/stage-types"
import { useEffect, useState } from "react"
import StageManager from "./_components/stage-manager"

export default function StagesPage() {
  const [stages, setStages] = useState<ProjectStage[]>([])
  const [forms, setForms] = useState<StageForm[]>([])
  // const [usageStats, setUsageStats] = useState<StageUsageStats[]>([])

  // Inicializar con etapas y formularios mock
  useEffect(() => {
    // Usar las etapas con formularios asociados
    setStages(MOCK_PROJECT_STAGES)

    // Usar los formularios mock
    setForms(MOCK_STAGE_FORMS)

    // Generar estadísticas mock (comentado por ahora)
    // const mockStats: StageUsageStats[] = MOCK_PROJECT_STAGES.map((stage) => ({
    //   stageId: stage.id,
    //   projectCount: Math.floor(Math.random() * 20) + 1,
    //   averageCompletionTime: Math.floor(Math.random() * 30) + 15,
    //   lastUsed: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
    //   completionRate: Math.floor(Math.random() * 40) + 60,
    // }))

    // setUsageStats(mockStats)
  }, [])

  return (
    <StageManager
      stages={stages}
      forms={forms}
      onStagesChange={setStages}
      onFormsChange={setForms}
    // usageStats={usageStats}
    />
  )
}
