import { useCarpetaContenido, useProyectoDetalle, useUpdateProject } from "@/lib/api/hooks/useProjects"
import TagStage from "@/shared/components/TagStage"
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card"
import { useQueryClient } from "@tanstack/react-query"
import { Calendar, FileText, FolderOpen, Loader2 } from "lucide-react"
import React, { useState } from "react"
import { toast } from "sonner"
import CardActions from "../CardActions"
import { ShowStageDetailsDialog } from "../ShowStageDetailsDialog"
import { AdvanceStageModal } from "./AdvanceStageModal"
import type { ProjectCardProps, ProyectoListItem } from "./project.types"
import RenameProjectDialog from "./RenameProjectDialog"

export const ProjectCard: React.FC<ProjectCardProps & { onUpdateProject?: (project: ProyectoListItem) => void }> = ({
  project,
  onSelect
}) => {
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [isAdvanceStageModalOpen, setIsAdvanceStageModalOpen] = useState(false)
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false)
  const [selectedProjectForAction, setSelectedProjectForAction] = useState<any>(null)
  const queryClient = useQueryClient()

  // Hook para actualizar proyecto
  const updateProjectMutation = useUpdateProject()

  // Obtener datos de la carpeta raíz
  const { data: carpetaData } = useCarpetaContenido(project.carpeta_raiz_id)

  // Obtener detalle del proyecto para tipo de obra
  const { data: proyectoDetalle, isLoading: isLoadingTipoObra } = useProyectoDetalle(project.id)

  // Calcular totales desde los datos de la API
  const totalFolders = carpetaData?.contenido?.carpetas?.length || 0
  const totalDocuments = carpetaData?.estadisticas?.total_documentos || 0

  // Obtener información de la etapa
  const etapaActual = project.etapas_registro[0]?.etapa_tipo
  const etapaNombre = etapaActual?.nombre
  const etapaColor = etapaActual?.color

  // Obtener tipo de obra desde el detalle del proyecto
  const tipoObra = isLoadingTipoObra
    ? "Cargando..."
    : proyectoDetalle?.data?.etapas_registro[0]?.tipo_obra?.nombre || "No especificado"

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

    console.log("Iniciando renombrado de proyecto:", selectedProjectForAction.nombre, "a:", newName)

    try {
      await updateProjectMutation.mutateAsync({
        projectId: selectedProjectForAction.id,
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
        className="cursor-pointer hover:shadow-lg transition-all relative border-1"
        style={{ borderColor: etapaColor }}
        onClick={handleCardClick}
      >
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex-1 pr-2">
              <h3 className="text-lg font-semibold">{project.nombre}</h3>
              <TagStage etapa={etapaNombre} size="xs" />
              <p className="text-xs text-muted-foreground mt-2">
                Tipo de obra:
                <span className="font-light ml-1">
                  {isLoadingTipoObra ? (
                    <span className="flex items-center gap-1">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Cargando...
                    </span>
                  ) : (
                    tipoObra
                  )}
                </span>
              </p>
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
              Creado {new Date(project.created_at).toLocaleDateString()}
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
          queryClient.invalidateQueries({ queryKey: ["proyecto", project.id] })
          queryClient.invalidateQueries({ queryKey: ["carpeta-contenido"] })
          queryClient.invalidateQueries({ queryKey: ["carpetas-proyecto", project.id] })
          queryClient.invalidateQueries({ queryKey: ["etapa-avanzar-info", project.id] })

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