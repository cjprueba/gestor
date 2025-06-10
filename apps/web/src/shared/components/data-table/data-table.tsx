import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table"
import { Button } from "@/shared/components/design-system/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select"
import { Input } from "@/shared/components/ui/input"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationEllipsis,
} from "@/shared/components/ui/pagination"
import clsx from "clsx"
import { useState } from "react"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  selected: string[]
  onDeleteSelected: () => void
}

/**
 * DataTable:
 * - columns: definidas mediante getFileColumns(...)
 * - data: arreglo de filas (FileItem en tu caso)
 * - selected: arreglo de IDs seleccionados (control externo)
 * - onDeleteSelected: callback para eliminar todos los seleccionados
 */
export function DataTable<TData, TValue>({
  columns,
  data,
  selected,
  onDeleteSelected,
}: DataTableProps<TData, TValue>) {
  const [pageSize, setPageSize] = useState(5)
  const [globalFilter, setGlobalFilter] = useState("")

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: { pagination: { pageSize: 5 } },
  })

  /**
   * Helper para generar la lista de páginas con elipsis:
   * - Si pageCount ≤ 7, muestra todas.
   * - Si pageCount > 7, muestra 0, ..., (alrededor de current), ..., (última).
   */
  const renderPageLinks = () => {
    const pageCount = table.getPageCount()
    const current = table.getState().pagination.pageIndex
    const pages: (number | "ellipsis")[] = []

    if (pageCount <= 7) {
      for (let i = 0; i < pageCount; i++) {
        pages.push(i)
      }
    } else {
      pages.push(0)
      if (current > 2) pages.push("ellipsis")
      const start = Math.max(1, current - 1)
      const end = Math.min(pageCount - 2, current + 1)
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      if (current < pageCount - 3) pages.push("ellipsis")
      pages.push(pageCount - 1)
    }

    return pages.map((p, idx) => {
      if (p === "ellipsis") {
        return (
          <PaginationItem key={`e${idx}`}>
            <PaginationEllipsis />
          </PaginationItem>
        )
      }
      return (
        <PaginationItem key={p}>
          <PaginationLink
            href="#"
            isActive={current === p}
            onClick={(e) => {
              e.preventDefault()
              table.setPageIndex(p as number)
            }}
            className={clsx(
              "h-5 w-5 rounded-sm p-2",
              current === p
                ? "bg-primary-500 text-white"
                : "text-primary-500 underline"
            )}
          >
            {(p as number) + 1}
          </PaginationLink>
        </PaginationItem>
      )
    })
  }

  return (
    <div>
      {/* --- Barra de búsqueda y botón de eliminación masiva --- */}
      <div className="flex items-center justify-between mb-4">
        <Input
          placeholder="Buscar archivo..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="w-[300px]"
        />
        {selected.length > 0 && (
          <Button variant="primario" onClick={onDeleteSelected}>
            Eliminar archivos seleccionados
          </Button>
        )}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-primary-500 text-white">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-white hover:bg-primary-500">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* --- Paginación completa con select de tamaño y enlaces --- */}
      <div className="flex items-center gap-6 mt-6 justify-end ">
        {/* Selector de cantidad de filas por página */}
        <div className="flex items-center gap-3">
          <span className="text-sm">Mostrar</span>
          <Select
            value={String(pageSize)}
            onValueChange={(value) => {
              setPageSize(Number(value))
              table.setPageSize(Number(value))
            }}
          >
            <SelectTrigger className="w-16 h-4 border-2 border-gray-800">
              <SelectValue className="text-sm " />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 20].map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-end ">
          <span className="text-sm flex items-center">
            Mostrando <b>{table.getState().pagination.pageIndex * pageSize + 1}</b> - {" "}
            <b>
              {Math.min(
                (table.getState().pagination.pageIndex + 1) * pageSize,
                data.length
              )}
            </b>{" "}
            de <b>{data.length}</b>
          </span>

          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationLink
                  href="#"
                  aria-disabled={!table.getCanPreviousPage()}
                  onClick={(e) => {
                    e.preventDefault()
                    table.previousPage()
                  }}
                >
                  <ChevronLeftIcon className="w-4 h-4" />
                </PaginationLink>
              </PaginationItem>

              {renderPageLinks()}

              <PaginationItem>
                <PaginationLink
                  href="#"
                  aria-disabled={!table.getCanNextPage()}
                  onClick={(e) => {
                    e.preventDefault()
                    table.nextPage()
                  }}
                >
                  <ChevronRightIcon className="w-4 h-4" />
                </PaginationLink>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  )
}
