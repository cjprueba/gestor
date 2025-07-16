import { QueryClient } from '@tanstack/react-query';

// Configuración del QueryClient
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Tiempo que los datos se consideran frescos
      staleTime: 5 * 60 * 1000, // 5 minutos
      
      // Tiempo que los datos se mantienen en caché
      gcTime: 10 * 60 * 1000, // 10 minutos
      
      // Reintentos en caso de error
      retry: (failureCount, error: any) => {
        // No reintentar en errores 4xx (excepto 408, 429)
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          if (error?.response?.status === 408 || error?.response?.status === 429) {
            return failureCount < 3;
          }
          return false;
        }
        
        // Reintentar hasta 3 veces para otros errores
        return failureCount < 3;
      },
      
      // Refetch en window focus
      refetchOnWindowFocus: false,
      
      // Refetch en reconnect
      refetchOnReconnect: true,
    },
    mutations: {
      // Reintentos para mutaciones
      retry: (failureCount, error: any) => {
        // No reintentar mutaciones en errores 4xx
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false;
        }
        
        // Reintentar hasta 2 veces para otros errores
        return failureCount < 2;
      },
    },
  },
}); 