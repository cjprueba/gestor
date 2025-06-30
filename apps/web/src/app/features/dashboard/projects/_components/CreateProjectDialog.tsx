import React from "react"
import { Button } from "@/shared/components/design-system/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog"
import { Badge } from "@/shared/components/ui/badge"
import { Check, Loader2 } from "lucide-react"
import clsx from "clsx"
import { BasicInfoStep } from "./form-steps/BasicInfoStep"
import { StageSpecificFieldsStep } from "./form-steps/StageSpecificFieldsStep"
import { FolderTemplatesStep } from "./form-steps/FolderTemplatesStep"
import { ProjectAlertsStep } from "./form-steps/ProjectAlertsStep"
import { useProjectForm } from "./hooks/useProjectForm"
import type { Project } from "./types"
import { PLANTILLAS_CARPETAS } from "@/shared/data/project-data"

interface CreateProjectDialogProps {
  isOpen: boolean
  onClose: () => void
  onCreateProject: (project: Project) => void
}

export const CreateProjectDialog: React.FC<CreateProjectDialogProps> = ({
  isOpen,
  onClose,
  onCreateProject,
}) => {
  const {
    // State
    currentStep,
    formData,
    errors,
    comunasDisponibles,
    provinciasDisponibles,
    selectedFolders,
    folderConfigs,
    customFolders,
    useCustomTemplates,
    showFolderTemplates,
    isLoading,

    // Actions
    setCurrentStep,
    updateFormData,
    canProceedToNextStep,
    createCustomFolder,
    resetForm,
    setSelectedFolders,
    setFolderConfigs,
    setUseCustomTemplates,
    setShowFolderTemplates,
    setIsLoading,
  } = useProjectForm()

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Información básica"
      case 2:
        return "Detalles del proyecto"
      case 3:
        return "Plantillas de carpetas"
      case 4:
        return "Alertas del proyecto"
      default:
        return "Crear proyecto"
    }
  }

  const getDialogWidth = () => {
    switch (currentStep) {
      case 1:
        return "max-w-md sm:max-w-lg"
      case 2:
        return "max-w-2xl sm:max-w-2xl"
      case 3:
        return "max-w-3xl sm:max-w-3xl"
      case 4:
        return "max-w-lg sm:max-w-lg"
      default:
        return "max-w-lg"
    }
  }

  const handleCreateProject = () => {
    if (!formData.nombre.trim()) return

    setIsLoading(true)

    // Obtener carpetas de plantilla específicas de la etapa seleccionada
    const templateFolders: string[] = formData.etapa in PLANTILLAS_CARPETAS
      ? [...(PLANTILLAS_CARPETAS as any)[formData.etapa]]
      : []

    // Convertir carpetas de plantilla seleccionadas a objetos FolderStructure
    const selectedTemplateFolders = templateFolders
      .filter(folderName => selectedFolders.includes(folderName))
      .map(folderName => ({
        id: `template-${folderName.toLowerCase().replace(/\s+/g, '-')}`,
        name: folderName,
        minDocuments: folderConfigs[folderName]?.minDocs || 3,
        documents: [],
        subfolders: [],
        daysLimit: folderConfigs[folderName]?.daysLimit,
      }))

    // Obtener carpetas personalizadas seleccionadas
    const selectedCustomFolders = customFolders
      .filter(folder => selectedFolders.includes(folder.id))
      .map(folder => ({
        ...folder,
        minDocuments: folderConfigs[folder.id]?.minDocs || folder.minDocuments,
        daysLimit: folderConfigs[folder.id]?.daysLimit,
      }))

    // Combinar todas las carpetas seleccionadas
    const selectedStructure = [...selectedTemplateFolders, ...selectedCustomFolders]

    const newProject: Project = {
      id: Date.now().toString(),
      name: formData.nombre,
      createdAt: new Date(),
      etapa: formData.etapa,
      projectData: formData,
      structure: {
        id: "root",
        name: formData.nombre,
        minDocuments: 0,
        documents: [],
        subfolders: selectedStructure,
      },
    }

    onCreateProject(newProject)
    handleCloseDialog()
    setIsLoading(false)
  }

  const handleCloseDialog = () => {
    resetForm()
    onClose()
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <BasicInfoStep
            formData={formData}
            errors={errors}
            onUpdateFormData={updateFormData}
          />
        )
      case 2:
        return (
          <StageSpecificFieldsStep
            formData={formData}
            errors={errors}
            provinciasDisponibles={provinciasDisponibles}
            comunasDisponibles={comunasDisponibles}
            onUpdateFormData={updateFormData}
          />
        )
      case 3:
        return (
          <FolderTemplatesStep
            formData={formData}
            selectedFolders={selectedFolders}
            folderConfigs={folderConfigs}
            customFolders={customFolders}
            useCustomTemplates={useCustomTemplates}
            showFolderTemplates={showFolderTemplates}
            onSetSelectedFolders={setSelectedFolders}
            onSetFolderConfigs={setFolderConfigs}
            onSetUseCustomTemplates={setUseCustomTemplates}
            onSetShowFolderTemplates={setShowFolderTemplates}
            onCreateCustomFolder={createCustomFolder}
          />
        )
      case 4:
        return (
          <ProjectAlertsStep
            formData={formData}
            errors={errors}
            onUpdateFormData={updateFormData}
          />
        )
      default:
        return null
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleCloseDialog}>
      <DialogContent className={`${getDialogWidth()} max-h-[90vh] overflow-y-auto`}>
        <DialogHeader className="flex flex-col justify-between">
          <DialogTitle className="flex items-center space-x-2">
            <span>{getStepTitle()}</span>
            <Badge variant="outline">Paso {currentStep} de 4</Badge>
          </DialogTitle>
          <DialogDescription>
            <div className="text-sm text-muted-foreground">
              {currentStep === 1 && "Ingresa la información básica del proyecto"}
              {currentStep === 2 && "Completa los detalles específicos según la etapa seleccionada"}
              {currentStep === 3 && "Selecciona las carpetas base para organizar tu proyecto"}
              {currentStep === 4 && "Configura alertas importantes para el proyecto"}
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-center items-center w-full my-6">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={clsx(
                  "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium border-2",
                  step < currentStep && "bg-primary-500 border-primary-500 text-white",
                  step === currentStep && "bg-primary-500 border-primary-500 text-white",
                  step > currentStep && "bg-primary-100 border-primary-100 text-white"
                )}
              >
                {step < currentStep ? (
                  <Check className="h-5 w-5" />
                ) : (
                  step
                )}
              </div>
              {step !== 4 && (
                <div
                  className={clsx(
                    "w-20 h-0.5 mx-2",
                    step < currentStep && "bg-blue-600",
                    step === currentStep && "bg-blue-600",
                    step > currentStep && "bg-gray-200"
                  )}
                />
              )}
            </div>
          ))}
        </div>

        <div className="space-y-6">{renderStepContent()}</div>

        <div className="flex justify-between pt-6 border-t">
          <Button
            variant="secundario"
            onClick={() => {
              if (currentStep > 1) {
                setCurrentStep(currentStep - 1)
              } else {
                handleCloseDialog()
              }
            }}
          >
            {currentStep > 1 ? "Anterior" : "Cancelar"}
          </Button>

          <div className="flex space-x-2">
            {currentStep < 4 ? (
              <Button
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={!canProceedToNextStep()}
              >
                Siguiente
              </Button>
            ) : (
              <Button
                onClick={handleCreateProject}
                className="w-full"
                disabled={
                  selectedFolders.length === 0 ||
                  !formData.nombre.trim() ||
                  isLoading ||
                  !canProceedToNextStep()
                }
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creando Proyecto...
                  </>
                ) : (
                  `Crear proyecto (${selectedFolders.length} carpetas seleccionadas)`
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 