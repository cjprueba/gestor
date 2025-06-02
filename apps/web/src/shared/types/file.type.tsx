export type FileType = "document" | "presentation" | "spreadsheet" | "image" | "video" | "folder" | "pdf" | "code"

export interface FileItem {
  id: string
  name: string
  type: FileType
  size?: number
  modified: Date
  starred?: boolean
  shared?: boolean
  thumbnail?: string
  path: string
  parentId: string | null
}

export interface Folder {
  id: string
  name: string
  path: string
  parentId: string | null
}

export interface Collection {
  id: string
  name: string
  icon?: string
  fileIds: string[] // IDs of files that belong to this collection
}
