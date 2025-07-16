"use client"

import { Button } from "@/shared/components/design-system/button"
import { Badge } from "@/shared/components/ui/badge"
import type { ActividadDocumental, TipoActividad } from "@/shared/types/milestones"
import type { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import {
  ArrowRight,
  Calendar,
  Download,
  Eye,
  FileText,
  FolderOpen,
  User
} from "lucide-react"

const getTipoActividadBadgeVariant = (tipo: TipoActividad) => {
  switch (tipo) {
    case "creacion_documento":
      return "default"
    case "subida_archivo":
      return "outline"
    case "actualizacion_documento":
      return "secondary"
    case "eliminacion_documento":
      return "destructive"
    default:
      return "default"
  }
}

const getTipoActividadLabel = (tipo: TipoActividad) => {
  switch (tipo) {
    case "creacion_documento":
      return "Creación"
    case "subida_archivo":
      return "Subida"
    case "actualizacion_documento":
      return "Actualización"
    case "eliminacion_documento":
      return "Eliminación"
    default:
      return tipo
  }
}

const formatDate = (dateString: string) => {
  return format(new Date(dateString), "dd-MM-yyyy HH:mm", { locale: es })
}

const formatDateOnly = (dateString: string) => {
  return format(new Date(dateString), "dd-MM-yyyy", { locale: es })
}

export const actividadesColumns: ColumnDef<ActividadDocumental>[] = [
  {
    accessorKey: "fechaActividad",
    header: ({ column }) => (
      <div className="text-blue-500 font-medium cursor-pointer" onClick={() => column.toggleSorting()}>
        Fecha
      </div>
    ),
    cell: ({ row }) => {
      const actividad = row.original
      return (
        <div className="flex flex-col gap-1">
          <div className="font-medium">{formatDate(actividad.fechaActividad)}</div>
          <div className="text-xs text-muted-foreground truncate max-w-[150px]" title={actividad.nombre}>
            {actividad.nombre}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "tipoActividad",
    header: ({ column }) => (
      <div className="text-blue-500 font-medium cursor-pointer" onClick={() => column.toggleSorting()}>
        Tipo Actividad
      </div>
    ),
    cell: ({ row }) => {
      const tipo = row.getValue("tipoActividad") as TipoActividad
      return (
        <Badge variant={getTipoActividadBadgeVariant(tipo)}>
          {getTipoActividadLabel(tipo)}
        </Badge>
      )
    },
  },
  {
    accessorKey: "documento",
    header: () => <div className="text-blue-500 font-medium">Documento</div>,
    cell: ({ row }) => {
      const documento = row.original.documento
      return (
        <div className="flex items-center gap-2 max-w-[200px]">
          <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <div className="min-w-0">
            <div className="font-medium truncate" title={documento.nombre}>
              {documento.nombre}
            </div>
            <div className="text-xs text-muted-foreground">
              {documento.tipo} • {documento.tamaño}
            </div>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "proyecto",
    header: () => <div className="text-blue-500 font-medium">Proyecto/Carpeta</div>,
    cell: ({ row }) => {
      const actividad = row.original
      return (
        <div className="flex items-center gap-2 max-w-[250px]">
          <FolderOpen className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <div className="min-w-0">
            <div className="font-medium truncate" title={actividad.proyecto.nombre}>
              {actividad.proyecto.nombre}
            </div>
            <div className="text-xs text-muted-foreground truncate" title={actividad.carpeta.rutaCarpeta}>
              {actividad.carpeta.rutaCarpeta}
            </div>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "usuario",
    header: () => <div className="text-blue-500 font-medium">Usuario</div>,
    cell: ({ row }) => {
      const usuario = row.original.usuario
      return (
        <div className="flex items-center gap-2 max-w-[180px]">
          <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <div className="min-w-0">
            <div className="font-medium truncate" title={usuario.name}>
              {usuario.name}
            </div>
            <div className="text-xs text-muted-foreground truncate" title={usuario.email}>
              {usuario.email}
            </div>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "etapa",
    header: () => <div className="text-blue-500 font-medium">Etapa</div>,
    cell: ({ row }) => {
      const actividad = row.original
      return (
        <div className="max-w-[200px]">
          {actividad.etapaAnterior ? (
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 justify-start">
                <div className="inline-flex items-center px-2 py-1 rounded border border-button-secondary text-primary-500 bg-background text-xs font-medium min-h-[20px]">
                  <span className="whitespace-normal break-words leading-tight">
                    {actividad.etapaAnterior}
                  </span>
                </div>
                <ArrowRight className="w-3 h-3 flex-shrink-0" />
                <div className="inline-flex items-center px-2 py-1 rounded bg-primary-500 text-primary-foreground text-xs font-medium min-h-[20px]">
                  <span className="whitespace-normal break-words  leading-tight">
                    {actividad.etapaActual}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-sm font-medium">{actividad.etapaActual}</div>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "fechaVencimiento",
    header: () => <div className="text-blue-500 font-medium">Fecha Vencimiento</div>,
    cell: ({ row }) => {
      const fechaVencimiento = row.original.fechaVencimiento
      return (
        <div>
          {fechaVencimiento ? (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-orange-500 flex-shrink-0" />
              <span className="text-orange-600 font-medium text-sm">
                {formatDateOnly(fechaVencimiento)}
              </span>
            </div>
          ) : (
            <span className="text-muted-foreground text-sm">Sin vencimiento</span>
          )}
        </div>
      )
    },
  },
  {
    id: "actions",
    header: () => <div className="text-blue-500 font-medium text-center">Acciones</div>,
    cell: () => {
      return (
        <div className="flex justify-center space-x-2" onClick={(e) => e.stopPropagation()}>
          <Button variant="ghost" size="icon" title="Ver detalles">
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" title="Descargar documento">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      )
    },
  },
] 