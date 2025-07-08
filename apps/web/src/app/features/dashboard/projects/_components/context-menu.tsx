import { useState } from "react"
import { Button } from "@/shared/components/design-system/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog"
import { MoreVertical, Eye, Edit, Trash2, Download, Share, Copy, Settings2, FileText } from "lucide-react"
import { ETAPAS } from "@/shared/data/project-data"

interface MenuItem {
  icon: any
  label: string
  action: (() => void) | undefined
  destructive?: boolean
}

interface ContextMenuProps {
  type: "project" | "folder" | "document"
  item: any
  onViewDetails: () => void
  onViewProjectDetails?: () => void
  onConfig?: () => void
  onEdit?: () => void
  onDelete?: () => void
  onDownload?: () => void
  onShare?: () => void
  onDuplicate?: () => void
  onAdvanceStage?: () => void
}

export default function ContextMenu({
  type,
  item,
  onViewDetails,
  onViewProjectDetails,
  onConfig,
  onEdit,
  onDelete,
  onDownload,
  onShare,
  onDuplicate,
  onAdvanceStage,
}: ContextMenuProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const getMenuItems = (): MenuItem[] => {
    const commonItems = [
      {
        icon: Eye,
        label: "Ver Detalles",
        action: onViewDetails,
      },
      {
        icon: Settings2,
        label: "Configurar Alertas",
        action: onConfig,
      }
    ]

    if (type === "document") {
      return [
        ...commonItems,
        {
          icon: Download,
          label: "Descargar",
          action: onDownload,
        },
        {
          icon: Share,
          label: "Compartir",
          action: onShare,
        },
        {
          icon: Copy,
          label: "Duplicar",
          action: onDuplicate,
        },
        {
          icon: Edit,
          label: "Renombrar",
          action: onEdit,
        },
        {
          icon: Trash2,
          label: "Eliminar",
          action: () => setIsDeleteDialogOpen(true),
          destructive: true,
        },
      ]
    }

    if (type === "folder") {
      const folderItems = [
        ...commonItems,
        {
          icon: Edit,
          label: "Renombrar",
          action: onEdit,
        },
        {
          icon: Copy,
          label: "Duplicar",
          action: onDuplicate,
        },
        {
          icon: Trash2,
          label: "Eliminar",
          action: () => setIsDeleteDialogOpen(true),
          destructive: true,
        },
      ]

      if (onViewProjectDetails) {
        folderItems.splice(2, 0, {
          icon: FileText,
          label: "Ver ficha de etapa",
          action: onViewProjectDetails,
        })
      }

      return folderItems
    }

    if (type === "project") {
      const isLastStage = ETAPAS[ETAPAS.length - 1] === item.etapa
      const projectItems = [
        ...commonItems,
        !isLastStage ? {
          icon: MoreVertical,
          label: "Avanzar a siguiente etapa",
          action: onAdvanceStage,
        } : undefined,
        {
          icon: Edit,
          label: "Editar",
          action: onEdit,
        },
        {
          icon: Copy,
          label: "Duplicar",
          action: onDuplicate,
        },
        {
          icon: Trash2,
          label: "Eliminar",
          action: () => setIsDeleteDialogOpen(true),
          destructive: true,
        },
      ].filter(x => !!x) as MenuItem[]
      return projectItems
    }

    return commonItems
  }

  const menuItems = getMenuItems()

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreVertical className="w-4 h-4" />
            <span className="sr-only">Abrir menú</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {menuItems.map((item, index) => (
            <div key={index}>
              <DropdownMenuItem
                onClick={item.action}
                className={item.destructive ? "text-destructive focus:text-destructive" : ""}
              >
                <item.icon className="w-4 h-4 mr-2" />
                {item.label}
              </DropdownMenuItem>
              {(index === 0 || (item.label === "Ver ficha de etapa")) && <DropdownMenuSeparator />}
            </div>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar "{item.name}"? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="secundario" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              variant="primario"
              onClick={() => {
                onDelete?.()
                setIsDeleteDialogOpen(false)
              }}
            >
              Eliminar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
