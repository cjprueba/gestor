import { Card, CardContent } from '@/shared/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// Esquema de validación para el formulario básico
const basicStageSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido'),
  descripcion: z.string().optional(),
  color: z.string().min(1, 'El color es requerido'),
});

type BasicStageFormData = z.infer<typeof basicStageSchema>;

interface CreateStageFormProps {
  onSuccess?: (data: BasicStageFormData) => void;
  onCancel?: () => void;
  onDataChange?: (data: BasicStageFormData) => void;
}

export function CreateStageForm({ onSuccess, onDataChange }: CreateStageFormProps) {
  const form = useForm<BasicStageFormData>({
    resolver: zodResolver(basicStageSchema),
    defaultValues: {
      nombre: '',
      descripcion: '',
      color: '#3b82f6',
    },
  });

  const onSubmit = (data: BasicStageFormData) => {
    onSuccess?.(data);
  };

  // Actualizar datos en tiempo real
  React.useEffect(() => {
    const subscription = form.watch((data) => {
      if (data.nombre || data.descripcion || data.color) {
        onDataChange?.(data as BasicStageFormData);
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch, onDataChange]);

  return (
    <Card className="w-full">
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <button type="submit" style={{ display: 'none' }} ref={(el) => {
              if (el) {
                // Exponer el botón para que el padre pueda activarlo
                (window as any).submitStageForm = () => el.click();
              }
            }} />
            {/* Campo Nombre */}
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ej: Análisis de Requisitos"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Nombre descriptivo de la etapa
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Campo Descripción */}
            <FormField
              control={form.control}
              name="descripcion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe brevemente qué se hace en esta etapa..."
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Descripción opcional de la etapa
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />



            {/* Campo Color */}
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <Input
                        type="color"
                        className="w-12 h-10 p-1 border rounded"
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                      <Input
                        placeholder="#3B82F6"
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Color para identificar la etapa visualmente
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
} 