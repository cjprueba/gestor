import type {
  AvanzarEtapaRequest,
  AvanzarEtapaResponse,
  Comuna,
  ComunasResponse,
  CreateProjectRequest,
  CreateProjectResponse,
  InspectoresFiscalesResponse,
  InspectorFiscal,
  Provincia,
  ProvinciasResponse,
  ProyectoDetalleResponse,
  ProyectosListResponse,
  Region,
  RegionesResponse,
  TipoIniciativa,
  TiposIniciativaResponse,
  TiposObraResponse,
} from "@/app/features/dashboard/projects/_components/project/project.types";
import type {
  CarpetaContenidoResponse,
  CarpetaDetalleResponse,
  CreateCarpetaRequest,
  CreateCarpetaResponse,
  MoverCarpetaRequest,
  MoverCarpetaResponse,
  RenombrarCarpetaRequest,
  RenombrarCarpetaResponse,
} from "@/app/features/dashboard/projects/_components/folder/folder.types";
import { apiClient } from "../config";

export class ProjectsService {
  private static readonly BASE_PATH = "/proyectos";

  /**
   * Crea un nuevo proyecto
   */
  static async createProject(
    data: CreateProjectRequest
  ): Promise<CreateProjectResponse> {
    const response = await apiClient.post<CreateProjectResponse>(
      this.BASE_PATH,
      data
    );
    return response.data;
  }

  /**
   * Actualiza un proyecto existente
   */
  static async updateProject(
    projectId: number,
    data: Partial<CreateProjectRequest>
  ): Promise<{ success: boolean; message: string; data: any }> {
    const response = await apiClient.put(
      `${this.BASE_PATH}/${projectId}`,
      data
    );
    return response.data;
  }

  /**
   * Obtiene los tipos de iniciativa disponibles
   */
  static async getTiposIniciativa(): Promise<TiposIniciativaResponse> {
    const response =
      await apiClient.get<TipoIniciativa[]>("/tipos_iniciativas");
    return { data: response.data };
  }

  /**
   * Obtiene los tipos de obra disponibles según la etapa
   */
  static async getTiposObraPorEtapa(
    etapa_tipo_id?: number
  ): Promise<TiposObraResponse> {
    if (!etapa_tipo_id) {
      console.log("No se proporcionó etapa_tipo_id, devolviendo array vacío");
      return { data: [] };
    }

    try {
      const response = await apiClient.get<{
        success: boolean;
        message: string;
        data: Array<{
          id: number;
          nombre: string;
          descripcion: string;
          color: string;
          carpetas_iniciales: any;
          tipos_obra: Array<{
            id: number;
            nombre: string;
          }>;
        }>;
      }>("/etapas-tipo-obra", {
        params: { etapa_tipo_id },
      });

      // Extraer los tipos de obra del primer elemento del array (si existe)
      const tiposObra = response.data.data?.[0]?.tipos_obra || [];
      return { data: tiposObra };
    } catch (error) {
      console.log("Error obteniendo tipos de obra, usando datos mock");
      return { data: [] };
    }
  }

  /**
   * Obtiene la lista de proyectos
   */
  static async getProyectos(): Promise<ProyectosListResponse> {
    const response = await apiClient.get("/proyectos");
    return response.data;
  }

  /**
   * Obtiene el detalle de un proyecto por ID
   */
  static async getProyectoDetalle(
    id: number
  ): Promise<ProyectoDetalleResponse> {
    const response = await apiClient.get(`/proyectos/${id}`);
    return response.data;
  }

  /**
   * Obtiene las regiones disponibles
   */
  static async getRegiones(): Promise<RegionesResponse> {
    const response = await apiClient.get<Region[]>("/regiones");
    return { data: response.data };
  }

  /**
   * Obtiene las provincias de una región específica
   */
  static async getProvincias(region_id: number): Promise<ProvinciasResponse> {
    const response = await apiClient.get<Provincia[]>(`/provincias`, {
      params: { region_id },
    });
    return { data: response.data };
  }

  /**
   * Obtiene las comunas de una provincia específica
   */
  static async getComunas(
    region_id: number,
    provincia_id: number
  ): Promise<ComunasResponse> {
    const response = await apiClient.get<Comuna[]>(`/comunas`, {
      params: { region_id, provincia_id },
    });
    return { data: response.data };
  }

  /**
   * Obtiene los inspectores fiscales disponibles
   */
  static async getInspectoresFiscales(): Promise<InspectoresFiscalesResponse> {
    const response = await apiClient.get<InspectorFiscal[]>(
      "/inspectores-fiscales"
    );
    console.log("Inspectores fiscales response:", response.data);
    return { data: response.data };
  }

  /**
   * Obtiene la información de la etapa actual y siguiente etapa para avanzar
   */
  static async getEtapaAvanzarInfo(
    proyectoId: number
  ): Promise<AvanzarEtapaResponse> {
    const response = await apiClient.get<AvanzarEtapaResponse>(
      `/etapas/${proyectoId}/avanzar`
    );
    return response.data;
  }

  /**
   * Avanza un proyecto a la siguiente etapa
   */
  static async avanzarEtapa(
    proyectoId: number,
    data: AvanzarEtapaRequest
  ): Promise<AvanzarEtapaResponse> {
    const response = await apiClient.post<AvanzarEtapaResponse>(
      `/etapas/${proyectoId}/avanzar`,
      data
    );
    return response.data;
  }

  /**
   * Cambia la etapa de un proyecto
   */
  static async cambiarEtapa(
    proyectoId: number,
    data: {
      etapa_tipo_id: number;
      tipo_iniciativa_id?: number;
      tipo_obra_id?: number;
      region_id?: number;
      provincia_id?: number;
      comuna_id?: number;
      volumen?: string;
      presupuesto_oficial?: string;
      valor_referencia?: string;
      bip?: string;
      fecha_llamado_licitacion?: string;
      fecha_recepcion_ofertas_tecnicas?: string;
      fecha_apertura_ofertas_economicas?: string;
      decreto_adjudicacion?: string;
      sociedad_concesionaria?: string;
      fecha_inicio_concesion?: string;
      plazo_total_concesion?: string;
      inspector_fiscal_id?: number;
      usuario_creador: number;
    }
  ): Promise<{ success: boolean; message: string; data: any }> {
    const response = await apiClient.patch<{
      success: boolean;
      message: string;
      data: any;
    }>(`/proyectos/${proyectoId}/cambiar-etapa`, data);
    return response.data;
  }

  /**
   * Método para obtener el contenido de una carpeta
   */
  static async getCarpetaContenido(
    carpetaId: number
  ): Promise<CarpetaContenidoResponse> {
    const response = await apiClient.get(`/carpetas/${carpetaId}/contenido`);
    return response.data;
  }

  /**
   * Método para crear una nueva carpeta
   */
  static async createCarpeta(
    data: CreateCarpetaRequest
  ): Promise<CreateCarpetaResponse> {
    const response = await apiClient.post("/carpetas", data);
    return response.data;
  }

  /**
   * Método para obtener las carpetas de un proyecto
   */
  static async getCarpetasProyecto(proyectoId: number): Promise<{
    success: boolean;
    message: string;
    data: Array<{
      id: number;
      nombre: string;
      descripcion: string;
      carpeta_padre_id: number | null;
      orden_visualizacion: number;
      fecha_creacion: string;
      fecha_actualizacion: string;
      activa: boolean;
    }>;
  }> {
    const response = await apiClient.get(`/proyectos/${proyectoId}/carpetas`);
    return response.data;
  }

  /**
   * Método para renombrar una carpeta
   */
  static async renombrarCarpeta(
    carpetaId: number,
    data: RenombrarCarpetaRequest
  ): Promise<RenombrarCarpetaResponse> {
    const response = await apiClient.put(
      `/carpetas/${carpetaId}/renombrar`,
      data
    );
    return response.data;
  }

  /**
   * Método para mover una carpeta
   */
  static async moverCarpeta(
    carpetaId: number,
    data: MoverCarpetaRequest
  ): Promise<MoverCarpetaResponse> {
    const response = await apiClient.put(`/carpetas/${carpetaId}/mover`, data);
    return response.data;
  }

  /**
   * Obtiene el detalle de una carpeta
   */
  static async getCarpetaDetalle(
    carpetaId: number
  ): Promise<CarpetaDetalleResponse> {
    const response = await apiClient.get<CarpetaDetalleResponse>(
      `/carpetas/${carpetaId}`
    );
    return response.data;
  }

  /**
   * Elimina un proyecto
   */
  static async deleteProject(
    projectId: number,
    data: {
      usuario_eliminador: number;
      motivo_eliminacion: string;
    }
  ): Promise<{ success: boolean; message: string; data: any }> {
    const response = await apiClient.delete(`${this.BASE_PATH}/${projectId}`, {
      data,
    });
    return response.data;
  }
}
