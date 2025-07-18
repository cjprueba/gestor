import { Button } from "@/shared/components/design-system/button"
import { Badge } from "@/shared/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card"
import { Label } from "@/shared/components/ui/label"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import { ETAPAS } from "@/shared/data/project-data"
import { getStageBadgeClasses, getStageBorderClassFromBadge } from "@/shared/utils/stage-colors"
import { ArrowRightFromLine, Calendar, Eye, FileText, FolderOpen, MoreVertical } from "lucide-react"
import React, { useState } from "react"
import { ProjectDetailsModal } from "./project-details-modal"
import { AdvanceStageModal } from "./advance-stage-modal"
import type { FolderStructure, ProjectCardProps } from "./types"
import { getTotalCarpetasPrincipales } from "@/shared/utils/project-utils"
import { useCarpetaContenido } from "@/lib/api/hooks/useProjects"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

const getTotalAlerts = (folder: FolderStructure): number => {
  let alerts = 0

  // Alertas por documentos faltantes
  if (folder.documents.length < folder.minDocuments) {
    alerts++
  }

  // Alertas por fechas vencidas
  const overdueDocs = folder.documents.filter((doc) => doc.dueDate && doc.dueDate < new Date())
  alerts += overdueDocs.length

  // Alertas de subcarpetas
  folder.subfolders.forEach((subfolder) => {
    alerts += getTotalAlerts(subfolder)
  })

  return alerts
}

export const ProjectCard: React.FC<ProjectCardProps & { onUpdateProject?: (project: any) => void }> = ({ project, onSelect }) => {
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [isAdvanceStageModalOpen, setIsAdvanceStageModalOpen] = useState(false)
  const queryClient = useQueryClient()

  // Obtener datos de la carpeta raíz si está disponible
  const { data: carpetaData } = useCarpetaContenido(project.carpeta_raiz_id)

  // Obtener el total de carpetas principales
  const carpetaInicial = project.projectData?.carpetaInicial || {};
  const totalFoldersFromCarpetaInicial = getTotalCarpetasPrincipales(carpetaInicial);

  // Usar datos de la API si están disponibles, sino usar carpeta_inicial
  const totalFolders = carpetaData?.contenido?.carpetas?.length || totalFoldersFromCarpetaInicial;

  // Obtener total de documentos desde la API
  const totalDocuments = carpetaData?.estadisticas?.total_documentos || 0;

  const getNextStage = (): typeof ETAPAS[number] | null => {
    const idx = ETAPAS.indexOf(project.etapa as typeof ETAPAS[number])
    if (idx >= 0 && idx < ETAPAS.length - 1) {
      return ETAPAS[idx + 1]
    }
    return null
  }



  const handleOpenAdvanceStage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsAdvanceStageModalOpen(true)
  }

  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as Element).closest('[data-dropdown-trigger]') ||
      (e.target as Element).closest('[data-dropdown-content]')) {
      return
    }
    onSelect(project)
  }

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation()
    console.log('handleViewDetails clicked for project:', project.name)
    setIsDetailsModalOpen(true)
  }

  const nextStage = getNextStage()

  return (
    <>
      <Card
        className={`cursor-pointer hover:shadow-lg transition-all relative border-1 ${getStageBorderClassFromBadge(project.etapa)}`}
        onClick={handleCardClick}
      >
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex-1 pr-2">
              <h3 className="text-lg font-semibold">{project.name}</h3>
              {project.etapa && (
                <Label htmlFor={project.etapa} className="text-sm cursor-pointer mt-2">
                  <Badge variant="outline" className={`text-xs ${getStageBadgeClasses(project.etapa)}`}>
                    {project.etapa}
                  </Badge>
                </Label>
              )}
              <p className="text-xs text-muted-foreground mt-2">Tipo de obra: <span className="font-light">{project.projectData?.tipoObra}</span></p>
            </div>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild data-dropdown-trigger>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-0 hover:bg-muted"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertical className="w-4 h-4" />
                    <span className="sr-only">Abrir menú</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" data-dropdown-content>
                  <DropdownMenuItem onClick={handleViewDetails}>
                    <Eye className="w-4 h-4 mr-2" />
                    Ver ficha
                  </DropdownMenuItem>
                  {nextStage && (
                    <DropdownMenuItem onClick={handleOpenAdvanceStage}>
                      <ArrowRightFromLine className="w-4 h-4 mr-2" />
                      Avanzar a siguiente etapa
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <FolderOpen className="w-4 h-4 mr-2" />
              {totalFolders} carpetas principales
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <FileText className="w-4 h-4 mr-2" />
              {totalDocuments === 0 ? "0 documentos" : `${totalDocuments} documentos totales`}
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="w-4 h-4 mr-2" />
              Creado {project.createdAt.toLocaleDateString()}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal de detalles */}
      <ProjectDetailsModal
        project={project}
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
      />

      {/* Modal avanzar etapa */}
      <AdvanceStageModal
        project={project}
        isOpen={isAdvanceStageModalOpen}
        onClose={() => setIsAdvanceStageModalOpen(false)}
        onSuccess={() => {
          // Refrescar datos del proyecto después de avanzar etapa
          console.log("Etapa avanzada exitosamente")

          // Invalidar todas las queries relacionadas con el proyecto
          queryClient.invalidateQueries({ queryKey: ["proyectos"] })
          queryClient.invalidateQueries({ queryKey: ["proyecto", parseInt(project.id)] })
          queryClient.invalidateQueries({ queryKey: ["carpeta-contenido"] })
          queryClient.invalidateQueries({ queryKey: ["carpetas-proyecto", parseInt(project.id)] })
          queryClient.invalidateQueries({ queryKey: ["etapa-avanzar-info", parseInt(project.id)] })

          // Mostrar mensaje de éxito
          toast.success("Se avanzó a la siguiente etapa exitosamente")
        }}
      />
    </>
  )
} 