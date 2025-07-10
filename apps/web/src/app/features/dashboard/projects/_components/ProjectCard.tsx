import { Button } from "@/shared/components/design-system/button"
import { Badge } from "@/shared/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import { Label } from "@/shared/components/ui/label"
import { ETAPAS } from "@/shared/data/project-data"
import { MOCK_STAGE_FORMS } from "@/shared/data/stage-forms-mock"
import { getStageBadgeClasses, getStageBorderClassFromBadge } from "@/shared/utils/stage-colors"
import { ArrowRightFromLine, Calendar, Eye, FileText, FolderOpen, MoreVertical } from "lucide-react"
import React, { useState } from "react"
import { ProjectDetailsModal } from "./project-details-modal"
import type { FolderStructure, ProjectCardProps } from "./types"
import { validateProjectForm } from "./utils/validation"

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

export const ProjectCard: React.FC<ProjectCardProps & { onUpdateProject?: (project: any) => void }> = ({ project, onSelect, onUpdateProject }) => {
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [isAdvanceStageModalOpen, setIsAdvanceStageModalOpen] = useState(false)
  const [advanceStageFormData, setAdvanceStageFormData] = useState<any>({})

  // const totalAlerts = getTotalAlerts(project.structure)
  const totalFolders = project.structure.subfolders.length
  const totalDocuments = project.structure.subfolders.reduce(
    (acc, folder) =>
      acc +
      folder.documents.length +
      folder.subfolders.reduce((subAcc, subfolder) => subAcc + subfolder.documents.length, 0),
    0,
  )

  const getNextStage = (): typeof ETAPAS[number] | null => {
    const idx = ETAPAS.indexOf(project.etapa as typeof ETAPAS[number])
    if (idx >= 0 && idx < ETAPAS.length - 1) {
      return ETAPAS[idx + 1]
    }
    return null
  }

  // Helper para obtener los campos de la etapa destino
  const getNextStageFields = () => {
    const nextStage = getNextStage()
    if (!nextStage) return []
    const form = MOCK_STAGE_FORMS.find(f => f.name.includes(nextStage))
    return form ? form.fields : []
  }

  // Helper para saber si un campo es heredado
  const isFieldHeredado = (fieldName: string) => {
    return Object.prototype.hasOwnProperty.call(project.projectData || {}, fieldName)
  }

  const handleOpenAdvanceStage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setAdvanceStageFormData({ ...project.projectData })
    setIsAdvanceStageModalOpen(true)
  }

  const handleCloseAdvanceStage = () => {
    setIsAdvanceStageModalOpen(false)
    setAdvanceStageFormData({})
  }

  const handleAdvanceStage = () => {
    const nextStage = getNextStage()
    if (!nextStage) return
    const dataToValidate = { ...advanceStageFormData, etapa: nextStage }
    const errors = validateProjectForm(dataToValidate)
    if (Object.keys(errors).length > 0) return
    // Actualizar el proyecto
    if (onUpdateProject) {
      const updatedProject = {
        ...project,
        etapa: nextStage,
        projectData: dataToValidate,
        metadata: {
          ...project.metadata,
          lastModifiedAt: new Date(),
          lastModifiedBy: "Usuario Actual",
          history: [
            {
              id: Date.now().toString(),
              timestamp: new Date(),
              userId: "user-1",
              userName: "Usuario Actual",
              action: "stage_changed" as const,
              details: {
                field: "etapa",
                oldValue: project.etapa,
                newValue: nextStage,
              },
            },
            ...(project.metadata?.history || []),
          ],
        },
      }
      onUpdateProject(updatedProject)
    }
    setIsAdvanceStageModalOpen(false)
    setAdvanceStageFormData({})
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
    setIsDetailsModalOpen(true)
  }

  const nextStage = getNextStage()

  // DEBUG: Agregar console.log temporal para verificar la lógica
  console.log('Proyecto:', project.name, 'Etapa actual:', project.etapa, 'Próxima etapa:', nextStage)

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
              {/* {totalAlerts > 0 && (
                <div className="flex items-center text-destructive">
                  <AlertTriangle className="w-4 h-4 mr-1" />
                  <span className="text-sm font-medium">{totalAlerts}</span>
                </div>
              )} */}

              {/* Menú de contexto */}
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
              {totalDocuments} documentos totales
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
      <Dialog open={isAdvanceStageModalOpen} onOpenChange={setIsAdvanceStageModalOpen}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Avanzar a siguiente etapa</DialogTitle>
            <DialogDescription>
              Completa los campos requeridos para la etapa <b>{nextStage}</b>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {getNextStageFields().map(field => (
              <div key={field.name} className="flex flex-col gap-1">
                <Label className="text-sm font-medium">{field.label}</Label>
                {isFieldHeredado(field.name) ? (
                  <input
                    className="bg-gray-100 border rounded px-2 py-1 text-gray-500 cursor-not-allowed"
                    value={advanceStageFormData[field.name] || ''}
                    disabled
                    readOnly
                  />
                ) : (
                  <input
                    className="border rounded px-2 py-1"
                    value={advanceStageFormData[field.name] || ''}
                    onChange={e => setAdvanceStageFormData((prev: any) => ({ ...prev, [field.name]: e.target.value }))}
                    placeholder={field.placeholder || ''}
                    required={field.required}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="secundario" onClick={handleCloseAdvanceStage}>Cancelar</Button>
            <Button variant="primario" onClick={handleAdvanceStage}>
              Guardar y avanzar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
} 