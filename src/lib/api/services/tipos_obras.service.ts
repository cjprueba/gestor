import { apiClient } from "../config";

export interface TipoObra {
  id: number;
  nombre: string;
  descripcion?: string;
}

export const tiposObrasService = {
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
