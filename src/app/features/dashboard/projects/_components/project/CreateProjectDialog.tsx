import React from "react";
import { FormProvider } from "react-hook-form";
import { Button } from "@/shared/components/design-system/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { Badge } from "@/shared/components/ui/badge";
import { Check, Loader2 } from "lucide-react";
import clsx from "clsx";
import { BasicInfoStep } from "../form-steps/BasicInfoStep"
import { StageSpecificFieldsStep } from "../form-steps/StageSpecificFieldsStep"
import { FolderTemplatesStep } from "../form-steps/FolderTemplatesStep"
import { ProjectAlertsStep } from "../form-steps/ProjectAlertsStep"
import { useCreateProjectForm } from "../hooks/useCreateProjectForm";

interface CreateProjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateProjectDialog: React.FC<CreateProjectDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    // Estado del formulario
    currentStep,
    setCurrentStep,
    methods,
    isLoading,

    // Datos de las queries
    stageTypes,
    stageTypeDetail,
    tiposIniciativa,
    tiposObra,
    regiones,
    provincias,
    comunas,
    inspectoresFiscales,

    // Funciones
    canProceedToNextStep,
    handleCreateProject,
    resetForm,
    getCarpetasIniciales,
  } = useCreateProjectForm();

  /* TODO: verificar hook useCreateProjectForm, should have a queue. You are likely calling Hooks condintinally */
  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Información básica";
      case 2:
        return "Detalles del proyecto";
      case 3:
        return "Plantillas de carpetas";
      case 4:
        return "Alertas del proyecto";
      default:
        return "Crear proyecto";
    }
  };

  const getDialogWidth = () => {
    switch (currentStep) {
      case 1:
        return "max-w-md sm:max-w-lg";
      case 2:
        return "max-w-2xl sm:max-w-2xl";
      case 3:
        return "max-w-3xl sm:max-w-3xl";
      case 4:
        return "max-w-lg sm:max-w-lg";
      default:
        return "max-w-lg";
    }
  };

  const handleCreateProjectSubmit = async () => {

    const success = await handleCreateProject();
    if (success) {
      // La invalidación de queries en useCreateProject refrescará automáticamente la lista
      // No necesitamos crear un proyecto mock ni llamar a onCreateProject
      handleCloseDialog();
    }
  };

  const handleCloseDialog = () => {
    resetForm();
    onClose();
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <BasicInfoStep stageTypes={stageTypes} />;
      case 2:
        return (
          <StageSpecificFieldsStep
            tiposIniciativa={tiposIniciativa}
            tiposObra={tiposObra}
            regiones={regiones}
            provincias={provincias}
            comunas={comunas}
            inspectoresFiscales={inspectoresFiscales}
            stageTypeDetail={stageTypeDetail}
          />
        );
      case 3:
        return <FolderTemplatesStep carpetasIniciales={getCarpetasIniciales()} />;
      case 4:
        return <ProjectAlertsStep />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCloseDialog}>
      <DialogContent className={`${getDialogWidth()} max-h-[90vh] overflow-y-auto`}>
        <DialogHeader className="flex flex-col justify-between">
          <DialogTitle className="flex items-center space-x-2">
            <span>{getStepTitle()}</span>
            <Badge variant="outline">Paso {currentStep} de 4</Badge>
          </DialogTitle>
          <DialogDescription>
            <>
              {currentStep === 1 && "Ingresa la información básica del proyecto"}
              {currentStep === 2 && "Completa los detalles específicos según la etapa seleccionada"}
              {currentStep === 3 && "Selecciona las carpetas base para organizar tu proyecto"}
              {currentStep === 4 && "Configura alertas importantes para el proyecto"}
            </>
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

        <FormProvider {...methods}>
          <div className="space-y-6">{renderStepContent()}</div>
        </FormProvider>

        <div className="flex justify-between pt-6 border-t">
          <Button
            variant="secundario"
            onClick={() => {
              if (currentStep > 1) {
                setCurrentStep(currentStep - 1);
              } else {
                handleCloseDialog();
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
                onClick={handleCreateProjectSubmit}
                className="w-full"
                disabled={isLoading || !canProceedToNextStep()}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creando proyecto...
                  </>
                ) : (
                  "Crear proyecto"
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 