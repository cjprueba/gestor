import { ArrowRightIcon } from "lucide-react"

import { formatFileSize, getFileIcon } from "@/shared/lib/file-utils"
import type { Collection, FileItem } from "@/shared/types/file.type"

import { Button } from "@/shared/components/design-system/button"
import { FileContextMenu } from "./file-context-menu"

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

      {/* {file.starred && (
        <div className="absolute bottom-2 right-2 z-10">
          <div className="rounded-full p-1">
            <StarIcon className="h-3 w-3 text-white" />
          </div>
        </div>
      )} */}

      <div className="pt-4 px-4">
        <div className="flex items-center gap-2 justify-between">
          <div className="flex items-center gap-2">
            {getFileIcon(file.type)}
            <h4 className=" text-gray-900 truncate">{file.name}</h4>
          </div>
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
        <p className="text-sm text-gray-500 mt-1">
          {file.type === "folder" ? "Folder" : `${file.type} • ${file.size ? formatFileSize(file.size) : ""}`}
        </p>
        <p className="text-xs text-gray-400 mt-1">Modified {file.modified.toLocaleDateString()}</p>
        <div className="flex justify-end mb-2 mt-4">
          <Button
            variant="primario"
            className="inline-flex items-center gap-2 justify-center transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 w-1/2 h-10">
            Ver
            <ArrowRightIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>

    </div>
  )
}