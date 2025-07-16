"use client"

import { Button } from "@/shared/components/design-system/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog"
import { Input } from "@/shared/components/ui/input"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/shared/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"
import type { ProjectStage, StageForm, StageType } from "@/shared/types/stage-types"
import {
  Copy,
  Edit,
  Eye,
  MoreHorizontal,
  Search,
  Loader2
} from "lucide-react"
import { useState } from "react"
import { CreateStageDialog } from "./create-stage-dialog"
import StageFormBuilder from "./stage-form-builder"
import StageFormPreview from "./stage-form-preview"
import { useStageTypes, useStageTypeDetail } from "@/lib/api/hooks/useStages"
import { ScrollArea } from "@radix-ui/react-scroll-area"

// Tipo para los datos del endpoint


interface StageManagerProps {
  stages: ProjectStage[]
  forms: StageForm[]
  // usageStats: StageUsageStats[]
  // onStagesChange: (stages: ProjectStage[]) => void
  onFormsChange: (forms: StageForm[]) => void
}

export default function StageManager({ forms, onFormsChange }: StageManagerProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTab, setSelectedTab] = useState("stages")
  // const [isCreateStageOpen, setIsCreateStageOpen] = useState(false)
  const [editingForm, setEditingForm] = useState<StageForm | null>(null)
  const [previewForm, setPreviewForm] = useState<StageForm | null>(null)
  const [selectedStageTypeId, setSelectedStageTypeId] = useState<number | null>(null)

  // Obtener tipos de etapa desde el endpoint
  const { data: stageTypesData, isLoading, error } = useStageTypes()

  // Obtener información detallada del tipo de etapa seleccionado
  const { data: stageTypeDetailData, isLoading: isLoadingDetail } = useStageTypeDetail(selectedStageTypeId)

  // Filtros
  // const filteredStages = stages.filter(
  //   (stage) =>
  //     (stage.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     (stage.description || '').toLowerCase().includes(searchTerm.toLowerCase()),
  // )

  // Usar los datos del endpoint si están disponibles, sino usar los props
  const displayStages: StageType[] = stageTypesData?.data || []


  // Crear nueva etapa
  // const createStage = () => {
  //   if (!newStageName.trim()) return

  //   const newStage: ProjectStage = {
  //     id: `stage-${Date.now()}`,
  //     name: newStageName,
  //     description: newStageDescription,
  //     color: newStageColor,
  //     order: stages.length + 1,
  //     isDefault: false,
  //     isActive: true,
  //     createdAt: new Date(),
  //     createdBy: "Usuario Actual",
  //     lastModifiedAt: new Date(),
  //     lastModifiedBy: "Usuario Actual",
  //   }

  //   onStagesChange([...stages, newStage])

  //   // Si se seleccionó crear formulario, abrir el builder
  //   if (createFormForStage) {
  //     const newForm: StageForm = {
  //       id: `form-${Date.now()}`,
  //       name: `${newStageName}`,
  //       description: `Formulario personalizado para la etapa ${newStageName}`,
  //       fields: [],
  //       createdAt: new Date(),
  //       createdBy: "Usuario Actual",
  //       lastModifiedAt: new Date(),
  //       lastModifiedBy: "Usuario Actual",
  //       isActive: true,
  //       version: 1,
  //     }

  //     onFormsChange([...forms, newForm])

  //     // Asociar el formulario a la etapa
  //     newStage.formId = newForm.id
  //     onStagesChange([...stages, newStage])

  //     setEditingForm(newForm)
  //   }

  //   // Limpiar formulario
  //   setNewStageName("")
  //   setNewStageDescription("")
  //   setNewStageColor("#3b82f6")
  //   setCreateFormForStage(false)
  //   setIsCreateStageOpen(false)
  // }

  // Obtener estadísticas de una etapa
  // const getStageStats = (stageId: string) => {
  //   return (
  //     usageStats.find((stat) => stat.stageId === stageId) || {
  //       stageId,
  //       projectCount: 0,
  //       averageCompletionTime: 0,
  //       lastUsed: new Date(),
  //       completionRate: 0,
  //     }
  //   )
  // }


  // Función para abrir el preview del formulario de un tipo de etapa
  const handleViewStageTypeForm = (stageTypeId: number) => {
    setSelectedStageTypeId(stageTypeId)
  }

  // Función para cerrar el preview del formulario
  const handleClosePreview = () => {
    setPreviewForm(null)
    setSelectedStageTypeId(null)
  }

  if (error) {
    return <div className="p-6">Error al cargar etapas: {error.message}</div>;
  }

  return (
    <div className="space-y-6 px-6 pb-6">
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Gestión de etapas</h1>
            <p className="text-muted-foreground mt-2">
              Administra las etapas de tus proyectos y sus formularios personalizados
            </p>
          </div>
          <CreateStageDialog onSuccess={() => {
            // Los datos se refrescarán automáticamente gracias al hook
            console.log('Etapa creada exitosamente');
          }} />
        </div>
      </div>

      {/* Controles */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center space-x-2 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar etapas o formularios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="stages">Etapas ({displayStages.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="stages" className="space-y-4 mt-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="ml-2">Cargando etapas...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayStages.map((stage) => {
                return (
                  <Card key={stage.id} className="group hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-md flex items-start gap-2 flex-1 mr-2">
                          <div
                            className="w-1 h-4 rounded-sm flex-shrink-0 mt-0.5"
                            style={{ backgroundColor: stage.color || '#3b82f6' }}
                          />
                          <span className="break-words leading-tight">{stage.nombre}</span>
                        </CardTitle>

                        <div className="flex items-start opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                          <Button variant="ghost" size="sm" >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Copy className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        {/* Removemos los badges por defecto ya que no tenemos esa info del endpoint */}
                      </div>
                      {stage.descripcion && stage.descripcion !== '-' && (
                        <CardDescription>{stage.descripcion}</CardDescription>
                      )}
                    </CardHeader>

                    <CardContent className="space-y-3">
                      <div className="flex items-center bg-muted rounded-md p-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewStageTypeForm(stage.id)}
                          className="text-xs"
                        >
                          Ver formulario
                        </Button>
                        <Eye className="w-4 h-4" />
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>


      </Tabs>

      {/* Form Builder Sheet */}
      {editingForm && (
        <Sheet open={!!editingForm} onOpenChange={() => setEditingForm(null)}>
          {/* <SheetContent className="w-full sm:max-w-4xl">
            <SheetHeader>
              <SheetTitle>Configuración del formulario</SheetTitle>
              <SheetDescription>Diseña los campos que aparecerán en el formulario de esta etapa.</SheetDescription>
            </SheetHeader> */}
          <SheetContent className="w-full sm:max-w-2xl flex flex-col h-full">
            <SheetHeader className="flex-shrink-0">
              <SheetTitle className="flex items-center space-x-2">
                <span>Configuración del formulario</span>
              </SheetTitle>
              <SheetDescription>Diseña los campos que aparecerán en el formulario de esta etapa.</SheetDescription>
            </SheetHeader>
            <div className="px-4">
              <h4 className="mb-4">Estas configurando: <span className="font-medium">{editingForm.name}</span></h4>
              <StageFormBuilder
                form={editingForm}
                onSave={(updatedForm) => {
                  const updatedForms = forms.map((f) => (f.id === updatedForm.id ? updatedForm : f))
                  onFormsChange(updatedForms)
                  setEditingForm(null)
                }}
                onCancel={() => setEditingForm(null)}
              />
            </div>
          </SheetContent>
        </Sheet>
      )}

      {/* Form Preview Dialog */}
      {previewForm && (
        <Dialog open={!!previewForm} onOpenChange={() => setPreviewForm(null)}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto flex flex-col">
            <DialogHeader className="flex-shrink-0">
              <DialogTitle>Vista Previa - {previewForm.name}</DialogTitle>
              <DialogDescription>
                Así se verá el formulario cuando los usuarios creen un proyecto en esta etapa.
              </DialogDescription>
            </DialogHeader>
            <StageFormPreview form={previewForm} />
          </DialogContent>
        </Dialog>
      )}

      <ScrollArea className="h-full">
        {/* Stage Type Form Preview Dialog */}
        {selectedStageTypeId && stageTypeDetailData && (
          <Dialog open={!!selectedStageTypeId} onOpenChange={handleClosePreview}>
            <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
              <DialogHeader className="flex-shrink-0">
                <DialogTitle>Vista Previa - {stageTypeDetailData.data.nombre}</DialogTitle>
                <DialogDescription>
                  Formulario configurado para esta etapa basado en los campos habilitados.
                </DialogDescription>
              </DialogHeader>
              <div className="flex-1 overflow-hidden">
                {isLoadingDetail ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span className="ml-2">Cargando formulario...</span>
                  </div>
                ) : (
                  <StageFormPreview
                    stageTypeDetail={stageTypeDetailData.data}
                    isStageTypeForm={true}
                  />
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </ScrollArea>
    </div >
  )
}
