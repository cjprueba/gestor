import { useState } from "react"
import { Button } from "@/shared/components/design-system/button"
import { Input } from "@/shared/components/ui/input"
import { Badge } from "@/shared/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Search, PlusCircle, Edit, ToggleLeft } from "lucide-react"
import { HitoModal } from "./_components/hito-modal"
import { HitoDetalleModal } from "./_components/hito-detalle-modal"
import { ConfirmacionModal } from "./_components/confirmacion-modal"
import type { Hito, HitoFiltros, Division, Etapa, HitoEstado } from "@/shared/types/milestones"

export default function MilestonesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedHito, setSelectedHito] = useState<Hito | null>(null)
  const [hitoModalOpen, setHitoModalOpen] = useState(false)
  const [hitoDetalleModalOpen, setHitoDetalleModalOpen] = useState(false)
  const [confirmacionModalOpen, setConfirmacionModalOpen] = useState(false)
  const [hitoToDisable, setHitoToDisable] = useState<Hito | null>(null)
  const [filtros, setFiltros] = useState<HitoFiltros>({})

  // Datos de ejemplo
  const [divisiones] = useState<Division[]>([
    { id: "1", nombre: "División Operativa" },
    { id: "2", nombre: "División Administrativa" },
    { id: "3", nombre: "División Técnica" },
  ])

  const [etapas] = useState<Etapa[]>([
    { id: "1", nombre: "Diseño" },
    { id: "2", nombre: "Construcción" },
    { id: "3", nombre: "Operación" },
  ])

  const [estados] = useState<HitoEstado[]>(["Por Cumplir", "Por Vencer", "Vencido", "Recepcionado", "Aprobado"])

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

  // Filtrar hitos según los filtros seleccionados
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
        responsable: hitoData.responsable,
        fechaEntrega: hitoData.fechaEntrega,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: {
          id: "current-user",
          name: "Usuario Actual",
          email: "usuario@empresa.com",
        },
      }
      setHitos([...hitos, newHito])
    }
  }

  const getEstadoBadgeVariant = (estado: string) => {
    switch (estado) {
      case "Por Cumplir":
        return "default"
      case "Por Vencer":
        return "default"
      case "Vencido":
        return "destructive"
      case "Recepcionado":
        return "secondary"
      case "Aprobado":
        return "default"
      case "Recepcionado Aprobado":
        return "default"
      default:
        return "outline"
    }
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd-MM-yyyy", { locale: es })
  }

  return (
    <>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        {/* Header de la página */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Módulo de Registro de actividad documental</h1>
            <p className="text-muted-foreground">Gestión de resgistro de actividades documentales y seguimiento de cumplimiento</p>
          </div>
          <Button onClick={handleCreateHito} variant="primario">
            <PlusCircle className="mr-2 h-5 w-5" />
            Nuevo Registro
          </Button>
        </div>

        {/* Filtros */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Select value={filtros.division} onValueChange={(value) => setFiltros({ ...filtros, division: value })}>
                <SelectTrigger className="w-[200px] text-white">
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
                <SelectTrigger className="w-[200px] text-white">
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
                <SelectTrigger className="w-[200px] text-white">
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

              <Select
                value={filtros.periodoAnio}
                onValueChange={(value) => setFiltros({ ...filtros, periodoAnio: value })}
              >
                <SelectTrigger className="w-[200px] text-white">
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
                <SelectTrigger className="w-[200px] text-white">
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

            <div className="mt-4 flex items-center">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Selecciona o Busca contrato"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Button variant="iconoSecundario" className="ml-2">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabla de hitos */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-blue-500">Fech Vencimiento</TableHead>
                  <TableHead className="text-blue-500">Periodo</TableHead>
                  <TableHead className="text-blue-500">Estado</TableHead>
                  <TableHead className="text-blue-500">Proyecto</TableHead>
                  <TableHead className="text-blue-500">Hito Contractual</TableHead>
                  <TableHead className="text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHitos.map((hito) => (
                  <TableRow key={hito.id} className="cursor-pointer" onClick={() => handleViewHito(hito)}>
                    <TableCell>
                      {formatDate(hito.fechaVencimiento)}
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
          </CardContent>
        </Card>
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
