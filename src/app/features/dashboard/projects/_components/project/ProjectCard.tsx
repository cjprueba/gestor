import { useCarpetaContenido, useUpdateProject } from "@/lib/api/hooks/useProjects"
import TagStage from "@/shared/components/TagStage"
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card"
import { getTotalCarpetasPrincipales } from "@/shared/utils/project-utils"
import { useQueryClient } from "@tanstack/react-query"
import { Calendar, FileText, FolderOpen } from "lucide-react"
import React, { useState } from "react"
import { toast } from "sonner"
import CardActions from "../CardActions"
import type { FolderStructure } from "../folder/folder.types"
import { ShowStageDetailsDialog } from "../ShowStageDetailsDialog"
import { AdvanceStageModal } from "./AdvanceStageModal"
import type { Project, ProjectCardProps } from "./project.types"
import RenameProjectDialog from "./RenameProjectDialog"

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

export const ProjectCard: React.FC<ProjectCardProps & { onUpdateProject?: (project: Project) => void }> = ({ project, onSelect }) => {
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [isAdvanceStageModalOpen, setIsAdvanceStageModalOpen] = useState(false)
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false)
  const [selectedProjectForAction, setSelectedProjectForAction] = useState<any>(null)
  const queryClient = useQueryClient()

  // Hook para actualizar proyecto
  const updateProjectMutation = useUpdateProject()

  const { data: carpetaData } = useCarpetaContenido(project.carpeta_raiz_id)

  const carpetaInicial = project.projectData?.carpetaInicial || {};
  const totalFoldersFromCarpetaInicial = getTotalCarpetasPrincipales(carpetaInicial);

  const totalFolders = carpetaData?.contenido?.carpetas?.length || totalFoldersFromCarpetaInicial;

  const totalDocuments = carpetaData?.estadisticas?.total_documentos || 0;

  const handleOpenAdvanceStage = () => {
    console.log("handleOpenAdvanceStage llamado")
    setIsAdvanceStageModalOpen(true)
  }

  const handleCardClick = () => {
    console.log("handleCardClick llamado - redirigiendo a proyecto")
    onSelect(project)
  }

  const handleViewDetails = () => {
    console.log("handleViewDetails llamado")
    setIsDetailsModalOpen(true)
  }

  const handleEdit = () => {
    console.log("handleEdit llamado")
    setSelectedProjectForAction(project)
    setIsRenameDialogOpen(true)
  }

  const handleRenameProject = async (newName: string) => {
    if (!selectedProjectForAction) return

    console.log("Iniciando renombrado de proyecto:", selectedProjectForAction.name, "a:", newName)

    try {
      await updateProjectMutation.mutateAsync({
        projectId: parseInt(selectedProjectForAction.id),
        data: {
          nombre: newName
        }
      })
    } catch (error) {
      console.error("Error en handleRenameProject:", error)
    }
  }

  console.log(project, "-------Project")
  return (
    <>
      <Card
        className={`cursor-pointer hover:shadow-lg transition-all relative border-1`}
        onClick={handleCardClick}
      >
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex-1 pr-2">
              <h3 className="text-lg font-semibold">{project.name}</h3>
              {project.etapa && (
                <TagStage etapa={project.etapa} size="xs" />
              )}
              <p className="text-xs text-muted-foreground mt-2">Tipo de obra: <span className="font-light">{project.projectData?.tipoObra}</span></p>
            </div>
            <div className="flex items-center space-x-2">
              <CardActions
                type="project"
                item={project}
                onViewProjectDetails={handleViewDetails}
                onAdvanceStage={handleOpenAdvanceStage}
                onEdit={handleEdit}
              />
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
      <ShowStageDetailsDialog
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

          queryClient.invalidateQueries({ queryKey: ["proyectos"] })
          queryClient.invalidateQueries({ queryKey: ["proyecto", parseInt(project.id)] })
          queryClient.invalidateQueries({ queryKey: ["carpeta-contenido"] })
          queryClient.invalidateQueries({ queryKey: ["carpetas-proyecto", parseInt(project.id)] })
          queryClient.invalidateQueries({ queryKey: ["etapa-avanzar-info", parseInt(project.id)] })

          // Mostrar mensaje de éxito
          toast.success("Se avanzó a la siguiente etapa exitosamente")
        }}
      />

      {/* Modal renombrar proyecto */}
      <RenameProjectDialog
        isOpen={isRenameDialogOpen}
        onClose={() => setIsRenameDialogOpen(false)}
        project={selectedProjectForAction}
        onRename={handleRenameProject}
        isLoading={updateProjectMutation.isPending}
      />
    </>
  )
} 