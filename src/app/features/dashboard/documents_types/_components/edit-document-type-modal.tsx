import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog"
import { Input } from "@/shared/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form"
import { Button } from "@/shared/components/design-system/button"
import { useForm } from "react-hook-form"
import type { TipoDocumento } from "@/shared/types/document-types"
import { useDocumentos } from "@/lib/api/hooks/useDocumentos"

interface EditDocumentTypeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: TipoDocumento | null
}

export function EditDocumentTypeModal({ open, onOpenChange, item }: EditDocumentTypeModalProps) {
  const { useUpdateTipoDocumento } = useDocumentos()
  const updateMutation = useUpdateTipoDocumento()

  const form = useForm<{ nombre: string }>({
    defaultValues: { nombre: item?.nombre ?? "" },
    mode: "onChange",
    values: { nombre: item?.nombre ?? "" },
  })

  return (
    <Dialog open={open} onOpenChange={(o) => {
      onOpenChange(o)
      if (!o) {
        form.reset({ nombre: "" })
      }
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar nombre</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(async (values) => {
              if (!item) return
              const payload = {
                nombre: values.nombre.trim() || item.nombre,
                descripcion: item.descripcion || "",
                requiere_nro_pro_exp: !!item.requiere_nro_pro_exp,
                requiere_saf_exp: !!item.requiere_saf_exp,
                requiere_numerar: !!item.requiere_numerar,
                requiere_tramitar: !!item.requiere_tramitar,
                activo: item.activo ?? true,
              }
              await updateMutation.mutateAsync({ id: item.id, payload })
              onOpenChange(false)
              form.reset({ nombre: "" })
            })}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="nombre"
              rules={{ required: "El nombre es obligatorio" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="secundario" onClick={() => onOpenChange(false)}>Cancelar</Button>
              <Button type="submit" disabled={updateMutation.isPending || !form.watch("nombre")?.trim()}>
                {updateMutation.isPending ? "Guardando..." : "Guardar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}


