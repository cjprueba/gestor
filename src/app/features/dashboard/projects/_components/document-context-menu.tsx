import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import { Button } from "@/shared/components/design-system/button"
import { Download, Eye, MoreVertical, Trash } from "lucide-react"
import type { DocumentoItem } from "@/shared/types/project-types"
import { Separator } from "@/shared/components/ui/separator"

interface DocumentContextMenuProps {
  document: DocumentoItem
  onView: (document: DocumentoItem) => void
  onDownload: (document: DocumentoItem) => void
  onDelete: (document: DocumentoItem) => void
}

export function DocumentContextMenu({
  document,
  onView,
  onDownload,
  onDelete,
}: DocumentContextMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className=" p-0 hover:bg-muted"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">Abrir menú</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem onClick={() => onView(document)}>
          <Eye className="mr-2 h-4 w-4" />
          Ver
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onDownload(document)}>
          <Download className="mr-2 h-4 w-4" />
          Descargar
        </DropdownMenuItem>
        <Separator />
        <DropdownMenuItem onClick={() => onDelete(document)} className="text-red-500">
          <Trash className="mr-2 h-4 w-4 text-red-500" />
          Eliminar
        </DropdownMenuItem>
      </DropdownMenuContent>

    </DropdownMenu>
  )
} 