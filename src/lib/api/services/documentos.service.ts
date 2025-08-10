import type {
  DownloadDocumentoResponse,
  DownloadDocumentoBase64Response,
  GetDocumentosResponse,
  UploadDocumentoRequest,
  UploadDocumentoResponse,
  GetTiposDocumentoResponse,
  DocumentoMetadataResponse,
} from "@/shared/types/document-types";
import { apiClient } from "../config";
import type { DocumentoItem } from "@/app/features/dashboard/projects/_components/folder/folder.types";

export const documentosService = {
  // Obtener tipos de documento
  getTiposDocumento: async (): Promise<GetTiposDocumentoResponse> => {
    const response = await apiClient.get("/documentos/tipos");
    return response.data;
  },

  // Crear tipo de documento
  createTipoDocumento: async (payload: {
    nombre: string;
    descripcion?: string;
    requiere_nro_pro_exp?: boolean;
    requiere_saf_exp?: boolean;
    requiere_numerar?: boolean;
    requiere_tramitar?: boolean;
  }): Promise<{ success: boolean; message?: string }> => {
    const body = {
      nombre: payload.nombre,
      descripcion: payload.descripcion ?? "",
      requiere_nro_pro_exp: payload.requiere_nro_pro_exp ?? false,
      requiere_saf_exp: payload.requiere_saf_exp ?? false,
      requiere_numerar: payload.requiere_numerar ?? false,
      requiere_tramitar: payload.requiere_tramitar ?? false,
    };
    const response = await apiClient.post("/documentos/tipos", body);
    return response.data;
  },

  // Actualizar tipo de documento (por ahora principal campo editable: nombre)
  updateTipoDocumento: async (
    id: number,
    payload: {
      nombre: string;
      descripcion?: string;
      requiere_nro_pro_exp?: boolean;
      requiere_saf_exp?: boolean;
      requiere_numerar?: boolean;
      requiere_tramitar?: boolean;
      activo?: boolean;
    }
  ): Promise<{ success: boolean; message?: string }> => {
    const body = {
      nombre: payload.nombre,
      descripcion: payload.descripcion ?? "",
      requiere_nro_pro_exp: payload.requiere_nro_pro_exp ?? false,
      requiere_saf_exp: payload.requiere_saf_exp ?? false,
      requiere_numerar: payload.requiere_numerar ?? false,
      requiere_tramitar: payload.requiere_tramitar ?? false,
      activo: payload.activo ?? true,
    };
    const response = await apiClient.put(`/documentos/tipos/${id}`, body);
    return response.data;
  },

  // Eliminar tipo de documento
  deleteTipoDocumento: async (
    id: number
  ): Promise<{ success: boolean; message?: string }> => {
    const response = await apiClient.delete(`/documentos/tipos/${id}`);
    return response.data;
  },

  // Subir documentos a una carpeta
  uploadDocumentos: async (
    request: UploadDocumentoRequest
  ): Promise<UploadDocumentoResponse> => {
    const formData = new FormData();
    formData.append("carpeta_id", request.carpeta_id.toString());
    formData.append("tipo_documento_id", request.tipo_documento_id.toString());

    // Agregar archivos
    request.archivos.forEach((archivo) => {
      formData.append("archivos", archivo);
    });

    // Agregar configuración de alertas si existe
    if (request.configuracion_alertas) {
      formData.append(
        "configuracion_alertas",
        JSON.stringify(request.configuracion_alertas)
      );
    }

    const response = await apiClient.post("/documentos/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Obtener documentos de una carpeta
  getDocumentosByCarpeta: async (
    carpetaId: number
  ): Promise<GetDocumentosResponse> => {
    const response = await apiClient.get(`/documentos/folder/${carpetaId}`);
    return response.data;
  },

  // Eliminar documento
  deleteDocumento: async (
    documentoId: string
  ): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete(`/documentos/${documentoId}`);
    return response.data;
  },

  // Descargar documento
  downloadDocumento: async (
    documentoId: string
  ): Promise<DownloadDocumentoResponse> => {
    const response = await apiClient.get(
      `/documentos/${documentoId}/download`,
      {
        responseType: "json",
      }
    );
    return response.data;
  },

  // Descargar documento como base64
  downloadDocumentoBase64: async (
    documentoId: string
  ): Promise<DownloadDocumentoBase64Response> => {
    const response = await apiClient.get(
      `/documentos/${documentoId}/download-base64`
    );
    return response.data;
  },

  // Obtener metadatos de un documento específico
  getDocumentoMetadata: async (
    documentoId: string
  ): Promise<DocumentoMetadataResponse> => {
    const response = await apiClient.get(`/documentos/${documentoId}`);
    return response.data;
  },

  // Actualizar documento
  updateDocumento: async (
    documentoId: string,
    updateData: {
      nombre_archivo: string;
      // descripcion: string;
      // categoria: string;
      // estado: string;
      // version: string;
      // archivo_relacionado: string;
      tipo_documento_id: number;
      // etiquetas: string[];
      // metadata: string;
    }
  ): Promise<{
    success: boolean;
    message: string;
    documento: DocumentoItem;
  }> => {
    const response = await apiClient.put(
      `/documentos/${documentoId}`,
      updateData
    );
    return response.data;
  },
};
