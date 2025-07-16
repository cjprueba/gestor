import {
  useQuery,
  useMutation,
  useQueryClient,
  useQueries,
} from "@tanstack/react-query";
import { StagesService } from "../services/stages.service";
import type {
  StagesQueryParams,
  CreateStageRequest,
} from "@/shared/types/stage-types";

// Query keys para react-query
export const stagesKeys = {
  all: ["stages"] as const,
  lists: () => [...stagesKeys.all, "list"] as const,
  list: (params?: StagesQueryParams) =>
    [...stagesKeys.lists(), params] as const,
  details: () => [...stagesKeys.all, "detail"] as const,
  detail: (id: number) => [...stagesKeys.details(), id] as const,
  activas: () => [...stagesKeys.all, "activas"] as const,
  types: () => [...stagesKeys.all, "types"] as const,
  typeDetails: () => [...stagesKeys.all, "typeDetails"] as const,
  typeDetail: (id: number) => [...stagesKeys.typeDetails(), id] as const,
};

/**
 * Hook para obtener todas las etapas con paginación y filtros
 */
export const useStages = (params?: StagesQueryParams) => {
  return useQuery({
    queryKey: stagesKeys.list(params),
    queryFn: () => StagesService.getStages(params),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
};

/**
 * Hook para obtener una etapa específica por ID
 */
export const useStage = (id: number) => {
  return useQuery({
    queryKey: stagesKeys.detail(id),
    queryFn: () => StagesService.getStageById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * Hook para obtener solo etapas activas
 */
export const useStagesActive = () => {
  return useQuery({
    queryKey: stagesKeys.activas(),
    queryFn: () => StagesService.getStagesActivas(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * Hook para crear una nueva etapa
 */
export const useCreateStage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateStageRequest) => StagesService.createStage(data),
    onSuccess: () => {
      // Invalidar todas las queries de etapas para refrescar los datos
      queryClient.invalidateQueries({ queryKey: stagesKeys.all });
    },
    onError: (error) => {
      console.error("Error al crear etapa:", error);
    },
  });
};

/**
 * Hook para actualizar una etapa
 */
export const useUpdateStage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CreateStageRequest }) =>
      StagesService.updateStage(id, data),
    onSuccess: (_, { id }) => {
      // Invalidar queries específicas
      queryClient.invalidateQueries({ queryKey: stagesKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: stagesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: stagesKeys.activas() });
    },
    onError: (error) => {
      console.error("Error al actualizar etapa:", error);
    },
  });
};

/**
 * Hook para eliminar una etapa
 */
// export const useDeleteEtapa = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (id: number) => StagesService.deleteStage(id),
//     onSuccess: () => {
//       // Invalidar todas las queries de etapas
//       queryClient.invalidateQueries({ queryKey: stagesKeys.all });
//     },
//     onError: (error) => {
//       console.error('Error al eliminar etapa:', error);
//     },
//   });
// };

/**
 * Hook para reordenar etapas
 */
export const useReorderStages = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (etapas: { id: number; orden: number }[]) =>
      StagesService.reorderStages(etapas),
    onSuccess: () => {
      // Invalidar todas las queries de etapas
      queryClient.invalidateQueries({ queryKey: stagesKeys.all });
    },
    onError: (error) => {
      console.error("Error al reordenar etapas:", error);
    },
  });
};

/**
 * Hook para obtener los tipos de etapa disponibles
 */
export const useStageTypes = () => {
  return useQuery({
    queryKey: stagesKeys.types(),
    queryFn: () => StagesService.getStageTypes(),
    staleTime: 10 * 60 * 1000, // 10 minutos
    gcTime: 30 * 60 * 1000, // 30 minutos
  });
};

/**
 * Hook para crear un nuevo tipo de etapa
 */
export const useCreateStageType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      nombre: string;
      descripcion: string;
      color: string;
      tipo_iniciativa: boolean;
      tipo_obra: boolean;
      region: boolean;
      provincia: boolean;
      comuna: boolean;
      volumen: boolean;
      presupuesto_oficial: boolean;
      bip: boolean;
      fecha_llamado_licitacion: boolean;
      fecha_recepcion_ofertas_tecnicas: boolean;
      fecha_apertura_ofertas_economicas: boolean;
      fecha_inicio_concesion: boolean;
      plazo_total_concesion: boolean;
      decreto_adjudicacion: boolean;
      sociedad_concesionaria: boolean;
      inspector_fiscal_id: boolean;
    }) => StagesService.createStageType(data),
    onSuccess: () => {
      // Invalidar la query de tipos de etapa para refrescar los datos
      queryClient.invalidateQueries({ queryKey: stagesKeys.types() });
    },
    onError: (error) => {
      console.error("Error al crear tipo de etapa:", error);
    },
  });
};

/**
 * Hook para obtener la información detallada de un tipo de etapa
 */
export function useStageTypeDetail(etapaId: number | undefined) {
  return useQuery({
    queryKey: stagesKeys.typeDetail(etapaId || 0),
    queryFn: () => StagesService.getStageTypeById(etapaId!),
    enabled: !!etapaId,
  });
}

/**
 * Hook para obtener múltiples tipos de etapa por sus IDs
 */
export function useStageTypesDetails(etapaIds: number[]) {
  return useQueries({
    queries: etapaIds.map((id) => ({
      queryKey: stagesKeys.typeDetail(id),
      queryFn: () => StagesService.getStageTypeById(id),
      enabled: id > 0,
    })),
  });
}
