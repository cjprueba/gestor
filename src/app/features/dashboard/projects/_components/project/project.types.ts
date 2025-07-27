// import type { FolderStructure } from "../folder/folder.types";

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
}

export interface Comuna {
  id: number;
  nombre: string;
}

export interface InspectorFiscal {
  id: number;
  nombre_completo: string;
  correo_electronico: string;
}

export interface EtapaRegistroDetalle {
  id: number;
  etapa_tipo: EtapaTipoDetallada;
  tipo_iniciativa: TipoIniciativa;
  tipo_obra: TipoObra;
  region: Region;
  provincia: Provincia;
  comuna: Comuna;
  volumen: string;
  presupuesto_oficial: string;
  bip: string;
  fecha_llamado_licitacion: string | null;
  fecha_recepcion_ofertas_tecnicas: string | null;
  fecha_apertura_ofertas_economicas: string | null;
  decreto_adjudicacion: string | null;
  sociedad_concesionaria: string | null;
  fecha_inicio_concesion: string | null;
  plazo_total_concesion: string;
  inspector_fiscal: InspectorFiscal;
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
  etapas_registro: EtapaRegistroDetalle[];
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

// Tipos para la API de creación
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

// Respuestas de la API para los datos de selección (para formularios)
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

// ============================================================================
// TIPOS PARA COMPONENTES (basados en API)
// ============================================================================

export interface ProjectListProps {
  projects: ProyectoListItem[];
  onSelectProject: (project: ProyectoListItem, targetFolderId?: number) => void;
  onCreateProject: () => void;
}

export interface ProjectCardProps {
  project: ProyectoListItem;
  onSelect: (project: ProyectoListItem) => void;
  totalAlerts: number;
}

// ============================================================================
// TIPOS COMENTADOS (no utilizados actualmente)
// ============================================================================

/*
// Tipos legacy - comentados para limpieza
export interface Project {
  id: string;
  name: string;
  createdAt: Date;
  carpeta_raiz_id?: number;
  structure?: FolderStructure;
  etapa: string;
  projectData?: any;
  metadata?: any;
  targetFolderId?: number;
}
*/

// Tipo usado por project.validations.ts - mantener temporalmente
// export interface ProjectFormData {
//   nombre: string;
//   etapa: string;
//   descripcion?: string;
//   tipoIniciativa?: string;
//   tipoObra?: string;
//   region?: string;
//   provincia?: string;
//   comuna?: string;
//   volumen?: string;
//   presupuestoOficial?: string;
//   llamadoLicitacion?: string;
//   plazoConcesion?: string;
//   fechaLlamadoLicitacion?: string;
//   fechaRecepcionOfertas?: string;
//   fechaAperturaOfertas?: string;
//   decretoAdjudicacion?: string;
//   sociedadConcesionaria?: string;
//   inicioPlazoConcesion?: string;
//   plazoTotalConcesion?: string;
//   inspectorFiscal?: string;
//   valorReferencia?: string;
//   alertaFechaLimite?: string;
//   alertaDescripcion?: string;
// }

// ============================================================================
// TIPOS PARA AVANZAR ETAPA Y CARPETAS (mantener por funcionalidad existente)
// ============================================================================

export interface AvanzarEtapaRequest {
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

export interface EtapaRegistro {
  id: number;
  etapa_tipo?: EtapaTipoDetallada;
  tipo_iniciativa?: TipoIniciativa;
  tipo_obra?: TipoObra;
  region?: Region;
  provincia?: Provincia;
  comuna?: Comuna;
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
  inspector_fiscal?: InspectorFiscal;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
  activa?: boolean;
}

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
