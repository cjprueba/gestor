import { useCreateStageType } from '@/lib/api/hooks/useStages';
import { Button } from '@/shared/components/design-system/button';
import { Badge } from '@/shared/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import clsx from 'clsx';
import { Check, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { CreateStageForm } from './create-stage-form';
import { StageFormSelector } from './stage-form-selector';

interface CreateStageDialogProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CreateStageDialog({ onSuccess, onCancel }: CreateStageDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    color: '#3b82f6'
  });
  const [selectedFields, setSelectedFields] = useState<Record<string, boolean>>({});
  const [requiredFields, setRequiredFields] = useState<Record<string, boolean>>({});

  const createStageType = useCreateStageType();


  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return 'Información básica';
      case 2:
        return 'Configurar campos';
      default:
        return 'Crear etapa';
    }
  };

  const getDialogWidth = () => {
    switch (currentStep) {
      case 1:
        return 'max-w-md sm:max-w-lg';
      case 2:
        return 'max-w-4xl sm:max-w-4xl';
      default:
        return 'max-w-lg';
    }
  };

  const handleFieldToggle = (fieldKey: string, isSelected: boolean) => {
    setSelectedFields(prev => ({
      ...prev,
      [fieldKey]: isSelected
    }));

    // Si se deselecciona un campo, también quitar de requeridos
    if (!isSelected) {
      setRequiredFields(prev => {
        const newRequired = { ...prev };
        delete newRequired[fieldKey];
        return newRequired;
      });
    }
  };

  const handleRequiredToggle = (fieldKey: string, isRequired: boolean) => {
    setRequiredFields(prev => ({
      ...prev,
      [fieldKey]: isRequired
    }));
  };

  const handleCreateStage = async () => {
    if (!formData.nombre.trim()) return;

    try {
      // Preparar los datos para el endpoint
      const stageData = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        color: formData.color,
        // Todos los campos booleanos
        tipo_iniciativa: selectedFields.tipo_iniciativa || false,
        tipo_obra: selectedFields.tipo_obra || false,
        region: selectedFields.region || false,
        provincia: selectedFields.provincia || false,
        comuna: selectedFields.comuna || false,
        volumen: selectedFields.volumen || false,
        presupuesto_oficial: selectedFields.presupuesto_oficial || false,
        bip: selectedFields.bip || false,
        fecha_llamado_licitacion: selectedFields.fecha_llamado_licitacion || false,
        fecha_recepcion_ofertas_tecnicas: selectedFields.fecha_recepcion_ofertas_tecnicas || false,
        fecha_apertura_ofertas_economicas: selectedFields.fecha_apertura_ofertas_economicas || false,
        fecha_inicio_concesion: selectedFields.fecha_inicio_concesion || false,
        plazo_total_concesion: selectedFields.plazo_total_concesion || false,
        decreto_adjudicacion: selectedFields.decreto_adjudicacion || false,
        sociedad_concesionaria: selectedFields.sociedad_concesionaria || false,
        inspector_fiscal_id: selectedFields.inspector_fiscal_id || false,
      };

      await createStageType.mutateAsync(stageData);

      // El hook maneja automáticamente los toasts y la invalidación de queries
      handleCloseDialog();
      onSuccess?.();
    } catch (error) {
      // El hook ya maneja el error y muestra el toast
      console.error('Error al crear etapa:', error);
    }
  };

  const handleCloseDialog = () => {
    setCurrentStep(1);
    setFormData({ nombre: '', descripcion: '', color: '#3b82f6' });
    setSelectedFields({});
    setRequiredFields({});
    setIsOpen(false);
    onCancel?.();
  };

  const canProceedToNextStep = () => {
    if (currentStep === 1) {
      return formData.nombre.trim().length > 0;
    }
    return true;
  };

  const canCreateStage = () => {
    return formData.nombre.trim().length > 0 && Object.keys(selectedFields).length > 0;
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <CreateStageForm
            onSuccess={(data) => {
              setFormData({
                nombre: data.nombre,
                descripcion: data.descripcion || '',
                color: data.color
              });
              setCurrentStep(2);
            }}
            onDataChange={(data) => {
              console.log('Datos del formulario actualizados:', data);
              setFormData({
                nombre: data.nombre,
                descripcion: data.descripcion || '',
                color: data.color
              });
            }}
            onCancel={handleCloseDialog}
          />
        );
      case 2:
        return (
          <StageFormSelector
            selectedFields={selectedFields}
            requiredFields={requiredFields}
            onFieldToggle={handleFieldToggle}
            onRequiredToggle={handleRequiredToggle}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)} variant="primario">
        Crear etapa
      </Button>

      <Dialog open={isOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className={`${getDialogWidth()} max-h-[90vh] overflow-y-auto`}>
          <DialogHeader className="flex flex-col justify-between">
            <DialogTitle className="flex items-center space-x-2">
              <span>{getStepTitle()}</span>
              <Badge variant="outline">Paso {currentStep} de 2</Badge>
            </DialogTitle>
            <DialogDescription>
              <div className="text-sm text-muted-foreground">
                {currentStep === 1 && "Ingresa la información básica de la etapa"}
                {currentStep === 2 && "Selecciona los campos que tendrá esta etapa"}
              </div>
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

          <div className="space-y-6">{renderStepContent()}</div>

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
                  onClick={() => {
                    if (currentStep === 1) {
                      // Activar el submit del formulario
                      (window as any).submitStageForm?.();
                    } else {
                      setCurrentStep(currentStep + 1);
                    }
                  }}
                  disabled={!canProceedToNextStep()}
                >
                  Siguiente
                </Button>
              ) : (
                <Button
                  onClick={handleCreateStage}
                  className="w-full"
                  disabled={
                    !canCreateStage() ||
                    createStageType.isPending
                  }
                >
                  {createStageType.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creando Etapa...
                    </>
                  ) : (
                    `Crear etapa (${Object.keys(selectedFields).length} campos seleccionados)`
                  )}
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
} 