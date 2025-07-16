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
  id: number;
  nombre: string;
  tipo: string;
  tamaño: number;
  fecha_subida: string;
  proyecto_id: number;
  proyecto_nombre: string;
  carpeta: string;
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
  async searchFiles(query: string): Promise<FileSearchResult[]> {
    const response = await apiClient.get("/busqueda/archivos", {
      params: { q: query },
    });
    return response.data;
  },

  // Búsqueda de carpetas
  async searchFolders(query: string): Promise<FolderSearchResult[]> {
    const response = await apiClient.get("/busqueda/carpetas", {
      params: { q: query },
    });
    return response.data;
  },

  // Obtener tipos de etapas
  async getEtapasTipo(): Promise<EtapaTipo[]> {
    try {
      const response = await apiClient.get("/etapas-tipo");
      console.log("Etapas API response:", response.data);

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
      console.log("Tipos obras API response:", response.data);

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
