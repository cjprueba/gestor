import React from "react"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Badge } from "@/shared/components/ui/badge"
import { TIPOS_INICIATIVA, TIPOS_OBRA, REGIONES, ROLES_INSPECTOR } from "@/shared/data/project-data"
import type { ProjectFormData } from "../types"

interface StageSpecificFieldsStepProps {
  formData: ProjectFormData
  errors: Record<string, string>
  provinciasDisponibles: Array<{ id: string; nombre: string }>
  comunasDisponibles: Array<{ id: string; nombre: string }>
  onUpdateFormData: (field: keyof ProjectFormData, value: string) => void
}

export const StageSpecificFieldsStep: React.FC<StageSpecificFieldsStepProps> = ({
  formData,
  errors,
  provinciasDisponibles,
  comunasDisponibles,
  onUpdateFormData,
}) => {
  if (!formData.etapa) return null

  const renderCommonFields = () => (
    <div className="flex flex-col gap-6">
      <div className="flex flex-row gap-4 mt-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="tipoIniciativa">Tipo de Iniciativa *</Label>
          <Select
            value={formData.tipoIniciativa || ""}
            onValueChange={(value) => onUpdateFormData("tipoIniciativa", value)}
          >
            <SelectTrigger className={errors.tipoIniciativa ? "border-red-500" : ""}>
              <SelectValue placeholder="Seleccionar..." />
            </SelectTrigger>
            <SelectContent>
              {TIPOS_INICIATIVA.map((tipo) => (
                <SelectItem key={tipo} value={tipo}>
                  {tipo}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.tipoIniciativa && <p className="text-sm text-red-500 mt-1">{errors.tipoIniciativa}</p>}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="tipoObra">Tipo de Obra *</Label>
          <Select value={formData.tipoObra || ""} onValueChange={(value) => onUpdateFormData("tipoObra", value)}>
            <SelectTrigger className={errors.tipoObra ? "border-red-500" : ""}>
              <SelectValue placeholder="Seleccionar..." />
            </SelectTrigger>
            <SelectContent>
              {(TIPOS_OBRA[formData.etapa as keyof typeof TIPOS_OBRA] || []).map((tipo) => (
                <SelectItem key={tipo} value={tipo}>
                  {tipo}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.tipoObra && <p className="text-sm text-red-500 mt-1">{errors.tipoObra}</p>}
        </div>
      </div>

      {/* Cascada de ubicación */}
      <div className="flex flex-row gap-4 ">
        <div className="flex flex-col gap-2">
          <Label htmlFor="region">Región *</Label>
          <Select value={formData.region || ""} onValueChange={(value) => onUpdateFormData("region", value)}>
            <SelectTrigger className={errors.region ? "border-red-500" : ""}>
              <SelectValue placeholder="Seleccionar región..." />
            </SelectTrigger>
            <SelectContent>
              {REGIONES.map((region) => (
                <SelectItem key={region.id} value={region.id}>
                  {region.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.region && <p className="text-sm text-red-500 mt-1">{errors.region}</p>}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="provincia">Provincia *</Label>
          <Select
            value={formData.provincia || ""}
            onValueChange={(value) => onUpdateFormData("provincia", value)}
            disabled={!formData.region}
          >
            <SelectTrigger className={errors.provincia ? "border-red-500" : ""}>
              <SelectValue placeholder="Seleccionar provincia..." />
            </SelectTrigger>
            <SelectContent>
              {provinciasDisponibles.map((provincia) => (
                <SelectItem key={provincia.id} value={provincia.id}>
                  {provincia.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.provincia && <p className="text-sm text-red-500 mt-1">{errors.provincia}</p>}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="comuna">Comuna *</Label>
          <Select
            value={formData.comuna || ""}
            onValueChange={(value) => onUpdateFormData("comuna", value)}
            disabled={!formData.provincia}
          >
            <SelectTrigger className={errors.comuna ? "border-red-500" : ""}>
              <SelectValue placeholder="Seleccionar comuna..." />
            </SelectTrigger>
            <SelectContent>
              {comunasDisponibles.map((comuna) => (
                <SelectItem key={comuna.id} value={comuna.id}>
                  {comuna.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.comuna && <p className="text-sm text-red-500 mt-1">{errors.comuna}</p>}
        </div>
      </div>

      <div className="flex flex-row gap-12">
        <div className="flex flex-col gap-2">
          <Label htmlFor="volumen">Volumen</Label>
          <Input
            id="volumen"
            value={formData.volumen || ""}
            onChange={(e) => onUpdateFormData("volumen", e.target.value)}
            placeholder="Ej: 50 km, 1000 m³"
            className="max-w-3xs"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="presupuestoOficial">Presupuesto Oficial</Label>
          <Input
            id="presupuestoOficial"
            value={formData.presupuestoOficial || ""}
            onChange={(e) => onUpdateFormData("presupuestoOficial", e.target.value)}
            placeholder="Ej: $50.000.000.000"
            className="max-w-3xs"
          />
        </div>
      </div>
    </div>
  )

  const renderStageSpecificFieldsByType = () => {
    switch (formData.etapa) {
      case "Cartera de proyectos":
        return (
          <div className="flex flex-row gap-12">
            <div className="flex flex-col gap-2">
              <Label htmlFor="llamadoLicitacion">Llamado a Licitación (Año)</Label>
              <Input
                id="llamadoLicitacion"
                value={formData.llamadoLicitacion || ""}
                onChange={(e) => onUpdateFormData("llamadoLicitacion", e.target.value)}
                placeholder="YYYY"
                maxLength={4}
                className={`max-w-3xs ${errors.llamadoLicitacion ? "border-red-500" : ""}`}
              />
              {errors.llamadoLicitacion && <p className="text-sm text-red-500 mt-1">{errors.llamadoLicitacion}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="plazoConcesion">Plazo de la Concesión</Label>
              <Input
                id="plazoConcesion"
                value={formData.plazoConcesion || ""}
                onChange={(e) => onUpdateFormData("plazoConcesion", e.target.value)}
                placeholder="dd-mm-yyyy"
                className={`max-w-3xs ${errors.plazoConcesion ? "border-red-500" : ""}`}
              />
              {errors.plazoConcesion && <p className="text-sm text-red-500 mt-1">{errors.plazoConcesion}</p>}
            </div>
          </div>
        )

      case "Proyectos en Licitación":
        return (
          <div className="flex flex-row gap-8">
            <div className="flex flex-col gap-2">
              <Label htmlFor="fechaLlamadoLicitacion">Fecha de Llamado a Licitación</Label>
              <Input
                id="fechaLlamadoLicitacion"
                value={formData.fechaLlamadoLicitacion || ""}
                onChange={(e) => onUpdateFormData("fechaLlamadoLicitacion", e.target.value)}
                placeholder="dd-mm-yyyy"
                className={`max-w-3xs ${errors.fechaLlamadoLicitacion ? "border-red-500" : ""}`}
              />
              {errors.fechaLlamadoLicitacion && (
                <p className="text-sm text-red-500 mt-1">{errors.fechaLlamadoLicitacion}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="fechaRecepcionOfertas">Fecha de Recepción de Ofertas</Label>
              <Input
                id="fechaRecepcionOfertas"
                value={formData.fechaRecepcionOfertas || ""}
                onChange={(e) => onUpdateFormData("fechaRecepcionOfertas", e.target.value)}
                placeholder="dd-mm-yyyy"
                className={`max-w-3xs ${errors.fechaRecepcionOfertas ? "border-red-500" : ""}`}
              />
              {errors.fechaRecepcionOfertas && (
                <p className="text-sm text-red-500 mt-1">{errors.fechaRecepcionOfertas}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="fechaAperturaOfertas">Fecha de Apertura de Ofertas Económicas</Label>
              <Input
                id="fechaAperturaOfertas"
                value={formData.fechaAperturaOfertas || ""}
                onChange={(e) => onUpdateFormData("fechaAperturaOfertas", e.target.value)}
                placeholder="dd-mm-yyyy"
                className={`max-w-3xs ${errors.fechaAperturaOfertas ? "border-red-500" : ""}`}
              />
              {errors.fechaAperturaOfertas && (
                <p className="text-sm text-red-500 mt-1">{errors.fechaAperturaOfertas}</p>
              )}
            </div>
          </div>
        )

      case "Concesiones en Operación":
      case "Concesiones en Construcción":
      case "Concesiones en Operación y Construcción":
        return (
          <div className="flex flex-col gap-8">
            <div className="flex flex-row gap-12 mt-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="fechaLlamadoLicitacion">Fecha de Llamado a Licitación</Label>
                <Input
                  id="fechaLlamadoLicitacion"
                  value={formData.fechaLlamadoLicitacion || ""}
                  onChange={(e) => onUpdateFormData("fechaLlamadoLicitacion", e.target.value)}
                  placeholder="dd-mm-yyyy"
                  className={`max-w-3xs ${errors.fechaLlamadoLicitacion ? "border-red-500" : ""}`}
                />
                {errors.fechaLlamadoLicitacion && (
                  <p className="text-sm text-red-500 mt-1">{errors.fechaLlamadoLicitacion}</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="fechaRecepcionOfertas">Fecha de Recepción de Ofertas</Label>
                <Input
                  id="fechaRecepcionOfertas"
                  value={formData.fechaRecepcionOfertas || ""}
                  onChange={(e) => onUpdateFormData("fechaRecepcionOfertas", e.target.value)}
                  placeholder="dd-mm-yyyy"
                  className={`max-w-3xs ${errors.fechaRecepcionOfertas ? "border-red-500" : ""}`}
                />
                {errors.fechaRecepcionOfertas && (
                  <p className="text-sm text-red-500 mt-1">{errors.fechaRecepcionOfertas}</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="fechaAperturaOfertas">Fecha de Apertura de Ofertas</Label>
                <Input
                  id="fechaAperturaOfertas"
                  value={formData.fechaAperturaOfertas || ""}
                  onChange={(e) => onUpdateFormData("fechaAperturaOfertas", e.target.value)}
                  placeholder="dd-mm-yyyy"
                  className={`max-w-3xs ${errors.fechaAperturaOfertas ? "border-red-500" : ""}`}
                />
                {errors.fechaAperturaOfertas && (
                  <p className="text-sm text-red-500 mt-1">{errors.fechaAperturaOfertas}</p>
                )}
              </div>
            </div>

            <div className="flex flex-row gap-12 ">
              <div className="flex flex-col gap-2">
                <Label htmlFor="decretoAdjudicacion">Decreto de Adjudicación</Label>
                <Input
                  id="decretoAdjudicacion"
                  value={formData.decretoAdjudicacion || ""}
                  onChange={(e) => onUpdateFormData("decretoAdjudicacion", e.target.value)}
                  placeholder="Número de decreto"
                  className="max-w-3xs"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="sociedadConcesionaria">Sociedad Concesionaria</Label>
                <Input
                  id="sociedadConcesionaria"
                  value={formData.sociedadConcesionaria || ""}
                  onChange={(e) => onUpdateFormData("sociedadConcesionaria", e.target.value)}
                  placeholder="Nombre de la sociedad"
                  className="max-w-3xs"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="inicioPlazoConcesion">Inicio de Plazo de Concesión</Label>
                <Input
                  id="inicioPlazoConcesion"
                  value={formData.inicioPlazoConcesion || ""}
                  onChange={(e) => onUpdateFormData("inicioPlazoConcesion", e.target.value)}
                  placeholder="dd-mm-yyyy"
                  className={`max-w-3xs ${errors.inicioPlazoConcesion ? "border-red-500" : ""}`}
                />
                {errors.inicioPlazoConcesion && (
                  <p className="text-sm text-red-500 mt-1">{errors.inicioPlazoConcesion}</p>
                )}
              </div>
            </div>
            <div className="flex flex-row gap-12 ">

              <div className="flex flex-col gap-2">
                <Label htmlFor="plazoTotalConcesion">Plazo Total de la Concesión</Label>
                <Input
                  id="plazoTotalConcesion"
                  value={formData.plazoTotalConcesion || ""}
                  onChange={(e) => onUpdateFormData("plazoTotalConcesion", e.target.value)}
                  placeholder="Ej: 25 años"
                  className="max-w-3xs"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="inspectorFiscal">Inspector/a Fiscal (Opcional)</Label>
                <Select
                  value={formData.inspectorFiscal || ""}
                  onValueChange={(value) => onUpdateFormData("inspectorFiscal", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar rol..." />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLES_INSPECTOR.map((rol) => (
                      <SelectItem key={rol} value={rol}>
                        {rol}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )

      case "Concesiones Finalizadas":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="valorReferencia">Valor de Referencia</Label>
                <Input
                  id="valorReferencia"
                  value={formData.valorReferencia || ""}
                  onChange={(e) => onUpdateFormData("valorReferencia", e.target.value)}
                  placeholder="Valor de referencia"
                  className="max-w-3xs"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="fechaLlamadoLicitacion">Fecha de Llamado a Licitación</Label>
                <Input
                  id="fechaLlamadoLicitacion"
                  value={formData.fechaLlamadoLicitacion || ""}
                  onChange={(e) => onUpdateFormData("fechaLlamadoLicitacion", e.target.value)}
                  placeholder="dd-mm-yyyy"
                  className={`max-w-3xs ${errors.fechaLlamadoLicitacion ? "border-red-500" : ""}`}
                />
                {errors.fechaLlamadoLicitacion && (
                  <p className="text-sm text-red-500 mt-1">{errors.fechaLlamadoLicitacion}</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="decretoAdjudicacion">Decreto de Adjudicación</Label>
                <Input
                  id="decretoAdjudicacion"
                  value={formData.decretoAdjudicacion || ""}
                  onChange={(e) => onUpdateFormData("decretoAdjudicacion", e.target.value)}
                  placeholder="Número de decreto"
                  className="max-w-3xs"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="sociedadConcesionaria">Sociedad Concesionaria</Label>
                <Input
                  id="sociedadConcesionaria"
                  value={formData.sociedadConcesionaria || ""}
                  onChange={(e) => onUpdateFormData("sociedadConcesionaria", e.target.value)}
                  placeholder="Nombre de la sociedad"
                  className="max-w-3xs"
                />
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <Badge variant="outline">{formData.etapa}</Badge>
        <span className="text-sm text-muted-foreground">Campos específicos para esta etapa</span>
      </div>

      {renderCommonFields()}
      {renderStageSpecificFieldsByType()}
    </div>
  )
} 