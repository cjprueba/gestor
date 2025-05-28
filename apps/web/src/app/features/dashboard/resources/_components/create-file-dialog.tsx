

import { useState } from "react"

import { Button } from "@/shared/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import type { FileType } from "@/shared/types/types"

interface CreateFileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateFile: (name: string, type: FileType) => void
}

export function CreateFileDialog({ open, onOpenChange, onCreateFile }: CreateFileDialogProps) {
  const [fileName, setFileName] = useState("")
  const [fileType, setFileType] = useState<FileType>("document")

  const handleCreate = () => {
    if (fileName.trim()) {
      onCreateFile(fileName, fileType)
      setFileName("")
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Archivo</DialogTitle>
          <DialogDescription>Ingresa un nombre y selecciona un tipo para tu nuevo archivo.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nombre
            </Label>
            <Input
              id="name"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="col-span-3"
              autoFocus
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">
              Tipo
            </Label>
            <select
              id="type"
              value={fileType}
              onChange={(e) => setFileType(e.target.value as FileType)}
              className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="document">Documento</option>
              <option value="presentation">Presentación</option>
              <option value="spreadsheet">Hoja de Cálculo</option>
              <option value="image">Imagen</option>
              <option value="video">Video</option>
            </select>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleCreate}>
            Crear
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
