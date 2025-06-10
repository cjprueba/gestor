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
import { Building } from "lucide-react"
import type { Department, Division } from "@/shared/types/organizational-units"

interface DepartmentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  department?: Department | null
  divisions: Division[]
  onSave: (departmentData: Partial<Department>) => void
}

export function DepartmentModal({ open, onOpenChange, department, divisions, onSave }: DepartmentModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    type: "" as Department["type"] | "",
    divisionId: "",
    status: "" as Department["status"] | "",
    observations: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (department) {
      setFormData({
        name: department.name,
        type: department.type,
        divisionId: department.divisionId,
        status: department.status,
        observations: department.observations || "",
      })
    } else {
      setFormData({
        name: "",
        type: "",
        divisionId: "",
        status: "ACTIVO",
        observations: "",
      })
    }
    setErrors({})
  }, [department, open])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "El nombre del departamento es requerido"
    }

    if (formData.name.length < 3) {
      newErrors.name = "El nombre debe tener al menos 3 caracteres"
    }

    if (!formData.type) {
      newErrors.type = "El tipo de departamento es requerido"
    }

    if (!formData.divisionId) {
      newErrors.divisionId = "Debe seleccionar una división"
    }

    if (!formData.status) {
      newErrors.status = "El estado es requerido"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      onSave(formData as Partial<Department>)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            {department ? "Editar Departamento" : "Crear Nuevo Departamento"}
          </DialogTitle>
          <DialogDescription>
            {department
              ? "Modifica los detalles del departamento"
              : "Crea un nuevo departamento dentro de una división"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
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

          <div className="space-y-2">
            <Label htmlFor="name">Nombre del Departamento</Label>
            <Input
              id="name"
              placeholder="Ej: Gerencia de Operaciones"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Tipo de Departamento</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData({ ...formData, type: value as Department["type"] })}
            >
              <SelectTrigger className={errors.type ? "border-red-500" : ""}>
                <SelectValue placeholder="Selecciona el tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GERENCIA">Gerencia</SelectItem>
                <SelectItem value="COORDINACION">Coordinación</SelectItem>
                <SelectItem value="SUPERVISION">Supervisión</SelectItem>
                <SelectItem value="OPERATIVO">Operativo</SelectItem>
              </SelectContent>
            </Select>
            {errors.type && <p className="text-sm text-red-500">{errors.type}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Estado</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value as Department["status"] })}
            >
              <SelectTrigger className={errors.status ? "border-red-500" : ""}>
                <SelectValue placeholder="Selecciona el estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVO">Activo</SelectItem>
                <SelectItem value="INACTIVO">Inactivo</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && <p className="text-sm text-red-500">{errors.status}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="observations">Observaciones</Label>
            <Textarea
              id="observations"
              placeholder="Descripción adicional del departamento (opcional)"
              value={formData.observations}
              onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="secundario" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>{department ? "Actualizar Departamento" : "Crear Departamento"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
