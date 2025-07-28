export interface FolderStructure {
  id: string;
  name: string;
  minDocuments: number;
  documents: Document[];
  subfolders: FolderStructure[];
  parentId?: string;
  daysLimit?: number;
}

export interface Document {
  id: string;
  name: string;
  uploadedAt: Date;
  dueDate?: Date;
}

export interface FolderConfig {
  minDocs: number;
  daysLimit?: number;
}

export interface FolderConfigCardProps {
  folder: FolderStructure;
  isSelected: boolean;
  config: FolderConfig;
  onToggle: () => void;
  onConfigChange: (config: FolderConfig) => void;
  onSubfolderAdd: (subfolderName: string) => void;
  onSubfolderEdit: (subfolderId: string, newName: string) => void;
}

export interface CarpetaEstructura {
  id: string;
  nombre: string;
  tipo: "inicial";
  subcarpetas: CarpetaEstructura[];
  nivel: number;
}

// Tipado para el detalle de una carpeta desde GET /carpetas/{id}
export interface CarpetaDetalle {
  id: number;
  nombre: string;
  descripcion: string;
  carpeta_padre_id: number;
  proyecto_id: number;
  s3_path: string;
  s3_bucket_name: string;
  s3_created: boolean;
  orden_visualizacion: number;
  max_tamaño_mb: number;
  tipos_archivo_permitidos: string[];
  permisos_lectura: string[];
  permisos_escritura: string[];
  usuario_creador: number;
  fecha_creacion: string;
  fecha_actualizacion: string;
  activa: boolean;
}

export interface CarpetaDetalleResponse {
  success: boolean;
  message: string;
  data: CarpetaDetalle;
}

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

// Interfaces para carpetas
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

export interface CarpetaTransversal {
  id: number;
  nombre: string;
  descripcion: string;
  color: string;
  orden: number;
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
  carpeta_transversal?: CarpetaTransversal | null;
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
