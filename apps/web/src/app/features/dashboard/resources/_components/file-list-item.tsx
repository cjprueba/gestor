import { StarIcon } from "lucide-react"

import { formatFileSize } from "@/shared/lib/file-utils"
import { getFileIcon } from "@/shared/lib/file-utils"
import { FileItem } from "@/shared/types/types"
import { Collection } from "@/shared/types/types"

import { FileContextMenu } from "./file-context-menu"

export function FileListItem({
  file,
  collections,
  onClick,
  onAddToCollection,
  onRemoveFromCollection,
  onDeleteFile,
  onStarFile,
  onShareFile,
}: {
  file: FileItem
  collections: Collection[]
  onClick: () => void
  onAddToCollection: (fileId: string, collectionId: string) => void
  onRemoveFromCollection: (fileId: string, collectionId: string) => void
  onDeleteFile: (fileId: string) => void
  onStarFile: (fileId: string) => void
  onShareFile: (fileId: string) => void
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer border-b" onClick={onClick}>
      {getFileIcon(file.type)}
      <div className="flex-1 min-w-0">
        <div className="flex items-center">
          <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
          {file.starred && (
            <div className="ml-2">
              <StarIcon className="h-3 w-3 text-yellow-400" />
            </div>
          )}
        </div>
        <p className="text-xs text-gray-500">
          {file.type === "folder" ? "Folder" : `${file.type} • ${file.size ? formatFileSize(file.size) : ""}`}
        </p>
      </div>
      <div className="text-xs text-gray-400">{file.modified.toLocaleDateString()}</div>
      <div onClick={(e) => e.stopPropagation()}>
        <FileContextMenu
          file={file}
          collections={collections}
          onAddToCollection={onAddToCollection}
          onRemoveFromCollection={onRemoveFromCollection}
          onDelete={onDeleteFile}
          onStar={onStarFile}
          onShare={onShareFile}
        />
      </div>
    </div>
  )
}