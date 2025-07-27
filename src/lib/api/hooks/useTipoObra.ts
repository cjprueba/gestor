import { useQuery } from "@tanstack/react-query";
import { tiposObrasService } from "../services/tipos_obras.service";

// Hook para obtener tipos de obras
export const useTiposObras = () => {
  return useQuery({
    queryKey: ["tipos-obras"],
    queryFn: () => tiposObrasService.getTiposObras(),
    staleTime: 30 * 60 * 1000, // 30 minutos
  });
};
