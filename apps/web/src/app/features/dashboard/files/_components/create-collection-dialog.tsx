"use client"

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
import { useState } from "react"

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
          <DialogTitle>Create New Collection</DialogTitle>
          <DialogDescription>Collections help you organize related files across different folders.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
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
            Create Collection
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
