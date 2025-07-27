import { useCambiarEtapa } from "@/lib/api/hooks/useProjects";
import type { AvanzarEtapaResponse } from "@/app/features/dashboard/projects/_components/project/project.types";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { useForm } from "react-hook-form";
import type { Project } from "../project.types";
import {
  advanceStageSchema,
  type AdvanceStageFormData,
} from "../project.validations";

interface UseAdvanceStageFormProps {
  project: Project | null;
  etapaAvanzarInfo: AvanzarEtapaResponse | null;
  onSuccess?: () => void;
  onClose: () => void;
}

export const useAdvanceStageForm = ({
  project,
  etapaAvanzarInfo,
  onSuccess,
  onClose,
}: UseAdvanceStageFormProps) => {
  // React Hook Form
  const methods = useForm<AdvanceStageFormData>({
    resolver: zodResolver(advanceStageSchema),
    defaultValues: {
      stepOne: {},
      stepTwo: {
        carpetas: [],
      },
    },
    mode: "onChange",
  });

  const { watch } = methods;

  // Mutation para cambiar etapa
  const cambiarEtapaMutation = useCambiarEtapa();

  // Obtener campos de la siguiente etapa
  const siguienteEtapa = etapaAvanzarInfo?.data?.siguiente_etapa;

  // Función para validar si los campos requeridos están completos
  const validateRequiredFields = (): boolean => {
    const stepOneData = watch("stepOne");

    if (!siguienteEtapa) return false;

    // Validar campos obligatorios específicos de la siguiente etapa
    if (siguienteEtapa.tipo_iniciativa && !stepOneData.tipo_iniciativa_id) {
      return false;
    }

    if (siguienteEtapa.tipo_obra && !stepOneData.tipo_obra_id) {
      return false;
    }

    if (siguienteEtapa.region && !stepOneData.region_id) {
      return false;
    }

    if (siguienteEtapa.provincia && !stepOneData.provincia_id) {
      return false;
    }

    if (siguienteEtapa.comuna && !stepOneData.comuna_id) {
      return false;
    }

    return true;
  };

  const canProceedToNextStep = (currentStep: number) => {
    switch (currentStep) {
      case 1:
        // Validar campos requeridos según la siguiente etapa
        return validateRequiredFields();

      case 2:
        // Validación para carpetas - siempre permitir continuar
        // ya que las carpetas iniciales se crean automáticamente
        return true;

      default:
        return false;
    }
  };

  const onSubmit = async (data: AdvanceStageFormData) => {
    if (!project || !siguienteEtapa) return;

    // Construir objeto con solo los campos habilitados para esta etapa
    const submitData: any = {
      etapa_tipo_id: siguienteEtapa.id,
      usuario_creador: 1, // TODO: Obtener del contexto de usuario
      inspector_fiscal_id: 1,
    };

    // Solo incluir campos que están habilitados en la siguiente etapa
    const stepOneData = data.stepOne;

    if (siguienteEtapa.tipo_iniciativa && stepOneData.tipo_iniciativa_id) {
      submitData.tipo_iniciativa_id = stepOneData.tipo_iniciativa_id;
    }

    if (siguienteEtapa.tipo_obra && stepOneData.tipo_obra_id) {
      submitData.tipo_obra_id = stepOneData.tipo_obra_id;
    }

    if (siguienteEtapa.region && stepOneData.region_id) {
      submitData.region_id = stepOneData.region_id;
    }

    if (siguienteEtapa.provincia && stepOneData.provincia_id) {
      submitData.provincia_id = stepOneData.provincia_id;
    }

    if (siguienteEtapa.comuna && stepOneData.comuna_id) {
      submitData.comuna_id = stepOneData.comuna_id;
    }

    if (siguienteEtapa.volumen && stepOneData.volumen) {
      submitData.volumen = stepOneData.volumen;
    }

    if (siguienteEtapa.presupuesto_oficial && stepOneData.presupuesto_oficial) {
      submitData.presupuesto_oficial = stepOneData.presupuesto_oficial;
    }

    if (siguienteEtapa.valor_referencia && stepOneData.valor_referencia) {
      submitData.valor_referencia = stepOneData.valor_referencia;
    }

    if (siguienteEtapa.bip && stepOneData.bip) {
      submitData.bip = stepOneData.bip;
    }

    // Convertir fechas a formato ISO solo si están habilitadas y tienen valor
    if (
      siguienteEtapa.fecha_llamado_licitacion &&
      stepOneData.fecha_llamado_licitacion
    ) {
      submitData.fecha_llamado_licitacion = dayjs(
        stepOneData.fecha_llamado_licitacion
      ).toISOString();
    }

    if (
      siguienteEtapa.fecha_recepcion_ofertas_tecnicas &&
      stepOneData.fecha_recepcion_ofertas_tecnicas
    ) {
      submitData.fecha_recepcion_ofertas_tecnicas = dayjs(
        stepOneData.fecha_recepcion_ofertas_tecnicas
      ).toISOString();
    }

    if (
      siguienteEtapa.fecha_apertura_ofertas_economicas &&
      stepOneData.fecha_apertura_ofertas_economicas
    ) {
      submitData.fecha_apertura_ofertas_economicas = dayjs(
        stepOneData.fecha_apertura_ofertas_economicas
      ).toISOString();
    }

    if (
      siguienteEtapa.decreto_adjudicacion &&
      stepOneData.decreto_adjudicacion
    ) {
      submitData.decreto_adjudicacion = stepOneData.decreto_adjudicacion;
    }

    if (
      siguienteEtapa.sociedad_concesionaria &&
      stepOneData.sociedad_concesionaria
    ) {
      submitData.sociedad_concesionaria = stepOneData.sociedad_concesionaria;
    }

    if (
      siguienteEtapa.fecha_inicio_concesion &&
      stepOneData.fecha_inicio_concesion
    ) {
      submitData.fecha_inicio_concesion = dayjs(
        stepOneData.fecha_inicio_concesion
      ).toISOString();
    }

    if (
      siguienteEtapa.plazo_total_concesion &&
      stepOneData.plazo_total_concesion
    ) {
      submitData.plazo_total_concesion = stepOneData.plazo_total_concesion;
    }

    console.log("Datos a enviar:", submitData);

    try {
      await cambiarEtapaMutation.mutateAsync({
        proyectoId: parseInt(project.id),
        data: submitData,
      });

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Error al cambiar etapa:", error);
    }
  };

  const handleAdvanceStage = async () => {
    // Validar campos requeridos antes de enviar
    if (!validateRequiredFields()) {
      console.error("Campos requeridos faltantes");
      return;
    }

    const formData = methods.getValues();
    await onSubmit(formData);
  };

  return {
    methods,
    validateRequiredFields,
    canProceedToNextStep,
    onSubmit,
    handleAdvanceStage,
    cambiarEtapaMutation,
    siguienteEtapa,
  };
};
