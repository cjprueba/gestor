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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"
import type { Department, Division, Project, Unit } from "@/shared/types/organizational-units"
import { Building, Building2, Code, Edit, MoreHorizontal, Plus, Search, Trash2, Users } from "lucide-react"
import { useEffect, useState } from "react"
import { UnitModal } from "./_components/units-modal"

export default function UnitsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null)
  const [unitModalOpen, setUnitModalOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [unitToDelete, setUnitToDelete] = useState<Unit | null>(null)
  const [selectedDivisionId, setSelectedDivisionId] = useState<string>("all")
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>("all")

  // Datos de ejemplo
  const [divisions] = useState<Division[]>([
    {
      id: "1",
      name: "División Operativa",
      type: "OPERATIVA",
      status: "ACTIVA",
      createdAt: "2024-01-15T10:00:00Z",
      updatedAt: "2024-01-15T10:00:00Z",
      createdBy: { id: "1", name: "María García", email: "maria@empresa.com" },
      departmentCount: 5,
      unitCount: 12,
    },
    {
      id: "2",
      name: "División Administrativa",
      type: "ADMINISTRATIVA",
      status: "ACTIVA",
      createdAt: "2024-01-10T14:30:00Z",
      updatedAt: "2024-01-12T09:20:00Z",
      createdBy: { id: "2", name: "Carlos López", email: "carlos@empresa.com" },
      departmentCount: 3,
      unitCount: 8,
    },
  ])

  const [departments] = useState<Department[]>([
    {
      id: "1",
      name: "Gerencia de Operaciones",
      type: "GERENCIA",
      divisionId: "1",
      division: { id: "1", name: "División Operativa" },
      status: "ACTIVO",
      createdAt: "2024-01-15T10:30:00Z",
      updatedAt: "2024-01-15T10:30:00Z",
      createdBy: { id: "1", name: "María García", email: "maria@empresa.com" },
      unitCount: 4,
    },
    {
      id: "2",
      name: "Coordinación de Producción",
      type: "COORDINACION",
      divisionId: "1",
      division: { id: "1", name: "División Operativa" },
      status: "ACTIVO",
      createdAt: "2024-01-15T11:00:00Z",
      updatedAt: "2024-01-15T11:00:00Z",
      createdBy: { id: "2", name: "Carlos López", email: "carlos@empresa.com" },
      unitCount: 3,
    },
    {
      id: "3",
      name: "Recursos Humanos",
      type: "GERENCIA",
      divisionId: "2",
      division: { id: "2", name: "División Administrativa" },
      status: "ACTIVO",
      createdAt: "2024-01-16T09:00:00Z",
      updatedAt: "2024-01-16T09:00:00Z",
      createdBy: { id: "3", name: "Ana Martín", email: "ana@empresa.com" },
      unitCount: 2,
    },
  ])

  const [projects] = useState<Project[]>([
    {
      id: "1",
      name: "Proyecto Alpha",
      status: "ACTIVO",
      description: "Desarrollo de nueva plataforma",
    },
    {
      id: "2",
      name: "Proyecto Beta",
      status: "ACTIVO",
      description: "Mejoras en infraestructura",
    },
    {
      id: "3",
      name: "Proyecto Gamma",
      status: "PAUSADO",
      description: "Investigación y desarrollo",
    },
  ])

  const [units, setUnits] = useState<Unit[]>([
    {
      id: "1",
      name: "Unidad de Producción A",
      status: "ACTIVA",
      divisionId: "1",
      departmentId: "1",
      assignmentType: "DIVISION",
      division: { id: "1", name: "División Operativa" },
      department: { id: "1", name: "Gerencia de Operaciones" },
      observations: "Línea principal de producción",
      createdAt: "2024-01-15T12:00:00Z",
      updatedAt: "2024-01-15T12:00:00Z",
      createdBy: { id: "1", name: "María García", email: "maria@empresa.com" },
    },
    {
      id: "2",
      name: "Unidad de Control de Calidad",
      status: "ACTIVA",
      divisionId: "1",
      departmentId: "2",
      assignmentType: "DIVISION",
      division: { id: "1", name: "División Operativa" },
      department: { id: "2", name: "Coordinación de Producción" },
      observations: "Control y aseguramiento de calidad",
      createdAt: "2024-01-15T13:00:00Z",
      updatedAt: "2024-01-15T13:00:00Z",
      createdBy: { id: "2", name: "Carlos López", email: "carlos@empresa.com" },
    },
    {
      id: "3",
      name: "Unidad de Desarrollo Alpha",
      status: "ACTIVA",
      divisionId: "1",
      projectId: "1",
      assignmentType: "PROJECT",
      division: { id: "1", name: "División Operativa" },
      project: { id: "1", name: "Proyecto Alpha" },
      observations: "Equipo dedicado al Proyecto Alpha",
      createdAt: "2024-01-16T10:00:00Z",
      updatedAt: "2024-01-16T10:00:00Z",
      createdBy: { id: "3", name: "Ana Martín", email: "ana@empresa.com" },
    },
  ])

  // Filtrar departamentos según la división seleccionada
  const availableDepartments = departments.filter(
    (dept) => selectedDivisionId === "all" || dept.divisionId === selectedDivisionId,
  )

  // Filtrar unidades según los filtros seleccionados
  const filteredUnits = units.filter((unit) => {
    const matchesSearch =
      unit.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDivision = selectedDivisionId === "all" || unit.divisionId === selectedDivisionId
    const matchesDepartment =
      selectedDepartmentId === "all" ||
      (unit.departmentId && unit.departmentId === selectedDepartmentId) ||
      (selectedDepartmentId === "all" && unit.assignmentType === "PROJECT")
    return matchesSearch && matchesDivision && matchesDepartment
  })

  // Reset department filter when division changes
  useEffect(() => {
    if (selectedDivisionId !== "all") {
      setSelectedDepartmentId("all")
    }
  }, [selectedDivisionId])

  const handleCreateUnit = () => {
    setSelectedUnit(null)
    setUnitModalOpen(true)
  }

  const handleEditUnit = (unit: Unit) => {
    setSelectedUnit(unit)
    setUnitModalOpen(true)
  }

  const handleDeleteUnit = (unit: Unit) => {
    setUnitToDelete(unit)
    setDeleteDialogOpen(true)
  }

  const confirmDeleteUnit = () => {
    if (unitToDelete) {
      setUnits(units.filter((u) => u.id !== unitToDelete.id))
      setDeleteDialogOpen(false)
      setUnitToDelete(null)
    }
  }

  const handleSaveUnit = (unitData: Partial<Unit>) => {
    if (selectedUnit) {
      // Editar unidad existente
      setUnits(
        units.map((u) =>
          u.id === selectedUnit.id
            ? {
              ...u,
              ...unitData,
              division: divisions.find((div) => div.id === unitData.divisionId) || u.division,
              department: unitData.departmentId
                ? departments.find((dept) => dept.id === unitData.departmentId)
                : undefined,
              project: unitData.projectId ? projects.find((proj) => proj.id === unitData.projectId) : undefined,
              updatedAt: new Date().toISOString(),
            }
            : u,
        ),
      )
    } else {
      // Crear nueva unidad
      const division = divisions.find((div) => div.id === unitData.divisionId)
      const department = unitData.departmentId
        ? departments.find((dept) => dept.id === unitData.departmentId)
        : undefined
      const project = unitData.projectId ? projects.find((proj) => proj.id === unitData.projectId) : undefined

      const newUnit: Unit = {
        id: Date.now().toString(),
        name: unitData.name!,
        status: unitData.status!,
        divisionId: unitData.divisionId!,
        departmentId: unitData.departmentId,
        projectId: unitData.projectId,
        assignmentType: unitData.assignmentType!,
        division: { id: division!.id, name: division!.name },
        department: department ? { id: department.id, name: department.name } : undefined,
        project: project ? { id: project.id, name: project.name } : undefined,
        observations: unitData.observations,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: {
          id: "current-user",
          name: "Usuario Actual",
          email: "usuario@empresa.com",
        },
      }
      setUnits([...units, newUnit])
    }
  }

  const getStatusBadgeVariant = (status: Unit["status"]) => {
    switch (status) {
      case "ACTIVA":
        return "default"
      case "INACTIVA":
        return "secondary"
      case "EN_MANTENIMIENTO":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getAssignmentBadgeVariant = (type: Unit["assignmentType"]) => {
    return type === "DIVISION" ? "outline" : "secondary"
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const activeUnits = filteredUnits.filter((u) => u.status === "ACTIVA").length
  const divisionUnits = filteredUnits.filter((u) => u.assignmentType === "DIVISION").length
  const projectUnits = filteredUnits.filter((u) => u.assignmentType === "PROJECT").length

  return (
    <>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        {/* Header de la página */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gestión de Unidades</h1>
            <p className="text-muted-foreground">Administra las unidades organizativas por división y departamento</p>
          </div>
          <Button onClick={handleCreateUnit}>
            <Plus className="mr-2 h-4 w-4" />
            Crear Unidad
          </Button>
        </div>

        {/* Estadísticas */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Unidades</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredUnits.length}</div>
              <p className="text-xs text-muted-foreground">{activeUnits} activas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Por División</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{divisionUnits}</div>
              <p className="text-xs text-muted-foreground">asignadas a división</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Por Proyecto</CardTitle>
              <Code className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{projectUnits}</div>
              <p className="text-xs text-muted-foreground">asignadas a proyecto</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Departamentos</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{availableDepartments.length}</div>
              <p className="text-xs text-muted-foreground">disponibles</p>
            </CardContent>
          </Card>
        </div>

        {/* Filtros y tabla */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Lista de Unidades</CardTitle>
                <CardDescription>Gestiona las unidades organizativas con filtros en cascada</CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Select value={selectedDivisionId} onValueChange={setSelectedDivisionId}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filtrar por división" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las divisiones</SelectItem>
                    {divisions.map((division) => (
                      <SelectItem key={division.id} value={division.id}>
                        {division.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={selectedDepartmentId}
                  onValueChange={setSelectedDepartmentId}
                  disabled={selectedDivisionId === "all"}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filtrar por departamento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los departamentos</SelectItem>
                    {availableDepartments.map((department) => (
                      <SelectItem key={department.id} value={department.id}>
                        {department.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar unidades..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 w-64"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>División</TableHead>
                  <TableHead>Asignación</TableHead>
                  <TableHead>Observaciones</TableHead>
                  <TableHead>Creado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUnits.map((unit) => (
                  <TableRow key={unit.id}>
                    <TableCell>
                      <div className="font-medium">{unit.name}</div>
                    </TableCell>

                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(unit.status)}>{unit.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{unit.division.name}</div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Badge variant={getAssignmentBadgeVariant(unit.assignmentType)}>
                          {unit.assignmentType === "DIVISION" ? "División" : "Proyecto"}
                        </Badge>
                        <div className="text-xs text-muted-foreground">
                          {unit.assignmentType === "DIVISION"
                            ? unit.department?.name || "Sin departamento"
                            : unit.project?.name || "Sin proyecto"}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                        {unit.observations || "Sin observaciones"}
                      </p>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{formatDate(unit.createdAt)}</p>
                        <p className="text-muted-foreground">por {unit.createdBy.name}</p>
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
                          <DropdownMenuItem onClick={() => handleEditUnit(unit)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Users className="mr-2 h-4 w-4" />
                            Ver detalles
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleDeleteUnit(unit)} className="text-red-600">
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

      {/* Modal de crear/editar unidad */}
      <UnitModal
        open={unitModalOpen}
        onOpenChange={setUnitModalOpen}
        unit={selectedUnit}
        divisions={divisions}
        departments={departments}
        projects={projects}
        onSave={handleSaveUnit}
      />

      {/* Diálogo de confirmación para eliminar */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente la unidad "
              <strong>{unitToDelete?.name}</strong>" del sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteUnit} className="bg-red-600 hover:bg-red-700">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
