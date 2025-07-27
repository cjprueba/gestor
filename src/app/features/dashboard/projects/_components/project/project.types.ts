import { z } from "zod";
import type { FolderStructure } from "../folder/folder.types";

// ============================================================================
// TIPOS DE API - BASADOS EN RESPONSES REALES
// ============================================================================

// Tipos para GET /proyectos
export interface EtapaTipoBasica {
  id: number;
  nombre: string;
  color: string;
}

export interface CreadorBasico {
  id: number;
  nombre_completo: string;
}

export interface ProyectoListItem {
  id: number;
  nombre: string;
  created_at: string;
  carpeta_raiz_id: number;
  etapas_registro: Array<{
    etapa_tipo: EtapaTipoBasica;
  }>;
  creador: CreadorBasico;
}

export interface ProyectosListResponse {
  success: boolean;
  message: string;
  data: ProyectoListItem[];
}

// Tipos para GET /proyectos/{id}
export interface EtapaTipoDetallada {
  id: number;
  nombre: string;
  descripcion: string;
  color: string;
}

export interface TipoIniciativa {
  id: number;
  nombre: string;
}

export interface TipoObra {
  id: number;
  nombre: string;
}

export interface Region {
  id: number;
  codigo: string;
  nombre: string;
  nombre_corto: string;
}

export interface Provincia {
  id: number;
  codigo: string;
  nombre: string;
  region_id: number;
}

export interface Comuna {
  id: number;
  codigo: string;
  nombre: string;
  provincia_id: number;
}

export interface InspectorFiscal {
  id: number;
  nombre: string;
  apellido: string;
  nombre_completo: string;
  correo_electronico: string;
}

export interface EtapaRegistro {
  id: number;
  etapa_tipo: EtapaTipoDetallada;
  tipo_iniciativa: TipoIniciativa;
  tipo_obra: TipoObra;
  region: Region;
  provincia: Provincia;
  comuna: Comuna;
  volumen: string;
  presupuesto_oficial: string;
  valor_referencia: string | null;
  bip: string | null;
  fecha_llamado_licitacion: string | null;
  fecha_recepcion_ofertas_tecnicas: string | null;
  fecha_apertura_ofertas_economicas: string | null;
  decreto_adjudicacion: string | null;
  sociedad_concesionaria: string | null;
  fecha_inicio_concesion: string | null;
  plazo_total_concesion: string | null;
  inspector_fiscal: InspectorFiscal;
  fecha_creacion: string;
  fecha_actualizacion: string;
  activa: boolean;
}

export interface Division {
  id: number;
  nombre: string;
  descripcion: string;
}

export interface Departamento {
  id: number;
  nombre: string;
  descripcion: string;
}

export interface Unidad {
  id: number;
  nombre: string;
  descripcion: string;
}

export interface CreadorDetallado {
  id: number;
  nombre_completo: string;
  correo_electronico: string;
}

export interface ProyectoDetalle {
  id: number;
  nombre: string;
  carpeta_inicial: Record<string, any>;
  carpeta_raiz_id: number;
  created_at: string;
  etapas_registro: EtapaRegistro[];
  division: Division;
  departamento: Departamento;
  unidad: Unidad;
  creador: CreadorDetallado;
}

export interface ProyectoDetalleResponse {
  success: boolean;
  message: string;
  data: ProyectoDetalle;
}

// ============================================================================
// ESQUEMAS DE VALIDACIÓN CON ZOD
// ============================================================================

export const createProjectStepOneSchema = z.object({
  nombre: z
    .string()
    .min(1, "El nombre del proyecto es obligatorio")
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres"),
  etapa: z.string().min(1, "Debe seleccionar una etapa"),
});

export const createProjectStepTwoSchema = z.object({
  tipo_iniciativa_id: z.number().min(1, "Tipo de iniciativa es obligatorio"),
  tipo_obra_id: z.number().min(1, "Tipo de obra es obligatorio"),
  region_id: z.number().min(1, "Región es obligatoria"),
  provincia_id: z.number().min(1, "Provincia es obligatoria"),
  comuna_id: z.number().min(1, "Comuna es obligatoria"),
  volumen: z.string().optional(),
  presupuesto_oficial: z.string().optional(),
  valor_referencia: z.string().optional(),
  bip: z.string().optional(),
  fecha_llamado_licitacion: z.string().optional(),
  fecha_recepcion_ofertas_tecnicas: z.string().optional(),
  fecha_apertura_ofertas_economicas: z.string().optional(),
  decreto_adjudicacion: z.string().optional(),
  sociedad_concesionaria: z.string().optional(),
  fecha_inicio_concesion: z.string().optional(),
  plazo_total_concesion: z.string().optional(),
  inspector_fiscal_id: z.number().optional(),
});

export const createProjectStepThreeSchema = z.object({
  carpetas: z
    .array(
      z.object({
        nombre: z.string().min(1, "El nombre de la carpeta es obligatorio"),
        tipo: z.string().optional(),
        id: z.string().optional(),
        subcarpetas: z.array(z.any()).optional(),
      })
    )
    .min(1, "Debe seleccionar al menos una carpeta"),
});

export const createProjectSchema = z.object({
  createProjectStepOne: createProjectStepOneSchema,
  createProjectStepTwo: createProjectStepTwoSchema,
  createProjectStepThree: createProjectStepThreeSchema,
});

export type CreateProjectStepOne = z.infer<typeof createProjectStepOneSchema>;
export type CreateProjectStepTwo = z.infer<typeof createProjectStepTwoSchema>;
export type CreateProjectStepThree = z.infer<
  typeof createProjectStepThreeSchema
>;
export type CreateProjectFormData = z.infer<typeof createProjectSchema>;

// ============================================================================
// TIPOS DE COMPONENTES
// ============================================================================

export interface Project {
  id: string;
  name: string;
  createdAt: Date;
  carpeta_raiz_id?: number;
  structure: FolderStructure;
  etapa: string;
  projectData?: any;
  metadata?: any;
  targetFolderId?: number; // Para navegación directa a una carpeta específica
}

export interface ProjectFormData {
  // Campos básicos
  nombre: string;
  etapa: string;
  descripcion?: string;

  // Campos comunes
  tipoIniciativa?: string;
  tipoObra?: string;
  region?: string;
  provincia?: string;
  comuna?: string;
  volumen?: string;
  presupuestoOficial?: string;

  // Fechas específicas por etapa
  llamadoLicitacion?: string;
  plazoConcesion?: string;
  fechaLlamadoLicitacion?: string;
  fechaRecepcionOfertas?: string;
  fechaAperturaOfertas?: string;

  // Campos de concesiones
  decretoAdjudicacion?: string;
  sociedadConcesionaria?: string;
  inicioPlazoConcesion?: string;
  plazoTotalConcesion?: string;
  inspectorFiscal?: string;

  // Campos específicos
  valorReferencia?: string;

  // Alertas del proyecto
  alertaFechaLimite?: string;
  alertaDescripcion?: string;
}

export interface ProjectCardProps {
  project: Project;
  onSelect: (project: Project) => void;
  totalAlerts: number;
}

export interface ProjectListProps {
  projects: Project[];
  onSelectProject: (project: Project, targetFolderId?: number) => void;
  onCreateProject: () => void;
}

// ============================================================================
// VERIFICAR DUPLICIDAD
// ============================================================================

// Tipos para la API
export interface CreateProjectRequest {
  nombre: string;
  carpeta_inicial: Record<string, any>;
  division_id: number;
  departamento_id: number;
  unidad_id: number;
  creado_por: number;
  etapas_registro: {
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
    inspector_fiscal_id: number;
    usuario_creador: number;
  };
}

export interface CreateProjectResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    nombre: string;
    created_at: string;
    updated_at: string;
  };
}

// Tipos para los datos de selección
export interface TipoIniciativa {
  id: number;
  nombre: string;
}

export interface TipoObra {
  id: number;
  nombre: string;
}

export interface Region {
  id: number;
  nombre: string;
}

export interface Provincia {
  id: number;
  nombre: string;
  region_id: number;
}

export interface Comuna {
  id: number;
  nombre: string;
  provincia_id: number;
}

export interface InspectorFiscal {
  id: number;
  nombre: string;
  apellido: string;
}

// Respuestas de la API para los datos de selección
export interface TiposIniciativaResponse {
  data: TipoIniciativa[];
}

export interface TiposObraResponse {
  data: TipoObra[];
}

export interface RegionesResponse {
  data: Region[];
}

export interface ProvinciasResponse {
  data: Provincia[];
}

export interface ComunasResponse {
  data: Comuna[];
}

export interface InspectoresFiscalesResponse {
  data: InspectorFiscal[];
}

// Tipos para avanzar etapa
export interface AvanzarEtapaRequest {
  // Los campos que se pueden enviar al avanzar etapa
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
  fecha_inicio_concesion?: string;
  plazo_total_concesion?: string;
  decreto_adjudicacion?: string;
  sociedad_concesionaria?: string;
  inspector_fiscal_id?: number;
}

// export interface EtapaRegistro {
//   id: number;
//   etapa_tipo_id: number;
//   tipo_iniciativa_id: number;
//   tipo_obra_id: number;
//   region_id: number;
//   provincia_id: number;
//   comuna_id: number;
//   volumen: string;
//   presupuesto_oficial: string;
//   valor_referencia: string;
//   bip: string;
//   fecha_llamado_licitacion: string;
//   fecha_recepcion_ofertas_tecnicas: string;
//   fecha_apertura_ofertas_economicas: string;
//   fecha_inicio_concesion: string;
//   plazo_total_concesion: string;
//   decreto_adjudicacion: string;
//   sociedad_concesionaria: string;
//   inspector_fiscal_id: number;
//   usuario_creador: number;
//   fecha_creacion: string;
//   fecha_actualizacion: string;
//   activa: boolean;
//   etapa_tipo: {
//     id: number;
//     nombre: string;
//     descripcion: string;
//     color: string;
//   };
//   tipo_iniciativa: {
//     id: number;
//     nombre: string;
//   };
//   tipo_obra: {
//     id: number;
//     nombre: string;
//   };
//   region: {
//     id: number;
//     nombre: string;
//     codigo: string;
//   };
//   provincia: {
//     id: number;
//     nombre: string;
//     codigo: string;
//   };
//   comuna: {
//     id: number;
//     nombre: string;
//     codigo: string;
//   };
//   inspector_fiscal: {
//     id: number;
//     correo_electronico: string;
//     nombre_completo: string;
//   };
//   usuario_creador_rel: {
//     id: number;
//     correo_electronico: string;
//     nombre_completo: string;
//   };
// }

export interface SiguienteEtapa {
  id: number;
  nombre: string;
  descripcion: string;
  color: string;
  carpetas_iniciales: Record<string, any>;
  tipo_iniciativa: boolean;
  tipo_obra: boolean;
  region: boolean;
  provincia: boolean;
  comuna: boolean;
  volumen: boolean;
  presupuesto_oficial: boolean;
  valor_referencia: boolean;
  bip: boolean;
  fecha_llamado_licitacion: boolean;
  fecha_recepcion_ofertas_tecnicas: boolean;
  fecha_apertura_ofertas_economicas: boolean;
  fecha_inicio_concesion: boolean;
  plazo_total_concesion: boolean;
  decreto_adjudicacion: boolean;
  sociedad_concesionaria: boolean;
  inspector_fiscal_id: boolean;
}

export interface AvanzarEtapaResponse {
  data: {
    etapas_anteriores: EtapaRegistro[];
    siguiente_etapa: SiguienteEtapa;
    es_ultima_etapa: boolean;
  };
}

// Interfaces para el endpoint /carpetas/{id}/contenido
export interface CarpetaInfo {
  id: number;
  nombre: string;
  descripcion: string;
  s3_path: string;
  orden_visualizacion: number;
  max_tamaño_mb: number | null;
  tipos_archivo_permitidos: string[];
  permisos_lectura: number[];
  permisos_escritura: number[];
  fecha_creacion: string;
  fecha_actualizacion: string;
  activa: boolean;
  proyecto: {
    id: number;
    nombre: string;
  };
  carpeta_padre: any | null;
}

export interface CarpetaItem {
  id: number;
  nombre: string;
  descripcion: string;
  orden_visualizacion: number;
  fecha_creacion: string;
  fecha_actualizacion: string;
  activa: boolean;
  total_documentos: number;
  total_carpetas_hijas: number;
  etapa_tipo?: {
    id: number;
    nombre: string;
    color: string;
  };
}

export interface DocumentoItem {
  id: string;
  nombre_archivo: string;
  extension: string;
  tamano: number;
  tipo_mime: string;
  descripcion: string;
  categoria: string;
  estado: string;
  version: string;
  carpeta_id: number;
  s3_path: string;
  s3_bucket_name: string;
  s3_created: boolean;
  hash_integridad: string;
  etiquetas: string[];
  proyecto_id: number;
  subido_por: number;
  fecha_creacion: string;
  fecha_ultima_actualizacion: string;
  tipo_documento_id?: number;
  creador?: {
    id: number;
    nombre_completo: string;
    correo_electronico: string;
  };
}

export interface CarpetaContenidoResponse {
  carpeta: CarpetaInfo;
  contenido: {
    carpetas: CarpetaItem[];
    documentos: DocumentoItem[];
  };
  estadisticas: {
    total_carpetas: number;
    total_documentos: number;
    tamano_total_mb: number;
    tipos_archivo_unicos: string[];
    fecha_ultima_actualizacion: string | null;
  };
}

// Interfaces para el endpoint POST /carpetas
export interface CreateCarpetaRequest {
  nombre: string;
  descripcion: string;
  carpeta_padre_id: number;
  proyecto_id: number;
  etapa_tipo_id: number;
  usuario_creador: number;
  orden_visualizacion: number;
  max_tamaño_mb: number;
  tipos_archivo_permitidos: string[];
  permisos_lectura: string[];
  permisos_escritura: string[];
}

export interface CreateCarpetaResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    nombre: string;
    descripcion: string;
    carpeta_padre_id: number;
    proyecto_id: number;
    etapa_tipo_id: number;
    usuario_creador: number;
    orden_visualizacion: number;
    max_tamaño_mb: number;
    tipos_archivo_permitidos: string[];
    permisos_lectura: string[];
    permisos_escritura: string[];
    fecha_creacion: string;
    fecha_actualizacion: string;
    activa: boolean;
  };
}

export interface RenombrarCarpetaRequest {
  nuevo_nombre: string;
  usuario_modificador: number;
}

export interface MoverCarpetaRequest {
  nueva_carpeta_padre_id: number;
  usuario_modificador: number;
}

export interface RenombrarCarpetaResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    nombre: string;
    fecha_actualizacion: string;
  };
}

export interface MoverCarpetaResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    carpeta_padre_id: number;
    fecha_actualizacion: string;
  };
}
