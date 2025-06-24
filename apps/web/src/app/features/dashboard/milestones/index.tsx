import { useState } from "react"
import { Button } from "@/shared/components/design-system/button"
import { Input } from "@/shared/components/ui/input"
import { Badge } from "@/shared/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Search, PlusCircle, Edit, ToggleLeft, FileText, Calendar, User, FolderOpen, Download, Eye } from "lucide-react"
import { HitoModal } from "./_components/hito-modal"
import { HitoDetalleModal } from "./_components/hito-detalle-modal"
import { ConfirmacionModal } from "./_components/confirmacion-modal"
import type { ActividadDocumental, Hito, HitoFiltros, Division, Etapa, HitoEstado, TipoActividad } from "@/shared/types/milestones"

export default function MilestonesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedHito, setSelectedHito] = useState<Hito | null>(null)
  const [hitoModalOpen, setHitoModalOpen] = useState(false)
  const [hitoDetalleModalOpen, setHitoDetalleModalOpen] = useState(false)
  const [confirmacionModalOpen, setConfirmacionModalOpen] = useState(false)
  const [hitoToDisable, setHitoToDisable] = useState<Hito | null>(null)
  const [filtros, setFiltros] = useState<HitoFiltros>({})
  const [vistaActual, setVistaActual] = useState<"actividades" | "hitos">("actividades")

  // Datos de ejemplo basados en el proyecto "Edificio Residencial Ejemplo"
  const [actividadesDocumentales, setActividadesDocumentales] = useState<ActividadDocumental[]>([
    {
      id: "act-1",
      nombre: "Subida",
      descripcion: "Permiso municipal para iniciar la construcción del edificio residencial",
      tipoActividad: "subida_archivo",
      fechaActividad: "2024-01-15T10:30:00Z",
      fechaVencimiento: "2024-12-31T23:59:59Z",
      proyecto: {
        id: "example-project-1",
        nombre: "Edificio Residencial Ejemplo",
        tipo: "Edificio Residencial"
      },
      carpeta: {
        id: "const-permits",
        nombre: "Permisos",
        rutaCarpeta: "Construcción/Permisos"
      },
      documento: {
        id: "doc-1",
        nombre: "Permiso_Construccion_001.pdf",
        tipo: "Permiso",
        tamaño: "2.4 MB",
        extension: "pdf"
      },
      usuario: {
        id: "user-1",
        name: "María García",
        email: "maria.garcia@empresa.com"
      },
      estado: "activo",
      metadatos: {
        ipAddress: "192.168.1.100",
        userAgent: "Mozilla/5.0...",
        dispositivo: "Windows PC"
      },
      createdAt: "2024-01-15T10:30:00Z",
      updatedAt: "2024-01-15T10:30:00Z"
    },
    {
      id: "act-2",
      nombre: "Actualización",
      descripcion: "Planos actualizados con las modificaciones aprobadas por el cliente",
      tipoActividad: "actualizacion_documento",
      fechaActividad: "2024-01-16T14:20:00Z",
      fechaVencimiento: "2024-06-30T23:59:59Z",
      proyecto: {
        id: "example-project-1",
        nombre: "Edificio Residencial Ejemplo",
        tipo: "Edificio Residencial"
      },
      carpeta: {
        id: "arch-plans",
        nombre: "Planos",
        rutaCarpeta: "Arquitectura/Planos"
      },
      documento: {
        id: "doc-2",
        nombre: "Planos_Arquitectonicos_v2.dwg",
        tipo: "Plano",
        tamaño: "15.7 MB",
        extension: "dwg"
      },
      usuario: {
        id: "user-2",
        name: "Carlos López",
        email: "carlos.lopez@empresa.com"
      },
      estado: "activo",
      metadatos: {
        ipAddress: "192.168.1.101",
        userAgent: "Mozilla/5.0...",
        dispositivo: "MacBook Pro"
      },
      createdAt: "2024-01-16T14:20:00Z",
      updatedAt: "2024-01-16T14:20:00Z"
    },
    {
      id: "act-3",
      nombre: "Creación",
      descripcion: "Documento con especificaciones técnicas detalladas para la construcción",
      tipoActividad: "creacion_documento",
      fechaActividad: "2024-01-17T09:15:00Z",
      fechaVencimiento: "2024-07-15T23:59:59Z",
      proyecto: {
        id: "example-project-1",
        nombre: "Edificio Residencial Ejemplo",
        tipo: "Edificio Residencial"
      },
      carpeta: {
        id: "arch-specs",
        nombre: "Especificaciones",
        rutaCarpeta: "Arquitectura/Especificaciones"
      },
      documento: {
        id: "doc-3",
        nombre: "Especificaciones_Tecnicas.docx",
        tipo: "Especificacion",
        tamaño: "1.8 MB",
        extension: "docx"
      },
      usuario: {
        id: "user-3",
        name: "Ana Martín",
        email: "ana.martin@empresa.com"
      },
      estado: "activo",
      createdAt: "2024-01-17T09:15:00Z",
      updatedAt: "2024-01-17T09:15:00Z"
    },
    {
      id: "act-4",
      nombre: "Subida",
      descripcion: "Cotización actualizada de materiales de construcción para el proyecto",
      tipoActividad: "subida_archivo",
      fechaActividad: "2024-01-18T16:45:00Z",
      fechaVencimiento: "2024-03-31T23:59:59Z",
      proyecto: {
        id: "example-project-1",
        nombre: "Edificio Residencial Ejemplo",
        tipo: "Edificio Residencial"
      },
      carpeta: {
        id: "const-materials",
        nombre: "Materiales",
        rutaCarpeta: "Construcción/Materiales"
      },
      documento: {
        id: "doc-4",
        nombre: "Cotizacion_Materiales_Enero.xlsx",
        tipo: "Material",
        tamaño: "892 KB",
        extension: "xlsx"
      },
      usuario: {
        id: "user-4",
        name: "Roberto Silva",
        email: "roberto.silva@empresa.com"
      },
      estado: "activo",
      metadatos: {
        ipAddress: "192.168.1.102",
        userAgent: "Mozilla/5.0...",
        dispositivo: "iPad"
      },
      createdAt: "2024-01-18T16:45:00Z",
      updatedAt: "2024-01-18T16:45:00Z"
    },
    {
      id: "act-5",
      nombre: "Eliminación",
      descripcion: "Eliminación de versión anterior de los planos arquitectónicos",
      tipoActividad: "eliminacion_documento",
      fechaActividad: "2024-01-19T11:30:00Z",
      proyecto: {
        id: "example-project-1",
        nombre: "Edificio Residencial Ejemplo",
        tipo: "Edificio Residencial"
      },
      carpeta: {
        id: "arch-plans",
        nombre: "Planos",
        rutaCarpeta: "Arquitectura/Planos"
      },
      documento: {
        id: "doc-5",
        nombre: "Planos_Arquitectonicos_v1.dwg",
        tipo: "Plano",
        tamaño: "14.2 MB",
        extension: "dwg"
      },
      usuario: {
        id: "user-2",
        name: "Carlos López",
        email: "carlos.lopez@empresa.com"
      },
      estado: "eliminado",
      createdAt: "2024-01-19T11:30:00Z",
      updatedAt: "2024-01-19T11:30:00Z"
    }
  ])

  const [divisiones] = useState<Division[]>([
    { id: "1", nombre: "Construcción" },
    { id: "2", nombre: "Arquitectura" },
    { id: "3", nombre: "Ingeniería" },
  ])

  const [etapas] = useState<Etapa[]>([
    { id: "1", nombre: "Planificación" },
    { id: "2", nombre: "Construcción" },
    { id: "3", nombre: "Finalización" },
  ])

  const [estados] = useState<HitoEstado[]>(["Por Cumplir", "Por Vencer", "Vencido", "Recepcionado", "Aprobado"])

  const [tiposActividad] = useState<TipoActividad[]>(["creacion_documento", "subida_archivo", "actualizacion_documento", "eliminacion_documento"])

  const [hitos, setHitos] = useState<Hito[]>([
    {
      id: "1",
      nombre: "Entrega de Boleta de Garantía",
      descripcion: "Boleta de garantía para el proyecto de concesión",
      fechaVencimiento: "2025-06-30",
      periodo: "mensual",
      estado: "Por Cumplir",
      proyecto: {
        id: "1",
        nombre: "concesión 1",
        tipo: "concesión",
      },
      hitoContractual: "Item 1",
      recepcionado: false,
      aprobado: false,
      documentos: [],
      createdAt: "2024-01-15T10:00:00Z",
      updatedAt: "2024-01-15T10:00:00Z",
      createdBy: {
        id: "1",
        name: "María García",
        email: "maria@empresa.com",
      },
    },
    {
      id: "2",
      nombre: "Informe Mensual de Avance",
      descripcion: "Informe mensual de avance del proyecto",
      fechaVencimiento: "2025-06-30",
      periodo: "mensual",
      estado: "Por Vencer",
      proyecto: {
        id: "2",
        nombre: "Proyecto",
        tipo: "Proyecto",
      },
      hitoContractual: "Item 2",
      recepcionado: false,
      aprobado: false,
      documentos: [],
      createdAt: "2024-01-16T10:00:00Z",
      updatedAt: "2024-01-16T10:00:00Z",
      createdBy: {
        id: "2",
        name: "Carlos López",
        email: "carlos@empresa.com",
      },
    },
    {
      id: "3",
      nombre: "Entrega de Planos As-Built",
      descripcion: "Planos finales de construcción",
      fechaVencimiento: "2025-06-30",
      periodo: "mensual",
      estado: "Vencido",
      proyecto: {
        id: "3",
        nombre: "Contrato",
        tipo: "Contrato",
      },
      hitoContractual: "Item 3",
      recepcionado: true,
      aprobado: false,
      documentos: [],
      createdAt: "2024-01-17T10:00:00Z",
      updatedAt: "2024-01-17T10:00:00Z",
      createdBy: {
        id: "3",
        name: "Ana Martín",
        email: "ana@empresa.com",
      },
    },
    {
      id: "4",
      nombre: "Informe Final de Obra",
      descripcion: "Informe final de la obra ejecutada",
      fechaVencimiento: "2025-06-30",
      periodo: "mensual",
      estado: "Aprobado",
      proyecto: {
        id: "4",
        nombre: "Item 4",
        tipo: "Proyecto",
      },
      hitoContractual: "Item 4",
      recepcionado: true,
      aprobado: true,
      documentos: [],
      createdAt: "2024-01-18T10:00:00Z",
      updatedAt: "2024-01-18T10:00:00Z",
      createdBy: {
        id: "4",
        name: "Roberto Silva",
        email: "roberto@empresa.com",
      },
    },
  ])

  // Filtrar actividades según los filtros seleccionados
  const filteredActividades = actividadesDocumentales.filter((actividad) => {
    const matchesSearch =
      searchTerm === "" ||
      actividad.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      actividad.documento.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      actividad.proyecto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      actividad.usuario.name.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesTipoActividad = !filtros.tipoActividad || actividad.tipoActividad === filtros.tipoActividad
    const matchesProyecto = !filtros.proyecto || actividad.proyecto.id === filtros.proyecto

    return matchesSearch && matchesTipoActividad && matchesProyecto
  })

  // Filtrar hitos según los filtros seleccionados (mantener funcionalidad existente)
  const filteredHitos = hitos.filter((hito) => {
    const matchesSearch =
      searchTerm === "" ||
      hito.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hito.hitoContractual.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hito.proyecto.nombre.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesSearch
  })

  const handleCreateHito = () => {
    setSelectedHito(null)
    setHitoModalOpen(true)
  }

  const handleEditHito = (hito: Hito) => {
    setSelectedHito(hito)
    setHitoModalOpen(true)
  }

  const handleViewHito = (hito: Hito) => {
    setSelectedHito(hito)
    setHitoDetalleModalOpen(true)
  }

  const handleDisableHito = (hito: Hito) => {
    setHitoToDisable(hito)
    setConfirmacionModalOpen(true)
  }

  const confirmDisableHito = () => {
    if (hitoToDisable) {
      // Aquí iría la lógica para deshabilitar el hito
      setConfirmacionModalOpen(false)
      setHitoToDisable(null)
    }
  }

  const handleSaveHito = (hitoData: Partial<Hito>) => {
    if (selectedHito) {
      // Editar hito existente
      setHitos(
        hitos.map((h) =>
          h.id === selectedHito.id
            ? {
              ...h,
              ...hitoData,
              updatedAt: new Date().toISOString(),
            }
            : h,
        ),
      )
    } else {
      // Crear nuevo hito
      const newHito: Hito = {
        id: Date.now().toString(),
        nombre: hitoData.nombre!,
        descripcion: hitoData.descripcion,
        fechaVencimiento: hitoData.fechaVencimiento!,
        periodo: hitoData.periodo!,
        estado: "Por Cumplir",
        proyecto: hitoData.proyecto!,
        hitoContractual: hitoData.hitoContractual!,
        recepcionado: false,
        aprobado: false,
        documentos: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: hitoData.createdBy!,
      }
      setHitos([...hitos, newHito])
    }
    setHitoModalOpen(false)
  }

  const getEstadoBadgeVariant = (estado: string) => {
    switch (estado) {
      case "Por Cumplir":
        return "default"
      case "Por Vencer":
        return "secondary"
      case "Vencido":
        return "destructive"
      case "Recepcionado":
        return "outline"
      case "Aprobado":
        return "default"
      default:
        return "default"
    }
  }

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

  return (
    <>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        {/* Header de la página */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Registro de Actividad Documental</h1>
            <p className="text-muted-foreground">Sistema de logs y seguimiento de actividades documentales por proyecto</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Select value={vistaActual} onValueChange={(value: "actividades" | "hitos") => setVistaActual(value)}>
              <SelectTrigger className="w-full sm:w-[200px] text-white">
                <SelectValue>
                  {vistaActual === "actividades" ? "Registro de Actividades" : "Registro de Hitos"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="actividades">Registro de Actividades</SelectItem>
                <SelectItem value="hitos">Registro de Hitos</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleCreateHito} variant="primario" className="w-full sm:w-auto">
              <PlusCircle className="mr-2 h-5 w-5" />
              <span className="hidden sm:inline">
                {vistaActual === "actividades" ? "Nueva Actividad" : "Nuevo Registro"}
              </span>
              <span className="sm:hidden">
                {vistaActual === "actividades" ? "Nueva" : "Nuevo"}
              </span>
            </Button>
          </div>
        </div>

        {/* Filtros */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Filtros de Búsqueda</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2">
              {vistaActual === "actividades" && (
                <>
                  <Select value={filtros.tipoActividad} onValueChange={(value) => setFiltros({ ...filtros, tipoActividad: value })}>
                    <SelectTrigger className="text-white">
                      <SelectValue placeholder="Tipo de Actividad" />
                    </SelectTrigger>
                    <SelectContent>
                      {tiposActividad.map((tipo) => (
                        <SelectItem key={tipo} value={tipo}>
                          {getTipoActividadLabel(tipo)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={filtros.proyecto} onValueChange={(value) => setFiltros({ ...filtros, proyecto: value })}>
                    <SelectTrigger className="text-white">
                      <SelectValue placeholder="Proyecto" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="example-project-1">Edificio Residencial Ejemplo</SelectItem>
                    </SelectContent>
                  </Select>
                </>
              )}

              {vistaActual === "hitos" && (
                <>
                  <Select value={filtros.division} onValueChange={(value) => setFiltros({ ...filtros, division: value })}>
                    <SelectTrigger className="text-white">
                      <SelectValue placeholder="División" />
                    </SelectTrigger>
                    <SelectContent>
                      {divisiones.map((division) => (
                        <SelectItem key={division.id} value={division.id}>
                          {division.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={filtros.etapa} onValueChange={(value) => setFiltros({ ...filtros, etapa: value })}>
                    <SelectTrigger className="text-white">
                      <SelectValue placeholder="Etapa" />
                    </SelectTrigger>
                    <SelectContent>
                      {etapas.map((etapa) => (
                        <SelectItem key={etapa.id} value={etapa.id}>
                          {etapa.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={filtros.estado} onValueChange={(value) => setFiltros({ ...filtros, estado: value })}>
                    <SelectTrigger className="text-white">
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                      {estados.map((estado) => (
                        <SelectItem key={estado} value={estado}>
                          {estado}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </>
              )}

              <Select
                value={filtros.periodoAnio}
                onValueChange={(value) => setFiltros({ ...filtros, periodoAnio: value })}
              >
                <SelectTrigger className="text-white">
                  <SelectValue placeholder="Periodo Año" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2025">2025</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filtros.periodoMes}
                onValueChange={(value) => setFiltros({ ...filtros, periodoMes: value })}
              >
                <SelectTrigger className="text-white">
                  <SelectValue placeholder="Periodo Mes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Enero</SelectItem>
                  <SelectItem value="2">Febrero</SelectItem>
                  <SelectItem value="3">Marzo</SelectItem>
                  <SelectItem value="4">Abril</SelectItem>
                  <SelectItem value="5">Mayo</SelectItem>
                  <SelectItem value="6">Junio</SelectItem>
                  <SelectItem value="7">Julio</SelectItem>
                  <SelectItem value="8">Agosto</SelectItem>
                  <SelectItem value="9">Septiembre</SelectItem>
                  <SelectItem value="10">Octubre</SelectItem>
                  <SelectItem value="11">Noviembre</SelectItem>
                  <SelectItem value="12">Diciembre</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={vistaActual === "actividades" ? "Buscar actividades, documentos, usuarios..." : "Selecciona o Busca contrato"}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Button variant="iconoSecundario" className="w-full sm:w-auto">
                <Search className="h-4 w-4 mr-2 sm:mr-0" />
                <span className="sm:hidden">Buscar</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabla de actividades documentales */}
        {vistaActual === "actividades" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex flex-col sm:flex-row sm:items-center gap-2">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1 max-w-sm flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    <span>Registro de Actividades Documentales</span>
                  </div>
                </div>
                <Badge variant="outline" className="w-fit sm:ml-auto">
                  {filteredActividades.length} registros
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {/* Vista móvil - Cards */}
              <div className="block lg:hidden">
                <div className="space-y-3 p-4">
                  {filteredActividades.map((actividad) => (
                    <Card key={actividad.id} className="cursor-pointer hover:bg-muted/50">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          {/* Header de la card */}
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <div className="font-medium text-sm">{formatDate(actividad.fechaActividad)}</div>
                                <div className="text-xs text-muted-foreground">{actividad.nombre}</div>
                              </div>
                            </div>
                            <Badge variant={getTipoActividadBadgeVariant(actividad.tipoActividad)} className="text-xs">
                              {getTipoActividadLabel(actividad.tipoActividad)}
                            </Badge>
                          </div>

                          {/* Documento */}
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm truncate">{actividad.documento.nombre}</div>
                              <div className="text-xs text-muted-foreground">
                                {actividad.documento.tipo} • {actividad.documento.tamaño}
                              </div>
                            </div>
                          </div>

                          {/* Proyecto y Usuario */}
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <FolderOpen className="h-4 w-4 text-muted-foreground" />
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm truncate">{actividad.proyecto.nombre}</div>
                                <div className="text-xs text-muted-foreground">{actividad.carpeta.rutaCarpeta}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm truncate">{actividad.usuario.name}</div>
                                <div className="text-xs text-muted-foreground truncate">{actividad.usuario.email}</div>
                              </div>
                            </div>
                          </div>

                          {/* Fecha de vencimiento y acciones */}
                          <div className="flex items-center justify-between pt-2 border-t">
                            <div>
                              {actividad.fechaVencimiento ? (
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4 text-orange-500" />
                                  <span className="text-orange-600 font-medium text-sm">
                                    {formatDateOnly(actividad.fechaVencimiento)}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-muted-foreground text-sm">Sin vencimiento</span>
                              )}
                            </div>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="icon" title="Ver detalles">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" title="Descargar documento">
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Vista desktop - Tabla */}
              <div className="hidden lg:block">
                <div className="overflow-x-auto">
                  <Table className="min-w-[800px]">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-blue-500">Fecha</TableHead>
                        <TableHead className="text-blue-500">Tipo Actividad</TableHead>
                        <TableHead className="text-blue-500">Documento</TableHead>
                        <TableHead className="text-blue-500">Proyecto/Carpeta</TableHead>
                        <TableHead className="text-blue-500">Usuario</TableHead>
                        <TableHead className="text-blue-500">Fecha Vencimiento</TableHead>
                        <TableHead className="text-center">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredActividades.map((actividad) => (
                        <TableRow key={actividad.id} className="cursor-pointer hover:bg-muted/50">
                          <TableCell>
                            <div className="flex flex-col gap-2">
                              {/* <div className="text-xs text-muted-foreground">{actividad.nombre}</div> */}
                              <div className="font-medium">{formatDate(actividad.fechaActividad)}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={getTipoActividadBadgeVariant(actividad.tipoActividad)}>
                              {getTipoActividadLabel(actividad.tipoActividad)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <div className="font-medium">{actividad.documento.nombre}</div>
                                <div className="text-xs text-muted-foreground">
                                  {actividad.documento.tipo} • {actividad.documento.tamaño}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <FolderOpen className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <div className="font-medium">{actividad.proyecto.nombre}</div>
                                <div className="text-xs text-muted-foreground">{actividad.carpeta.rutaCarpeta}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <div className="font-medium">{actividad.usuario.name}</div>
                                <div className="text-xs text-muted-foreground">{actividad.usuario.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {actividad.fechaVencimiento ? (
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-orange-500" />
                                <span className="text-orange-600 font-medium">
                                  {formatDateOnly(actividad.fechaVencimiento)}
                                </span>
                              </div>
                            ) : (
                              <span className="text-muted-foreground text-sm">Sin vencimiento</span>
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex justify-center space-x-2">
                              <Button variant="ghost" size="icon" title="Ver detalles">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" title="Descargar documento">
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabla de hitos (vista existente) */}
        {vistaActual === "hitos" && (
          <Card>
            <CardContent className="p-0">
              {/* Vista móvil - Cards para hitos */}
              <div className="block lg:hidden">
                <div className="space-y-3 p-4">
                  {filteredHitos.map((hito) => (
                    <Card key={hito.id} className="cursor-pointer hover:bg-muted/50" onClick={() => handleViewHito(hito)}>
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="font-medium">{formatDateOnly(hito.fechaVencimiento)}</div>
                              <div className="text-sm text-muted-foreground">{hito.nombre}</div>
                            </div>
                            <Badge variant={getEstadoBadgeVariant(hito.estado)}>{hito.estado}</Badge>
                          </div>
                          <div className="space-y-2">
                            <div><span className="text-sm font-medium">Periodo:</span> {hito.periodo}</div>
                            <div><span className="text-sm font-medium">Proyecto:</span> {hito.proyecto.nombre}</div>
                            <div><span className="text-sm font-medium">Actividad:</span> {hito.hitoContractual}</div>
                          </div>
                          <div className="flex justify-end space-x-2 pt-2 border-t">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleCreateHito()
                              }}
                            >
                              <PlusCircle className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleEditHito(hito)
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDisableHito(hito)
                              }}
                            >
                              <ToggleLeft className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Vista desktop - Tabla para hitos */}
              <div className="hidden lg:block">
                <div className="overflow-x-auto">
                  <Table className="min-w-[700px]">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-blue-500">Fech Vencimiento</TableHead>
                        <TableHead className="text-blue-500">Periodo</TableHead>
                        <TableHead className="text-blue-500">Estado</TableHead>
                        <TableHead className="text-blue-500">Proyecto</TableHead>
                        <TableHead className="text-blue-500">Actividad documental</TableHead>
                        <TableHead className="text-center">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredHitos.map((hito) => (
                        <TableRow key={hito.id} className="cursor-pointer" onClick={() => handleViewHito(hito)}>
                          <TableCell>
                            {formatDateOnly(hito.fechaVencimiento)}
                            <div className="text-sm text-muted-foreground">{hito.nombre}</div>
                          </TableCell>
                          <TableCell>{hito.periodo}</TableCell>
                          <TableCell>
                            <Badge variant={getEstadoBadgeVariant(hito.estado)}>{hito.estado}</Badge>
                          </TableCell>
                          <TableCell>{hito.proyecto.nombre}</TableCell>
                          <TableCell>{hito.hitoContractual}</TableCell>
                          <TableCell className="text-center">
                            <div className="flex justify-center space-x-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleCreateHito()
                                }}
                              >
                                <PlusCircle className="h-5 w-5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleEditHito(hito)
                                }}
                              >
                                <Edit className="h-5 w-5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDisableHito(hito)
                                }}
                              >
                                <ToggleLeft className="h-5 w-5" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Modal de crear/editar hito */}
      <HitoModal open={hitoModalOpen} onOpenChange={setHitoModalOpen} hito={selectedHito} onSave={handleSaveHito} />

      {/* Modal de detalle de hito */}
      <HitoDetalleModal open={hitoDetalleModalOpen} onOpenChange={setHitoDetalleModalOpen} hito={selectedHito} />

      {/* Modal de confirmación para deshabilitar */}
      <ConfirmacionModal
        open={confirmacionModalOpen}
        onOpenChange={setConfirmacionModalOpen}
        onConfirm={confirmDisableHito}
        title="Confirmación"
        description="Está seguro que quiere deshabilitar Hito, en caso de existir información se mantendrá guardada por un periodo x"
      />
    </>
  )
}
