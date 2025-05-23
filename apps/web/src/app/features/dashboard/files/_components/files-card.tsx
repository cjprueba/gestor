import { Collection } from "@/shared/types/types"

import { FileItem } from "@/shared/types/types"
import { FileContextMenu } from "./file-context-menu"
import { StarIcon } from "lucide-react"
import { formatFileSize } from "@/shared/lib/file-utils"
import { getFileIcon } from "@/shared/lib/file-utils"

export function FileCard({
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
    <div className="group relative overflow-hidden rounded-lg border bg-white cursor-pointer" onClick={onClick}>
      <div className="absolute top-2 right-1 z-10">
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

      {file.starred && (
        <div className="absolute bottom-2 right-2 z-10">
          <div className="rounded-full p-1">
            <StarIcon className="h-3 w-3 text-white" />
          </div>
        </div>
      )}

      {/* <div className="aspect-[4/3] overflow-hidden">
        {file.type === "folder" ? (
          <div className="h-full w-full flex items-center justify-center bg-gray-100">
            <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
              />
            </svg>
          </div>
        ) : (
          <img
            src={file.thumbnail || "/placeholder.svg?height=300&width=400"}
            alt={file.name}
            width={400}
            height={300}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        )}
      </div> */}
      <div className="p-4">
        <div className="flex items-center gap-2">
          {getFileIcon(file.type)}
          <h3 className="font-medium text-gray-900 truncate">{file.name}</h3>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          {file.type === "folder" ? "Folder" : `${file.type} • ${file.size ? formatFileSize(file.size) : ""}`}
        </p>
        <p className="text-xs text-gray-400 mt-1">Modified {file.modified.toLocaleDateString()}</p>
      </div>
    </div>
  )
}