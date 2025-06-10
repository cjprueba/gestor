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
import { Building2 } from "lucide-react"
import type { Division } from "@/shared/types/organizational-units"

interface DivisionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  division?: Division | null
  onSave: (divisionData: Partial<Division>) => void
}

export function DivisionModal({ open, onOpenChange, division, onSave }: DivisionModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    type: "" as Division["type"] | "",
    status: "" as Division["status"] | "",
    observations: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (division) {
      setFormData({
        name: division.name,
        type: division.type,
        status: division.status,
        observations: division.observations || "",
      })
    } else {
      setFormData({
        name: "",
        type: "",
        status: "",
        observations: "",
      })
    }
    setErrors({})
  }, [division, open])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "El nombre de la división es requerido"
    }

    if (formData.name.length < 3) {
      newErrors.name = "El nombre debe tener al menos 3 caracteres"
    }

    if (!formData.type) {
      newErrors.type = "El tipo de división es requerido"
    }

    if (!formData.status) {
      newErrors.status = "El estado es requerido"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      onSave(formData as Partial<Division>)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            {division ? "Editar División" : "Crear Nueva División"}
          </DialogTitle>
          <DialogDescription>
            {division
              ? "Modifica los detalles de la división organizativa"
              : "Crea una nueva división organizativa en el sistema"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre de la División</Label>
            <Input
              id="name"
              placeholder="Ej: División Operativa"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Tipo de División</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData({ ...formData, type: value as Division["type"] })}
            >
              <SelectTrigger className={errors.type ? "border-red-500" : ""}>
                <SelectValue placeholder="Selecciona el tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="OPERATIVA">Operativa</SelectItem>
                <SelectItem value="ADMINISTRATIVA">Administrativa</SelectItem>
                <SelectItem value="COMERCIAL">Comercial</SelectItem>
                <SelectItem value="TECNICA">Técnica</SelectItem>
              </SelectContent>
            </Select>
            {errors.type && <p className="text-sm text-red-500">{errors.type}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Estado</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value as Division["status"] })}
            >
              <SelectTrigger className={errors.status ? "border-red-500" : ""}>
                <SelectValue placeholder="Selecciona el estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVA">Activa</SelectItem>
                <SelectItem value="INACTIVA">Inactiva</SelectItem>
                <SelectItem value="SUSPENDIDA">Suspendida</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && <p className="text-sm text-red-500">{errors.status}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="observations">Observaciones</Label>
            <Textarea
              id="observations"
              placeholder="Descripción adicional de la división (opcional)"
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
          <Button onClick={handleSubmit}>{division ? "Actualizar División" : "Crear División"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
