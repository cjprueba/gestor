import React from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog"
import { Badge } from "@/shared/components/ui/badge"
import { Separator } from "@/shared/components/ui/separator"
import { Label } from "@/shared/components/ui/label"
import { REGIONES, PROVINCIAS, COMUNAS } from "@/shared/data"
import type { Project } from "./types"
import { MOCK_STAGE_FORMS } from "@/shared/data/stage-forms-mock"
import { ETAPAS } from "@/shared/data/project-data"

interface ProjectDetailsModalProps {
  project: Project | null
  isOpen: boolean
  onClose: () => void
}

export const ProjectDetailsModal: React.FC<ProjectDetailsModalProps> = ({
  project,
  isOpen,
  onClose,
}) => {
  if (!project) return null

  // Helper para obtener nombre de región, provincia y comuna
  const getLocationName = (id: string, type: 'region' | 'provincia' | 'comuna') => {
    switch (type) {
      case 'region':
        return REGIONES.find(r => r.id === id)?.nombre || id
      case 'provincia':
        return PROVINCIAS[project.projectData?.region || '']?.find(p => p.id === id)?.nombre || id
      case 'comuna':
        return COMUNAS[project.projectData?.provincia || '']?.find(c => c.id === id)?.nombre || id
      default:
        return id
    }
  }

  // Helper para obtener los campos agrupados por etapa
  const getFieldsByStage = (projectData: any) => {
    return ETAPAS.map(etapa => {
      const form = MOCK_STAGE_FORMS.find(f => f.name.includes(etapa))
      if (!form) return null
      const fields = form.fields.filter(field => projectData[field.name] !== undefined && projectData[field.name] !== "")
      if (fields.length === 0) return null
      return {
        etapa,
        fields: fields.map(field => ({
          label: field.label,
          value: projectData[field.name],
        })),
      }
    }).filter(Boolean)
  }

  const renderCommonFields = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium text-muted-foreground">Tipo de Iniciativa</Label>
          <p className="mt-1">{project.projectData?.tipoIniciativa || 'No especificado'}</p>
        </div>
        <div>
          <Label className="text-sm font-medium text-muted-foreground">Tipo de Obra</Label>
          <p className="mt-1">{project.projectData?.tipoObra || 'No especificado'}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label className="text-sm font-medium text-muted-foreground">Región</Label>
          <p className="mt-1">{project.projectData?.region ? getLocationName(project.projectData.region, 'region') : 'No especificado'}</p>
        </div>
        <div>
          <Label className="text-sm font-medium text-muted-foreground">Provincia</Label>
          <p className="mt-1">{project.projectData?.provincia ? getLocationName(project.projectData.provincia, 'provincia') : 'No especificado'}</p>
        </div>
        <div>
          <Label className="text-sm font-medium text-muted-foreground">Comuna</Label>
          <p className="mt-1">{project.projectData?.comuna ? getLocationName(project.projectData.comuna, 'comuna') : 'No especificado'}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium text-muted-foreground">Volumen</Label>
          <p className="mt-1">{project.projectData?.volumen || 'No especificado'}</p>
        </div>
        <div>
          <Label className="text-sm font-medium text-muted-foreground">Presupuesto Oficial</Label>
          <p className="mt-1">{project.projectData?.presupuestoOficial || 'No especificado'}</p>
        </div>
      </div>
    </div>
  )

  // const renderStageSpecificFields = () => {
  //   const { etapa, projectData } = project

  //   switch (etapa) {
  //     case 'Cartera de proyectos':
  //       return (
  //         <div className="space-y-4">
  //           <h4 className="font-medium">Campos Específicos - Cartera de Proyectos</h4>
  //           <div className="grid grid-cols-2 gap-4">
  //             <div>
  //               <Label className="text-sm font-medium text-muted-foreground">Llamado a Licitación (Año)</Label>
  //               <p className="mt-1">{projectData?.llamadoLicitacion || 'No especificado'}</p>
  //             </div>
  //             <div>
  //               <Label className="text-sm font-medium text-muted-foreground">Plazo de la Concesión</Label>
  //               <p className="mt-1">{projectData?.plazoConcesion || 'No especificado'}</p>
  //             </div>
  //           </div>
  //         </div>
  //       )

  //     case 'Proyectos en Licitación':
  //       return (
  //         <div className="space-y-4">
  //           <h4 className="font-medium">Campos Específicos - Proyectos en Licitación</h4>
  //           <div className="grid grid-cols-3 gap-4">
  //             <div>
  //               <Label className="text-sm font-medium text-muted-foreground">Fecha Llamado a Licitación</Label>
  //               <p className="mt-1">{projectData?.fechaLlamadoLicitacion || 'No especificado'}</p>
  //             </div>
  //             <div>
  //               <Label className="text-sm font-medium text-muted-foreground">Fecha Recepción de Ofertas</Label>
  //               <p className="mt-1">{projectData?.fechaRecepcionOfertas || 'No especificado'}</p>
  //             </div>
  //             <div>
  //               <Label className="text-sm font-medium text-muted-foreground">Fecha Apertura de Ofertas</Label>
  //               <p className="mt-1">{projectData?.fechaAperturaOfertas || 'No especificado'}</p>
  //             </div>
  //           </div>
  //         </div>
  //       )

  //     case 'Concesiones en Operación':
  //     case 'Concesiones en Construcción':
  //     case 'Concesiones en Operación y Construcción':
  //       return (
  //         <div className="space-y-4">
  //           <h4 className="font-medium">Campos Específicos - Concesiones Activas</h4>
  //           <div className="grid grid-cols-2 gap-4">
  //             <div>
  //               <Label className="text-sm font-medium text-muted-foreground">Decreto de Adjudicación</Label>
  //               <p className="mt-1">{projectData?.decretoAdjudicacion || 'No especificado'}</p>
  //             </div>
  //             <div>
  //               <Label className="text-sm font-medium text-muted-foreground">Sociedad Concesionaria</Label>
  //               <p className="mt-1">{projectData?.sociedadConcesionaria || 'No especificado'}</p>
  //             </div>
  //           </div>
  //           <div className="grid grid-cols-3 gap-4">
  //             <div>
  //               <Label className="text-sm font-medium text-muted-foreground">Inicio Plazo Concesión</Label>
  //               <p className="mt-1">{projectData?.inicioPlazoConcesion || 'No especificado'}</p>
  //             </div>
  //             <div>
  //               <Label className="text-sm font-medium text-muted-foreground">Plazo Total</Label>
  //               <p className="mt-1">{projectData?.plazoTotalConcesion || 'No especificado'}</p>
  //             </div>
  //             <div>
  //               <Label className="text-sm font-medium text-muted-foreground">Inspector Fiscal</Label>
  //               <p className="mt-1">{projectData?.inspectorFiscal || 'No asignado'}</p>
  //             </div>
  //           </div>
  //         </div>
  //       )

  //     case 'Concesiones Finalizadas':
  //       return (
  //         <div className="space-y-4">
  //           <h4 className="font-medium">Campos Específicos - Concesiones Finalizadas</h4>
  //           <div className="grid grid-cols-2 gap-4">
  //             <div>
  //               <Label className="text-sm font-medium text-muted-foreground">Valor de Referencia</Label>
  //               <p className="mt-1">{projectData?.valorReferencia || 'No especificado'}</p>
  //             </div>
  //             <div>
  //               <Label className="text-sm font-medium text-muted-foreground">Fecha de Finalización</Label>
  //               <p className="mt-1">{projectData?.fechaFinalizacion || 'No especificado'}</p>
  //             </div>
  //           </div>
  //           <div>
  //             <Label className="text-sm font-medium text-muted-foreground">Sociedad Concesionaria</Label>
  //             <p className="mt-1">{projectData?.sociedadConcesionaria || 'No especificado'}</p>
  //           </div>
  //         </div>
  //       )

  //     default:
  //       return null
  //   }
  // }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{project.name}</DialogTitle>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{project.etapa}</Badge>
            <span className="text-sm text-muted-foreground">
              Creado el {project.createdAt.toLocaleDateString()}
            </span>
          </div>
          <DialogDescription>
            Detalles del proyecto
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 space-y-6">
          {/* Información general */}
          <div>
            <h3 className="font-medium mb-4">Información General</h3>
            {renderCommonFields()}
          </div>

          <Separator />

          {/* Agrupación de campos por etapa */}
          <div className="space-y-6 mt-6">
            {getFieldsByStage(project.projectData || {}).map(grupo => {
              if (!grupo) return null
              return (
                <div key={grupo.etapa}>
                  <h4 className="font-semibold mb-2">{grupo.etapa}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {grupo.fields.map((f, idx) => (
                      <div key={idx} className="flex flex-col">
                        <span className="text-xs text-muted-foreground">{f.label}</span>
                        <span className="font-medium text-sm">{f.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Información de alertas si existen */}
          {project.projectData?.alertaDescripcion && (
            <>
              <Separator />
              <div>
                <h4 className="font-medium mb-2">Alertas</h4>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-sm">{project.projectData.alertaDescripcion}</p>
                  {project.projectData.alertaFechaLimite && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Fecha límite: {project.projectData.alertaFechaLimite}
                    </p>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Información del proyecto */}
          <Separator />
          <div>
            <h4 className="font-medium mb-2">Información del Sistema</h4>
            <div className="grid grid-cols-1 gap-4 text-sm">
              <div>
                <Label className="text-xs font-medium text-muted-foreground">Fecha de Creación</Label>
                <p className="mt-1">{project.createdAt.toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 