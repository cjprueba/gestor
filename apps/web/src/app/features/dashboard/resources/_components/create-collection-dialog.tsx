

import { useState } from "react"

import { Button } from "@/shared/components/design-system/button"
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

interface CreateCollectionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateCollection: (name: string) => void
}

export function CreateCollectionDialog({ open, onOpenChange, onCreateCollection }: CreateCollectionDialogProps) {
  const [collectionName, setCollectionName] = useState("")

  const handleCreate = () => {
    if (collectionName.trim()) {
      onCreateCollection(collectionName)
      setCollectionName("")
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Crear Nueva Colección</DialogTitle>
          <DialogDescription>Las colecciones te ayudan a organizar archivos relacionados en diferentes carpetas.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nombre
            </Label>
            <Input
              id="name"
              value={collectionName}
              onChange={(e) => setCollectionName(e.target.value)}
              className="col-span-3"
              autoFocus
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleCreate}>
            Crear Colección
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
