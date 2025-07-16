"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Checkbox } from "@/shared/components/ui/checkbox"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Badge } from "@/shared/components/ui/badge"
import { Folder, Settings2 } from "lucide-react"

interface FolderTemplate {
  id: string
  name: string
  minDocuments: number
  subfolders: { id: string; name: string; minDocuments: number }[]
}

interface FolderConfig {
  minDocs: number
  daysLimit?: number
}

interface FolderSelectorProps {
  templates: FolderTemplate[]
  selectedFolders: string[]
  folderConfigs: Record<string, FolderConfig>
  onFolderToggle: (folderId: string) => void
  onConfigChange: (folderId: string, config: FolderConfig) => void
}

export default function FolderSelector({
  templates,
  selectedFolders,
  folderConfigs,
  onFolderToggle,
  onConfigChange,
}: FolderSelectorProps) {
  const [expandedConfigs, setExpandedConfigs] = useState<string[]>([])

  const toggleConfig = (folderId: string) => {
    setExpandedConfigs((prev) => (prev.includes(folderId) ? prev.filter((id) => id !== folderId) : [...prev, folderId]))
  }

  return (
    <div className="space-y-3">
      {templates.map((folder) => {
        const isSelected = selectedFolders.includes(folder.id)
        const config = folderConfigs[folder.id] || { minDocs: folder.minDocuments }
        const isConfigExpanded = expandedConfigs.includes(folder.id)

        return (
          <Card key={folder.id} className={`transition-all ${isSelected ? "ring-2 ring-primary" : ""}`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Checkbox id={folder.id} checked={isSelected} onCheckedChange={() => onFolderToggle(folder.id)} />
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
                    <button onClick={() => toggleConfig(folder.id)} className="p-1 hover:bg-muted rounded">
                      <Settings2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </CardHeader>

            {isSelected && (
              <CardContent className="pt-0">
                <div className="text-sm text-muted-foreground mb-3">
                  <strong>Incluye:</strong> {folder.subfolders.map((sub) => sub.name).join(", ")}
                </div>

                {isConfigExpanded && (
                  <div className="bg-muted p-3 rounded-lg space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs font-medium">Documentos Mínimos</Label>
                        <Input
                          type="number"
                          min="0"
                          value={config.minDocs}
                          onChange={(e) =>
                            onConfigChange(folder.id, {
                              ...config,
                              minDocs: Number.parseInt(e.target.value) || 0,
                            })
                          }
                          className="h-8 mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-xs font-medium">Días Límite</Label>
                        <Input
                          type="number"
                          min="1"
                          placeholder="30"
                          value={config.daysLimit || ""}
                          onChange={(e) =>
                            onConfigChange(folder.id, {
                              ...config,
                              daysLimit: e.target.value ? Number.parseInt(e.target.value) : undefined,
                            })
                          }
                          className="h-8 mt-1"
                        />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {config.daysLimit
                        ? `Alerta si no se completan ${config.minDocs} documentos en ${config.daysLimit} días`
                        : `Alerta si no se alcanzan ${config.minDocs} documentos mínimos`}
                    </p>
                  </div>
                )}

                {!isConfigExpanded && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Mínimo: {config.minDocs} documentos</span>
                    {config.daysLimit && <span className="text-muted-foreground">Límite: {config.daysLimit} días</span>}
                  </div>
                )}
              </CardContent>
            )}
          </Card>
        )
      })}
    </div>
  )
}
