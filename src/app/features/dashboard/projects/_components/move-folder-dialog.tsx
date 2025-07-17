import { Button } from "@/shared/components/design-system/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog"
import { Label } from "@/shared/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { FolderOpen } from "lucide-react"
import { useState, useEffect } from "react"

interface MoveFolderDialogProps {
  isOpen: boolean
  onClose: () => void
  folder: any
  onMove: (newParentId: number | null) => Promise<void>
  isLoading?: boolean
  availableFolders: any[]
  getFolderPath: (folderId: number) => string
  carpetaRaizId: number
}

export default function MoveFolderDialog({
  isOpen,
  onClose,
  folder,
  onMove,
  isLoading = false,
  availableFolders,
  getFolderPath,
  carpetaRaizId
}: MoveFolderDialogProps) {
  const [selectedParentFolderId, setSelectedParentFolderId] = useState<number | null>(null)
  const [showFolderSelector, setShowFolderSelector] = useState(false)

  // Resetear la selección cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      setSelectedParentFolderId(null)
      setShowFolderSelector(false)
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await onMove(selectedParentFolderId)
      onClose()
    } catch (error) {
      console.error("Error al mover carpeta:", error)
    }
  }

  const handleClose = () => {
    setSelectedParentFolderId(null)
    setShowFolderSelector(false)
    onClose()
  }

  // Función para obtener carpetas organizadas específicamente para mover
  const getMoveOrganizedFolders = () => {
    // Excluir solo la carpeta que se está moviendo (permitir mover a cualquier otro lugar)
    const filteredFolders = availableFolders.filter(f => f.id !== folder?.id)

    // Separar por carpetas raíz (que están directamente en carpeta_raiz_id) y subcarpetas
    const rootFolders = filteredFolders.filter(carpeta => carpeta.carpeta_padre_id === carpetaRaizId)
    const subFolders = filteredFolders.filter(carpeta => carpeta.carpeta_padre_id !== carpetaRaizId)

    return {
      sections: [
        {
          title: "Carpetas",
          folders: rootFolders,
          type: "root"
        },
        ...(subFolders.length > 0 ? [{
          title: "Subcarpetas",
          folders: subFolders,
          type: "subfolders"
        }] : [])
      ]
    }
  }

  // Función para obtener el nombre de la carpeta seleccionada
  const getSelectedFolderName = (): string => {
    if (selectedParentFolderId === carpetaRaizId) {
      return "Raíz del proyecto"
    }

    const selectedFolder = availableFolders.find(f => f.id === selectedParentFolderId)
    return selectedFolder?.nombre || "Sin seleccionar"
  }

  const organizedFolders = getMoveOrganizedFolders()

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-blue-500" />
            Mover carpeta
          </DialogTitle>
          <DialogDescription>
            Mueve la carpeta "{folder?.nombre}" a una nueva ubicación
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Carpeta a mover</Label>
            <div className="bg-muted p-3 rounded-lg">
              <div className="flex items-center text-sm">
                <FolderOpen className="w-4 h-4 mr-2 text-blue-500" />
                <span className="font-medium">{folder?.nombre}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Nueva ubicación</Label>
            <div className="bg-muted p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm">
                  <FolderOpen className="w-4 h-4 mr-2 text-blue-500" />
                  <span>
                    Destino: <strong>{getSelectedFolderName()}</strong>
                  </span>
                </div>
                <Button
                  type="button"
                  variant="secundario"
                  size="sm"
                  onClick={() => setShowFolderSelector(!showFolderSelector)}
                >
                  Cambiar
                </Button>
              </div>
            </div>

            {/* Selector de carpeta */}
            {showFolderSelector && (
              <div className="mt-3">
                <Select
                  value={selectedParentFolderId?.toString() || ""}
                  onValueChange={(value) => {
                    if (value === "root") {
                      setSelectedParentFolderId(carpetaRaizId)
                    } else {
                      setSelectedParentFolderId(value ? parseInt(value) : null)
                    }
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccionar carpeta destino...">
                      {getSelectedFolderName()}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="max-h-80">
                    <SelectItem value="root">
                      Raíz del proyecto
                    </SelectItem>

                    {organizedFolders.sections.map((section, sectionIndex) => (
                      <div key={sectionIndex}>
                        {/* Separador de sección */}
                        <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground bg-muted/50 border-b">
                          {section.title}
                        </div>

                        {/* Carpetas de la sección */}
                        {section.folders.map((carpeta) => (
                          <SelectItem
                            key={carpeta.id}
                            value={carpeta.id.toString()}
                            className="pl-6"
                          >
                            <div className="flex flex-col gap-1 w-full">
                              <div className="flex items-center gap-2">
                                <FolderOpen className="w-3 h-3 text-blue-500 flex-shrink-0" />
                                <span className="truncate font-medium">{carpeta.nombre}</span>
                              </div>
                              {section.type === "subfolders" && (
                                <div className="flex items-center gap-1 ml-5">
                                  <span className="text-xs text-muted-foreground truncate">
                                    {getFolderPath(carpeta.id)}
                                  </span>
                                </div>
                              )}
                            </div>
                          </SelectItem>
                        ))}
                      </div>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="flex space-x-2 pt-4">
            <Button
              type="submit"
              className="flex-1"
              disabled={isLoading}
            >
              {isLoading ? "Moviendo..." : "Mover carpeta"}
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