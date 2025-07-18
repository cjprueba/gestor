import { apiClient } from "../config";

// Tipos para las respuestas de búsqueda
export interface SearchResult {
  id: number;
  nombre: string;
  created_at: string;
  etapas_registro: Array<{
    etapa_tipo: {
      id: number;
      nombre: string;
    };
  }>;
  creador: {
    id: number;
    nombre_completo: string;
  };
}

export interface FileSearchResult {
  id: string;
  nombre_archivo: string;
  extension: string;
  tamano: number;
  tipo_mime: string;
  descripcion: string | null;
  categoria: string | null;
  estado: string;
  version: string;
  carpeta_id: number;
  s3_path: string;
  etiquetas: string[];
  proyecto_id: number | null;
  subido_por: number;
  fecha_creacion: string;
  fecha_ultima_actualizacion: string;
}

export interface FileSearchResponse {
  archivos: FileSearchResult[];
  paginacion: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
  estadisticas: {
    tiempo_busqueda_ms: number;
    consulta_original: string;
  };
}

export interface FolderSearchResult {
  id: number;
  nombre: string;
  proyecto_id: number;
  proyecto_nombre: string;
  ruta: string;
}

// Tipos para los filtros
export interface EtapaTipo {
  id: number;
  nombre: string;
  descripcion?: string;
}

export interface TipoObra {
  id: number;
  nombre: string;
  descripcion?: string;
}

// Servicio de búsqueda general
export const searchService = {
  // Búsqueda general de proyectos
  async searchProjects(query: string): Promise<SearchResult[]> {
    const response = await apiClient.get("/busqueda", {
      params: { q: query },
    });
    return response.data;
  },

  // Búsqueda de archivos
  async searchFiles(
    query: string,
    options?: {
      extension?: string;
      proyecto_id?: string;
      carpeta_id?: string;
    }
  ): Promise<FileSearchResponse> {
    const params: any = { query };

    if (options?.extension) {
      params.extension = options.extension;
    }
    if (options?.proyecto_id) {
      params.proyecto_id = options.proyecto_id;
    }
    if (options?.carpeta_id) {
      params.carpeta_id = options.carpeta_id;
    }

    const response = await apiClient.get("/busqueda/archivos", {
      params,
    });
    return response.data;
  },

  // Búsqueda de carpetas
  async searchFolders(
    query: string,
    options?: {
      proyecto_id?: string;
      carpeta_padre_id?: string;
    }
  ): Promise<FolderSearchResult[]> {
    const params: any = { query };

    if (options?.proyecto_id) {
      params.proyecto_id = options.proyecto_id;
    }
    if (options?.carpeta_padre_id) {
      params.carpeta_padre_id = options.carpeta_padre_id;
    }

    const response = await apiClient.get("/busqueda/carpetas", {
      params,
    });
    return response.data;
  },

  // Obtener tipos de etapas
  async getEtapasTipo(): Promise<EtapaTipo[]> {
    try {
      const response = await apiClient.get("/etapas-tipo");

      // Manejar diferentes estructuras de respuesta
      if (response.data && Array.isArray(response.data)) {
        return response.data;
      } else if (response.data && Array.isArray(response.data.data)) {
        return response.data.data;
      } else if (
        response.data &&
        response.data.results &&
        Array.isArray(response.data.results)
      ) {
        return response.data.results;
      }
      console.warn("Unexpected etapas response structure:", response.data);
      return [];
    } catch (error) {
      console.error("Error fetching etapas:", error);
      return [];
    }
  },

  // Obtener tipos de obras
  async getTiposObras(): Promise<TipoObra[]> {
    try {
      const response = await apiClient.get("/tipos_obras");

      // Manejar diferentes estructuras de respuesta
      if (response.data && Array.isArray(response.data)) {
        return response.data;
      } else if (response.data && Array.isArray(response.data.data)) {
        return response.data.data;
      } else if (
        response.data &&
        response.data.results &&
        Array.isArray(response.data.results)
      ) {
        return response.data.results;
      }
      console.warn("Unexpected tipos obras response structure:", response.data);
      return [];
    } catch (error) {
      console.error("Error fetching tipos obras:", error);
      return [];
    }
  },
};
