import { useDocumentos } from "@/lib/api/hooks/useDocumentos"
import { DataTable } from "@/shared/components/data-table"
import { Button } from "@/shared/components/design-system/button"
import { Card, CardContent } from "@/shared/components/ui/card"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form"
import { Input } from "@/shared/components/ui/input"
import type { TipoDocumento } from "@/shared/types/document-types"
import type { ColumnDef } from "@tanstack/react-table"
import { Pencil, Plus, Trash2 } from "lucide-react"
import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { DeleteDocumentTypeModal } from "./_components/delete-document-type-modal"
import { EditDocumentTypeModal } from "./_components/edit-document-type-modal"

export default function DocumentsTypesPage() {
  const { useGetTiposDocumento, useCreateTipoDocumento } = useDocumentos()

  // Listado
  const { data: tiposResponse, isLoading, error } = useGetTiposDocumento()
  const tipos = tiposResponse?.tipos_documentos ?? []

  // Crear
  const createMutation = useCreateTipoDocumento()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const createForm = useForm<{ nombre: string; descripcion: string }>({
    defaultValues: { nombre: "", descripcion: "" },
    mode: "onChange",
  })

  // Editar
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editItem, setEditItem] = useState<TipoDocumento | null>(null)

  // Eliminar
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [deleteItem, setDeleteItem] = useState<TipoDocumento | null>(null)

  const openEdit = (item: TipoDocumento) => {
    setEditItem(item)
    setIsEditOpen(true)
  }

  const columns: ColumnDef<TipoDocumento>[] = useMemo(() => [
    {
      accessorKey: "nombre",
      header: "Nombre",
      cell: ({ row }) => <div className="font-medium">{row.original.nombre}</div>,
    },
    {
      accessorKey: "descripcion",
      header: "Descripción",
      cell: ({ row }) => <div className="text-muted-foreground">{row.original.descripcion || "-"}</div>,
    },
    {
      accessorKey: "requiere_nro_pro_exp",
      header: "Req. Nro Pro/Exp",
      cell: ({ row }) => <span>{row.original.requiere_nro_pro_exp ? "Sí" : "No"}</span>,
    },
    {
      accessorKey: "requiere_saf_exp",
      header: "Req. SAF/Exp",
      cell: ({ row }) => <span>{row.original.requiere_saf_exp ? "Sí" : "No"}</span>,
    },
    {
      accessorKey: "requiere_numerar",
      header: "Req. Numerar",
      cell: ({ row }) => <span>{row.original.requiere_numerar ? "Sí" : "No"}</span>,
    },
    {
      accessorKey: "requiere_tramitar",
      header: "Req. Tramitar",
      cell: ({ row }) => <span>{row.original.requiere_tramitar ? "Sí" : "No"}</span>,
    },
    {
      accessorKey: "activo",
      header: "Activo",
      cell: ({ row }) => <span>{row.original.activo ? "Sí" : "No"}</span>,
    },
    {
      id: "actions",
      header: () => <div className="text-center">Acciones</div>,
      cell: ({ row }) => {
        const item = row.original
        return (
          <div className="flex items-center justify-center gap-2">
            <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); openEdit(item) }}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation()
                setDeleteItem(item)
                setIsDeleteOpen(true)
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )
      },
    },
  ], [])

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestión de tipos de documentos</h1>
          <p className="text-muted-foreground mt-2">Administra los tipos de documentos disponibles en el sistema</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo tipo
        </Button>
      </div>

      <Card>
        {/* <CardHeader>
          <CardTitle>Listado de tipos de documentos</CardTitle>
        </CardHeader> */}
        <CardContent>
          {isLoading && (
            <div className="py-8 text-center text-muted-foreground">Cargando tipos de documentos...</div>
          )}
          {error && (
            <div className="py-8 text-center text-destructive">Error al cargar tipos de documentos</div>
          )}
          {!isLoading && !error && (
            <DataTable<TipoDocumento, unknown>
              columns={columns}
              data={tipos}
              pageSize={10}
            />
          )}
        </CardContent>
      </Card>

      {/* Crear */}
      <Dialog open={isCreateOpen} onOpenChange={(open) => {
        setIsCreateOpen(open)
        if (!open) { createForm.reset({ nombre: "", descripcion: "" }) }
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Crear tipo de documento</DialogTitle>
          </DialogHeader>
          <Form {...createForm}>
            <form
              onSubmit={createForm.handleSubmit(async (values) => {
                await createMutation.mutateAsync({
                  nombre: values.nombre.trim(),
                  descripcion: (values.descripcion || "").trim(),
                  requiere_nro_pro_exp: false,
                  requiere_saf_exp: false,
                  requiere_numerar: false,
                  requiere_tramitar: false,
                })
                setIsCreateOpen(false)
                createForm.reset({ nombre: "", descripcion: "" })
              })}
              className="space-y-4"
            >
              <FormField
                control={createForm.control}
                name="nombre"
                rules={{ required: "El nombre es obligatorio" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Oficio" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={createForm.control}
                name="descripcion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción</FormLabel>
                    <FormControl>
                      <Input placeholder="Opcional" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="secundario" onClick={() => setIsCreateOpen(false)}>Cancelar</Button>
                <Button type="submit" disabled={createMutation.isPending || !createForm.watch("nombre")?.trim()}>
                  {createMutation.isPending ? "Creando..." : "Crear"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Editar nombre */}
      <EditDocumentTypeModal open={isEditOpen} onOpenChange={(o) => { setIsEditOpen(o); if (!o) setEditItem(null) }} item={editItem} />

      {/* Eliminar */}
      <DeleteDocumentTypeModal open={isDeleteOpen} onOpenChange={(o) => { setIsDeleteOpen(o); if (!o) setDeleteItem(null) }} item={deleteItem} />
    </div>
  )
}

