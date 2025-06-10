"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog"
import { Button } from "@/shared/components/design-system/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Textarea } from "@/shared/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group"
import { Users, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/shared/components/ui/alert"
import type { Unit, Division, Department, Project } from "@/shared/types/organizational-units"

interface UnitModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  unit?: Unit | null
  divisions: Division[]
  departments: Department[]
  projects: Project[]
  onSave: (unitData: Partial<Unit>) => void
}

export function UnitModal({ open, onOpenChange, unit, divisions, departments, projects, onSave }: UnitModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    status: "" as Unit["status"] | "",
    divisionId: "",
    assignmentType: "" as Unit["assignmentType"] | "",
    departmentId: "",
    projectId: "",
    observations: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Filtrar departamentos según la división seleccionada
  const availableDepartments = departments.filter((dept) => dept.divisionId === formData.divisionId)
  const availableProjects = projects.filter((proj) => proj.status === "ACTIVO")

  useEffect(() => {
    if (unit) {
      setFormData({
        name: unit.name,
        code: unit.code,
        status: unit.status,
        divisionId: unit.divisionId,
        assignmentType: unit.assignmentType,
        departmentId: unit.departmentId || "",
        projectId: unit.projectId || "",
        observations: unit.observations || "",
      })
    } else {
      setFormData({
        name: "",
        code: "",
        status: "ACTIVA",
        divisionId: "",
        assignmentType: "",
        departmentId: "",
        projectId: "",
        observations: "",
      })
    }
    setErrors({})
  }, [unit, open])

  // Reset department and project when division changes
  useEffect(() => {
    if (formData.divisionId) {
      setFormData((prev) => ({
        ...prev,
        departmentId: "",
        projectId: "",
      }))
    }
  }, [formData.divisionId])

  // Reset department/project when assignment type changes
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      departmentId: "",
      projectId: "",
    }))
  }, [formData.assignmentType])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "El nombre de la unidad es requerido"
    }

    if (formData.name.length < 3) {
      newErrors.name = "El nombre debe tener al menos 3 caracteres"
    }

    if (!formData.code.trim()) {
      newErrors.code = "El código de la unidad es requerido"
    }

    if (!formData.divisionId) {
      newErrors.divisionId = "Debe seleccionar una división"
    }

    if (!formData.assignmentType) {
      newErrors.assignmentType = "Debe seleccionar el tipo de asignación"
    }

    if (formData.assignmentType === "DIVISION" && !formData.departmentId) {
      newErrors.departmentId = "Debe seleccionar un departamento para asignación a división"
    }

    if (formData.assignmentType === "PROJECT" && !formData.projectId) {
      newErrors.projectId = "Debe seleccionar un proyecto para asignación a proyecto"
    }

    if (!formData.status) {
      newErrors.status = "El estado es requerido"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      const unitData: Partial<Unit> = {
        ...formData,
        // Solo incluir departmentId si es asignación a división
        departmentId: formData.assignmentType === "DIVISION" ? formData.departmentId : undefined,
        // Solo incluir projectId si es asignación a proyecto
        projectId: formData.assignmentType === "PROJECT" ? formData.projectId : undefined,
      }
      onSave(unitData)
      onOpenChange(false)
    }
  }

  const generateCode = () => {
    if (formData.name) {
      // Generar código basado en el nombre
      const words = formData.name.split(" ")
      const initials = words.map((word) => word.charAt(0).toUpperCase()).join("")
      const timestamp = Date.now().toString().slice(-3)
      const code = `${initials}-${timestamp}`
      setFormData((prev) => ({ ...prev, code }))
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {unit ? "Editar Unidad" : "Crear Nueva Unidad"}
          </DialogTitle>
          <DialogDescription>
            {unit
              ? "Modifica los detalles de la unidad organizativa"
              : "Crea una nueva unidad y asígnala a una división o proyecto"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
          {/* Información básica */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre de la Unidad</Label>
              <Input
                id="name"
                placeholder="Ej: Unidad de Producción A"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="code">Código</Label>
              <div className="flex space-x-2">
                <Input
                  id="code"
                  placeholder="Ej: UPA-001"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className={errors.code ? "border-red-500" : ""}
                />
                <Button type="button" variant="outline" onClick={generateCode} disabled={!formData.name}>
                  Auto
                </Button>
              </div>
              {errors.code && <p className="text-sm text-red-500">{errors.code}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Estado</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value as Unit["status"] })}
            >
              <SelectTrigger className={errors.status ? "border-red-500" : ""}>
                <SelectValue placeholder="Selecciona el estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVA">Activa</SelectItem>
                <SelectItem value="INACTIVA">Inactiva</SelectItem>
                <SelectItem value="EN_MANTENIMIENTO">En Mantenimiento</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && <p className="text-sm text-red-500">{errors.status}</p>}
          </div>

          {/* Selección de División */}
          <div className="space-y-2">
            <Label htmlFor="divisionId">División</Label>
            <Select
              value={formData.divisionId}
              onValueChange={(value) => setFormData({ ...formData, divisionId: value })}
            >
              <SelectTrigger className={errors.divisionId ? "border-red-500" : ""}>
                <SelectValue placeholder="Selecciona la división" />
              </SelectTrigger>
              <SelectContent>
                {divisions
                  .filter((div) => div.status === "ACTIVA")
                  .map((division) => (
                    <SelectItem key={division.id} value={division.id}>
                      {division.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            {errors.divisionId && <p className="text-sm text-red-500">{errors.divisionId}</p>}
          </div>

          {/* Tipo de Asignación */}
          {formData.divisionId && (
            <div className="space-y-3">
              <Label>Asignar a...</Label>
              <RadioGroup
                value={formData.assignmentType}
                onValueChange={(value) => setFormData({ ...formData, assignmentType: value as Unit["assignmentType"] })}
                className="flex space-x-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="DIVISION" id="division" />
                  <Label htmlFor="division">División (Departamento)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="PROJECT" id="project" />
                  <Label htmlFor="project">Proyecto</Label>
                </div>
              </RadioGroup>
              {errors.assignmentType && <p className="text-sm text-red-500">{errors.assignmentType}</p>}
            </div>
          )}

          {/* Selección de Departamento (solo si es asignación a división) */}
          {formData.assignmentType === "DIVISION" && (
            <div className="space-y-2">
              <Label htmlFor="departmentId">Departamento</Label>
              <Select
                value={formData.departmentId}
                onValueChange={(value) => setFormData({ ...formData, departmentId: value })}
              >
                <SelectTrigger className={errors.departmentId ? "border-red-500" : ""}>
                  <SelectValue placeholder="Selecciona el departamento" />
                </SelectTrigger>
                <SelectContent>
                  {availableDepartments.length === 0 ? (
                    <SelectItem value="" disabled>
                      No hay departamentos disponibles
                    </SelectItem>
                  ) : (
                    availableDepartments.map((department) => (
                      <SelectItem key={department.id} value={department.id}>
                        {department.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {errors.departmentId && <p className="text-sm text-red-500">{errors.departmentId}</p>}
              {availableDepartments.length === 0 && formData.divisionId && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    No hay departamentos disponibles en la división seleccionada. Crea primero un departamento o
                    selecciona otra división.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {/* Selección de Proyecto (solo si es asignación a proyecto) */}
          {formData.assignmentType === "PROJECT" && (
            <div className="space-y-2">
              <Label htmlFor="projectId">Proyecto</Label>
              <Select
                value={formData.projectId}
                onValueChange={(value) => setFormData({ ...formData, projectId: value })}
              >
                <SelectTrigger className={errors.projectId ? "border-red-500" : ""}>
                  <SelectValue placeholder="Selecciona el proyecto" />
                </SelectTrigger>
                <SelectContent>
                  {availableProjects.length === 0 ? (
                    <SelectItem value="" disabled>
                      No hay proyectos activos disponibles
                    </SelectItem>
                  ) : (
                    availableProjects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        <div>
                          <div className="font-medium">{project.name}</div>
                          <div className="text-sm text-muted-foreground">{project.code}</div>
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {errors.projectId && <p className="text-sm text-red-500">{errors.projectId}</p>}
              {availableProjects.length === 0 && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    No hay proyectos activos disponibles. Contacta al administrador para crear proyectos.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {/* Observaciones */}
          <div className="space-y-2">
            <Label htmlFor="observations">Observaciones</Label>
            <Textarea
              id="observations"
              placeholder="Descripción adicional de la unidad (opcional)"
              value={formData.observations}
              onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>{unit ? "Actualizar Unidad" : "Crear Unidad"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
