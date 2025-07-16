import { useQuery, useQueries } from "@tanstack/react-query";
import { ProjectsService } from "../services/projects.service";

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
  // Implementar cuando sea necesario
  return {
    mutateAsync: async (data: any) => {
      return ProjectsService.createProject(data);
    },
    isPending: false,
  };
};

export const useTiposIniciativa = () => {
  return useQuery({
    queryKey: ["tipos-iniciativa"],
    queryFn: () => ProjectsService.getTiposIniciativa(),
  });
};

export const useTiposObra = (etapa_tipo_id?: number) => {
  return useQuery({
    queryKey: ["tipos-obra", etapa_tipo_id],
    queryFn: () => ProjectsService.getTiposObra(etapa_tipo_id),
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

// export const useInspectoresFiscales = () => {
//   return useQuery({
//     queryKey: ["inspectores_fiscales"],
//     queryFn: () => ProjectsService.getInspectoresFiscales(),
//   });
// };
