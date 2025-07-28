import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { documentosService } from "../services/documentos.service";
import type { UploadDocumentoRequest } from "@/shared/types/document-types";
import { toast } from "sonner";

export const useDocumentos = () => {
  const queryClient = useQueryClient();

  // Hook para obtener tipos de documento
  const useGetTiposDocumento = () => {
    return useQuery({
      queryKey: ["tipos-documento"],
      queryFn: () => documentosService.getTiposDocumento(),
      staleTime: 5 * 60 * 1000, // 5 minutos
    });
  };

  // Hook para obtener documentos de una carpeta
  const useGetDocumentosByCarpeta = (carpetaId: number) => {
    return useQuery({
      queryKey: ["documentos", "carpeta", carpetaId],
      queryFn: () => documentosService.getDocumentosByCarpeta(carpetaId),
      enabled: !!carpetaId,
    });
  };

  // Hook para obtener metadatos de un documento específico
  const useGetDocumentoMetadata = (documentoId: string | undefined) => {
    return useQuery({
      queryKey: ["documento-metadata", documentoId],
      queryFn: () => documentosService.getDocumentoMetadata(documentoId!),
      enabled: !!documentoId,
      staleTime: 5 * 60 * 1000, // 5 minutos
    });
  };

  // Hook para subir documentos
  const useUploadDocumentos = () => {
    return useMutation({
      mutationFn: (request: UploadDocumentoRequest) =>
        documentosService.uploadDocumentos(request),
      onSuccess: () => {
        toast.success("Documentos subidos exitosamente");
        // Invalidar las queries relacionadas para refrescar los datos
        queryClient.invalidateQueries({ queryKey: ["carpeta-contenido"] });
        queryClient.invalidateQueries({ queryKey: ["carpetas-proyecto"] });
      },
      onError: (error: any) => {
        toast.error(
          error.response?.data?.message || "Error al subir documentos"
        );
      },
    });
  };

  // Hook para eliminar documento
  const useDeleteDocumento = () => {
    return useMutation({
      mutationFn: (documentoId: string) =>
        documentosService.deleteDocumento(documentoId),
      onSuccess: () => {
        toast.success("Documento eliminado exitosamente");
        // Invalidar las queries relacionadas para refrescar los datos
        queryClient.invalidateQueries({ queryKey: ["carpeta-contenido"] });
        queryClient.invalidateQueries({ queryKey: ["carpetas-proyecto"] });
      },
      onError: (error: any) => {
        toast.error(
          error.response?.data?.message || "Error al eliminar documento"
        );
      },
    });
  };

  // Hook para descargar documento
  const useDownloadDocumento = () => {
    return useMutation({
      mutationFn: (documentoId: string) =>
        documentosService.downloadDocumento(documentoId),
      onSuccess: (data) => {
        console.log("Respuesta de descarga:", data);
        if (data.success && data.url) {
          // Crear un enlace temporal para descargar el archivo
          const link = document.createElement("a");
          link.href = data.url;
          link.download = "";
          link.target = "_blank";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          toast.success("Descarga iniciada");
        } else {
          console.error("Respuesta inválida:", data);
          toast.error(
            `Error al obtener el enlace de descarga: ${data.message || "Respuesta inválida del servidor"}`
          );
        }
      },
      onError: (error: any) => {
        console.error("Error de descarga:", error);
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Error al descargar documento";
        toast.error(errorMessage);
      },
    });
  };

  // Hook para descargar documento como base64
  const useDownloadDocumentoBase64 = () => {
    return useMutation({
      mutationFn: ({ documentoId }: { documentoId: string }) =>
        documentosService.downloadDocumentoBase64(documentoId),
      onError: (error: any) => {
        console.error("Error de descarga base64:", error);
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Error al descargar documento";
        toast.error(errorMessage);
      },
    });
  };

  return {
    useGetTiposDocumento,
    useGetDocumentosByCarpeta,
    useGetDocumentoMetadata,
    useUploadDocumentos,
    useDeleteDocumento,
    useDownloadDocumento,
    useDownloadDocumentoBase64,
  };
};
