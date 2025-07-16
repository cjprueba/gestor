import { Button } from "@/shared/components/design-system/button"
import { Badge } from "@/shared/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Input } from "@/shared/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { DataTable } from "@/shared/components/data-table"
import { MOCK_ACTIVIDADES_DOCUMENTALES } from "@/shared/data"
import type { ActividadDocumental, HitoFiltros, TipoActividad } from "@/shared/types/milestones"
import { Search } from "lucide-react"
import { useState, useMemo } from "react"
import { actividadesColumns } from "./_components/actividades-columns"
import { ActividadDetalleModal } from "./_components/actividad-detalle-modal"

export default function MilestonesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filtros, setFiltros] = useState<HitoFiltros>({})

  // Estado para el modal
  const [selectedActividad, setSelectedActividad] = useState<ActividadDocumental | null>(null)
  const [actividadModalOpen, setActividadModalOpen] = useState(false)

  // Usar datos mock centralizados
  const [actividadesDocumentales] = useState<ActividadDocumental[]>(MOCK_ACTIVIDADES_DOCUMENTALES)

  const [tiposActividad] = useState<TipoActividad[]>(["creacion_documento", "subida_archivo", "actualizacion_documento", "eliminacion_documento"])

  // Filtrar actividades según los filtros seleccionados usando useMemo para optimizar rendimiento
  const filteredActividades = useMemo(() => {
    return actividadesDocumentales.filter((actividad) => {
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
  }, [actividadesDocumentales, searchTerm, filtros])

  // Función para manejar el click en una fila
  const handleRowClick = (actividad: ActividadDocumental) => {
    setSelectedActividad(actividad)
    setActividadModalOpen(true)
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

  return (
    <>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        {/* Header de la página */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Registro de Actividad Documental</h1>
            <p className="text-muted-foreground">Sistema de logs y seguimiento de actividades documentales por proyecto</p>
          </div>

        </div>

        {/* Filtros */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Filtros de Búsqueda</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2">
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
                  <SelectItem value="proj-alpha">Autopista Norte - Región Metropolitana</SelectItem>
                  <SelectItem value="proj-beta">Hospital Regional del Biobío</SelectItem>
                  <SelectItem value="proj-gamma">Túnel Las Palmas</SelectItem>
                </SelectContent>
              </Select>

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
                  placeholder="Buscar actividades, documentos, usuarios..."
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

        {/* Tabla de actividades documentales usando DataTable */}
        <Card>
          <CardHeader>
            <CardTitle className="flex flex-col sm:flex-row sm:items-center gap-2">
              <div className="flex items-center gap-2">
                <span>Registro de Actividades Documentales</span>
              </div>
              <Badge variant="outline" className="w-fit sm:ml-auto">
                {filteredActividades.length} registros
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={actividadesColumns}
              data={filteredActividades}
              pageSize={10}
              onRowClick={handleRowClick}
            />
          </CardContent>
        </Card>
      </div>

      {/* Modal para ver detalles de la actividad */}
      <ActividadDetalleModal
        actividad={selectedActividad}
        open={actividadModalOpen}
        onOpenChange={setActividadModalOpen}
      />
    </>
  )
}
