import { z } from "zod";

// Esquemas de validación con Zod
export const createProjectStepOneSchema = z.object({
  nombre: z
    .string()
    .min(1, "El nombre del proyecto es obligatorio")
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres"),
  etapa: z.string().min(1, "Debe seleccionar una etapa"),
});

export const createProjectStepTwoSchema = z.object({
  tipo_iniciativa_id: z.number().min(1, "Tipo de iniciativa es obligatorio"),
  tipo_obra_id: z.number().min(1, "Tipo de obra es obligatorio"),
  region_id: z.number().min(1, "Región es obligatoria"),
  provincia_id: z.number().min(1, "Provincia es obligatoria"),
  comuna_id: z.number().min(1, "Comuna es obligatoria"),
  volumen: z.string().optional(),
  presupuesto_oficial: z.string().optional(),
  valor_referencia: z.string().optional(),
  bip: z.string().optional(),
  fecha_llamado_licitacion: z.string().optional(),
  fecha_recepcion_ofertas_tecnicas: z.string().optional(),
  fecha_apertura_ofertas_economicas: z.string().optional(),
  decreto_adjudicacion: z.string().optional(),
  sociedad_concesionaria: z.string().optional(),
  fecha_inicio_concesion: z.string().optional(),
  plazo_total_concesion: z.string().optional(),
  inspector_fiscal_id: z.number().optional(),
});

export const createProjectStepThreeSchema = z.object({
  carpetas: z
    .array(
      z.object({
        nombre: z.string().min(1, "El nombre de la carpeta es obligatorio"),
        tipo: z.string().optional(),
        id: z.string().optional(),
        subcarpetas: z.array(z.any()).optional(),
      })
    )
    .min(1, "Debe seleccionar al menos una carpeta"),
});

export const createProjectSchema = z.object({
  createProjectStepOne: createProjectStepOneSchema,
  createProjectStepTwo: createProjectStepTwoSchema,
  createProjectStepThree: createProjectStepThreeSchema,
});

export type CreateProjectStepOne = z.infer<typeof createProjectStepOneSchema>;
export type CreateProjectStepTwo = z.infer<typeof createProjectStepTwoSchema>;
export type CreateProjectStepThree = z.infer<
  typeof createProjectStepThreeSchema
>;
export type CreateProjectFormData = z.infer<typeof createProjectSchema>;
