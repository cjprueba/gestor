import { z } from "zod";

export const advanceStageSchema = z.object({
  stepOne: z.object({
    tipo_iniciativa_id: z.number().optional(),
    tipo_obra_id: z.number().optional(),
    region_id: z.number().optional(),
    provincia_id: z.number().optional(),
    comuna_id: z.number().optional(),
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
  }),
  stepTwo: z.object({
    carpetas: z.array(z.any()).optional(),
  }),
});

export type AdvanceStageFormData = z.infer<typeof advanceStageSchema>;
