"use client"

import { useState } from "react"
import { Button } from "@/shared/components/design-system/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Card, CardContent } from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import { Folder, FolderPlus, Edit2, Trash2, GripVertical, ChevronDown, ChevronRight, Plus } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/shared/components/ui/collapsible"
import type { SubfolderTemplate } from "@/shared/types/template-types"

interface TreeBuilderProps {
  folders: SubfolderTemplate[]
  onChange: (folders: SubfolderTemplate[]) => void
  maxDepth?: number
}

interface FolderNodeProps {
  folder: SubfolderTemplate
  onUpdate: (folder: SubfolderTemplate) => void
  onDelete: () => void
  onAddChild: (parentId: string) => void
  depth: number
  maxDepth: number
}

function FolderNode({ folder, onUpdate, onDelete, onAddChild, depth, maxDepth }: FolderNodeProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isExpanded, setIsExpanded] = useState(true)
  const [editName, setEditName] = useState(folder.name)
  const [editMinDocs, setEditMinDocs] = useState(folder.minDocuments)
  const [editDaysLimit, setEditDaysLimit] = useState(folder.daysLimit || "")

  const handleSave = () => {
    onUpdate({
      ...folder,
      name: editName,
      minDocuments: editMinDocs,
      daysLimit: editDaysLimit ? Number(editDaysLimit) : undefined,
    })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditName(folder.name)
    setEditMinDocs(folder.minDocuments)
    setEditDaysLimit(folder.daysLimit?.toString() || "")
    setIsEditing(false)
  }

  const updateSubfolder = (index: number, updatedSubfolder: SubfolderTemplate) => {
    const newSubfolders = [...(folder.subfolders || [])]
    newSubfolders[index] = updatedSubfolder
    onUpdate({ ...folder, subfolders: newSubfolders })
  }

  const deleteSubfolder = (index: number) => {
    const newSubfolders = [...(folder.subfolders || [])]
    newSubfolders.splice(index, 1)
    onUpdate({ ...folder, subfolders: newSubfolders })
  }

  const addSubfolder = () => {
    const newSubfolder: SubfolderTemplate = {
      id: `subfolder-${Date.now()}-${Math.random()}`,
      name: "Nueva Subcarpeta",
      minDocuments: 1,
      subfolders: [],
    }
    const newSubfolders = [...(folder.subfolders || []), newSubfolder]
    onUpdate({ ...folder, subfolders: newSubfolders })
  }

  const canAddChildren = depth < maxDepth

  return (
    <div className="space-y-2">
      <Card className="border-l-4 border-l-blue-500">
        <CardContent className="p-4">
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

              <Folder className="w-5 h-5 text-blue-600" />

              {isEditing ? (
                <div className="flex-1 space-y-2">
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="h-8"
                    placeholder="Nombre de la carpeta"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs">Docs mín.</Label>
                      <Input
                        type="number"
                        min="0"
                        value={editMinDocs}
                        onChange={(e) => setEditMinDocs(Number(e.target.value) || 0)}
                        className="h-8"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Días límite</Label>
                      <Input
                        type="number"
                        min="1"
                        value={editDaysLimit}
                        onChange={(e) => setEditDaysLimit(e.target.value)}
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
                      {folder.minDocuments} docs
                    </Badge>
                    {folder.daysLimit && (
                      <Badge variant="outline" className="text-xs">
                        {folder.daysLimit} días
                      </Badge>
                    )}
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

          {folder.subfolders && folder.subfolders.length > 0 && (
            <Collapsible open={isExpanded}>
              <CollapsibleContent className="mt-4 ml-6 space-y-2">
                {folder.subfolders.map((subfolder, index) => (
                  <FolderNode
                    key={subfolder.id}
                    folder={subfolder}
                    onUpdate={(updated) => updateSubfolder(index, updated)}
                    onDelete={() => deleteSubfolder(index)}
                    onAddChild={onAddChild}
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

export default function TemplateTreeBuilder({ folders, onChange, maxDepth = 3 }: TreeBuilderProps) {
  const addRootFolder = () => {
    const newFolder: SubfolderTemplate = {
      id: `folder-${Date.now()}-${Math.random()}`,
      name: "Nueva Carpeta",
      minDocuments: 3,
      subfolders: [],
    }
    onChange([...folders, newFolder])
  }

  const updateFolder = (index: number, updatedFolder: SubfolderTemplate) => {
    const newFolders = [...folders]
    newFolders[index] = updatedFolder
    onChange(newFolders)
  }

  const deleteFolder = (index: number) => {
    const newFolders = [...folders]
    newFolders.splice(index, 1)
    onChange(newFolders)
  }

  if (folders.length === 0) {
    return (
      <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
        <Folder className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Sin estructura de carpetas</h3>
        <p className="text-gray-500 mb-4">Comienza agregando tu primera carpeta raíz</p>
        <Button onClick={addRootFolder}>
          <Plus className="w-4 h-4 mr-2" />
          Agregar Carpeta Raíz
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4 p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Estructura de carpetas</h3>
        <Button variant="primario" onClick={addRootFolder}>
          <Plus className="w-4 h-4 mr-2" />
          Agregar Carpeta
        </Button>
      </div>

      <div className="space-y-3">
        {folders.map((folder, index) => (
          <FolderNode
            key={folder.id}
            folder={folder}
            onUpdate={(updated) => updateFolder(index, updated)}
            onDelete={() => deleteFolder(index)}
            onAddChild={() => { }}
            depth={0}
            maxDepth={maxDepth}
          />
        ))}
      </div>

      <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
        <p>
          <strong>Tip:</strong> Puedes anidar carpetas hasta {maxDepth} niveles de profundidad.
        </p>
        <p>Usa el ícono de arrastrar para reordenar las carpetas.</p>
      </div>
    </div>
  )
}
