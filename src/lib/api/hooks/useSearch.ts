import { useQuery } from "@tanstack/react-query";
import { searchService } from "../services/search.service";
import { useDebounce } from "@/shared/hooks";

// Hook para búsqueda de proyectos
export const useProjectSearch = (query: string) => {
  const debouncedQuery = useDebounce(query, 300);

  return useQuery({
    queryKey: ["project-search", debouncedQuery],
    queryFn: () => searchService.searchProjects(debouncedQuery),
    enabled: debouncedQuery.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para búsqueda de archivos
export const useFileSearch = (
  query: string,
  options?: {
    extension?: string;
    proyecto_id?: string;
    carpeta_id?: string;
  }
) => {
  const debouncedQuery = useDebounce(query, 300);

  return useQuery({
    queryKey: ["file-search", debouncedQuery, options],
    queryFn: () => searchService.searchFiles(debouncedQuery, options),
    enabled: debouncedQuery.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para búsqueda de carpetas
export const useFolderSearch = (
  query: string,
  options?: {
    proyecto_id?: string;
    carpeta_padre_id?: string;
  }
) => {
  const debouncedQuery = useDebounce(query, 300);

  return useQuery({
    queryKey: ["folder-search", debouncedQuery, options],
    queryFn: () => searchService.searchFolders(debouncedQuery, options),
    enabled: debouncedQuery.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para obtener tipos de etapas
export const useEtapasTipo = () => {
  return useQuery({
    queryKey: ["etapas-tipo"],
    queryFn: () => searchService.getEtapasTipo(),
    staleTime: 30 * 60 * 1000, // 30 minutos
  });
};

// Hook para obtener tipos de obras
export const useTiposObras = () => {
  return useQuery({
    queryKey: ["tipos-obras"],
    queryFn: () => searchService.getTiposObras(),
    staleTime: 30 * 60 * 1000, // 30 minutos
  });
};
