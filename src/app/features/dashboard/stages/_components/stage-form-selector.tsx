import { Badge } from '@/shared/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Label } from '@/shared/components/ui/label';

interface FieldConfig {
  key: string;
  label: string;
  description: string;
  category: 'basic' | 'location' | 'financial' | 'dates' | 'concession';
}

const AVAILABLE_FIELDS: FieldConfig[] = [
  // Campos básicos
  {
    key: 'tipo_iniciativa',
    label: 'Tipo de Iniciativa',
    description: 'Tipo de iniciativa del proyecto',
    category: 'basic'
  },
  {
    key: 'tipo_obra',
    label: 'Tipo de Obra',
    description: 'Clasificación del tipo de obra',
    category: 'basic'
  },
  {
    key: 'volumen',
    label: 'Volumen',
    description: 'Volumen o magnitud del proyecto',
    category: 'basic'
  },
  {
    key: 'presupuesto_oficial',
    label: 'Presupuesto Oficial',
    description: 'Presupuesto oficial del proyecto',
    category: 'financial'
  },
  {
    key: 'bip',
    label: 'BIP',
    description: 'Código BIP del proyecto',
    category: 'financial'
  },
  // Ubicación
  {
    key: 'region',
    label: 'Región',
    description: 'Región donde se ejecuta el proyecto',
    category: 'location'
  },
  {
    key: 'provincia',
    label: 'Provincia',
    description: 'Provincia del proyecto',
    category: 'location'
  },
  {
    key: 'comuna',
    label: 'Comuna',
    description: 'Comuna del proyecto',
    category: 'location'
  },
  // Fechas
  {
    key: 'fecha_llamado_licitacion',
    label: 'Fecha Llamado a Licitación',
    description: 'Fecha del llamado a licitación',
    category: 'dates'
  },
  {
    key: 'fecha_recepcion_ofertas_tecnicas',
    label: 'Fecha Recepción Ofertas Técnicas',
    description: 'Fecha límite para recepción de ofertas técnicas',
    category: 'dates'
  },
  {
    key: 'fecha_apertura_ofertas_economicas',
    label: 'Fecha Apertura Ofertas Económicas',
    description: 'Fecha de apertura de ofertas económicas',
    category: 'dates'
  },
  {
    key: 'fecha_inicio_concesion',
    label: 'Fecha Inicio Concesión',
    description: 'Fecha de inicio de la concesión',
    category: 'dates'
  },
  {
    key: 'plazo_total_concesion',
    label: 'Plazo Total Concesión',
    description: 'Plazo total de la concesión',
    category: 'dates'
  },
  // Concesión
  {
    key: 'decreto_adjudicacion',
    label: 'Decreto Adjudicación',
    description: 'Decreto de adjudicación',
    category: 'concession'
  },
  {
    key: 'sociedad_concesionaria',
    label: 'Sociedad Concesionaria',
    description: 'Sociedad concesionaria responsable',
    category: 'concession'
  },
  {
    key: 'inspector_fiscal_id',
    label: 'Inspector Fiscal',
    description: 'Inspector fiscal asignado',
    category: 'concession'
  }
];

const CATEGORIES = {
  basic: { label: 'Información Básica', color: 'bg-blue-100 text-blue-800' },
  location: { label: 'Ubicación', color: 'bg-green-100 text-green-800' },
  financial: { label: 'Información Financiera', color: 'bg-yellow-100 text-yellow-800' },
  dates: { label: 'Fechas Importantes', color: 'bg-purple-100 text-purple-800' },
  concession: { label: 'Concesión', color: 'bg-orange-100 text-orange-800' }
};

interface StageFormSelectorProps {
  selectedFields: Record<string, boolean>;
  requiredFields: Record<string, boolean>;
  onFieldToggle: (fieldKey: string, isSelected: boolean) => void;
  onRequiredToggle: (fieldKey: string, isRequired: boolean) => void;
}

export function StageFormSelector({
  selectedFields,
  // requiredFields,
  onFieldToggle,
  // onRequiredToggle
}: StageFormSelectorProps) {
  const groupedFields = AVAILABLE_FIELDS.reduce((acc, field) => {
    if (!acc[field.category]) {
      acc[field.category] = [];
    }
    acc[field.category].push(field);
    return acc;
  }, {} as Record<string, FieldConfig[]>);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold">Selecciona los campos para esta etapa</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Marca los campos que quieres incluir y cuáles serán requeridos
        </p>
      </div>

      <div className="space-y-4">
        {Object.entries(groupedFields).map(([category, fields]) => (
          <Card key={category}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Badge variant="secondary" className={CATEGORIES[category as keyof typeof CATEGORIES].color}>
                  {CATEGORIES[category as keyof typeof CATEGORIES].label}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  ({fields.filter(f => selectedFields[f.key]).length} seleccionados)
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {fields.map((field) => (
                <div key={field.key} className="flex items-start space-x-3 p-3 border rounded-lg">
                  <div className="flex items-center space-x-2 flex-1">
                    <Checkbox
                      id={field.key}
                      checked={selectedFields[field.key] || false}
                      onCheckedChange={(checked) =>
                        onFieldToggle(field.key, checked as boolean)
                      }
                    />
                    <div className="flex-1">
                      <Label
                        htmlFor={field.key}
                        className="text-sm font-medium cursor-pointer"
                      >
                        {field.label}
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">
                        {field.description}
                      </p>
                    </div>
                  </div>

                  {/* {selectedFields[field.key] && (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`required-${field.key}`}
                        checked={requiredFields[field.key] || false}
                        onCheckedChange={(checked) =>
                          onRequiredToggle(field.key, checked as boolean)
                        }
                      />
                      <Label
                        htmlFor={`required-${field.key}`}
                        className="text-xs text-muted-foreground cursor-pointer"
                      >
                        Requerido
                      </Label>
                    </div>
                  )} */}
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center p-4 bg-muted rounded-lg">
        <p className="text-sm text-muted-foreground">
          Campos seleccionados: {Object.values(selectedFields).filter(Boolean).length} de {AVAILABLE_FIELDS.length}
        </p>
        {/* <p className="text-xs text-muted-foreground mt-1">
            Campos requeridos: {Object.values(requiredFields).filter(Boolean).length}
          </p> */}
      </div>
    </div>
  );
}
