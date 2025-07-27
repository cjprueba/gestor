import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../config";
import type { CarpetaDetalleResponse } from "@/app/features/dashboard/projects/_components/folder/folder.types";

// Servicio para obtener detalle de carpeta
const getCarpetaDetalle = async (
  carpetaId: number
): Promise<CarpetaDetalleResponse> => {
  const response = await apiClient.get<CarpetaDetalleResponse>(
    `/carpetas/${carpetaId}`
  );
  return response.data;
};

// Hook para obtener el detalle de una carpeta
export const useCarpetaDetalle = (carpetaId: number | undefined) => {
  return useQuery({
    queryKey: ["carpeta-detalle", carpetaId],
    queryFn: () => getCarpetaDetalle(carpetaId!),
    enabled: !!carpetaId,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};
