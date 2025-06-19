"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/design-system/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Badge } from "@/shared/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog"
import { Folder, Settings2, Plus, Edit2, Calendar } from "lucide-react"

interface FolderStructure {
  id: string
  name: string
  minDocuments: number
  documents: any[]
  subfolders: FolderStructure[]
  parentId?: string
  dueDate?: Date
}

interface FolderConfig {
  minDocs: number
  dueDate?: Date
}

interface FolderConfigCardProps {
  folder: FolderStructure
  isSelected: boolean
  config: FolderConfig
  onToggle: () => void
  onConfigChange: (config: FolderConfig) => void
  onSubfolderAdd: (name: string) => void
  onSubfolderEdit: (subfolderId: string, newName: string) => void
}

export default function FolderConfigCard({
  folder,
  isSelected,
  config,
  onToggle,
  onConfigChange,
  onSubfolderAdd,
  onSubfolderEdit,
}: FolderConfigCardProps) {
  const [isConfigExpanded, setIsConfigExpanded] = useState(false)
  const [isAddSubfolderOpen, setIsAddSubfolderOpen] = useState(false)
  const [newSubfolderName, setNewSubfolderName] = useState("")
  const [editingSubfolder, setEditingSubfolder] = useState<{ id: string; name: string } | null>(null)

  const addSubfolder = () => {
    if (!newSubfolderName.trim()) return
    onSubfolderAdd(newSubfolderName)
    setNewSubfolderName("")
    setIsAddSubfolderOpen(false)
  }

  const saveSubfolderEdit = () => {
    if (!editingSubfolder || !editingSubfolder.name.trim()) return
    onSubfolderEdit(editingSubfolder.id, editingSubfolder.name)
    setEditingSubfolder(null)
  }

  return (
    <Card className={`transition-all ${isSelected ? "ring-2 ring-primary" : ""}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <input type="checkbox" id={folder.id} checked={isSelected} onChange={onToggle} className="w-4 h-4" />
            <div className="flex items-center space-x-2">
              <Folder className="w-5 h-5 text-blue-500" />
              <CardTitle className="text-base">{folder.name}</CardTitle>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="text-xs">
              {folder.subfolders.length} subcarpetas
            </Badge>
            {isSelected && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsConfigExpanded(!isConfigExpanded)}
                className="h-8 w-8 p-0"
              >
                <Settings2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      {isSelected && (
        <CardContent className="pt-0">
          {/* Subcarpetas editables */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm font-medium">Subcarpetas</Label>
              <Dialog open={isAddSubfolderOpen} onOpenChange={setIsAddSubfolderOpen}>
                <DialogTrigger asChild>
                  <Button variant="primario" size="sm">
                    <Plus className="w-3 h-3 mr-1" />
                    Agregar
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Agregar Subcarpeta</DialogTitle>
                    <DialogDescription>Crear una nueva subcarpeta en {folder.name}</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="subfolderName">Nombre de la Subcarpeta</Label>
                      <Input
                        id="subfolderName"
                        value={newSubfolderName}
                        onChange={(e) => setNewSubfolderName(e.target.value)}
                        placeholder="Ej: Documentos Adicionales"
                      />
                    </div>
                    <Button onClick={addSubfolder} className="w-full">
                      Crear Subcarpeta
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-2">
              {folder.subfolders.map((subfolder) => (
                <div key={subfolder.id} className="flex items-center justify-between bg-muted p-2 rounded">
                  <span className="text-sm">{subfolder.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingSubfolder({ id: subfolder.id, name: subfolder.name })}
                    className="h-6 w-6 p-0"
                  >
                    <Edit2 className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Configuración expandible */}
          {isConfigExpanded && (
            <div className="bg-muted p-3 rounded-lg space-y-3">
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <Label className="text-xs font-medium">Documentos Mínimos</Label>
                  <Input
                    type="number"
                    min="0"
                    value={config.minDocs}
                    onChange={(e) =>
                      onConfigChange({
                        ...config,
                        minDocs: Number.parseInt(e.target.value) || 0,
                      })
                    }
                    className="h-8 mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs font-medium">Fecha Límite (Opcional)</Label>
                  <Input
                    type="date"
                    value={config.dueDate ? config.dueDate.toISOString().split("T")[0] : ""}
                    onChange={(e) =>
                      onConfigChange({
                        ...config,
                        dueDate: e.target.value ? new Date(e.target.value) : undefined,
                      })
                    }
                    className="h-8 mt-1"
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                {config.dueDate
                  ? `Alerta si no se completan ${config.minDocs} documentos antes del ${config.dueDate.toLocaleDateString()}`
                  : `Alerta si no se alcanzan ${config.minDocs} documentos mínimos`}
              </p>
            </div>
          )}

          {!isConfigExpanded && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Mínimo: {config.minDocs} documentos</span>
              {config.dueDate && (
                <div className="flex items-center text-muted-foreground">
                  <Calendar className="w-3 h-3 mr-1" />
                  {config.dueDate.toLocaleDateString()}
                </div>
              )}
            </div>
          )}
        </CardContent>
      )}

      {/* Dialog para editar subcarpeta */}
      <Dialog open={!!editingSubfolder} onOpenChange={() => setEditingSubfolder(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Subcarpeta</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="editSubfolderName">Nombre de la Subcarpeta</Label>
              <Input
                id="editSubfolderName"
                value={editingSubfolder?.name || ""}
                onChange={(e) =>
                  setEditingSubfolder(editingSubfolder ? { ...editingSubfolder, name: e.target.value } : null)
                }
              />
            </div>
            <div className="flex space-x-2">
              <Button onClick={saveSubfolderEdit} className="flex-1">
                Guardar
              </Button>
              <Button variant="secundario" onClick={() => setEditingSubfolder(null)} className="flex-1">
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
