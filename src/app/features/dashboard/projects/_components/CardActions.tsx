import { useEtapasTipo } from "@/lib/api/hooks/useSearch"
import { Button } from "@/shared/components/design-system/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Textarea } from "@/shared/components/ui/textarea"
import { ArrowRightFromLine, Download, Edit, Eye, FileText, FolderOpen, MoreVertical, SquareChartGanttIcon, Trash2 } from "lucide-react"
import { useState } from "react"

interface MenuItem {
  icon: any
  label: string
  action: (() => void) | undefined
  destructive?: boolean
}

interface ContextMenuProps {
  type: "folder" | "project" | "document"
  item: any
  onViewDetails?: () => void
  onViewProjectDetails?: () => void
  onConfig?: () => void
  onEdit?: () => void
  onDelete?: ((motivoEliminacion?: string | any) => void | Promise<void>) | undefined
  onMove?: () => void
  onDownload?: () => void
  onShare?: () => void
  onDuplicate?: () => void
  onAdvanceStage?: () => void
  onPreview?: () => void
}

export default function ContextMenu({
  type,
  item,
  onViewDetails,
  onViewProjectDetails,
  // onConfig,
  onEdit,
  onDelete,
  onMove,
  // onDuplicate,
  onAdvanceStage,
  onDownload,
  // onShare,
  onPreview,
}: ContextMenuProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [confirmationText, setConfirmationText] = useState("")
  const [motivoEliminacion, setMotivoEliminacion] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  // Obtener etapas desde la API en lugar de usar datos locales
  // Esto asegura que la validación de "última etapa" sea dinámica y real
  const { data: etapasData } = useEtapasTipo()

  // Función para obtener el nombre del item según el tipo
  const getItemName = () => {
    return item.nombre_archivo || item.nombre || item.name || ""
  }

  // Función para validar si se puede proceder con la eliminación
  const canProceedWithDeletion = () => {
    const itemName = getItemName()
    const isConfirmationValid = confirmationText === itemName

    if (type === "project") {
      return isConfirmationValid && motivoEliminacion.trim().length > 0
    }

    return isConfirmationValid
  }

  // Función para resetear el modal
  const resetDeleteModal = () => {
    setConfirmationText("")
    setMotivoEliminacion("")
    setIsDeleting(false)
    setIsDeleteDialogOpen(false)
  }

  const getMenuItems = (): MenuItem[] => {
    const commonItems = [
      {
        icon: Eye,
        label: "Ver detalles",
        action: onViewDetails,
      },
      // {
      //   icon: Settings2,
      //   label: "Configurar Alertas",
      //   action: onConfig,
      // }
    ]

    if (type === "document") {
      return [
        // ...commonItems,
        {
          icon: Eye,
          label: "Visualizar",
          action: onPreview,
        },
        {
          icon: SquareChartGanttIcon,
          label: "Ver detalles",
          action: onViewDetails,
        },
        {
          icon: Edit,
          label: "Editar",
          action: onEdit,
        },
        // {
        //   icon: FileSpreadsheetIcon,
        //   label: "Ver ficha de etapa",
        //   action: onViewProjectDetails,
        // },
        {
          icon: Download,
          label: "Descargar",
          action: onDownload,
        },
        // {
        //   icon: Share,
        //   label: "Compartir",
        //   action: onShare,
        // },
        // {
        //   icon: Edit,
        //   label: "Renombrar",
        //   action: onEdit,
        // },
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
          icon: FolderOpen,
          label: "Mover",
          action: onMove,
        },
        // {
        //   icon: Copy,
        //   label: "Duplicar",
        //   action: onDuplicate,
        // },
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
              {item.destructive && <DropdownMenuSeparator />}
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                  item.action?.()
                }}
                className={item.destructive ? "text-destructive focus:text-destructive hover:bg-destructive/10 hover:text-destructive" : ""}
              >
                <item.icon className={`w-4 h-4 mr-2 ${item.destructive ? "text-destructive" : ""}`} />
                {item.label}
              </DropdownMenuItem>
            </div>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isDeleteDialogOpen} onOpenChange={resetDeleteModal}>
        <DialogContent
          className="sm:max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer. <br />
              Para confirmar la eliminación, ingresa el nombre exacto del {type === "project" ? "proyecto" : type === "folder" ? "carpeta" : "documento"}.
              <span className="text-red-500"> {getItemName()}</span>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="confirmation-text">
                Nombre del {type === "project" ? "proyecto" : type === "folder" ? "carpeta" : "documento"}
              </Label>
              <Input
                id="confirmation-text"
                value={confirmationText}
                onChange={(e) => setConfirmationText(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                placeholder={`Ingresa "${getItemName()}"`}
                className="mt-1"
              />
            </div>

            {type === "project" && (
              <div>
                <Label htmlFor="motivo-eliminacion">
                  Motivo de eliminación <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="motivo-eliminacion"
                  value={motivoEliminacion}
                  onChange={(e) => setMotivoEliminacion(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  placeholder="Describe el motivo de la eliminación..."
                  className="mt-1"
                  rows={3}
                />
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <Button
              variant="secundario"
              onClick={(e) => {
                e.stopPropagation()
                resetDeleteModal()
              }}
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button
              variant="primario"
              onClick={async (e) => {
                e.stopPropagation()
                if (!canProceedWithDeletion()) return

                setIsDeleting(true)
                try {
                  if (type === "project") {
                    await onDelete?.(motivoEliminacion)
                  } else {
                    await onDelete?.(item)
                  }
                  resetDeleteModal()
                } catch (error) {
                  console.error("Error al eliminar:", error)
                } finally {
                  setIsDeleting(false)
                }
              }}
              disabled={!canProceedWithDeletion() || isDeleting}
              className="bg-destructive text-white hover:bg-destructive/70 "
            >
              {isDeleting ? "Eliminando..." : "Eliminar"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* TODO: Agregar los dialogs de mover y renombrar */}
    </>
  )
}
