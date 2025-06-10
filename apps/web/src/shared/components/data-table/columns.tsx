import type { ColumnDef } from "@tanstack/react-table"
import { formatFileSize } from "@/shared/lib/file-utils"
import type { FileItem } from "@/shared/types/file.type"
import { Checkbox } from "@/shared/components/ui/checkbox"
import { Button } from "@/shared/components/design-system/button"
import { EyeIcon, Trash2Icon, Share2Icon, FilterIcon } from "lucide-react"

export function getFileColumns(
  selected: string[],
  setSelected: (ids: string[]) => void,
  actions: {
    onClick: (file: FileItem) => void
    onDeleteFile: (id: string) => void
    onStarFile: (id: string) => void
    onShareFile: (id: string) => void
  }
): ColumnDef<FileItem>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => {
            table.toggleAllPageRowsSelected(!!value)
            const visibleRowIds = table.getRowModel().rows.map(r => r.original.id)
            setSelected(value ? visibleRowIds : [])
          }}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => {
            row.toggleSelected(!!value)
            const id = row.original.id
            setSelected(value ? [...selected, id] : selected.filter(i => i !== id))
          }}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: "Nombre",
      cell: ({ row }) => <div className="font-medium">{row.original.name}</div>,
    },
    {
      accessorKey: "type",
      header: "Tipo",
      cell: ({ row }) => <div className="text-muted-foreground">{row.original.type}</div>,
    },
    {
      accessorKey: "size",
      header: () => (
        <div className="flex items-center gap-1 justify-center">
          Tamaño
          <FilterIcon className="w-3 h-3 text-white" />
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-muted-foreground justify-center flex">
          {row.original.size ? formatFileSize(row.original.size) : "-"}
        </div>
      ),
    },
    {
      accessorKey: "modified",
      header: () => (
        <div className="flex items-center gap-1 justify-center">
          Modificado
          <FilterIcon className="w-3 h-3 text-white" />
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-muted-foreground justify-center flex">
          {new Date(row.original.modified).toLocaleDateString()}
        </div>
      ),
    },
    {
      id: "actions",
      header: () => (
        <div className="flex items-center justify-center">
          Acciones
        </div>
      ),
      cell: ({ row }) => {
        const file = row.original
        return (
          <div className="flex gap-2 items-center justify-center">
            <Button variant="ghost" size="icon" onClick={() => actions.onClick(file)}>
              <EyeIcon className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => actions.onShareFile(file.id)}>
              <Share2Icon className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => actions.onDeleteFile(file.id)}>
              <Trash2Icon className="h-4 w-4" />
            </Button>
          </div>
        )
      },
    },
  ]
}