import { apiClient } from "../config";
import type {
  CreateProjectRequest,
  CreateProjectResponse,
  TiposIniciativaResponse,
  TiposObraResponse,
  RegionesResponse,
  ProvinciasResponse,
  ComunasResponse,
  InspectoresFiscalesResponse,
  TipoIniciativa,
  Region,
  Provincia,
  Comuna,
  InspectorFiscal,
} from "@/shared/types/project-types";

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
  static async getTiposObra(
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
  static async getProyectos(): Promise<{
    success: boolean;
    message: string;
    data: Array<{
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
    }>;
  }> {
    const response = await apiClient.get("/proyectos");
    return response.data;
  }

  /**
   * Obtiene el detalle de un proyecto por ID
   */
  static async getProyectoDetalle(id: number): Promise<{
    success: boolean;
    message: string;
    data: {
      id: number;
      nombre: string;
      carpeta_inicial: string;
      created_at: string;
      etapas_registro: Array<{
        id: number;
        etapa_tipo: {
          id: number;
          nombre: string;
          descripcion: string;
        };
        tipo_iniciativa: {
          id: number;
          nombre: string;
        };
        tipo_obra: {
          id: number;
          nombre: string;
        };
        region: {
          id: number;
          codigo: string;
          nombre: string;
          nombre_corto: string;
        };
        provincia: {
          id: number;
          codigo: string;
          nombre: string;
        };
        comuna: {
          id: number;
          codigo: string;
          nombre: string;
        };
        volumen: string;
        presupuesto_oficial: string;
        fecha_llamado_licitacion: string;
        fecha_recepcion_ofertas_tecnicas: string;
        fecha_apertura_ofertas_economicas: string;
        decreto_adjudicacion: string;
        sociedad_concesionaria: string;
        fecha_inicio_concesion: string;
        plazo_total_concesion: string;
        inspector_fiscal: {
          id: number;
          nombre_completo: string;
          correo_electronico: string;
        };
        fecha_creacion: string;
        fecha_actualizacion: string;
        activa: boolean;
      }>;
      division: {
        id: number;
        nombre: string;
        descripcion: string;
      };
      departamento: {
        id: number;
        nombre: string;
        descripcion: string;
      };
      unidad: {
        id: number;
        nombre: string;
        descripcion: string;
      };
      creador: {
        id: number;
        nombre_completo: string;
        correo_electronico: string;
      };
    };
  }> {
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
}
