export interface FormField {
  id: string
  name: string
  label: string
  type: "text" | "textarea" | "number" | "date" | "select" | "checkbox" | "email" | "tel"
  required: boolean
  placeholder?: string
  options?: string[] // Para campos select
  validation?: {
    min?: number
    max?: number
    pattern?: string
    message?: string
  }
  defaultValue?: string | number | boolean
  description?: string
}

export interface StageForm {
  id: string
  name: string
  description?: string
  fields: FormField[]
  createdAt: Date
  createdBy: string
  lastModifiedAt: Date
  lastModifiedBy: string
  isActive: boolean
  version: number
}

export interface ProjectStage {
  id: string
  name: string
  description?: string
  color?: string
  order: number
  formId?: string // Referencia al formulario asociado
  isDefault: boolean
  isActive: boolean
  createdAt: Date
  createdBy: string
  lastModifiedAt: Date
  lastModifiedBy: string
  metadata?: {
    projectCount?: number
    averageCompletionTime?: number
  }
}

export interface StageUsageStats {
  stageId: string
  projectCount: number
  averageCompletionTime: number
  lastUsed: Date
  completionRate: number
}


export interface Stage {
  id: string
  name: string
  description?: string
  color?: string
  order: number
  isDefault: boolean
  isActive: boolean
}

export interface CreateStageRequest {
  nombre: string;
  descripcion?: string;
  orden: number;
  color?: string;
  activo?: boolean;
}


export interface StagesQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  activo?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Respuestas de la API
export interface StagesResponse {
  data: Stage[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface StageResponse {
  data: Stage;
  message?: string;
  success: boolean;
}

export interface StageType {
  id: number;
  nombre: string;
  descripcion: string;
  color: string | null;
}

export interface StageTypeDetail {
  id: number;
  nombre: string;
  descripcion: string;
  color: string;
  tipo_iniciativa: boolean;
  tipo_obra: boolean;
  bip: boolean;
  region: boolean;
  provincia: boolean;
  comuna: boolean;
  volumen: boolean;
  presupuesto_oficial: boolean;
  fecha_llamado_licitacion: boolean;
  fecha_recepcion_ofertas_tecnicas: boolean;
  fecha_apertura_ofertas_economicas: boolean;
  fecha_inicio_concesion: boolean;
  plazo_total_concesion: boolean;
  decreto_adjudicacion: boolean;
  sociedad_concesionaria: boolean;
  inspector_fiscal_id: boolean;
}

export interface StageTypeDetailResponse {
  success: boolean;
  message: string;
  data: StageTypeDetail;
}