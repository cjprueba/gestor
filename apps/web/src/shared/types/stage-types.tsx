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
