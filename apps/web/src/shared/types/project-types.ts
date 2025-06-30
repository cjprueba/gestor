export interface ProjectHistoryEntry {
  id: string
  timestamp: Date
  userId: string
  userName: string
  userAvatar?: string
  action:
    | 'created'
    | 'stage_changed'
    | 'updated'
    | 'document_added'
    | 'folder_created'
  details: {
    field?: string
    oldValue?: string
    newValue?: string
    description?: string
  }
}

export interface ProjectMetadata {
  createdBy: string
  createdAt: Date
  lastModifiedBy: string
  lastModifiedAt: Date
  currentStage: string
  history: ProjectHistoryEntry[]
}

export interface Project {
  id: string
  name: string
  description: string
  createdAt: Date
  structure: FolderStructure
  etapa: string
  projectData?: any
  metadata: ProjectMetadata
}

export interface FolderStructure {
  id: string
  name: string
  minDocuments: number
  documents: Document[]
  subfolders: FolderStructure[]
  parentId?: string
  daysLimit?: number
  metadata?: {
    createdAt: Date
    createdBy: string
    lastModifiedAt: Date
    lastModifiedBy: string
  }
}

export interface Document {
  id: string
  name: string
  uploadedAt: Date
  dueDate?: Date
  hasCustomAlert?: boolean
  alertConfig?: any
  metadata?: {
    size?: number
    type?: string
    uploadedBy: string
    lastModifiedAt: Date
    lastModifiedBy: string
  }
}
