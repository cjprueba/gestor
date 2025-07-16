import { z } from "zod";

// Esquemas de validación con Zod
export const createProjectStepOneSchema = z.object({
  nombre: z
    .string()
    .min(1, "El nombre del proyecto es obligatorio")
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres"),
  etapa: z.string().min(1, "Debe seleccionar una etapa"),
});

export const createProjectStepTwoSchema = z.object({
  tipo_iniciativa_id: z.number().min(1, "Tipo de iniciativa es obligatorio"),
  tipo_obra_id: z.number().min(1, "Tipo de obra es obligatorio"),
  region_id: z.number().min(1, "Región es obligatoria"),
  provincia_id: z.number().min(1, "Provincia es obligatoria"),
  comuna_id: z.number().min(1, "Comuna es obligatoria"),
  volumen: z.string().optional(),
  presupuesto_oficial: z.string().optional(),
  valor_referencia: z.string().optional(),
  bip: z.string().optional(),
  fecha_llamado_licitacion: z.string().optional(),
  fecha_recepcion_ofertas_tecnicas: z.string().optional(),
  fecha_apertura_ofertas_economicas: z.string().optional(),
  decreto_adjudicacion: z.string().optional(),
  sociedad_concesionaria: z.string().optional(),
  fecha_inicio_concesion: z.string().optional(),
  plazo_total_concesion: z.string().optional(),
  inspector_fiscal_id: z.number().optional(),
});

export const createProjectStepThreeSchema = z.object({
  carpetas: z
    .array(
      z.object({
        nombre: z.string().min(1, "El nombre de la carpeta es obligatorio"),
        tipo: z.string().optional(),
        id: z.string().optional(),
        subcarpetas: z.array(z.any()).optional(),
      })
    )
    .min(1, "Debe seleccionar al menos una carpeta"),
});

export const createProjectSchema = z.object({
  createProjectStepOne: createProjectStepOneSchema,
  createProjectStepTwo: createProjectStepTwoSchema,
  createProjectStepThree: createProjectStepThreeSchema,
});

export type CreateProjectStepOne = z.infer<typeof createProjectStepOneSchema>;
export type CreateProjectStepTwo = z.infer<typeof createProjectStepTwoSchema>;
export type CreateProjectStepThree = z.infer<
  typeof createProjectStepThreeSchema
>;
export type CreateProjectFormData = z.infer<typeof createProjectSchema>;

// Tipos para la API
export interface CreateProjectRequest {
  nombre: string;
  carpeta_inicial: Record<string, any>;
  division_id: number;
  departamento_id: number;
  unidad_id: number;
  creado_por: number;
  etapas_registro: {
    etapa_tipo_id: number;
    tipo_iniciativa_id?: number;
    tipo_obra_id?: number;
    region_id?: number;
    provincia_id?: number;
    comuna_id?: number;
    volumen?: string;
    presupuesto_oficial?: string;
    valor_referencia?: string;
    bip?: string;
    fecha_llamado_licitacion?: string;
    fecha_recepcion_ofertas_tecnicas?: string;
    fecha_apertura_ofertas_economicas?: string;
    decreto_adjudicacion?: string;
    sociedad_concesionaria?: string;
    fecha_inicio_concesion?: string;
    plazo_total_concesion?: string;
    inspector_fiscal_id: number;
    usuario_creador: number;
  };
}

export interface CreateProjectResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    nombre: string;
    created_at: string;
    updated_at: string;
  };
}

// Tipos para los datos de selección
export interface TipoIniciativa {
  id: number;
  nombre: string;
}

export interface TipoObra {
  id: number;
  nombre: string;
}

export interface Region {
  id: number;
  nombre: string;
}

export interface Provincia {
  id: number;
  nombre: string;
  region_id: number;
}

export interface Comuna {
  id: number;
  nombre: string;
  provincia_id: number;
}

export interface InspectorFiscal {
  id: number;
  nombre: string;
  apellido: string;
}

// Respuestas de la API para los datos de selección
export interface TiposIniciativaResponse {
  data: TipoIniciativa[];
}

export interface TiposObraResponse {
  data: TipoObra[];
}

export interface RegionesResponse {
  data: Region[];
}

export interface ProvinciasResponse {
  data: Provincia[];
}

export interface ComunasResponse {
  data: Comuna[];
}

export interface InspectoresFiscalesResponse {
  data: InspectorFiscal[];
}

export interface ProjectHistoryEntry {
  id: string;
  timestamp: Date;
  userId: string;
  userName: string;
  userAvatar?: string;
  action:
    | "created"
    | "stage_changed"
    | "updated"
    | "document_added"
    | "folder_created";
  details: {
    field?: string;
    oldValue?: string;
    newValue?: string;
    description?: string;
  };
}

export interface ProjectMetadata {
  createdBy: string;
  createdAt: Date;
  lastModifiedBy: string;
  lastModifiedAt: Date;
  currentStage: string;
  history: ProjectHistoryEntry[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  structure: FolderStructure;
  etapa: string;
  projectData?: any;
  metadata: ProjectMetadata;
}

export interface FolderStructure {
  id: string;
  name: string;
  minDocuments: number;
  documents: Document[];
  subfolders: FolderStructure[];
  parentId?: string;
  daysLimit?: number;
  metadata?: {
    createdAt: Date;
    createdBy: string;
    lastModifiedAt: Date;
    lastModifiedBy: string;
  };
}

export interface Document {
  id: string;
  name: string;
  uploadedAt: Date;
  dueDate?: Date;
  hasCustomAlert?: boolean;
  alertConfig?: any;
  metadata?: {
    size?: number;
    type?: string;
    uploadedBy: string;
    lastModifiedAt: Date;
    lastModifiedBy: string;
  };
}
