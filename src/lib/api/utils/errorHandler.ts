import type { AxiosError } from 'axios';

// Tipos de errores de API
export interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: any;
}

/**
 * Extrae información de error de una respuesta de axios
 */
export const extractApiError = (error: AxiosError): ApiError => {
  const status = error.response?.status || 0;
  const data = error.response?.data as any;
  
  return {
    message: data?.message || error.message || 'Error desconocido',
    status,
    code: data?.code,
    details: data?.details || data,
  };
};

/**
 * Verifica si un error es de red
 */
export const isNetworkError = (error: AxiosError): boolean => {
  return !error.response && error.request;
};

/**
 * Verifica si un error es de timeout
 */
export const isTimeoutError = (error: AxiosError): boolean => {
  return error.code === 'ECONNABORTED' || error.message.includes('timeout');
};

/**
 * Obtiene un mensaje de error amigable para el usuario
 */
export const getErrorMessage = (error: AxiosError): string => {
  if (isNetworkError(error)) {
    return 'Error de conexión. Verifica tu conexión a internet.';
  }
  
  if (isTimeoutError(error)) {
    return 'La solicitud tardó demasiado. Inténtalo de nuevo.';
  }
  
  const apiError = extractApiError(error);
  
  // Mensajes específicos por código de estado
  switch (apiError.status) {
    case 400:
      return 'Datos inválidos. Verifica la información ingresada.';
    case 401:
      return 'No tienes autorización para realizar esta acción.';
    case 403:
      return 'No tienes permisos para acceder a este recurso.';
    case 404:
      return 'El recurso solicitado no fue encontrado.';
    case 409:
      return 'Conflicto con el recurso existente.';
    case 422:
      return 'Datos de validación incorrectos.';
    case 429:
      return 'Demasiadas solicitudes. Inténtalo más tarde.';
    case 500:
      return 'Error interno del servidor. Inténtalo más tarde.';
    case 502:
    case 503:
    case 504:
      return 'Servicio temporalmente no disponible. Inténtalo más tarde.';
    default:
      return apiError.message;
  }
};

/**
 * Log de errores para debugging
 */
export const logApiError = (error: AxiosError, context?: string): void => {
  const apiError = extractApiError(error);
  
  console.error(`[API Error]${context ? ` [${context}]` : ''}:`, {
    status: apiError.status,
    message: apiError.message,
    url: error.config?.url,
    method: error.config?.method,
    details: apiError.details,
  });
}; 