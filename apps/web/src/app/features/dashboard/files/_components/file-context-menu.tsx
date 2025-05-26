"use client"

import { Button } from "@/shared/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import type { Collection, FileItem } from "@/shared/types/types"
import { Star, Trash, FolderPlus, Share2, Info, MoreVertical } from "lucide-react"
import { useState } from "react"
import { FileDetails } from "./file-details"

interface FileContextMenuProps {
  file: FileItem
  collections: Collection[]
  onAddToCollection: (fileId: string, collectionId: string) => void
  onRemoveFromCollection: (fileId: string, collectionId: string) => void
  onDelete: (fileId: string) => void
  onStar: (fileId: string) => void
  onShare: (fileId: string) => void
}

export function FileContextMenu({
  file,
  collections,
  onAddToCollection,
  onRemoveFromCollection,
  onDelete,
  onStar,
  onShare,
}: FileContextMenuProps) {
  const [detailsOpen, setDetailsOpen] = useState(false)

  // Check which collections this file is already in
  const getFileCollections = (fileId: string) => {
    return collections.filter((collection) => collection.fileIds.includes(fileId))
  }

  const fileCollections = getFileCollections(file.id)
  const availableCollections = collections.filter((collection) => !collection.fileIds.includes(file.id))

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Abrir menú</span>
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 hide" onClick={(e) => e.stopPropagation()}>
          <DropdownMenuLabel>Opciones</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => setDetailsOpen(true)}>
              <Info className="mr-2 h-4 w-4" />
              <span>Detalles</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStar(file.id)}>
              <Star className="mr-2 h-4 w-4" />
              <span>{file.starred ? "Quitar favorito" : "Marcar favorito"}</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onShare(file.id)}>
              <Share2 className="mr-2 h-4 w-4" />
              <span>Compartir</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />
          <DropdownMenuLabel>Colecciones</DropdownMenuLabel>

          {availableCollections.length > 0 && (
            <DropdownMenuGroup>
              {availableCollections.map((collection) => (
                <DropdownMenuItem key={collection.id} onClick={() => onAddToCollection(file.id, collection.id)}>
                  <FolderPlus className="mr-2 h-4 w-4" />
                  <span>Agregar a {collection.name}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          )}

          {fileCollections.length > 0 && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Remover de</DropdownMenuLabel>
              <DropdownMenuGroup>
                {fileCollections.map((collection) => (
                  <DropdownMenuItem key={collection.id} onClick={() => onRemoveFromCollection(file.id, collection.id)}>
                    <Trash className="mr-2 h-4 w-4" />
                    <span>{collection.name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </>
          )}

          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-600" onClick={() => onDelete(file.id)}>
            <Trash className="mr-2 h-4 w-4" />
            <span>Eliminar</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <FileDetails file={file} collections={collections} open={detailsOpen} setOpen={setDetailsOpen} />
    </>

  )
}
