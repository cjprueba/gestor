"use client"

import { Button } from "@/shared/components/design-system/button"
import { Badge } from "@/shared/components/ui/badge"
import { Card, CardContent } from "@/shared/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/shared/components/ui/collapsible"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/components/ui/dialog"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Textarea } from "@/shared/components/ui/textarea"
import type { FolderTemplate, SubfolderTemplate } from "@/shared/types/template-types"
import { ChevronDown, ChevronRight, Edit2, Folder, FolderPlus, GripVertical, Plus, Trash2 } from "lucide-react"
import { useState } from "react"

interface TemplateSetStructureEditorProps {
  folders: FolderTemplate[]
  onChange: (folders: FolderTemplate[]) => void
  etapa: string
}

interface FolderTemplateNodeProps {
  folder: FolderTemplate
  onUpdate: (folder: FolderTemplate) => void
  onDelete: () => void
  etapa: string
}

function FolderTemplateNode({ folder, onUpdate, onDelete }: FolderTemplateNodeProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isExpanded, setIsExpanded] = useState(true)
  const [editData, setEditData] = useState({
    name: folder.name,
    description: folder.description || "",
    minDocuments: folder.minDocuments,
    daysLimit: folder.daysLimit?.toString() || "",
  })

  const handleSave = () => {
    onUpdate({
      ...folder,
      name: editData.name,
      description: editData.description || undefined,
      minDocuments: editData.minDocuments,
      daysLimit: editData.daysLimit ? Number(editData.daysLimit) : undefined,
      lastModifiedAt: new Date(),
      lastModifiedBy: "Usuario Actual",
    })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditData({
      name: folder.name,
      description: folder.description || "",
      minDocuments: folder.minDocuments,
      daysLimit: folder.daysLimit?.toString() || "",
    })
    setIsEditing(false)
  }

  const updateSubfolder = (index: number, updatedSubfolder: SubfolderTemplate) => {
    const newSubfolders = [...folder.subfolders]
    newSubfolders[index] = updatedSubfolder
    onUpdate({
      ...folder,
      subfolders: newSubfolders,
      minDocuments: newSubfolders.reduce((sum, sf) => sum + sf.minDocuments, 0),
      lastModifiedAt: new Date(),
      lastModifiedBy: "Usuario Actual",
    })
  }

  const deleteSubfolder = (index: number) => {
    const newSubfolders = [...folder.subfolders]
    newSubfolders.splice(index, 1)
    onUpdate({
      ...folder,
      subfolders: newSubfolders,
      minDocuments: newSubfolders.reduce((sum, sf) => sum + sf.minDocuments, 0),
      lastModifiedAt: new Date(),
      lastModifiedBy: "Usuario Actual",
    })
  }

  const addSubfolder = () => {
    const newSubfolder: SubfolderTemplate = {
      id: `subfolder-${Date.now()}-${Math.random()}`,
      name: "Nueva Subcarpeta",
      minDocuments: 1,
      subfolders: [],
    }
    const newSubfolders = [...folder.subfolders, newSubfolder]
    onUpdate({
      ...folder,
      subfolders: newSubfolders,
      minDocuments: newSubfolders.reduce((sum, sf) => sum + sf.minDocuments, 0),
      lastModifiedAt: new Date(),
      lastModifiedBy: "Usuario Actual",
    })
  }

  return (
    <Card className="border-l-4 border-l-purple-500">
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 flex-1">
              <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />

              {folder.subfolders && folder.subfolders.length > 0 && (
                <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="p-0">
                      {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </Button>
                  </CollapsibleTrigger>
                </Collapsible>
              )}

              {isEditing ? (
                <div className="flex-1 space-y-3">
                  <Input
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    className="h-8"
                    placeholder="Nombre de la carpeta"
                  />
                  <Textarea
                    value={editData.description}
                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                    placeholder="Descripción de la carpeta (opcional)"
                    rows={2}
                    className="text-sm"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs">Docs mín. totales</Label>
                      <Input
                        type="number"
                        min="0"
                        value={editData.minDocuments}
                        onChange={(e) => setEditData({ ...editData, minDocuments: Number(e.target.value) || 0 })}
                        className="h-8"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Días límite</Label>
                      <Input
                        type="number"
                        min="1"
                        value={editData.daysLimit}
                        onChange={(e) => setEditData({ ...editData, daysLimit: e.target.value })}
                        className="h-8"
                        placeholder="Opcional"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{folder.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {folder.subfolders.length} subcarpetas
                    </Badge>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-1">
              {isEditing ? (
                <>
                  <Button variant="ghost" size="sm" onClick={handleSave} className="h-8 px-2">
                    Guardar
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleCancel} className="h-8 px-2">
                    Cancelar
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={addSubfolder}
                    className="p-0"
                    title="Agregar subcarpeta"
                  >
                    <FolderPlus className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)} className="p-0">
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onDelete}
                    className="p-0 text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Subcarpetas */}
          {folder.subfolders && folder.subfolders.length > 0 && (
            <Collapsible open={isExpanded}>
              <CollapsibleContent className="ml-8 space-y-2">
                {folder.subfolders.map((subfolder, index) => (
                  <SubfolderNode
                    key={subfolder.id}
                    subfolder={subfolder}
                    onUpdate={(updated) => updateSubfolder(index, updated)}
                    onDelete={() => deleteSubfolder(index)}
                    depth={1}
                    maxDepth={3}
                  />
                ))}
              </CollapsibleContent>
            </Collapsible>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

interface SubfolderNodeProps {
  subfolder: SubfolderTemplate
  onUpdate: (subfolder: SubfolderTemplate) => void
  onDelete: () => void
  depth: number
  maxDepth: number
}

function SubfolderNode({ subfolder, onUpdate, onDelete, depth, maxDepth }: SubfolderNodeProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isExpanded, setIsExpanded] = useState(true)
  const [editName, setEditName] = useState(subfolder.name)
  const [editMinDocs, setEditMinDocs] = useState(subfolder.minDocuments)
  const [editDaysLimit, setEditDaysLimit] = useState(subfolder.daysLimit?.toString() || "")

  const handleSave = () => {
    onUpdate({
      ...subfolder,
      name: editName,
      minDocuments: editMinDocs,
      daysLimit: editDaysLimit ? Number(editDaysLimit) : undefined,
    })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditName(subfolder.name)
    setEditMinDocs(subfolder.minDocuments)
    setEditDaysLimit(subfolder.daysLimit?.toString() || "")
    setIsEditing(false)
  }

  const updateSubfolder = (index: number, updatedSubfolder: SubfolderTemplate) => {
    const newSubfolders = [...(subfolder.subfolders || [])]
    newSubfolders[index] = updatedSubfolder
    onUpdate({ ...subfolder, subfolders: newSubfolders })
  }

  const deleteSubfolder = (index: number) => {
    const newSubfolders = [...(subfolder.subfolders || [])]
    newSubfolders.splice(index, 1)
    onUpdate({ ...subfolder, subfolders: newSubfolders })
  }

  const addSubfolder = () => {
    const newSubfolder: SubfolderTemplate = {
      id: `subfolder-${Date.now()}-${Math.random()}`,
      name: "Nueva Subcarpeta",
      minDocuments: 1,
      subfolders: [],
    }
    const newSubfolders = [...(subfolder.subfolders || []), newSubfolder]
    onUpdate({ ...subfolder, subfolders: newSubfolders })
  }

  const canAddChildren = depth < maxDepth

  return (
    <div className="space-y-2">
      <Card className="border-l-4 border-l-primary-500">
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 flex-1">
              <GripVertical className="w-3 h-3 text-gray-400 cursor-move" />

              {subfolder.subfolders && subfolder.subfolders.length > 0 && (
                <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="p-0">
                      {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </Button>
                  </CollapsibleTrigger>
                </Collapsible>
              )}

              {isEditing ? (
                <div className="flex-1 space-y-2">
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="h-7 text-sm"
                    placeholder="Nombre de la subcarpeta"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs">Docs mín.</Label>
                      <Input
                        type="number"
                        min="0"
                        value={editMinDocs}
                        onChange={(e) => setEditMinDocs(Number(e.target.value) || 0)}
                        className="h-7 text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Días límite</Label>
                      <Input
                        type="number"
                        min="1"
                        value={editDaysLimit}
                        onChange={(e) => setEditDaysLimit(e.target.value)}
                        className="h-7 text-sm"
                        placeholder="Opcional"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-sm">{subfolder.name}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center ">
              {isEditing ? (
                <div className="flex flex-col pl-4 gap-2">
                  <Button variant="primario" size="sm" onClick={handleSave} className="h-7 px-2 text-xs">
                    Guardar
                  </Button>
                  <Button variant="secundario" size="sm" onClick={handleCancel} className="h-7 px-2 text-xs">
                    Cancelar
                  </Button>
                </div>
              ) : (
                <>
                  {canAddChildren && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={addSubfolder}
                      className="p-0"
                      title="Agregar subcarpeta"
                    >
                      <FolderPlus className="w-4 h-4" />
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)} className="p-0">
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onDelete}
                    className="p-0 text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>
          </div>

          {subfolder.subfolders && subfolder.subfolders.length > 0 && (
            <Collapsible open={isExpanded}>
              <CollapsibleContent className="mt-3 ml-4 space-y-2">
                {subfolder.subfolders.map((nestedSubfolder, index) => (
                  <SubfolderNode
                    key={nestedSubfolder.id}
                    subfolder={nestedSubfolder}
                    onUpdate={(updated) => updateSubfolder(index, updated)}
                    onDelete={() => deleteSubfolder(index)}
                    depth={depth + 1}
                    maxDepth={maxDepth}
                  />
                ))}
              </CollapsibleContent>
            </Collapsible>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default function TemplateSetStructureEditor({ folders, onChange, etapa }: TemplateSetStructureEditorProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newFolderData, setNewFolderData] = useState({
    name: "",
    description: "",
    minDocuments: 3,
    daysLimit: "",
  })

  const addNewFolder = () => {
    if (!newFolderData.name.trim()) return

    const newFolder: FolderTemplate = {
      id: `folder-${Date.now()}`,
      name: newFolderData.name,
      description: newFolderData.description || undefined,
      minDocuments: newFolderData.minDocuments,
      daysLimit: newFolderData.daysLimit ? Number(newFolderData.daysLimit) : undefined,
      subfolders: [],
      etapas: [etapa],
      createdAt: new Date(),
      createdBy: "Usuario Actual",
      lastModifiedAt: new Date(),
      lastModifiedBy: "Usuario Actual",
      isDefault: false,
      isActive: true,
      version: 1,
      tags: ["custom"],
    }

    onChange([...folders, newFolder])
    setNewFolderData({ name: "", description: "", minDocuments: 3, daysLimit: "" })
    setIsCreateDialogOpen(false)
  }

  const updateFolder = (index: number, updatedFolder: FolderTemplate) => {
    const newFolders = [...folders]
    newFolders[index] = updatedFolder
    onChange(newFolders)
  }

  const deleteFolder = (index: number) => {
    const newFolders = [...folders]
    newFolders.splice(index, 1)
    onChange(newFolders)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Estructura de carpetas</h3>
          <p className="text-sm text-muted-foreground">
            Configura las carpetas y subcarpetas de esta plantilla
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-xs">
            {folders.length} carpetas
          </Badge>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Nueva carpeta
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Crear nueva carpeta</DialogTitle>
                <DialogDescription>
                  Agrega una nueva carpeta a esta plantilla
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="folder-name">Nombre de la carpeta *</Label>
                  <Input
                    id="folder-name"
                    value={newFolderData.name}
                    onChange={(e) => setNewFolderData({ ...newFolderData, name: e.target.value })}
                    placeholder="Ej: Documentación Legal"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="folder-description">Descripción (Opcional)</Label>
                  <Textarea
                    id="folder-description"
                    value={newFolderData.description}
                    onChange={(e) => setNewFolderData({ ...newFolderData, description: e.target.value })}
                    placeholder="Describe el propósito de esta carpeta..."
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="folder-min-docs">Documentos mínimos *</Label>
                    <Input
                      id="folder-min-docs"
                      type="number"
                      min="0"
                      value={newFolderData.minDocuments}
                      onChange={(e) => setNewFolderData({ ...newFolderData, minDocuments: Number(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="folder-days-limit">Días límite (Opcional)</Label>
                    <Input
                      id="folder-days-limit"
                      type="number"
                      min="1"
                      value={newFolderData.daysLimit}
                      onChange={(e) => setNewFolderData({ ...newFolderData, daysLimit: e.target.value })}
                      placeholder="30"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="secundario" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={addNewFolder} disabled={!newFolderData.name.trim()}>
                  Crear carpeta
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {folders.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
          <Folder className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No hay carpetas en esta plantilla</p>
          <p className="text-sm">Haz clic en "Nueva carpeta" para comenzar</p>
        </div>
      ) : (
        <div className="space-y-4">
          {folders.map((folder, index) => (
            <FolderTemplateNode
              key={folder.id}
              folder={folder}
              onUpdate={(updated) => updateFolder(index, updated)}
              onDelete={() => deleteFolder(index)}
              etapa={etapa}
            />
          ))}
        </div>
      )}
    </div>
  )
} 