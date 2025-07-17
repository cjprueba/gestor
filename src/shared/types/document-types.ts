export interface Documento {
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
}

export interface DocumentoConCreador extends Documento {
  creador: {
    id: number;
    nombre_completo: string;
    correo_electronico: string;
  };
}

export interface UploadDocumentoResponse {
  success: boolean;
  message: string;
  documento: Documento;
}

export interface GetDocumentosResponse {
  success: boolean;
  documentos: DocumentoConCreador[];
}

export interface DownloadDocumentoResponse {
  success: boolean;
  message: string;
  url: string;
}

export interface UploadDocumentoRequest {
  carpeta_id: number;
  archivos: File[];
  configuracion_alertas?: {
    hasAlert: boolean;
    alertType?: "due_date" | "days_after";
    alertDate?: string;
    alertDays?: number;
  };
}
