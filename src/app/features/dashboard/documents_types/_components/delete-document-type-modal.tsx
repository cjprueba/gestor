import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog"
import { Input } from "@/shared/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form"
import { Button } from "@/shared/components/design-system/button"
import { useForm } from "react-hook-form"
import type { TipoDocumento } from "@/shared/types/document-types"
import { useDocumentos } from "@/lib/api/hooks/useDocumentos"

interface DeleteDocumentTypeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: TipoDocumento | null
}

export function DeleteDocumentTypeModal({ open, onOpenChange, item }: DeleteDocumentTypeModalProps) {
  const { useDeleteTipoDocumento } = useDocumentos()
  const deleteMutation = useDeleteTipoDocumento()

  const form = useForm<{ confirmation: string }>({
    defaultValues: { confirmation: "" },
    mode: "onChange",
  })

  return (
    <Dialog open={open} onOpenChange={(o) => {
      onOpenChange(o)
      if (!o) {
        form.reset({ confirmation: "" })
      }
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Eliminar tipo de documento</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(async () => {
              if (!item) return
              await deleteMutation.mutateAsync(item.id)
              onOpenChange(false)
              form.reset({ confirmation: "" })
            })}
            className="space-y-4"
          >
            <div className="text-sm text-muted-foreground">
              Esta acción no se puede deshacer. Para confirmar, escribe exactamente el nombre del tipo:
              <span className="text-red-500"> {item?.nombre}</span>
            </div>
            <FormField
              control={form.control}
              name="confirmation"
              rules={{
                validate: (value) => value === (item?.nombre ?? "") || "El nombre no coincide",
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del tipo</FormLabel>
                  <FormControl>
                    <Input placeholder={item?.nombre ?? ""} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="secundario" onClick={() => onOpenChange(false)}>Cancelar</Button>
              <Button
                type="submit"
                className="bg-destructive text-white hover:bg-destructive/80"
                disabled={deleteMutation.isPending || !item || form.watch("confirmation") !== item.nombre}
              >
                {deleteMutation.isPending ? "Eliminando..." : "Eliminar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}


