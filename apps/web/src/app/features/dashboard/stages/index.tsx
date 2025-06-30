"use client"

import { ETAPAS } from "@/shared/data/project-data"
import type { ProjectStage, StageForm } from "@/shared/types/stage-types"
import { useEffect, useState } from "react"
import StageManager from "./_components/stage-manager"

export default function StagesPage() {
  const [stages, setStages] = useState<ProjectStage[]>([])
  const [forms, setForms] = useState<StageForm[]>([])
  // const [usageStats, setUsageStats] = useState<StageUsageStats[]>([])

  // Inicializar con etapas por defecto
  useEffect(() => {
    const defaultStages: ProjectStage[] = ETAPAS.map((etapa, index) => ({
      id: `stage-${index}`,
      name: etapa,
      description: `Etapa por defecto del sistema: ${etapa}`,
      color: getStageColor(index),
      order: index + 1,
      isDefault: true,
      isActive: true,
      createdAt: new Date(),
      createdBy: "Sistema",
      lastModifiedAt: new Date(),
      lastModifiedBy: "Sistema",
    }))

    setStages(defaultStages)

    // Generar estadísticas mock
    // const mockStats: StageUsageStats[] = defaultStages.map((stage) => ({
    //   stageId: stage.id,
    //   projectCount: Math.floor(Math.random() * 20) + 1,
    //   averageCompletionTime: Math.floor(Math.random() * 30) + 15,
    //   lastUsed: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
    //   completionRate: Math.floor(Math.random() * 40) + 60,
    // }))

    // setUsageStats(mockStats)
  }, [])

  // Función para obtener colores de etapas
  const getStageColor = (index: number) => {
    const colors = [
      "#3b82f6", // blue
      "#10b981", // emerald
      "#f59e0b", // amber
      "#ef4444", // red
      "#8b5cf6", // violet
      "#06b6d4", // cyan
      "#84cc16", // lime
      "#f97316", // orange
    ]
    return colors[index % colors.length]
  }

  return (
    <div className="flex flex-1 flex-col p-6">
      <StageManager
        stages={stages}
        forms={forms}
        // usageStats={usageStats}
        onStagesChange={setStages}
        onFormsChange={setForms}
      />
    </div>
  )
}
