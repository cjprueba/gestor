import {
  useQuery,
  useQueries,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { ProjectsService } from "../services/projects.service";
import { toast } from "sonner";
import type {
  CreateCarpetaRequest,
  MoverCarpetaRequest,
  RenombrarCarpetaRequest,
} from "@/app/features/dashboard/projects/_components/project/project.types";

// Hook para obtener la lista de proyectos
export const useProyectos = () => {
  return useQuery({
    queryKey: ["proyectos"],
    queryFn: () => ProjectsService.getProyectos(),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para obtener el detalle de un proyecto
export const useProyectoDetalle = (id: number | undefined) => {
  return useQuery({
    queryKey: ["proyecto", id],
    queryFn: () => ProjectsService.getProyectoDetalle(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para obtener todos los proyectos con sus detalles (versión corregida)
export const useProyectosCompletos = () => {
  const {
    data: proyectosLista,
    isLoading: isLoadingLista,
    error: errorLista,
  } = useProyectos();

  // Solo obtener detalles si tenemos la lista de proyectos
  const proyectosIds =
    proyectosLista?.data?.map((proyecto) => proyecto.id) || [];

  // Usar useQueries para obtener todos los detalles de una vez
  const proyectosDetalles = useQueries({
    queries: proyectosIds.map((id) => ({
      queryKey: ["proyecto", id],
      queryFn: () => ProjectsService.getProyectoDetalle(id),
      enabled: !!id,
      staleTime: 5 * 60 * 1000,
    })),
  });

  const isLoadingDetalles = proyectosDetalles.some((p) => p.isLoading);
  const hasError = proyectosDetalles.some((p) => p.error) || errorLista;
  const isAnyLoading = isLoadingLista || isLoadingDetalles;

  return {
    proyectosLista: proyectosLista?.data || [],
    proyectosDetalles: proyectosIds.map((id, index) => ({
      id,
      data: proyectosDetalles[index]?.data,
      isLoading: proyectosDetalles[index]?.isLoading,
      error: proyectosDetalles[index]?.error,
    })),
    isLoading: isAnyLoading,
    error: hasError,
  };
};

// Hook para obtener un proyecto específico con su detalle
export const useProyectoCompleto = (id: number | undefined) => {
  const { data: proyectoLista } = useProyectos();
  const { data: proyectoDetalle, isLoading, error } = useProyectoDetalle(id);

  const proyecto = proyectoLista?.data?.find((p) => p.id === id);

  return {
    proyecto,
    proyectoDetalle: proyectoDetalle?.data,
    isLoading,
    error,
  };
};

// Hooks existentes para compatibilidad
export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => ProjectsService.createProject(data),
    onSuccess: () => {
      // Invalidar las queries de proyectos para refrescar los datos
      queryClient.invalidateQueries({ queryKey: ["proyectos"] });
      queryClient.invalidateQueries({ queryKey: ["proyecto"] });
      toast.success("Proyecto creado exitosamente");
    },
    onError: (error: any) => {
      console.error("Error al crear proyecto:", error);
      toast.error(
        error.response?.data?.message || "Error al crear el proyecto"
      );
    },
  });
};

// Hook para actualizar un proyecto
export const useUpdateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: number; data: any }) =>
      ProjectsService.updateProject(projectId, data),
    onSuccess: (_, { projectId }) => {
      // Invalidar las queries de proyectos para refrescar los datos
      queryClient.invalidateQueries({ queryKey: ["proyectos"] });
      queryClient.invalidateQueries({ queryKey: ["proyecto", projectId] });
      toast.success("Proyecto actualizado exitosamente");
    },
    onError: (error: any) => {
      console.error("Error al actualizar proyecto:", error);
      toast.error(
        error.response?.data?.message || "Error al actualizar el proyecto"
      );
    },
  });
};

export const useAvanzarEtapa = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ proyectoId, data }: { proyectoId: number; data: any }) =>
      ProjectsService.avanzarEtapa(proyectoId, data),
    onSuccess: () => {
      // Invalidar las queries de proyectos para refrescar los datos
      queryClient.invalidateQueries({ queryKey: ["proyectos"] });
      queryClient.invalidateQueries({ queryKey: ["proyecto"] });
    },
    onError: (error: any) => {
      console.error("Error al avanzar etapa:", error);
    },
  });
};

export const useCambiarEtapa = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ proyectoId, data }: { proyectoId: number; data: any }) =>
      ProjectsService.cambiarEtapa(proyectoId, data),
    onSuccess: () => {
      // Invalidar las queries de proyectos para refrescar los datos
      queryClient.invalidateQueries({ queryKey: ["proyectos"] });
      queryClient.invalidateQueries({ queryKey: ["proyecto"] });
      queryClient.invalidateQueries({ queryKey: ["etapa-avanzar-info"] });
    },
    onError: (error: any) => {
      console.error("Error al cambiar etapa:", error);
    },
  });
};

export const useTiposIniciativa = () => {
  return useQuery({
    queryKey: ["tipos-iniciativa"],
    queryFn: () => ProjectsService.getTiposIniciativa(),
  });
};

export const useTiposObraPorEtapa = (etapa_tipo_id?: number) => {
  return useQuery({
    queryKey: ["tipos-obra", etapa_tipo_id],
    queryFn: () => ProjectsService.getTiposObraPorEtapa(etapa_tipo_id),
    enabled: !!etapa_tipo_id,
  });
};

export const useRegiones = () => {
  return useQuery({
    queryKey: ["regiones"],
    queryFn: () => ProjectsService.getRegiones(),
  });
};

export const useProvincias = (region_id?: number) => {
  return useQuery({
    queryKey: ["provincias", region_id],
    queryFn: () => ProjectsService.getProvincias(region_id!),
    enabled: !!region_id,
  });
};

export const useComunas = (region_id?: number, provincia_id?: number) => {
  return useQuery({
    queryKey: ["comunas", region_id, provincia_id],
    queryFn: () => ProjectsService.getComunas(region_id!, provincia_id!),
    enabled: !!region_id && !!provincia_id,
  });
};

export const useInspectoresFiscales = () => {
  return useQuery({
    queryKey: ["inspectores_fiscales"],
    queryFn: () => ProjectsService.getInspectoresFiscales(),
  });
};

// Hook para obtener la información de la etapa actual y la siguiente etapa para avanzar
export const useEtapaAvanzarInfo = (proyectoId: number | undefined) => {
  return useQuery({
    queryKey: ["etapa-avanzar-info", proyectoId],
    queryFn: () => ProjectsService.getEtapaAvanzarInfo(proyectoId!),
    enabled: !!proyectoId,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para obtener el contenido de una carpeta
export const useCarpetaContenido = (carpetaId: number | undefined) => {
  return useQuery({
    queryKey: ["carpeta-contenido", carpetaId],
    queryFn: () => ProjectsService.getCarpetaContenido(carpetaId!),
    enabled: !!carpetaId,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para crear una nueva carpeta
export const useCreateCarpeta = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCarpetaRequest) =>
      ProjectsService.createCarpeta(data),
    onSuccess: () => {
      // Invalidar las queries de carpetas para refrescar los datos
      queryClient.invalidateQueries({ queryKey: ["carpeta-contenido"] });
      queryClient.invalidateQueries({ queryKey: ["proyectos"] });
      queryClient.invalidateQueries({ queryKey: ["proyecto"] });
    },
    onError: (error: any) => {
      console.error("Error al crear carpeta:", error);
    },
  });
};

// Hook para obtener las carpetas de un proyecto
export const useCarpetasProyecto = (proyectoId: number | undefined) => {
  return useQuery({
    queryKey: ["carpetas-proyecto", proyectoId],
    queryFn: () => ProjectsService.getCarpetasProyecto(proyectoId!),
    enabled: !!proyectoId,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para renombrar una carpeta
export const useRenombrarCarpeta = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      carpetaId,
      data,
    }: {
      carpetaId: number;
      data: RenombrarCarpetaRequest;
    }) => ProjectsService.renombrarCarpeta(carpetaId, data),
    onSuccess: () => {
      // Invalidar las queries relacionadas para refrescar los datos
      queryClient.invalidateQueries({ queryKey: ["carpeta-contenido"] });
      queryClient.invalidateQueries({ queryKey: ["carpetas-proyecto"] });
    },
    onError: (error: any) => {
      console.error("Error al renombrar carpeta:", error);
    },
  });
};

// Hook para mover una carpeta
export const useMoverCarpeta = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      carpetaId,
      data,
    }: {
      carpetaId: number;
      data: MoverCarpetaRequest;
    }) => ProjectsService.moverCarpeta(carpetaId, data),
    onSuccess: () => {
      // Invalidar las queries relacionadas para refrescar los datos
      queryClient.invalidateQueries({ queryKey: ["carpeta-contenido"] });
      queryClient.invalidateQueries({ queryKey: ["carpetas-proyecto"] });
    },
    onError: (error: any) => {
      console.error("Error al mover carpeta:", error);
    },
  });
};
