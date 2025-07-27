import { Button } from "@/shared/components/design-system/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import { ArrowRightFromLine, Copy, Edit, Eye, FileText, FolderOpen, MoreVertical, Settings2, Trash2 } from "lucide-react"
import { useState } from "react"
import { useEtapasTipo } from "@/lib/api/hooks/useSearch"

interface MenuItem {
  icon: any
  label: string
  action: (() => void) | undefined
  destructive?: boolean
}

interface ContextMenuProps {
  type: "folder" | "project"
  item: any
  onViewDetails?: () => void
  onViewProjectDetails?: () => void
  onConfig?: () => void
  onEdit?: () => void
  onDelete?: () => void
  onMove?: () => void
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
  onMove,
  onDuplicate,
  onAdvanceStage,
}: ContextMenuProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  // Obtener etapas desde la API en lugar de usar datos locales
  // Esto asegura que la validación de "última etapa" sea dinámica y real
  const { data: etapasData } = useEtapasTipo()

  const getMenuItems = (): MenuItem[] => {
    const commonItems = [
      {
        icon: Eye,
        label: "Ver detalles",
        action: onViewDetails,
      },
      {
        icon: Settings2,
        label: "Configurar Alertas",
        action: onConfig,
      }
    ]

    // if (type === "document") {
    //   return [
    //     ...commonItems,
    //     {
    //       icon: Download,
    //       label: "Descargar",
    //       action: onDownload,
    //     },
    //     {
    //       icon: Share,
    //       label: "Compartir",
    //       action: onShare,
    //     },
    //     {
    //       icon: Copy,
    //       label: "Duplicar",
    //       action: onDuplicate,
    //     },
    //     {
    //       icon: Edit,
    //       label: "Renombrar",
    //       action: onEdit,
    //     },
    //     {
    //       icon: Trash2,
    //       label: "Eliminar",
    //       action: () => setIsDeleteDialogOpen(true),
    //       destructive: true,
    //     },
    //   ]
    // }

    if (type === "folder") {
      const folderItems = [
        ...commonItems,
        {
          icon: Edit,
          label: "Renombrar",
          action: onEdit,
        },
        {
          icon: FolderOpen,
          label: "Mover",
          action: onMove,
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
      const etapas = etapasData || []
      const isLastStage = etapas.length > 0 &&
        etapas[etapas.length - 1]?.nombre === item.etapa

      const projectItems = [
        {
          icon: Eye,
          label: "Ver ficha de etapa",
          action: onViewProjectDetails,
        },
        (!isLastStage && etapas.length > 0) ? {
          icon: ArrowRightFromLine,
          label: "Avanzar de etapa",
          action: onAdvanceStage,
        } : undefined,
        {
          icon: Edit,
          label: "Renombrar",
          action: onEdit,
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
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreVertical className="w-4 h-4" />
            <span className="sr-only">Abrir menú</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {menuItems.map((item, index) => (
            <div key={index}>
              <DropdownMenuItem
                onClick={(e) => {
                  console.log("DropdownMenuItem clicked:", item.label)
                  e.stopPropagation()
                  item.action?.()
                }}
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

      {/* TODO: Agregar los dialogs de mover y renombrar */}
    </>
  )
}
