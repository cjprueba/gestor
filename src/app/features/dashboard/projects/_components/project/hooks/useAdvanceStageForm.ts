import { useCambiarEtapa } from "@/lib/api/hooks/useProjects";
import type {
  AvanzarEtapaResponse,
  ProyectoListItem,
} from "@/app/features/dashboard/projects/_components/project/project.types";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { useForm } from "react-hook-form";
import {
  advanceStageSchema,
  type AdvanceStageFormData,
} from "../project.validations";
import { ProjectsService } from "@/lib/api/services/projects.service";

interface UseAdvanceStageFormProps {
  project: ProyectoListItem | null;
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

  const { watch, setValue } = methods;

  // Mutation para cambiar etapa
  const cambiarEtapaMutation = useCambiarEtapa();

  // Función para obtener los valores de la etapa anterior más reciente
  const getPreviousStageValues = (): Partial<
    AdvanceStageFormData["stepOne"]
  > => {
    if (
      !etapaAvanzarInfo?.data?.etapas_anteriores ||
      etapaAvanzarInfo.data.etapas_anteriores.length === 0
    ) {
      return {};
    }

    // Obtener la etapa anterior más reciente (la última en el array)
    const etapaAnterior = etapaAvanzarInfo.data.etapas_anteriores[0];

    const values: Partial<AdvanceStageFormData["stepOne"]> = {};

    // Mapear campos de la etapa anterior al formulario
    if (etapaAnterior.tipo_iniciativa?.id) {
      values.tipo_iniciativa_id = etapaAnterior.tipo_iniciativa.id;
    }

    if (etapaAnterior.tipo_obra?.id) {
      values.tipo_obra_id = etapaAnterior.tipo_obra.id;
    }

    // Ubicación desde estructura anidada nueva
    const regiones_ids =
      (etapaAnterior as any)?.etapas_regiones
        ?.map((r: any) => r.id)
        .filter(Boolean) || [];
    const provincias_ids = (
      (etapaAnterior as any)?.etapas_regiones || []
    ).flatMap((r: any) =>
      (r?.etapas_provincias || [])
        .map((p: any) => p?.provincia?.id)
        .filter(Boolean)
    );
    const comunas_ids = ((etapaAnterior as any)?.etapas_regiones || []).flatMap(
      (r: any) =>
        (r?.etapas_provincias || []).flatMap((p: any) =>
          (p?.provincia?.etapas_comunas || [])
            .map((c: any) => c?.comuna?.id)
            .filter(Boolean)
        )
    );
    if (regiones_ids.length) values.regiones_ids = regiones_ids;
    if (provincias_ids.length) values.provincias_ids = provincias_ids;
    if (comunas_ids.length) values.comunas_ids = comunas_ids;

    if (etapaAnterior.volumen) {
      values.volumen = etapaAnterior.volumen;
    }

    if (etapaAnterior.presupuesto_oficial) {
      values.presupuesto_oficial = etapaAnterior.presupuesto_oficial;
    }

    if (etapaAnterior.valor_referencia) {
      values.valor_referencia = etapaAnterior.valor_referencia;
    }

    if (etapaAnterior.bip) {
      values.bip = etapaAnterior.bip;
    }

    if (etapaAnterior.fecha_llamado_licitacion) {
      values.fecha_llamado_licitacion = etapaAnterior.fecha_llamado_licitacion;
    }

    if (etapaAnterior.fecha_recepcion_ofertas_tecnicas) {
      values.fecha_recepcion_ofertas_tecnicas =
        etapaAnterior.fecha_recepcion_ofertas_tecnicas;
    }

    if (etapaAnterior.fecha_apertura_ofertas_economicas) {
      values.fecha_apertura_ofertas_economicas =
        etapaAnterior.fecha_apertura_ofertas_economicas;
    }

    if (etapaAnterior.decreto_adjudicacion) {
      values.decreto_adjudicacion = etapaAnterior.decreto_adjudicacion;
    }

    if (etapaAnterior.sociedad_concesionaria) {
      values.sociedad_concesionaria = etapaAnterior.sociedad_concesionaria;
    }

    if (etapaAnterior.fecha_inicio_concesion) {
      values.fecha_inicio_concesion = etapaAnterior.fecha_inicio_concesion;
    }

    if (etapaAnterior.plazo_total_concesion) {
      values.plazo_total_concesion = etapaAnterior.plazo_total_concesion;
    }

    return values;
  };

  // Función para pre-llenar el formulario (será llamada desde el componente padre)
  const prefillFormWithPreviousValues = () => {
    if (etapaAvanzarInfo?.data?.etapas_anteriores) {
      const previousValues = getPreviousStageValues();

      console.log(
        "Pre-llenando formulario con valores de etapa anterior:",
        previousValues
      );

      // Aplicar valores al formulario
      Object.entries(previousValues).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          setValue(`stepOne.${key}` as any, value);
        }
      });
    }
  };

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

    // Validación de ubicación: usar arrays (nuevo)
    if (siguienteEtapa.region) {
      const ok =
        Array.isArray(stepOneData.regiones_ids) &&
        stepOneData.regiones_ids.length > 0;
      if (!ok) return false;
    }

    if (siguienteEtapa.provincia) {
      const ok =
        Array.isArray(stepOneData.provincias_ids) &&
        stepOneData.provincias_ids.length > 0;
      if (!ok) return false;
    }

    if (siguienteEtapa.comuna) {
      const ok =
        Array.isArray(stepOneData.comunas_ids) &&
        stepOneData.comunas_ids.length > 0;
      if (!ok) return false;
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

    // Ubicación: construir estructura anidada regiones -> provincias -> comunas
    if (
      siguienteEtapa.region ||
      siguienteEtapa.provincia ||
      siguienteEtapa.comuna
    ) {
      const selectedRegionIds = Array.isArray(stepOneData.regiones_ids)
        ? stepOneData.regiones_ids
        : [];
      const selectedProvinciaIds = Array.isArray(stepOneData.provincias_ids)
        ? stepOneData.provincias_ids
        : [];
      const selectedComunaIds = Array.isArray(stepOneData.comunas_ids)
        ? stepOneData.comunas_ids
        : [];

      if (
        selectedRegionIds.length +
          selectedProvinciaIds.length +
          selectedComunaIds.length >
        0
      ) {
        // Fetch provincias por región en paralelo
        const provinciasResponses = await Promise.all(
          Array.from(new Set(selectedRegionIds)).map((rid) =>
            ProjectsService.getProvincias(rid)
          )
        );
        const provinciasAll: any[] = provinciasResponses.flatMap(
          (r: any) => r?.data || []
        );
        const provinciaIdToRegionId = new Map<number, number>();
        provinciasAll.forEach((p: any) => {
          const rid = p?.region_id ?? p?.region?.id;
          if (rid) provinciaIdToRegionId.set(p.id, Number(rid));
        });

        // Fetch comunas por (region, provincia) necesarios
        const comunaFetchPairs = Array.from(new Set(selectedProvinciaIds))
          .map((pid) => ({
            provinciaId: pid,
            regionId: provinciaIdToRegionId.get(pid),
          }))
          .filter((x) => x.regionId);

        const comunasResponses = await Promise.all(
          comunaFetchPairs.map(({ regionId, provinciaId }) =>
            ProjectsService.getComunas(
              regionId as number,
              provinciaId as number
            )
          )
        );
        const comunasAll: any[] = comunasResponses.flatMap(
          (r: any) => r?.data || []
        );
        const comunaIdToProvinciaId = new Map<number, number>();
        comunasAll.forEach((c: any) => {
          const pid = c?.provincia_id ?? c?.provincia?.id;
          if (pid) comunaIdToProvinciaId.set(c.id, Number(pid));
        });

        const regionesNested = Array.from(new Set(selectedRegionIds)).map(
          (rid) => {
            const provinciasForRegion = selectedProvinciaIds.filter(
              (pid) => provinciaIdToRegionId.get(pid) === rid
            );
            const provinciasNested = Array.from(
              new Set(provinciasForRegion)
            ).map((pid) => {
              const comunasForProvincia = selectedComunaIds.filter(
                (cid) => comunaIdToProvinciaId.get(cid) === pid
              );
              const comunasNested = Array.from(
                new Set(comunasForProvincia)
              ).map((cid) => ({ id: cid }));
              return { id: pid, comunas: comunasNested };
            });
            return { id: rid, provincias: provinciasNested };
          }
        );

        submitData.regiones = regionesNested;
      }
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

    console.log("Datos a enviar (avanzar etapa):", submitData);

    try {
      await cambiarEtapaMutation.mutateAsync({
        proyectoId: project.id,
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
    prefillFormWithPreviousValues,
  };
};
