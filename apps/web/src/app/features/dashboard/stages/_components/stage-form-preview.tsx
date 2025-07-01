"use client"

import { Button } from "@/shared/components/design-system/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Textarea } from "@/shared/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Checkbox } from "@/shared/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import type { StageForm } from "@/shared/types/stage-types"

interface StageFormPreviewProps {
  form: StageForm
}

export default function StageFormPreview({ form }: StageFormPreviewProps) {
  const renderField = (field: any) => {
    const baseProps = {
      id: field.id,
      name: field.name,
      placeholder: field.placeholder,
      required: field.required,
    }

    switch (field.type) {
      case "text":
      case "email":
      case "tel":
        return <Input {...baseProps} type={field.type} />

      case "number":
        return <Input {...baseProps} type="number" />

      case "date":
        return <Input {...baseProps} type="date" />

      case "textarea":
        return <Textarea {...baseProps} />

      case "select":
        return (
          <Select>
            <SelectTrigger>
              <SelectValue placeholder={field.placeholder || "Selecciona una opción"} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option: string, index: number) => (
                <SelectItem key={index} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )

      case "checkbox":
        return (
          <div className="flex items-center space-x-2">
            <Checkbox id={field.id} />
            <Label htmlFor={field.id} className="text-sm">
              {field.placeholder || field.label}
            </Label>
          </div>
        )

      default:
        return <Input {...baseProps} />
    }
  }

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center space-x-2 flex-shrink-0">
        <div>
          <h3 className="font-semibold">{form.name}</h3>
          {form.description && <p className="text-sm text-muted-foreground">{form.description}</p>}
        </div>
      </div>

      {/* Formulario */}
      <Card className="flex-1 flex flex-col">
        <CardHeader className="flex-shrink-0">
          <CardTitle className="flex items-center justify-between">
            Vista Previa del formulario
            <Badge variant="secondary">{form.fields.length} campos</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto space-y-4 max-h-[600px]">
          {form.fields.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">Este formulario no tiene campos configurados</div>
          ) : (
            <div className="space-y-4">
              {form.fields.map((field) => (
                <div key={field.id} className="space-y-2">
                  <Label htmlFor={field.id} className="flex items-center space-x-1">
                    <span>{field.label}</span>
                    {field.required && <span className="text-destructive">*</span>}
                  </Label>
                  {renderField(field)}
                  {field.description && <p className="text-xs text-muted-foreground">{field.description}</p>}
                </div>
              ))}

              {form.fields.length > 0 && (
                <div className="pt-4 border-t sticky bottom-0 bg-background">
                  <Button className="w-full" disabled>
                    Crear proyecto (Vista Previa)
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
