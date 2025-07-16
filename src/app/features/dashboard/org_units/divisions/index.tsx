import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog"
import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/design-system/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import { Input } from "@/shared/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"
import type { Division } from "@/shared/types/organizational-units"
import {
  AlertTriangle,
  Building,
  Building2,
  Edit,
  Filter,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  Users,
} from "lucide-react"
import { useState } from "react"
import { DivisionModal } from "./_components/division-modal"

export default function DivisionsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDivision, setSelectedDivision] = useState<Division | null>(null)
  const [divisionModalOpen, setDivisionModalOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [divisionToDelete, setDivisionToDelete] = useState<Division | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>("all")

  // Datos de ejemplo
  const [divisions, setDivisions] = useState<Division[]>([
    {
      id: "1",
      name: "División Operativa",
      type: "OPERATIVA",
      status: "ACTIVA",
      observations: "División principal de operaciones",
      createdAt: "2024-01-15T10:00:00Z",
      updatedAt: "2024-01-15T10:00:00Z",
      createdBy: {
        id: "1",
        name: "María García",
        email: "maria@empresa.com",
      },
      departmentCount: 5,
      unitCount: 12,
    },
    {
      id: "2",
      name: "División Administrativa",
      type: "ADMINISTRATIVA",
      status: "ACTIVA",
      observations: "Gestión administrativa y financiera",
      createdAt: "2024-01-10T14:30:00Z",
      updatedAt: "2024-01-12T09:20:00Z",
      createdBy: {
        id: "2",
        name: "Carlos López",
        email: "carlos@empresa.com",
      },
      departmentCount: 3,
      unitCount: 8,
    },
    {
      id: "3",
      name: "División Comercial",
      type: "COMERCIAL",
      status: "ACTIVA",
      observations: "Ventas y marketing",
      createdAt: "2024-01-08T11:15:00Z",
      updatedAt: "2024-01-14T16:45:00Z",
      createdBy: {
        id: "3",
        name: "Ana Martín",
        email: "ana@empresa.com",
      },
      departmentCount: 4,
      unitCount: 10,
    },
    {
      id: "4",
      name: "División Técnica",
      type: "TECNICA",
      status: "INACTIVA",
      observations: "Desarrollo y soporte técnico",
      createdAt: "2024-01-05T08:00:00Z",
      updatedAt: "2024-01-13T12:30:00Z",
      createdBy: {
        id: "1",
        name: "María García",
        email: "maria@empresa.com",
      },
      departmentCount: 2,
      unitCount: 6,
    },
  ])

  const filteredDivisions = divisions.filter((division) => {
    const matchesSearch = division.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || division.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleCreateDivision = () => {
    setSelectedDivision(null)
    setDivisionModalOpen(true)
  }

  const handleEditDivision = (division: Division) => {
    setSelectedDivision(division)
    setDivisionModalOpen(true)
  }

  const handleDeleteDivision = (division: Division) => {
    setDivisionToDelete(division)
    setDeleteDialogOpen(true)
  }

  const confirmDeleteDivision = () => {
    if (divisionToDelete) {
      setDivisions(divisions.filter((d) => d.id !== divisionToDelete.id))
      setDeleteDialogOpen(false)
      setDivisionToDelete(null)
    }
  }

  const handleSaveDivision = (divisionData: Partial<Division>) => {
    if (selectedDivision) {
      // Editar división existente
      setDivisions(
        divisions.map((d) =>
          d.id === selectedDivision.id ? { ...d, ...divisionData, updatedAt: new Date().toISOString() } : d,
        ),
      )
    } else {
      // Crear nueva división
      const newDivision: Division = {
        id: Date.now().toString(),
        name: divisionData.name!,
        type: divisionData.type!,
        status: divisionData.status!,
        observations: divisionData.observations,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: {
          id: "current-user",
          name: "Usuario Actual",
          email: "usuario@empresa.com",
        },
        departmentCount: 0,
        unitCount: 0,
      }
      setDivisions([...divisions, newDivision])
    }
  }

  const getStatusBadgeVariant = (status: Division["status"]) => {
    switch (status) {
      case "ACTIVA":
        return "default"
      case "INACTIVA":
        return "secondary"
      case "SUSPENDIDA":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getTypeBadgeVariant = (type: Division["type"]) => {
    switch (type) {
      case "OPERATIVA":
        return "default"
      case "ADMINISTRATIVA":
        return "secondary"
      case "COMERCIAL":
        return "outline"
      case "TECNICA":
        return "destructive"
      default:
        return "outline"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const totalDepartments = divisions.reduce((acc, div) => acc + div.departmentCount, 0)
  const totalUnits = divisions.reduce((acc, div) => acc + div.unitCount, 0)
  const activeDivisions = divisions.filter((d) => d.status === "ACTIVA").length

  return (
    <>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        {/* Header de la página */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gestión de Divisiones</h1>
            <p className="text-muted-foreground">Administra las divisiones organizativas de la empresa</p>
          </div>
          <Button onClick={handleCreateDivision}>
            <Plus className="mr-2 h-4 w-4" />
            Crear División
          </Button>
        </div>

        {/* Estadísticas */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Divisiones</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{divisions.length}</div>
              <p className="text-xs text-muted-foreground">{activeDivisions} activas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Departamentos</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalDepartments}</div>
              <p className="text-xs text-muted-foreground">en todas las divisiones</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unidades</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUnits}</div>
              <p className="text-xs text-muted-foreground">unidades organizativas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Promedio</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(totalDepartments / divisions.length || 0)}</div>
              <p className="text-xs text-muted-foreground">departamentos por división</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabla de divisiones */}
        <Card>
          <CardHeader>
            <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>Lista de Divisiones</CardTitle>
                <CardDescription>Gestiona las divisiones organizativas y su estructura</CardDescription>
              </div>
              <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar divisiones..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 w-full"
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="secundario" size="sm" className="w-full sm:w-auto">
                      <Filter className="mr-2 h-4 w-4" />
                      Estado
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-full sm:w-auto">
                    <DropdownMenuLabel>Filtrar por estado</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => setStatusFilter("all")}>Todos</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("ACTIVA")}>Activas</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("INACTIVA")}>Inactivas</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("SUSPENDIDA")}>Suspendidas</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Departamentos</TableHead>
                  <TableHead>Unidades</TableHead>
                  <TableHead>Creado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDivisions.map((division) => (
                  <TableRow key={division.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{division.name}</div>
                        {division.observations && (
                          <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                            {division.observations}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getTypeBadgeVariant(division.type)}>{division.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(division.status)}>{division.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <span>{division.departmentCount}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{division.unitCount}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{formatDate(division.createdAt)}</p>
                        <p className="text-muted-foreground">por {division.createdBy.name}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleEditDivision(division)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Building className="mr-2 h-4 w-4" />
                            Ver departamentos
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDeleteDivision(division)}
                            className="text-red-600"
                            disabled={division.departmentCount > 0}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Modal de crear/editar división */}
      <DivisionModal
        open={divisionModalOpen}
        onOpenChange={setDivisionModalOpen}
        division={selectedDivision}
        onSave={handleSaveDivision}
      />

      {/* Diálogo de confirmación para eliminar */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente la división "
              <strong>{divisionToDelete?.name}</strong>" del sistema.
              {divisionToDelete?.departmentCount && divisionToDelete.departmentCount > 0 && (
                <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm text-yellow-800">
                      Esta división tiene {divisionToDelete.departmentCount} departamento(s). No se puede eliminar.
                    </span>
                  </div>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteDivision}
              disabled={!!divisionToDelete?.departmentCount && divisionToDelete.departmentCount > 0}
              className="bg-red-600 hover:bg-red-700"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
