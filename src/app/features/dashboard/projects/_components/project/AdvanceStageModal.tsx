import { useEtapaAvanzarInfo } from "@/lib/api/hooks/useProjects"
import { Button } from "@/shared/components/design-system/button"
import { Badge } from "@/shared/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog"
import { Separator } from "@/shared/components/ui/separator"
import clsx from "clsx"
import { ArrowRight, Check, Loader2 } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { FormProvider } from "react-hook-form"
import ShowPreviusStages from "../ShowPreviusStages"
import AdvanceStageStepOne from "./AdvanceStageSteps/AdvanceStageStepOne"
import AdvanceStageStepTwo from "./AdvanceStageSteps/AdvanceStageStepTwo"
import { useAdvanceStageForm } from "./hooks/useAdvanceStageForm"

import type { ProyectoListItem } from "./project.types"

interface AdvanceStageModalProps {
  project: ProyectoListItem | null
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export const AdvanceStageModal: React.FC<AdvanceStageModalProps> = ({
  project,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [currentStep, setCurrentStep] = useState(1)
  const hasPrefilled = useRef(false)

  const { data: etapaAvanzarInfo, isLoading, error } = useEtapaAvanzarInfo(project ? project.id : undefined)

  const {
    methods,
    canProceedToNextStep,
    handleAdvanceStage,
    cambiarEtapaMutation,
    siguienteEtapa,
    prefillFormWithPreviousValues
  } = useAdvanceStageForm({
    project,
    etapaAvanzarInfo: etapaAvanzarInfo || null,
    onSuccess,
    onClose
  })

  // Resetear el formulario cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      methods.reset()
      setCurrentStep(1)
      hasPrefilled.current = false // Resetear el flag cuando se abre el modal
    }
  }, [isOpen, methods])

  // Pre-llenar formulario con valores de etapa anterior después de que se carguen los datos
  useEffect(() => {
    if (isOpen && etapaAvanzarInfo && currentStep === 1 && !hasPrefilled.current) {
      console.log("Modal abierto, datos cargados, ejecutando pre-llenado...")
      // Usar setTimeout para asegurar que el FormProvider esté disponible
      setTimeout(() => {
        console.log("Ejecutando prefillFormWithPreviousValues...")
        prefillFormWithPreviousValues()
        hasPrefilled.current = true // Marcar como pre-llenado
        console.log("Pre-llenado completado, hasPrefilled.current =", hasPrefilled.current)
      }, 200)
    } else if (isOpen && etapaAvanzarInfo && currentStep === 1 && hasPrefilled.current) {
      console.log("Modal abierto, pero ya se pre-llenó anteriormente, saltando...")
    }
  }, [isOpen, etapaAvanzarInfo, currentStep, prefillFormWithPreviousValues])

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Detalles de la nueva etapa"
      case 2:
        return "Carpetas de la etapa"
      default:
        return "Avanzar etapa"
    }
  }

  const getDialogWidth = () => {
    switch (currentStep) {
      case 1:
        return "max-w-2xl sm:max-w-2xl"
      case 2:
        return "max-w-3xl sm:max-w-3xl"
      default:
        return "max-w-2xl"
    }
  }

  const handleCloseDialog = () => {
    methods.reset()
    setCurrentStep(1)
    onClose()
  }

  // Usar directamente FolderTemplatesStep para mantener consistencia visual

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="mt-8">
            <AdvanceStageStepOne
              etapaAvanzarInfo={etapaAvanzarInfo || null}
              isLoading={isLoading}
              error={error || null} />

          </div>
        )
      case 2:
        return (
          <AdvanceStageStepTwo etapaAvanzarInfo={etapaAvanzarInfo || null} siguienteEtapa={siguienteEtapa || null} />
        )
      default:
        return null
    }
  }

  if (!project) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleCloseDialog}>
      <DialogContent className={`${getDialogWidth()} max-h-[90vh] overflow-y-auto`}>
        <DialogHeader className="flex flex-col justify-between">
          <DialogTitle className="flex items-center space-x-2">
            <span>{getStepTitle()}</span>
            <Badge variant="outline">Paso {currentStep} de 2</Badge>
          </DialogTitle>
          <DialogDescription>
            <span className="text-sm text-muted-foreground">
              {project?.nombre && (
                <span className="font-medium block mb-2">Proyecto: {project.nombre}</span>
              )}
              {currentStep === 1 && "Completa los campos requeridos para la nueva etapa"}
              {currentStep === 2 && "Revisa y configura las carpetas de la nueva etapa"}
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-center items-center w-full my-6">
          {[1, 2].map((step) => (
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
              {step !== 2 && (
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
        <div className="flex items-center justify-center">
          {project?.etapas_registro?.[0]?.etapa_tipo?.nombre && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3 flex-col">
                <h2 className="text-sm font-medium">Etapa actual</h2>
                <div className="inline-flex items-center px-2 py-1 rounded border border-button-secondary text-primary-500 bg-background text-xs font-medium min-h-[24px]">
                  <span className="whitespace-normal break-words text-center leading-tight">
                    {project.etapas_registro[0].etapa_tipo.nombre}
                  </span>
                </div>
              </div>
              <div className="flex items-center self-center mt-8">
                <ArrowRight className="w-6 h-6 flex-shrink-0" />
              </div>
              <div className="flex items-center gap-3 flex-col">
                <h2 className="text-sm font-medium">Etapa siguiente</h2>
                <div className="inline-flex items-center px-2 py-1 rounded bg-primary-500 text-primary-foreground text-xs font-medium min-h-[24px]">
                  <span className="whitespace-normal break-words text-center leading-tight">
                    {etapaAvanzarInfo?.data?.siguiente_etapa?.nombre}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
        <FormProvider {...methods}>
          <div className="space-y-6">{renderStepContent()}</div>
        </FormProvider>

        {/* Información de etapas anteriores - solo mostrar en el paso 1 */}
        {currentStep === 1 && (
          <>
            <Separator />
            <ShowPreviusStages etapasAnteriores={etapaAvanzarInfo?.data?.etapas_anteriores || []} />
          </>
        )}

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
            {currentStep < 2 ? (
              <Button
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={!canProceedToNextStep(currentStep)}
              >
                Siguiente
              </Button>
            ) : (
              <Button
                onClick={handleAdvanceStage}
                className="w-full"
                disabled={cambiarEtapaMutation.isPending || !canProceedToNextStep(currentStep)}
              >
                {cambiarEtapaMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Avanzando etapa...
                  </>
                ) : (
                  "Avanzar etapa"
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 