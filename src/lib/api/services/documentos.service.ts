import type {
  DownloadDocumentoResponse,
  DownloadDocumentoBase64Response,
  GetDocumentosResponse,
  UploadDocumentoRequest,
  UploadDocumentoResponse,
  GetTiposDocumentoResponse,
} from "@/shared/types/document-types";
import { apiClient } from "../config";

export const documentosService = {
  // Obtener tipos de documento
  getTiposDocumento: async (): Promise<GetTiposDocumentoResponse> => {
    const response = await apiClient.get("/documentos/tipos");
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
};
