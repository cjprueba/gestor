"use client"

import { Button } from "@/shared/components/design-system/button"
import { Badge } from "@/shared/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/shared/components/ui/sheet"
import { Switch } from "@/shared/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"
import { Textarea } from "@/shared/components/ui/textarea"
import type { ProjectStage, StageForm } from "@/shared/types/stage-types"
import {
  Copy,
  Edit,
  Eye,
  FileText,
  MoreHorizontal,
  Plus,
  Search
} from "lucide-react"
import { useState } from "react"
import StageFormBuilder from "./stage-form-builder"
import StageFormPreview from "./stage-form-preview"

interface StageManagerProps {
  stages: ProjectStage[]
  forms: StageForm[]
  // usageStats: StageUsageStats[]
  onStagesChange: (stages: ProjectStage[]) => void
  onFormsChange: (forms: StageForm[]) => void
}

export default function StageManager({ stages, forms, onStagesChange, onFormsChange }: StageManagerProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTab, setSelectedTab] = useState("stages")
  const [isCreateStageOpen, setIsCreateStageOpen] = useState(false)
  const [editingForm, setEditingForm] = useState<StageForm | null>(null)
  const [previewForm, setPreviewForm] = useState<StageForm | null>(null)

  // Estados para crear nueva etapa
  const [newStageName, setNewStageName] = useState("")
  const [newStageDescription, setNewStageDescription] = useState("")
  const [newStageColor, setNewStageColor] = useState("#3b82f6")
  const [createFormForStage, setCreateFormForStage] = useState(false)

  // Filtros
  const filteredStages = stages.filter(
    (stage) =>
      stage.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stage.description?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredForms = forms.filter(
    (form) =>
      form.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      form.description?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Crear nueva etapa
  const createStage = () => {
    if (!newStageName.trim()) return

    const newStage: ProjectStage = {
      id: `stage-${Date.now()}`,
      name: newStageName,
      description: newStageDescription,
      color: newStageColor,
      order: stages.length + 1,
      isDefault: false,
      isActive: true,
      createdAt: new Date(),
      createdBy: "Usuario Actual",
      lastModifiedAt: new Date(),
      lastModifiedBy: "Usuario Actual",
    }

    onStagesChange([...stages, newStage])

    // Si se seleccionó crear formulario, abrir el builder
    if (createFormForStage) {
      const newForm: StageForm = {
        id: `form-${Date.now()}`,
        name: `${newStageName}`,
        description: `Formulario personalizado para la etapa ${newStageName}`,
        fields: [],
        createdAt: new Date(),
        createdBy: "Usuario Actual",
        lastModifiedAt: new Date(),
        lastModifiedBy: "Usuario Actual",
        isActive: true,
        version: 1,
      }

      onFormsChange([...forms, newForm])

      // Asociar el formulario a la etapa
      newStage.formId = newForm.id
      onStagesChange([...stages, newStage])

      setEditingForm(newForm)
    }

    // Limpiar formulario
    setNewStageName("")
    setNewStageDescription("")
    setNewStageColor("#3b82f6")
    setCreateFormForStage(false)
    setIsCreateStageOpen(false)
  }

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

  // Obtener formulario asociado a una etapa
  const getStageForm = (stageId: string) => {
    const stage = stages.find((s) => s.id === stageId)
    return stage?.formId ? forms.find((f) => f.id === stage.formId) : null
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
          <Dialog open={isCreateStageOpen} onOpenChange={setIsCreateStageOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Nueva etapa
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Crear nueva etapa</DialogTitle>
                <DialogDescription>
                  Define una nueva etapa para tus proyectos y opcionalmente crea su formulario personalizado.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="stage-name">Nombre de la etapa</Label>
                  <Input
                    id="stage-name"
                    value={newStageName}
                    onChange={(e) => setNewStageName(e.target.value)}
                    placeholder="Ej: Diseño Preliminar"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stage-description">Descripción (Opcional)</Label>
                  <Textarea
                    id="stage-description"
                    value={newStageDescription}
                    onChange={(e) => setNewStageDescription(e.target.value)}
                    placeholder="Describe el propósito de esta etapa..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stage-color">Color de identificación</Label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      id="stage-color"
                      value={newStageColor}
                      onChange={(e) => setNewStageColor(e.target.value)}
                      className="w-10 h-10 rounded border"
                    />
                    <Input
                      value={newStageColor}
                      onChange={(e) => setNewStageColor(e.target.value)}
                      placeholder="#3b82f6"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="create-form" checked={createFormForStage} onCheckedChange={setCreateFormForStage} />
                  <Label htmlFor="create-form">Crear formulario personalizado para esta etapa</Label>
                </div>

                <div className="flex justify-end space-x-2 mt-6">
                  <Button variant="secundario" onClick={() => setIsCreateStageOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={createStage}>Crear etapa</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
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
          <TabsTrigger value="stages">Etapas ({stages.length})</TabsTrigger>
          <TabsTrigger value="forms">Formularios ({forms.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="stages" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStages.map((stage) => {
              const associatedForm = getStageForm(stage.id)
              return (
                <Card key={stage.id} className="group hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-md flex items-start gap-2 flex-1 mr-2">
                        <div className="w-1 h-4 rounded-sm flex-shrink-0 mt-0.5" style={{ backgroundColor: stage.color }} />
                        <span className="break-words leading-tight">{stage.name}</span>
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
                      {stage.isDefault && (
                        <Badge variant="secondary" className="text-xs">
                          Por defecto
                        </Badge>
                      )}
                      {!stage.isActive && (
                        <Badge variant="destructive" className="text-xs">
                          Inactiva
                        </Badge>
                      )}
                    </div>
                    {stage.description && <CardDescription>{stage.description}</CardDescription>}
                  </CardHeader>

                  <CardContent className="space-y-3">


                    {/* Formulario asociado */}
                    {associatedForm ? (
                      <div className="flex items-center justify-between p-2 bg-muted rounded">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-blue-500" />
                          <span className="text-sm font-medium">{associatedForm.name}</span>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => setPreviewForm(associatedForm)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center p-2 border-2 border-dashed border-muted-foreground/25 rounded">
                        <span className="text-xs text-muted-foreground">Sin formulario asociado</span>
                      </div>
                    )}

                    {/* Acciones */}
                    {/* <div className="flex items-center justify-between pt-2">
                      <div className="text-xs text-muted-foreground">Orden: {stage.order}</div>
                      <div className="flex items-center space-x-1">
                        <Button variant="ghost" size="sm" onClick={() => setEditingStage(stage)}>
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Copy className="w-3 h-3" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-3 h-3" />
                        </Button>
                      </div>
                    </div> */}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="forms" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredForms.map((form) => (
              <Card key={form.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{form.name}</CardTitle>
                    <div className="flex items-center space-x-1">
                      {!form.isActive && (
                        <Badge variant="destructive" className="text-xs">
                          Inactivo
                        </Badge>
                      )}
                    </div>
                  </div>
                  {form.description && <CardDescription>{form.description}</CardDescription>}
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Campos:</span>
                    <span className="font-medium">{form.fields.length}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Versión:</span>
                    <span className="font-medium">v{form.version}</span>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="text-xs text-muted-foreground">{form.lastModifiedAt.toLocaleDateString()}</div>
                    <div className="flex items-center space-x-1">
                      <Button variant="ghost" size="sm" onClick={() => setPreviewForm(form)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setEditingForm(form)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
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
          <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
            <DialogHeader className="flex-shrink-0">
              <DialogTitle>Vista Previa - {previewForm.name}</DialogTitle>
              <DialogDescription>
                Así se verá el formulario cuando los usuarios creen un proyecto en esta etapa.
              </DialogDescription>
            </DialogHeader>
            <div className="flex-1 overflow-hidden">
              <StageFormPreview form={previewForm} />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
