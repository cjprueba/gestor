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
import type { Department, Division } from "@/shared/types/organizational-units"
import { AlertTriangle, Building, Building2, Edit, MoreHorizontal, Plus, Search, Trash2, Users } from "lucide-react"
import { useState } from "react"
import { DepartmentModal } from "./_components/department-modal"

export default function DepartmentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null)
  const [departmentModalOpen, setDepartmentModalOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [departmentToDelete, setDepartmentToDelete] = useState<Department | null>(null)
  const [selectedDivisionId, setSelectedDivisionId] = useState<string>("all")

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

  const [departments, setDepartments] = useState<Department[]>([
    {
      id: "1",
      name: "Gerencia de Operaciones",
      type: "GERENCIA",
      divisionId: "1",
      division: { id: "1", name: "División Operativa" },
      observations: "Supervisión general de operaciones",
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
      observations: "Coordinación de líneas de producción",
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
      observations: "Gestión del talento humano",
      status: "ACTIVO",
      createdAt: "2024-01-16T09:00:00Z",
      updatedAt: "2024-01-16T09:00:00Z",
      createdBy: { id: "3", name: "Ana Martín", email: "ana@empresa.com" },
      unitCount: 2,
    },
  ])

  const filteredDepartments = departments.filter((department) => {
    const matchesSearch = department.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDivision = selectedDivisionId === "all" || department.divisionId === selectedDivisionId
    return matchesSearch && matchesDivision
  })

  const handleCreateDepartment = () => {
    setSelectedDepartment(null)
    setDepartmentModalOpen(true)
  }

  const handleEditDepartment = (department: Department) => {
    setSelectedDepartment(department)
    setDepartmentModalOpen(true)
  }

  const handleDeleteDepartment = (department: Department) => {
    setDepartmentToDelete(department)
    setDeleteDialogOpen(true)
  }

  const confirmDeleteDepartment = () => {
    if (departmentToDelete) {
      setDepartments(departments.filter((d) => d.id !== departmentToDelete.id))
      setDeleteDialogOpen(false)
      setDepartmentToDelete(null)
    }
  }

  const handleSaveDepartment = (departmentData: Partial<Department>) => {
    if (selectedDepartment) {
      // Editar departamento existente
      setDepartments(
        departments.map((d) =>
          d.id === selectedDepartment.id
            ? {
              ...d,
              ...departmentData,
              division: divisions.find((div) => div.id === departmentData.divisionId) || d.division,
              updatedAt: new Date().toISOString(),
            }
            : d,
        ),
      )
    } else {
      // Crear nuevo departamento
      const division = divisions.find((div) => div.id === departmentData.divisionId)
      const newDepartment: Department = {
        id: Date.now().toString(),
        name: departmentData.name!,
        type: departmentData.type!,
        divisionId: departmentData.divisionId!,
        division: { id: division!.id, name: division!.name },
        observations: departmentData.observations,
        status: departmentData.status!,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: {
          id: "current-user",
          name: "Usuario Actual",
          email: "usuario@empresa.com",
        },
        unitCount: 0,
      }
      setDepartments([...departments, newDepartment])
    }
  }

  const getTypeBadgeVariant = (type: Department["type"]) => {
    switch (type) {
      case "GERENCIA":
        return "default"
      case "COORDINACION":
        return "secondary"
      case "SUPERVISION":
        return "outline"
      case "OPERATIVO":
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

  const totalUnits = filteredDepartments.reduce((acc, dept) => acc + dept.unitCount, 0)

  return (
    <>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        {/* Header de la página */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gestión de Departamentos</h1>
            <p className="text-muted-foreground">Administra los departamentos por división organizativa</p>
          </div>
          <Button onClick={handleCreateDepartment}>
            <Plus className="mr-2 h-4 w-4" />
            Crear Departamento
          </Button>
        </div>

        {/* Estadísticas */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Departamentos</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredDepartments.length}</div>
              <p className="text-xs text-muted-foreground">
                {selectedDivisionId === "all" ? "en todas las divisiones" : "en división seleccionada"}
              </p>
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
              <CardTitle className="text-sm font-medium">Divisiones</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{divisions.length}</div>
              <p className="text-xs text-muted-foreground">divisiones activas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Promedio</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(totalUnits / filteredDepartments.length || 0)}</div>
              <p className="text-xs text-muted-foreground">unidades por departamento</p>
            </CardContent>
          </Card>
        </div>

        {/* Filtros y tabla */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Lista de Departamentos</CardTitle>
                <CardDescription>Gestiona los departamentos organizativos por división</CardDescription>
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
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar departamentos..."
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
                  <TableHead>Tipo</TableHead>
                  <TableHead>División</TableHead>
                  <TableHead>Unidades</TableHead>
                  <TableHead>Observaciones</TableHead>
                  <TableHead>Creado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDepartments.map((department) => (
                  <TableRow key={department.id}>
                    <TableCell>
                      <div className="font-medium">{department.name}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getTypeBadgeVariant(department.type)}>{department.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{department.division.name}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{department.unitCount}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                        {department.observations || "Sin observaciones"}
                      </p>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{formatDate(department.createdAt)}</p>
                        <p className="text-muted-foreground">por {department.createdBy.name}</p>
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
                          <DropdownMenuItem onClick={() => handleEditDepartment(department)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Users className="mr-2 h-4 w-4" />
                            Ver unidades
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDeleteDepartment(department)}
                            className="text-red-600"
                            disabled={department.unitCount > 0}
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

      {/* Modal de crear/editar departamento */}
      <DepartmentModal
        open={departmentModalOpen}
        onOpenChange={setDepartmentModalOpen}
        department={selectedDepartment}
        divisions={divisions}
        onSave={handleSaveDepartment}
      />

      {/* Diálogo de confirmación para eliminar */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente el departamento "
              <strong>{departmentToDelete?.name}</strong>" del sistema.
              {departmentToDelete?.unitCount && departmentToDelete.unitCount > 0 && (
                <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm text-yellow-800">
                      Este departamento tiene {departmentToDelete.unitCount} unidad(es). No se puede eliminar.
                    </span>
                  </div>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteDepartment}
              disabled={!!departmentToDelete?.unitCount && departmentToDelete.unitCount > 0}
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
