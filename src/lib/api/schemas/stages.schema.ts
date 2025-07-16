import { z } from 'zod';

// Esquema para crear una etapa
export const createStageSchema = z.object({
  nombre: z
    .string()
    .min(1, 'El nombre es requerido')
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  
  descripcion: z
    .string()
    .max(500, 'La descripción no puede exceder 500 caracteres')
    .optional(),
  
  orden: z
    .number()
    .min(1, 'El orden debe ser mayor a 0')
    .max(999, 'El orden no puede exceder 999'),
  
  color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, 'El color debe ser un código hexadecimal válido (ej: #3B82F6)')
    .optional(),
  
  activo: z
    .boolean(),
});

// Esquema para actualizar una etapa
export const updateStageSchema = createStageSchema.partial();

// Tipos derivados del esquema
export type CreateStageFormData = z.infer<typeof createStageSchema>;
export type UpdateStageFormData = z.infer<typeof updateStageSchema>;

// Valores por defecto para el formulario
export const defaultStageValues: CreateStageFormData = {
  nombre: '',
  descripcion: '',
  orden: 1,
  color: '#3B82F6',
  activo: true,
}; 