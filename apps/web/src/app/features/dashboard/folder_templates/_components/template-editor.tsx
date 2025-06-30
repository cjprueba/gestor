"use client"

import { useState } from "react"
import { Button } from "@/shared/components/design-system/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Textarea } from "@/shared/components/ui/textarea"
import { Checkbox } from "@/shared/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import { Separator } from "@/shared/components/ui/separator"
import { Plus, Trash2, Folder } from "lucide-react"
import { ETAPAS } from "@/shared/data/project-data"
import type { FolderTemplate, SubfolderTemplate } from "@/shared/types/template-types"

interface TemplateEditorProps {
  template?: FolderTemplate
  onSave: (templateData: Partial<FolderTemplate>) => void
  onCancel: () => void
}

export default function TemplateEditor({ template, onSave, onCancel }: TemplateEditorProps) {
  const [formData, setFormData] = useState({
    name: template?.name || "",
    description: template?.description || "",
    minDocuments: template?.minDocuments || 3,
    daysLimit: template?.daysLimit || undefined,
    etapas: template?.etapas || [],
    subfolders: template?.subfolders || [],
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Limpiar error del campo
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleEtapaToggle = (etapa: string, checked: boolean) => {
    const newEtapas = checked ? [...formData.etapas, etapa] : formData.etapas.filter((e) => e !== etapa)

    updateFormData("etapas", newEtapas)
  }

  const addSubfolder = () => {
    const newSubfolder: SubfolderTemplate = {
      id: `subfolder-${Date.now()}`,
      name: "",
      minDocuments: 1,
    }
    updateFormData("subfolders", [...formData.subfolders, newSubfolder])
  }

  const updateSubfolder = (index: number, field: keyof SubfolderTemplate, value: any) => {
    const newSubfolders = [...formData.subfolders]
    newSubfolders[index] = { ...newSubfolders[index], [field]: value }
    updateFormData("subfolders", newSubfolders)
  }

  const removeSubfolder = (index: number) => {
    const newSubfolders = formData.subfolders.filter((_, i) => i !== index)
    updateFormData("subfolders", newSubfolders)
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es obligatorio"
    }

    if (formData.etapas.length === 0) {
      newErrors.etapas = "Debe seleccionar al menos una etapa"
    }

    if (formData.minDocuments < 0) {
      newErrors.minDocuments = "Los documentos mínimos no pueden ser negativos"
    }

    if (formData.daysLimit && formData.daysLimit < 1) {
      newErrors.daysLimit = "Los días límite deben ser mayor a 0"
    }

    // Validar subcarpetas
    formData.subfolders.forEach((subfolder, index) => {
      if (!subfolder.name.trim()) {
        newErrors[`subfolder-${index}-name`] = "El nombre de la subcarpeta es obligatorio"
      }
      if (subfolder.minDocuments < 0) {
        newErrors[`subfolder-${index}-minDocs`] = "Los documentos mínimos no pueden ser negativos"
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = () => {
    if (!validateForm()) return

    onSave({
      name: formData.name,
      description: formData.description || undefined,
      minDocuments: formData.minDocuments,
      daysLimit: formData.daysLimit,
      etapas: formData.etapas,
      subfolders: formData.subfolders,
    })
  }

  const getEtapaColor = (etapa: string) => {
    const colors = {
      "Cartera de proyectos": "bg-blue-100 text-blue-800 border-blue-300",
      "Proyectos en Licitación": "bg-yellow-100 text-yellow-800 border-yellow-300",
      "Concesiones en Operación": "bg-green-100 text-green-800 border-green-300",
      "Concesiones en Construcción": "bg-orange-100 text-orange-800 border-orange-300",
      "Concesiones en Operación y Construcción": "bg-purple-100 text-purple-800 border-purple-300",
      "Concesiones Finalizadas": "bg-gray-100 text-gray-800 border-gray-300",
    }
    return colors[etapa as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-300"
  }

  return (
    <div className="space-y-6">
      {/* Información básica */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre del Template *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => updateFormData("name", e.target.value)}
            placeholder="Ej: Documentación Legal"
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="minDocuments">Documentos Mínimos *</Label>
          <Input
            id="minDocuments"
            type="number"
            min="0"
            value={formData.minDocuments}
            onChange={(e) => updateFormData("minDocuments", Number.parseInt(e.target.value) || 0)}
            className={errors.minDocuments ? "border-red-500" : ""}
          />
          {errors.minDocuments && <p className="text-sm text-red-500">{errors.minDocuments}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descripción (Opcional)</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => updateFormData("description", e.target.value)}
          placeholder="Describe el propósito de este template..."
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="daysLimit">Días Límite (Opcional)</Label>
        <Input
          id="daysLimit"
          type="number"
          min="1"
          value={formData.daysLimit || ""}
          onChange={(e) => updateFormData("daysLimit", e.target.value ? Number.parseInt(e.target.value) : undefined)}
          placeholder="30"
          className={errors.daysLimit ? "border-red-500" : ""}
        />
        {errors.daysLimit && <p className="text-sm text-red-500">{errors.daysLimit}</p>}
        <p className="text-xs text-muted-foreground">
          Si se establece, se generará una alerta si no se completan los documentos mínimos en este tiempo
        </p>
      </div>

      <Separator />

      {/* Etapas disponibles */}
      <div className="space-y-4">
        <div>
          <Label className="text-base font-medium">Etapas Disponibles *</Label>
          <p className="text-sm text-muted-foreground">Selecciona en qué etapas estará disponible este template</p>
          {errors.etapas && <p className="text-sm text-red-500">{errors.etapas}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {ETAPAS.map((etapa) => (
            <div key={etapa} className="flex items-center space-x-3">
              <Checkbox
                id={etapa}
                checked={formData.etapas.includes(etapa)}
                onCheckedChange={(checked) => handleEtapaToggle(etapa, checked as boolean)}
              />
              <Label htmlFor={etapa} className="text-sm cursor-pointer flex-1">
                <Badge variant="outline" className={`${getEtapaColor(etapa)} text-xs`}>
                  {etapa}
                </Badge>
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Subcarpetas */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-base font-medium">Subcarpetas</Label>
            <p className="text-sm text-muted-foreground">Define las subcarpetas que se crearán automáticamente</p>
          </div>
          <Button variant="secundario" size="sm" onClick={addSubfolder}>
            <Plus className="w-4 h-4 mr-2" />
            Agregar Subcarpeta
          </Button>
        </div>

        {formData.subfolders.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-8">
              <Folder className="w-12 h-12 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">No hay subcarpetas definidas</p>
              <p className="text-xs text-muted-foreground">Haz clic en "Agregar Subcarpeta" para comenzar</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {formData.subfolders.map((subfolder, index) => (
              <Card key={subfolder.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm flex items-center">
                      <Folder className="w-4 h-4 mr-2 text-blue-500" />
                      Subcarpeta {index + 1}
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSubfolder(index)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor={`subfolder-${index}-name`}>Nombre *</Label>
                      <Input
                        id={`subfolder-${index}-name`}
                        value={subfolder.name}
                        onChange={(e) => updateSubfolder(index, "name", e.target.value)}
                        placeholder="Ej: Documentos Principales"
                        className={errors[`subfolder-${index}-name`] ? "border-red-500" : ""}
                      />
                      {errors[`subfolder-${index}-name`] && (
                        <p className="text-sm text-red-500">{errors[`subfolder-${index}-name`]}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`subfolder-${index}-minDocs`}>Documentos Mínimos</Label>
                      <Input
                        id={`subfolder-${index}-minDocs`}
                        type="number"
                        min="0"
                        value={subfolder.minDocuments}
                        onChange={(e) => updateSubfolder(index, "minDocuments", Number.parseInt(e.target.value) || 0)}
                        className={errors[`subfolder-${index}-minDocs`] ? "border-red-500" : ""}
                      />
                      {errors[`subfolder-${index}-minDocs`] && (
                        <p className="text-sm text-red-500">{errors[`subfolder-${index}-minDocs`]}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`subfolder-${index}-daysLimit`}>Días Límite (Opcional)</Label>
                      <Input
                        id={`subfolder-${index}-daysLimit`}
                        type="number"
                        min="1"
                        value={subfolder.daysLimit || ""}
                        onChange={(e) =>
                          updateSubfolder(
                            index,
                            "daysLimit",
                            e.target.value ? Number.parseInt(e.target.value) : undefined,
                          )
                        }
                        placeholder="30"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Botones de acción */}
      <div className="flex justify-end space-x-2 pt-4 border-t">
        <Button variant="secundario" onClick={onCancel}>
          Cancelar
        </Button>
        <Button onClick={handleSave}>{template ? "Actualizar Template" : "Crear Template"}</Button>
      </div>
    </div>
  )
}
