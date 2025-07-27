import { Button } from "@/shared/components/design-system/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { FolderOpen } from "lucide-react"
import { useEffect, useState } from "react"
import type { ProyectoListItem } from "./project.types"

interface RenameProjectDialogProps {
  isOpen: boolean
  onClose: () => void
  project: ProyectoListItem,
  onRename: (newName: string) => Promise<void>
  isLoading?: boolean
}

export default function RenameProjectDialog({
  isOpen,
  onClose,
  project,
  onRename,
  isLoading = false
}: RenameProjectDialogProps) {
  const [newName, setNewName] = useState("")

  // Resetear el nombre cuando se abre el modal
  useEffect(() => {
    if (isOpen && project) {
      setNewName(project.nombre || "")
    }
  }, [isOpen, project])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim() || newName.trim() === project?.nombre) {
      return
    }

    try {
      await onRename(newName.trim())
      onClose()
    } catch (error) {
      console.error("Error al renombrar proyecto:", error)
    }
  }

  const handleClose = () => {
    setNewName("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-blue-500" />
            Renombrar proyecto
          </DialogTitle>
          <DialogDescription>
            Cambia el nombre del proyecto "{project?.nombre}"
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentName">Nombre actual</Label>
            <Input
              id="currentName"
              value={project?.nombre || ""}
              disabled
              className="bg-muted"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="newName">Nuevo nombre *</Label>
            <Input
              id="newName"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Ingresa el nuevo nombre del proyecto"
              autoFocus
              required
            />
          </div>

          <div className="flex space-x-2 pt-4">
            <Button
              type="submit"
              className="flex-1"
              disabled={!newName.trim() || newName.trim() === project?.nombre || isLoading}
            >
              {isLoading ? "Renombrando..." : "Renombrar"}
            </Button>
            <Button type="button" variant="secundario" onClick={handleClose} className="flex-1">
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 