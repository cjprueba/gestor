import { apiClient } from "../config";
import type {
  Stage,
  CreateStageRequest,
  StagesQueryParams,
  StagesResponse,
  StageResponse,
  StageTypeDetailResponse,
} from "@/shared/types/stage-types";

export class StagesService {
  private static readonly BASE_PATH = "/etapas";

  /**
   * Obtiene todas las etapas con paginación y filtros
   */
  static async getStages(params?: StagesQueryParams): Promise<StagesResponse> {
    const response = await apiClient.get<StagesResponse>(this.BASE_PATH, {
      params,
    });
    return response.data;
  }

  /**
   * Obtiene una etapa por su ID
   */
  static async getStageById(id: number): Promise<StageResponse> {
    const response = await apiClient.get<StageResponse>(
      `${this.BASE_PATH}/${id}`
    );
    return response.data;
  }

  /**
   * Crea una nueva etapa
   */
  static async createStage(data: CreateStageRequest): Promise<StageResponse> {
    const response = await apiClient.post<StageResponse>(this.BASE_PATH, data);
    return response.data;
  }

  /**
   * Actualiza una etapa existente
   */
  static async updateStage(
    id: number,
    data: CreateStageRequest
  ): Promise<StageResponse> {
    const response = await apiClient.put<StageResponse>(
      `${this.BASE_PATH}/${id}`,
      data
    );
    return response.data;
  }

  /**
   * Elimina una etapa
   */
  static async deleteEtapa(
    id: number
  ): Promise<{ success: boolean; message?: string }> {
    const response = await apiClient.delete(`${this.BASE_PATH}/${id}`);
    return response.data;
  }

  /**
   * Obtiene etapas activas (conveniencia)
   */
  static async getStagesActivas(): Promise<Stage[]> {
    const response = await this.getStages({ activo: true });
    return response.data;
  }

  /**
   * Reordena etapas
   */
  static async reorderStages(
    stages: { id: number; orden: number }[]
  ): Promise<StageResponse[]> {
    const response = await apiClient.put<StageResponse[]>(
      `${this.BASE_PATH}/reorder`,
      {
        stages,
      }
    );
    return response.data;
  }

  /**
   * Obtiene los tipos de etapa disponibles
   */
  static async getStageTypes(): Promise<{
    success: boolean;
    message: string;
    data: Array<{
      id: number;
      nombre: string;
      descripcion: string;
      color: string | null;
    }>;
  }> {
    const response = await apiClient.get("/etapas-tipo");
    return response.data;
  }

  /**
   * Crea un nuevo tipo de etapa
   */
  static async createStageType(data: {
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
  }): Promise<{
    data: {
      id: number;
      nombre: string;
      descripcion: string;
      color: string | null;
    };
  }> {
    const response = await apiClient.post("/etapas-tipo", data);
    console.log(response.data);
    return response.data;
  }

  /**
   * Obtiene la información completa de un tipo de etapa por su ID
   */
  static async getStageTypeById(
    etapaId: number
  ): Promise<StageTypeDetailResponse> {
    const response = await apiClient.get<StageTypeDetailResponse>(
      `/etapas-tipo/etapa/${etapaId}`
    );
    return response.data;
  }
}
