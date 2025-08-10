import { useState, useEffect } from "react";
import { useQueries } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  useCreateProject,
  useTiposIniciativa,
  useRegiones,
  useInspectoresFiscales,
} from "@/lib/api/hooks/useProjects";
import { ProjectsService } from "@/lib/api/services/projects.service";
import { useStageTypes, useStageTypeDetail } from "@/lib/api/hooks/useStages";
import { useTiposObras } from "@/lib/api/hooks/useTipoObra";
import dayjs from "dayjs";
import {
  createProjectSchema,
  type CreateProjectFormData,
} from "../project/project.validations";

export const useCreateProjectForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedEtapaId, setSelectedEtapaId] = useState<number | undefined>(
    undefined
  );
  // IDs legacy removidos: ya no se usan seleccionadores simples

  // Formulario con react-hook-form y zod
  const methods = useForm<CreateProjectFormData>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      createProjectStepOne: {
        nombre: "",
        etapa: "",
      },
      createProjectStepTwo: {
        tipo_iniciativa_id: 0,
        tipo_obra_id: 0,
        regiones_ids: [],
        provincias_ids: [],
        comunas_ids: [],
        volumen: "",
        presupuesto_oficial: "",
        valor_referencia: "",
        bip: "",
        fecha_llamado_licitacion: "",
        fecha_recepcion_ofertas_tecnicas: "",
        fecha_apertura_ofertas_economicas: "",
        decreto_adjudicacion: "",
        sociedad_concesionaria: "",
        fecha_inicio_concesion: "",
        plazo_total_concesion: "",
        inspector_fiscal_id: 0,
      },
      createProjectStepThree: {
        carpetas: [],
      },
    },
    mode: "onChange",
  });

  const {
    watch,
    setValue,
    formState: { errors, isValid },
  } = methods;

  // Observar cambios en los campos del formulario
  const watchedStepOne = watch("createProjectStepOne");
  const watchedStepTwo = watch("createProjectStepTwo");

  // Queries para obtener datos
  const { data: stageTypesData } = useStageTypes();
  const { data: stageTypeDetailData } = useStageTypeDetail(
    selectedEtapaId || null
  );

  // Auto-seleccionar "Cartera de proyecto" al cargar los datos
  useEffect(() => {
    if (stageTypesData?.data && !selectedEtapaId) {
      const carteraStage = stageTypesData.data.find(
        (stage) => stage.nombre === "Cartera de proyectos"
      );
      if (carteraStage) {
        setSelectedEtapaId(carteraStage.id);
        setValue("createProjectStepOne.etapa", carteraStage.nombre);
      }
    }
  }, [stageTypesData, selectedEtapaId, setValue]);
  const { data: tiposIniciativaData } = useTiposIniciativa();
  // Obtener todos los tipos de obra disponibles (no filtrados por etapa)
  const { data: tiposObraData } = useTiposObras();
  const { data: regionesData } = useRegiones();

  // Multi-fetch para provincias cuando hay múltiples regiones seleccionadas
  const regionesIds = Array.isArray(watchedStepTwo.regiones_ids)
    ? watchedStepTwo.regiones_ids
    : [];

  const provinciasQueries = useQueries({
    queries: regionesIds.map((rid) => ({
      queryKey: ["provincias", rid],
      queryFn: () => ProjectsService.getProvincias(rid),
      enabled: !!rid,
      staleTime: 5 * 60 * 1000,
    })),
  });

  const provinciasList = provinciasQueries.flatMap((q) => q.data?.data || []);

  // Multi-fetch para comunas cuando hay múltiples provincias seleccionadas
  const provinciasIds = Array.isArray(watchedStepTwo.provincias_ids)
    ? watchedStepTwo.provincias_ids
    : [];

  // Mapear provincia->region usando las provincias ya cargadas
  const provinciaIdToRegionId = new Map<number, number>();
  provinciasList.forEach((p: any) => {
    const regionId = p.region_id ?? p.region?.id;
    if (regionId) provinciaIdToRegionId.set(p.id, Number(regionId));
  });

  const comunaPairs = provinciasIds
    .map((pid) => ({
      provinciaId: pid,
      regionId: provinciaIdToRegionId.get(pid),
    }))
    .filter((x) => x.regionId);

  const comunasQueries = useQueries({
    queries: comunaPairs.map(({ regionId, provinciaId }) => ({
      queryKey: ["comunas", regionId, provinciaId],
      queryFn: () =>
        ProjectsService.getComunas(regionId as number, provinciaId as number),
      enabled: !!regionId && !!provinciaId,
      staleTime: 5 * 60 * 1000,
    })),
  });

  const comunasList = comunasQueries.flatMap((q) => q.data?.data || []);
  const { data: inspectoresFiscalesData } = useInspectoresFiscales();

  // Mutation para crear proyecto
  const createProjectMutation = useCreateProject();

  // Efecto para actualizar el ID de la etapa cuando cambia la selección
  useEffect(() => {
    if (watchedStepOne.etapa && stageTypesData?.data) {
      const selectedStage = stageTypesData.data.find(
        (stage) => stage.nombre === watchedStepOne.etapa
      );
      if (selectedStage) {
        setSelectedEtapaId(selectedStage.id);
        // Ya no reseteamos el tipo de obra porque ahora es independiente de la etapa
      }
    }
  }, [watchedStepOne.etapa, stageTypesData, setValue]);

  // Efecto para actualizar el ID de la región cuando cambia la selección
  // Efectos legacy removidos (IDs simples)

  // Función para obtener las carpetas iniciales de la etapa
  const getCarpetasIniciales = () => {
    if (!stageTypeDetailData?.data?.carpetas_iniciales) {
      return [];
    }

    const carpetas = stageTypeDetailData.data.carpetas_iniciales;
    const carpetasArray: Array<{ nombre: string; tipo: string }> = [];

    const extractCarpetas = (obj: any, parentName = "") => {
      Object.entries(obj).forEach(([key, value]) => {
        const nombre = parentName ? `${parentName} > ${key}` : key;
        carpetasArray.push({ nombre, tipo: "inicial" });

        if (
          typeof value === "object" &&
          value !== null &&
          Object.keys(value).length > 0
        ) {
          extractCarpetas(value, nombre);
        }
      });
    };

    extractCarpetas(carpetas);
    return carpetasArray;
  };

  // Función para validar si se puede avanzar al siguiente paso
  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 1:
        return (
          watchedStepOne.nombre.trim() !== "" && watchedStepOne.etapa !== ""
        );
      case 2: {
        const regionOk =
          Array.isArray(watchedStepTwo.regiones_ids) &&
          watchedStepTwo.regiones_ids.length > 0;
        const provinciaOk =
          Array.isArray(watchedStepTwo.provincias_ids) &&
          watchedStepTwo.provincias_ids.length > 0;
        const comunaOk =
          Array.isArray(watchedStepTwo.comunas_ids) &&
          watchedStepTwo.comunas_ids.length > 0;
        return (
          watchedStepTwo.tipo_iniciativa_id > 0 &&
          watchedStepTwo.tipo_obra_id > 0 &&
          regionOk &&
          provinciaOk &&
          comunaOk
        );
      }
      case 3:
        // Permitir continuar si hay carpetas (iniciales o personalizadas)
        // Las carpetas iniciales siempre estarán presentes
        return true;
      case 4:
        return true; // El paso 4 es opcional
      default:
        return false;
    }
  };

  // Función para convertir array de carpetas personalizadas a formato de objeto anidado
  // Solo procesa carpetas que NO son iniciales (tipo !== "inicial")
  const convertCarpetasToNestedObject = (carpetas: any[]) => {
    const result: Record<string, any> = {};

    const processSubcarpetas = (subcarpetas: any[]): Record<string, any> => {
      const subResult: Record<string, any> = {};
      subcarpetas.forEach((subcarpeta) => {
        // Solo procesar subcarpetas que no son iniciales
        if (subcarpeta.tipo !== "inicial") {
          subResult[subcarpeta.nombre] =
            subcarpeta.subcarpetas && subcarpeta.subcarpetas.length > 0
              ? processSubcarpetas(subcarpeta.subcarpetas)
              : {};
        }
      });
      return subResult;
    };

    carpetas.forEach((item) => {
      // Solo procesar carpetas que NO son iniciales
      if (item.tipo === "carpeta" && item.tipo !== "inicial") {
        result[item.nombre] =
          item.subcarpetas && item.subcarpetas.length > 0
            ? processSubcarpetas(item.subcarpetas)
            : {};
      } else if (item.nombre && item.tipo !== "inicial") {
        // Para carpetas simples que no son iniciales
        result[item.nombre] = {};
      }
    });

    return result;
  };

  // Función para limpiar los campos vacíos o no permitidos en etapas_registro
  const cleanEtapasRegistro = (data: any, allowedFields: string[]) => {
    const cleaned: any = {};
    for (const key of allowedFields) {
      if (data[key] !== undefined && data[key] !== null && data[key] !== "") {
        cleaned[key] = data[key];
      }
    }
    return cleaned;
  };

  // Función para manejar la creación del proyecto
  const handleCreateProject = async () => {
    if (!isValid) return;

    const formData = methods.getValues();

    // Convertir carpetas al formato esperado por la API (sin la clave 'carpetas')
    const carpetasAnidadas = convertCarpetasToNestedObject(
      formData.createProjectStepThree.carpetas || []
    );

    // Determinar los campos permitidos para la etapa actual
    let allowedFields: string[] = [];
    if (
      stageTypeDetailData?.data &&
      (stageTypeDetailData.data as any).formulario
    ) {
      allowedFields = Object.entries(
        (stageTypeDetailData.data as any).formulario
      )
        .filter(([_, v]) => v === true)
        .map(([k]) => k);
    } else {
      // fallback: permitir todos los campos
      allowedFields = Object.keys(formData.createProjectStepTwo);
    }
    // Siempre incluir los obligatorios
    allowedFields = Array.from(
      new Set([
        ...allowedFields,
        "etapa_tipo_id",
        "inspector_fiscal_id",
        "usuario_creador",
        "regiones",
      ])
    );

    // Preparar los datos para la API
    // Construir estructura anidada regiones -> provincias -> comunas
    const selectedRegionIds = Array.isArray(
      formData.createProjectStepTwo.regiones_ids
    )
      ? formData.createProjectStepTwo.regiones_ids
      : [];

    const selectedProvinciaIds = Array.isArray(
      formData.createProjectStepTwo.provincias_ids
    )
      ? formData.createProjectStepTwo.provincias_ids
      : [];

    const selectedComunaIds = Array.isArray(
      formData.createProjectStepTwo.comunas_ids
    )
      ? formData.createProjectStepTwo.comunas_ids
      : [];

    // Map provincia -> region
    const provinciaIdToRegionId = new Map<number, number>();
    provinciasList.forEach((p: any) => {
      const rid = p.region_id ?? p.region?.id;
      if (rid) provinciaIdToRegionId.set(p.id, Number(rid));
    });

    // Map comuna -> provincia
    const comunaIdToProvinciaId = new Map<number, number>();
    comunasList.forEach((c: any) => {
      const pid = c.provincia_id ?? c.provincia?.id;
      if (pid) comunaIdToProvinciaId.set(c.id, Number(pid));
    });

    const regionesNested = Array.from(new Set(selectedRegionIds)).map((rid) => {
      const provinciasForRegion = selectedProvinciaIds.filter(
        (pid) => provinciaIdToRegionId.get(pid) === rid
      );
      const provinciasNested = Array.from(new Set(provinciasForRegion)).map(
        (pid) => {
          const comunasForProvincia = selectedComunaIds.filter(
            (cid) => comunaIdToProvinciaId.get(cid) === pid
          );
          const comunasNested = Array.from(new Set(comunasForProvincia)).map(
            (cid) => ({ id: cid })
          );
          return { id: pid, comunas: comunasNested };
        }
      );
      return { id: rid, provincias: provinciasNested };
    });

    const etapasRegistroRaw = {
      etapa_tipo_id: selectedEtapaId || 1,
      tipo_iniciativa_id: formData.createProjectStepTwo.tipo_iniciativa_id,
      tipo_obra_id: formData.createProjectStepTwo.tipo_obra_id,
      regiones: regionesNested,
      volumen: formData.createProjectStepTwo.volumen,
      presupuesto_oficial: formData.createProjectStepTwo.presupuesto_oficial,
      valor_referencia: formData.createProjectStepTwo.valor_referencia,
      bip: formData.createProjectStepTwo.bip,
      fecha_llamado_licitacion: formData.createProjectStepTwo
        .fecha_llamado_licitacion
        ? dayjs(
            formData.createProjectStepTwo.fecha_llamado_licitacion
          ).toISOString()
        : undefined,
      fecha_recepcion_ofertas_tecnicas: formData.createProjectStepTwo
        .fecha_recepcion_ofertas_tecnicas
        ? dayjs(
            formData.createProjectStepTwo.fecha_recepcion_ofertas_tecnicas
          ).toISOString()
        : undefined,
      fecha_apertura_ofertas_economicas: formData.createProjectStepTwo
        .fecha_apertura_ofertas_economicas
        ? dayjs(
            formData.createProjectStepTwo.fecha_apertura_ofertas_economicas
          ).toISOString()
        : undefined,
      decreto_adjudicacion: formData.createProjectStepTwo.decreto_adjudicacion,
      sociedad_concesionaria:
        formData.createProjectStepTwo.sociedad_concesionaria,
      fecha_inicio_concesion: formData.createProjectStepTwo
        .fecha_inicio_concesion
        ? dayjs(
            formData.createProjectStepTwo.fecha_inicio_concesion
          ).toISOString()
        : undefined,
      plazo_total_concesion:
        formData.createProjectStepTwo.plazo_total_concesion,
      inspector_fiscal_id: 1, // Hardcodeado a 1 como solicitaste
      usuario_creador: 1, // Hardcodeado a 1 como solicitaste
    };
    const etapas_registro = cleanEtapasRegistro(
      etapasRegistroRaw,
      allowedFields
    );

    const projectData = {
      nombre: formData.createProjectStepOne.nombre,
      carpeta_inicial: carpetasAnidadas,
      division_id: 1, // Valores por defecto - deberían venir del contexto del usuario
      departamento_id: 1,
      unidad_id: 1,
      creado_por: 1, // ID del usuario actual
      etapas_registro,
    };

    console.log("=== DATOS ENVIADOS A LA API ===");
    console.log(JSON.stringify(projectData, null, 2));
    console.log("================================");

    try {
      console.log("[Crear Proyecto] Payload a enviar:", projectData);
      await createProjectMutation.mutateAsync(projectData);
      resetForm();
      return true;
    } catch (error) {
      console.error("Error al crear proyecto:", error);
      return false;
    }
  };

  // Función para resetear el formulario
  const resetForm = () => {
    methods.reset();
    setCurrentStep(1);
    setSelectedEtapaId(undefined);
  };

  return {
    // Estado del formulario
    currentStep,
    setCurrentStep,
    methods,
    errors,
    isValid,
    isLoading: createProjectMutation.isPending,
    selectedEtapaId,

    // Datos de las queries
    stageTypes: stageTypesData?.data || [],
    stageTypeDetail: stageTypeDetailData?.data,
    tiposIniciativa: tiposIniciativaData?.data || [],
    tiposObra: tiposObraData || [],
    regiones: regionesData?.data || [],
    provincias: provinciasList,
    comunas: comunasList,
    inspectoresFiscales: inspectoresFiscalesData?.data || [],

    // Funciones
    canProceedToNextStep,
    handleCreateProject,
    resetForm,
    getCarpetasIniciales,
  };
};
