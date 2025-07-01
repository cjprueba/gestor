import { useState } from "react"
import { Button } from "@/shared/components/design-system/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Textarea } from "@/shared/components/ui/textarea"
import { Switch } from "@/shared/components/ui/switch"
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import { Separator } from "@/shared/components/ui/separator"
import {
  Trash2,
  GripVertical,
  Type,
  Hash,
  Calendar,
  Mail,
  Phone,
  CheckSquare,
  List,
  AlignLeft,
  Save,
  X,
} from "lucide-react"
import type { StageForm, FormField } from "@/shared/types/stage-types"

interface StageFormBuilderProps {
  form: StageForm
  onSave: (form: StageForm) => void
  onCancel: () => void
}

const FIELD_TYPES = [
  { value: "text", label: "Texto", icon: Type },
  { value: "textarea", label: "Área de Texto", icon: AlignLeft },
  { value: "number", label: "Número", icon: Hash },
  { value: "date", label: "Fecha", icon: Calendar },
  { value: "email", label: "Email", icon: Mail },
  { value: "tel", label: "Teléfono", icon: Phone },
  { value: "select", label: "Lista Desplegable", icon: List },
  { value: "checkbox", label: "Casilla de Verificación", icon: CheckSquare },
]

export default function StageFormBuilder({ form, onSave, onCancel }: StageFormBuilderProps) {
  const [editingForm, setEditingForm] = useState<StageForm>(form)
  // const [draggedField, setDraggedField] = useState<number | null>(null)

  // Agregar nuevo campo
  const addField = (type: FormField["type"]) => {
    const newField: FormField = {
      id: `field-${Date.now()}`,
      name: `campo_${editingForm.fields.length + 1}`,
      label: `Campo ${editingForm.fields.length + 1}`,
      type,
      required: false,
      placeholder: "",
      options: type === "select" ? ["Opción 1", "Opción 2"] : undefined,
    }

    setEditingForm({
      ...editingForm,
      fields: [...editingForm.fields, newField],
      lastModifiedAt: new Date(),
    })
  }

  // Actualizar campo
  const updateField = (fieldId: string, updates: Partial<FormField>) => {
    setEditingForm({
      ...editingForm,
      fields: editingForm.fields.map((field) => (field.id === fieldId ? { ...field, ...updates } : field)),
      lastModifiedAt: new Date(),
    })
  }

  // Eliminar campo
  const removeField = (fieldId: string) => {
    setEditingForm({
      ...editingForm,
      fields: editingForm.fields.filter((field) => field.id !== fieldId),
      lastModifiedAt: new Date(),
    })
  }

  // Reordenar campos
  // const moveField = (fromIndex: number, toIndex: number) => {
  //   const newFields = [...editingForm.fields]
  //   const [movedField] = newFields.splice(fromIndex, 1)
  //   newFields.splice(toIndex, 0, movedField)

  //   setEditingForm({
  //     ...editingForm,
  //     fields: newFields,
  //     lastModifiedAt: new Date(),
  //   })
  // }

  const handleSave = () => {
    onSave({
      ...editingForm,
      version: editingForm.version + 1,
    })
  }

  return (
    <div className="space-y-6 max-h-[80vh] overflow-y-auto">
      {/* Información del formulario */}
      {/* <div className="space-y-4 p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="space-y-2">
          <Label htmlFor="edit-name">Nombre de la plantilla</Label>
          <div className="flex items-center space-x-2">
            {isEditingStage ? (
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="max-w-3xs"
              />
            ) : (
              <span>{formData.name}</span>
            )}
            <Button variant="ghost" size="sm" onClick={() => setIsEditingStage(true)}>
              <Edit className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div> */}

      <Separator />

      {/* Tipos de campo disponibles */}
      <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
        <Label className="text-base font-semibold text-gray-800">Agregar campos</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
          {FIELD_TYPES.map((fieldType) => {
            const Icon = fieldType.icon
            return (
              <Button
                key={fieldType.value}
                variant="secundario"
                size="default"
                onClick={() => addField(fieldType.value as FormField["type"])}
                className="h-12 justify-start text-left bg-white border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <Icon className="w-5 h-5 mr-3 text-primary-500 flex-shrink-0" />
                <span className="text-sm font-medium text-gray-700">{fieldType.label}</span>
              </Button>
            )
          })}
        </div>
      </div>

      <Separator />

      {/* Campos del formulario */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <Label className="text-base font-semibold text-gray-800">Campos del formulario ({editingForm.fields.length})</Label>
          {editingForm.fields.length > 0 && (
            <Badge variant="secondary" className="text-xs font-medium bg-blue-100 text-blue-800 border-blue-200">{editingForm.fields.filter((f) => f.required).length} obligatorios</Badge>
          )}
        </div>

        {editingForm.fields.length === 0 ? (
          <Card className="border-dashed border-2 border-gray-300 bg-gray-50/50">
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <Type className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 font-medium mb-1">No hay campos en este formulario</p>
                <p className="text-sm text-gray-500">Agrega campos usando los botones de arriba</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {editingForm.fields.map((field) => {
              const FieldIcon = FIELD_TYPES.find((t) => t.value === field.type)?.icon || Type

              return (
                <Card key={field.id} className="border-l-4 border-l-blue-500 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
                  <CardHeader className="pb-3 bg-gray-50/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <GripVertical className="w-4 h-4 text-gray-400 cursor-move hover:text-gray-600" />
                        <FieldIcon className="w-5 h-5 text-blue-600" />
                        <span className="font-semibold text-gray-800">{field.label}</span>
                        {field.required && (
                          <Badge variant="destructive" className="text-xs font-medium">
                            Obligatorio
                          </Badge>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeField(field.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4 p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Etiqueta</Label>
                        <Input
                          value={field.label}
                          onChange={(e) => updateField(field.id, { label: e.target.value })}
                          className="h-9 border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Nombre del Campo</Label>
                        <Input
                          value={field.name}
                          onChange={(e) => updateField(field.id, { name: e.target.value })}
                          className="h-9 border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Placeholder</Label>
                      <Input
                        value={field.placeholder || ""}
                        onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                        placeholder="Texto de ayuda para el usuario..."
                        className="h-9 border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                      />
                    </div>

                    {field.type === "select" && (
                      <div className="space-y-1">
                        <Label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Opciones (una por línea)</Label>
                        <Textarea
                          value={field.options?.join("\n") || ""}
                          onChange={(e) =>
                            updateField(field.id, {
                              options: e.target.value.split("\n").filter((o) => o.trim()),
                            })
                          }
                          placeholder="Opción 1&#10;Opción 2&#10;Opción 3"
                          className="h-20 border-gray-200 focus:border-blue-400 focus:ring-blue-400 resize-none"
                        />
                      </div>
                    )}

                    <div className="flex items-center space-x-4 pt-2">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id={`required-${field.id}`}
                          checked={field.required}
                          onCheckedChange={(checked) => updateField(field.id, { required: checked })}
                        />
                        <Label htmlFor={`required-${field.id}`} className="text-sm font-medium text-gray-700">
                          Campo obligatorio
                        </Label>
                      </div>
                    </div>

                    {field.description && (
                      <div className="space-y-1">
                        <Label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Descripción</Label>
                        <Input
                          value={field.description}
                          onChange={(e) => updateField(field.id, { description: e.target.value })}
                          placeholder="Descripción adicional del campo..."
                          className="h-9 border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      {/* Acciones */}
      <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200 bg-white p-6 rounded-lg">
        <Button variant="secundario" onClick={onCancel} className="h-10 px-6">
          <X className="w-4 h-4 mr-2" />
          Cancelar
        </Button>
        <Button onClick={handleSave} className="h-10 px-6 bg-primary-500 hover:bg-primary-600 text-white">
          <Save className="w-4 h-4 mr-2" />
          Guardar formulario
        </Button>
      </div>
    </div>
  )
}
