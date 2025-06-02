import type React from "react"
import { v4 as uuidv4 } from "uuid"

import type { FileItem, FileType, Folder } from "@/shared/types/file.type"

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

export function getFileTypeFromExtension(filename: string): FileType {
  const extension = filename.split(".").pop()?.toLowerCase() || ""

  if (["doc", "docx", "txt", "pdf"].includes(extension)) {
    return "document"
  } else if (["ppt", "pptx"].includes(extension)) {
    return "presentation"
  } else if (["xls", "xlsx", "csv"].includes(extension)) {
    return "spreadsheet"
  } else if (["jpg", "jpeg", "png", "gif", "svg"].includes(extension)) {
    return "image"
  } else if (["mp4", "mov", "avi", "webm"].includes(extension)) {
    return "video"
  }

  return "document"
}

export function createFileItem(
  name: string,
  type: FileType,
  size: number,
  parentId: string | null,
  path: string,
): FileItem {
  return {
    id: uuidv4(),
    name,
    type,
    size,
    modified: new Date(),
    starred: false,
    shared: false,
    path,
    parentId,
    thumbnail: type === "folder" ? undefined : `/placeholder.svg?height=300&width=400`,
  }
}

// Create a new folder
export function createFolder(name: string, parentId: string | null, path: string): Folder {
  return {
    id: uuidv4(),
    name,
    path,
    parentId,
  }
}

// Get file icon based on type
export function getFileIcon(type: FileType): React.ReactElement {
  switch (type) {
    case "document":
      return (
        <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      )
    case "presentation":
      return (
        <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 12V5a2 2 0 012-2h6a2 2 0 012 2v14a2 2 0 01-2 2H9a2 2 0 01-2-2v-5m8-7H9"
          />
        </svg>
      )
    case "spreadsheet":
      return (
        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      )
    case "image":
      return (
        <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V8a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      )
    case "video":
      return (
        <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
      )
    case "folder":
      return (
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
          />
        </svg>
      )
    default:
      return (
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      )
  }
}
