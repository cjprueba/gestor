import type { StageTypeDetail } from "@/shared/types/stage-types";

export interface StageFormField {
  key: string;
  label: string;
  description: string;
  category: "basic" | "location" | "financial" | "dates" | "concession";
}

export interface StageFormMapping {
  fields: StageFormField[];
  hasFields: boolean;
  fieldCount: number;
}

// Mapeo de campos booleanos usando la misma estructura que StageFormSelector
const FIELD_MAPPINGS: StageFormField[] = [
  // Campos básicos
  {
    key: "tipo_iniciativa",
    label: "Tipo de Iniciativa",
    description: "Tipo de iniciativa del proyecto",
    category: "basic",
  },
  {
    key: "tipo_obra",
    label: "Tipo de Obra",
    description: "Clasificación del tipo de obra",
    category: "basic",
  },
  {
    key: "volumen",
    label: "Volumen",
    description: "Volumen o magnitud del proyecto",
    category: "basic",
  },
  // Información financiera
  {
    key: "presupuesto_oficial",
    label: "Presupuesto Oficial",
    description: "Presupuesto oficial del proyecto",
    category: "financial",
  },
  {
    key: "bip",
    label: "BIP",
    description: "Código BIP del proyecto",
    category: "financial",
  },
  // Ubicación
  {
    key: "region",
    label: "Región",
    description: "Región donde se ejecuta el proyecto",
    category: "location",
  },
  {
    key: "provincia",
    label: "Provincia",
    description: "Provincia del proyecto",
    category: "location",
  },
  {
    key: "comuna",
    label: "Comuna",
    description: "Comuna del proyecto",
    category: "location",
  },
  // Fechas
  {
    key: "fecha_llamado_licitacion",
    label: "Fecha Llamado a Licitación",
    description: "Fecha del llamado a licitación",
    category: "dates",
  },
  {
    key: "fecha_recepcion_ofertas_tecnicas",
    label: "Fecha Recepción Ofertas Técnicas",
    description: "Fecha límite para recepción de ofertas técnicas",
    category: "dates",
  },
  {
    key: "fecha_apertura_ofertas_economicas",
    label: "Fecha Apertura Ofertas Económicas",
    description: "Fecha de apertura de ofertas económicas",
    category: "dates",
  },
  {
    key: "fecha_inicio_concesion",
    label: "Fecha Inicio Concesión",
    description: "Fecha de inicio de la concesión",
    category: "dates",
  },
  {
    key: "plazo_total_concesion",
    label: "Plazo Total Concesión",
    description: "Plazo total de la concesión",
    category: "dates",
  },
  // Concesión
  {
    key: "decreto_adjudicacion",
    label: "Decreto Adjudicación",
    description: "Decreto de adjudicación",
    category: "concession",
  },
  {
    key: "sociedad_concesionaria",
    label: "Sociedad Concesionaria",
    description: "Sociedad concesionaria responsable",
    category: "concession",
  },
  {
    key: "inspector_fiscal_id",
    label: "Inspector Fiscal",
    description: "Inspector fiscal asignado",
    category: "concession",
  },
];

export const CATEGORIES = {
  basic: { label: "Información Básica", color: "bg-blue-100 text-blue-800" },
  location: { label: "Ubicación", color: "bg-green-100 text-green-800" },
  financial: {
    label: "Información Financiera",
    color: "bg-yellow-100 text-yellow-800",
  },
  dates: {
    label: "Fechas Importantes",
    color: "bg-purple-100 text-purple-800",
  },
  concession: { label: "Concesión", color: "bg-orange-100 text-orange-800" },
} as const;

/**
 * Mapea los campos booleanos de una etapa a campos de formulario
 * @param stageType - Los datos del tipo de etapa con campos booleanos
 * @returns Objeto con los campos mapeados y metadatos
 */
export function mapStageTypeToFormFields(
  stageType: StageTypeDetail
): StageFormMapping {
  const activeFields = FIELD_MAPPINGS.filter(
    (mapping) => stageType[mapping.key as keyof StageTypeDetail]
  ).map((mapping) => ({
    key: mapping.key,
    label: mapping.label,
    description: mapping.description,
    category: mapping.category,
  }));

  return {
    fields: activeFields,
    hasFields: activeFields.length > 0,
    fieldCount: activeFields.length,
  };
}

/**
 * Verifica si una etapa tiene campos de formulario habilitados
 * @param stageType - Los datos del tipo de etapa
 * @returns true si la etapa tiene al menos un campo habilitado
 */
export function hasStageFormFields(stageType: StageTypeDetail): boolean {
  return FIELD_MAPPINGS.some(
    (mapping) => stageType[mapping.key as keyof StageTypeDetail]
  );
}

/**
 * Obtiene el número de campos habilitados para una etapa
 * @param stageType - Los datos del tipo de etapa
 * @returns Número de campos habilitados
 */
export function getStageFieldCount(stageType: StageTypeDetail): number {
  return FIELD_MAPPINGS.filter(
    (mapping) => stageType[mapping.key as keyof StageTypeDetail]
  ).length;
}

/**
 * Obtiene una descripción de los campos habilitados para una etapa
 * @param stageType - Los datos del tipo de etapa
 * @returns Array con los nombres de los campos habilitados
 */
export function getEnabledFieldLabels(stageType: StageTypeDetail): string[] {
  return FIELD_MAPPINGS.filter(
    (mapping) => stageType[mapping.key as keyof StageTypeDetail]
  ).map((mapping) => mapping.label);
}

/**
 * Agrupa los campos por categoría
 * @param fields - Array de campos
 * @returns Objeto con campos agrupados por categoría
 */
export function groupFieldsByCategory(fields: StageFormField[]) {
  return fields.reduce(
    (acc, field) => {
      if (!acc[field.category]) {
        acc[field.category] = [];
      }
      acc[field.category].push(field);
      return acc;
    },
    {} as Record<string, StageFormField[]>
  );
}
