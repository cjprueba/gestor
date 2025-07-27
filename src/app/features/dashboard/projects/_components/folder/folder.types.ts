export interface FolderStructure {
  id: string;
  name: string;
  minDocuments: number;
  documents: Document[];
  subfolders: FolderStructure[];
  parentId?: string;
  daysLimit?: number;
}

export interface Document {
  id: string;
  name: string;
  uploadedAt: Date;
  dueDate?: Date;
}

export interface FolderConfig {
  minDocs: number;
  daysLimit?: number;
}

export interface FolderConfigCardProps {
  folder: FolderStructure;
  isSelected: boolean;
  config: FolderConfig;
  onToggle: () => void;
  onConfigChange: (config: FolderConfig) => void;
  onSubfolderAdd: (subfolderName: string) => void;
  onSubfolderEdit: (subfolderId: string, newName: string) => void;
}

export interface CarpetaEstructura {
  id: string;
  nombre: string;
  tipo: "inicial";
  subcarpetas: CarpetaEstructura[];
  nivel: number;
}
