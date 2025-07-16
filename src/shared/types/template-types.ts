// export interface FolderTemplate {
//   id: string
//   name: string
//   description?: string
//   minDocuments: number
//   daysLimit?: number
//   subfolders: SubfolderTemplate[]
//   etapas: string[] // Etapas donde se puede usar este template
//   createdAt: Date
//   createdBy: string
//   lastModifiedAt: Date
//   lastModifiedBy: string
//   isDefault: boolean // Si es un template por defecto del sistema
// }

// export interface SubfolderTemplate {
//   id: string
//   name: string
//   minDocuments: number
//   daysLimit?: number
// }

// export interface TemplateSet {
//   id: string
//   name: string
//   description?: string
//   etapa: string
//   folders: FolderTemplate[]
//   createdAt: Date
//   createdBy: string
//   isDefault: boolean
// }

export interface FolderTemplate {
  id: string
  name: string
  description?: string
  minDocuments: number
  daysLimit?: number
  subfolders: SubfolderTemplate[]
  etapas: string[] // Etapas donde se puede usar este template
  createdAt: Date
  createdBy: string
  lastModifiedAt: Date
  lastModifiedBy: string
  isDefault: boolean // Si es un template por defecto del sistema
  isActive: boolean // Si está activo para uso
  version: number // Control de versiones
  tags?: string[] // Tags para mejor organización
}

export interface SubfolderTemplate {
  id: string
  name: string
  minDocuments: number
  daysLimit?: number
  subfolders?: SubfolderTemplate[] // Soporte para subcarpetas anidadas
}

export interface TemplateSet {
  id: string
  name: string
  description?: string
  etapa: string
  folders: FolderTemplate[]
  createdAt: Date
  createdBy: string
  isDefault: boolean
  isActive: boolean
}

export interface TemplateUsageStats {
  templateId: string
  usageCount: number
  lastUsed: Date
  projectsUsing: string[]
}

export interface TemplateHistory {
  id: string
  templateId: string
  action:
    | 'created'
    | 'updated'
    | 'deleted'
    | 'duplicated'
    | 'activated'
    | 'deactivated'
  changes: Record<string, { old: any; new: any }>
  timestamp: Date
  userId: string
  userName: string
}
