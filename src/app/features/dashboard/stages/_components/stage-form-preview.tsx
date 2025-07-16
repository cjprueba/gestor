import { Badge } from "@/shared/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Checkbox } from "@/shared/components/ui/checkbox"
import type { StageForm, StageTypeDetail } from "@/shared/types/stage-types"
import {
  mapStageTypeToFormFields,
  groupFieldsByCategory,
  CATEGORIES
} from "@/shared/utils/stage-form-mapper"

interface StageFormPreviewProps {
  form?: StageForm
  stageTypeDetail?: StageTypeDetail
  isStageTypeForm?: boolean
}

export default function StageFormPreview({ form, stageTypeDetail, isStageTypeForm = false }: StageFormPreviewProps) {
  // Usar el mapper para obtener los campos del tipo de etapa
  const stageTypeFormMapping = isStageTypeForm && stageTypeDetail
    ? mapStageTypeToFormFields(stageTypeDetail)
    : null

  const fields = isStageTypeForm && stageTypeFormMapping
    ? stageTypeFormMapping.fields
    : []

  const formDescription = isStageTypeForm && stageTypeDetail
    ? stageTypeDetail.descripcion
    : form?.description

  const fieldCount = isStageTypeForm && stageTypeFormMapping
    ? stageTypeFormMapping.fieldCount
    : form?.fields.length || 0

  // Agrupar campos por categoría para etapas
  const groupedFields = isStageTypeForm && stageTypeFormMapping
    ? groupFieldsByCategory(stageTypeFormMapping.fields)
    : {}

  return (
    <div className="space-y-4 max-h-[80vh] overflow-y-auto">
      {/* Header info */}
      {formDescription && (
        <div className="flex items-center justify-between sticky top-0 bg-background z-10 pb-2">
          <p className="text-sm text-muted-foreground">{formDescription}</p>
          <Badge variant="secondary">{fieldCount} campos</Badge>
        </div>
      )}

      {isStageTypeForm ? (
        // Vista para formularios de etapa usando el estilo de StageFormSelector
        fields.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>Esta etapa no tiene campos configurados</p>
            <p className="text-xs mt-1">No se han habilitado campos para este tipo de etapa</p>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(groupedFields).map(([category, categoryFields]) => (
              <Card key={category}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Badge variant="secondary" className={CATEGORIES[category as keyof typeof CATEGORIES].color}>
                      {CATEGORIES[category as keyof typeof CATEGORIES].label}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      ({categoryFields.length} campos)
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {categoryFields.map((field) => (
                    <div key={field.key} className="flex items-start space-x-3 p-3 border rounded-lg">
                      <div className="flex items-center space-x-2 flex-1">
                        <Checkbox
                          id={field.key}
                          checked={true}
                        // disabled
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {field.label}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {field.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}

            {/* Resumen */}
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                Campos habilitados: {fieldCount} de {Object.keys(groupedFields).length} categorías
              </p>
            </div>
          </div>
        )
      ) : (
        // Vista para formularios tradicionales (mantener la funcionalidad existente)
        form?.fields.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>Este formulario no tiene campos configurados</p>
            <p className="text-xs mt-1">Agrega campos desde la configuración del formulario</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Campos del formulario */}
            <div className="space-y-4">
              {form?.fields.map((field) => (
                <div key={field.id} className="space-y-2">
                  <p className="text-sm font-medium flex items-center space-x-1">
                    <span>{field.label}</span>
                    {field.required && <span className="text-destructive">*</span>}
                  </p>
                  <div className="p-3 border rounded-lg bg-muted/30">
                    <p className="text-xs text-muted-foreground">
                      Campo de tipo: {field.type}
                    </p>
                    {field.description && (
                      <p className="text-xs text-muted-foreground mt-1">{field.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Botón en la parte inferior */}
            <div className="pt-6 border-t bg-background">
              <div className="w-full p-3 bg-muted rounded-lg text-center">
                <p className="text-sm text-muted-foreground">Crear proyecto (Vista Previa)</p>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  )
}
