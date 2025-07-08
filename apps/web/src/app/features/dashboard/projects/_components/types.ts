export interface Project {
  id: string
  name: string
  createdAt: Date
  structure: FolderStructure
  etapa: string
  projectData?: any
  metadata?: any
}

export interface FolderStructure {
  id: string
  name: string
  minDocuments: number
  documents: Document[]
  subfolders: FolderStructure[]
  parentId?: string
  daysLimit?: number
}

export interface Document {
  id: string
  name: string
  uploadedAt: Date
  dueDate?: Date
}

export interface FolderConfig {
  minDocs: number
  daysLimit?: number
}

export interface FolderConfigCardProps {
  folder: FolderStructure
  isSelected: boolean
  config: FolderConfig
  onToggle: () => void
  onConfigChange: (config: FolderConfig) => void
  onSubfolderAdd: (subfolderName: string) => void
  onSubfolderEdit: (subfolderId: string, newName: string) => void
}

export interface ProjectFormData {
  // Campos básicos
  nombre: string
  etapa: string
  descripcion?: string

  // Campos comunes
  tipoIniciativa?: string
  tipoObra?: string
  region?: string
  provincia?: string
  comuna?: string
  volumen?: string
  presupuestoOficial?: string

  // Fechas específicas por etapa
  llamadoLicitacion?: string
  plazoConcesion?: string
  fechaLlamadoLicitacion?: string
  fechaRecepcionOfertas?: string
  fechaAperturaOfertas?: string

  // Campos de concesiones
  decretoAdjudicacion?: string
  sociedadConcesionaria?: string
  inicioPlazoConcesion?: string
  plazoTotalConcesion?: string
  inspectorFiscal?: string

  // Campos específicos
  valorReferencia?: string

  // Alertas del proyecto
  alertaFechaLimite?: string
  alertaDescripcion?: string
}

export interface ProjectCardProps {
  project: Project
  onSelect: (project: Project) => void
  totalAlerts: number
}

export interface ProjectListProps {
  projects: Project[]
  onSelectProject: (project: Project) => void
  onCreateProject: () => void
}
