// Configuración
export { apiClient, API_BASE_URL } from "./config";

// Tipos
export * from "@/shared/types/stage-types";

// Esquemas
export * from "./schemas/stages.schema";

// Servicios
export { StagesService } from "./services/stages.service";
export { ProjectsService } from "./services/projects.service";
export { searchService } from "./services/search.service";
export { documentosService } from "./services/documentos.service";

// Hooks
export * from "./hooks/useStages";
export * from "./hooks/useProjects";
export * from "./hooks/useSearch";
export * from "./hooks/useDocumentos";

// Utilidades
export * from "./utils/errorHandler";

// QueryClient
export { queryClient } from "./queryClient";

// Re-exportar tipos comunes para conveniencia
export type { ApiResponse, PaginatedResponse } from "./config";
