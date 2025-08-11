import { useCarpetaContenido, useProyectoDetalle, useUpdateProject } from "@/lib/api/hooks/useProjects"
import { ProjectsService } from "@/lib/api/services/projects.service"
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
import { Badge } from "@/shared/components/ui/badge"

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
  const esProyectoPadre = project.es_proyecto_padre === true

  const etapaActual = project.etapas_registro[0]?.etapa_tipo
  const etapaNombre = esProyectoPadre ? undefined : etapaActual?.nombre
  const etapaColor = esProyectoPadre ? undefined : etapaActual?.color

  // Obtener tipo de obra desde el detalle del proyecto
  const tipoObra = isLoadingTipoObra
    ? "Cargando..."
    : proyectoDetalle?.data?.etapas_registro[0]?.tipo_obra?.nombre || "No especificado"

  const handleOpenAdvanceStage = () => {
    setIsAdvanceStageModalOpen(true)
  }

  const handleCardClick = () => {
    onSelect(project)
  }

  const handleViewDetails = () => {
    setIsDetailsModalOpen(true)
  }

  const handleEdit = () => {
    setSelectedProjectForAction(project)
    setIsRenameDialogOpen(true)
  }

  const handleRenameProject = async (newName: string) => {
    if (!selectedProjectForAction) return

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

  const handleDeleteProject = async (motivoEliminacion: string | any) => {
    try {
      await ProjectsService.deleteProject(project.id, {
        usuario_eliminador: 1, // Por ahora hardcodeado como 1
        motivo_eliminacion: motivoEliminacion
      })

      // Invalidar queries para actualizar la lista
      queryClient.invalidateQueries({ queryKey: ["proyectos"] })

      toast.success("Proyecto eliminado exitosamente")
    } catch (error) {
      console.error("Error al eliminar proyecto:", error)
      toast.error("Error al eliminar el proyecto")
      throw error // Re-lanzar el error para que el modal lo maneje
    }
  }

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
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">{project.nombre}</h3>
                {esProyectoPadre && (
                  <Badge variant="secondary" className="text-[10px]">Proyecto padre</Badge>
                )}
              </div>
              {!esProyectoPadre && <TagStage etapa={etapaNombre ?? ""} size="xs" />}
              <p className="text-xs text-muted-foreground mt-2">
                {!esProyectoPadre ? "Tipo de obra:" : ""}
                <span className="font-light ml-1">
                  {!esProyectoPadre && (
                    isLoadingTipoObra ? (
                      <span className="flex items-center gap-1">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Cargando...
                      </span>
                    ) : (
                      tipoObra
                    )
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
                onDelete={handleDeleteProject}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {!esProyectoPadre ? (
              <div className="flex items-center text-sm text-muted-foreground">
                <FolderOpen className="w-4 h-4 mr-2" />
                {totalFolders} carpetas principales
              </div>
            ) : (
              <div className="flex items-center text-sm text-muted-foreground">
                <FolderOpen className="w-4 h-4 mr-2" />
                {project.proyectos_hijos_count ?? project.proyectos_hijos?.length ?? 0} proyecto/s hijo/s
              </div>
            )}
            <div className="flex items-center text-sm text-muted-foreground">
              <FileText className="w-4 h-4 mr-2" />
              {!esProyectoPadre
                ? (totalDocuments === 0 ? "0 documentos" : `${totalDocuments} documentos totales`)
                : ""}
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