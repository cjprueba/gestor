import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/shared/components/ui/dialog"
import { Button } from "@/shared/components/design-system/button"
import { Checkbox } from "@/shared/components/ui/checkbox"
import { Label } from "@/shared/components/ui/label"
import { Calendar } from "@/shared/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/shared/lib/utils"
import type { Hito } from "@/shared/types/milestones"

interface HitoDetalleModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  hito?: Hito | null
}

export function HitoDetalleModal({ open, onOpenChange, hito }: HitoDetalleModalProps) {
  const [date, setDate] = useState<Date | undefined>(
    hito?.fechaVencimiento ? new Date(hito.fechaVencimiento) : undefined,
  )

  if (!hito) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] md:max-w-[700px] max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-xl md:text-2xl font-semibold">{hito.hitoContractual}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pr-2">
          <div className="space-y-3">
            <h3 className="text-lg md:text-xl font-medium text-primary">Información del Proyecto</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-muted/30 rounded-lg p-4">
              <div className="flex flex-col">
                <span className="font-medium text-sm text-muted-foreground">Proyecto</span>
                <span className="text-base">{hito.proyecto.nombre}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-sm text-muted-foreground">Contexto</span>
                <span className="text-base">{hito.proyecto.tipo}</span>
              </div>
              <div className="flex flex-col md:col-span-2">
                <span className="font-medium text-sm text-muted-foreground">Referencia</span>
                <span className="text-base">{hito.hitoContractual}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg md:text-xl font-medium text-primary">Información del Hito</h3>
            <div className="grid grid-cols-1 gap-3 bg-muted/30 rounded-lg p-4">
              <div className="flex flex-col">
                <span className="font-medium text-sm text-muted-foreground">Nombre del Hito</span>
                <span className="text-base">{hito.nombre}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-sm text-muted-foreground">Descripción del Hito</span>
                <span className="text-base">{hito.descripcion || "Sin descripción"}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-sm text-muted-foreground">Fecha de entrega</span>
                <span className="text-base">{hito.periodo}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg md:text-xl font-medium text-primary">Vencimiento Hito</h3>
            <div className="flex items-center space-x-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="secundario"
                    className={cn("w-full md:w-[240px] justify-start text-left font-normal", !date && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "dd/MM/yyyy", { locale: es }) : <span>Seleccionar fecha</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={date} onSelect={setDate} initialFocus locale={es} />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg md:text-xl font-medium text-primary">Aprobadores Hito</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-muted/30 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Checkbox id="sinRecepcion" className="h-5 w-5" />
                <Label htmlFor="sinRecepcion" className="text-base">Sin Recepción</Label>
              </div>
              <div className="flex items-center space-x-3">
                <Checkbox id="recepcionado" checked={hito.recepcionado} className="h-5 w-5" />
                <Label htmlFor="recepcionado" className="text-base">Recepcionado</Label>
              </div>
              <div className="flex items-center space-x-3">
                <Checkbox id="aprobadoIF" checked={hito.aprobado} className="h-5 w-5" />
                <Label htmlFor="aprobadoIF" className="text-base">Aprobado IF</Label>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col-reverse sm:flex-row justify-between gap-2 mt-6">
          <Button variant="secundario" className="w-full sm:w-auto">Cancelar</Button>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button variant="secundario" className="w-full sm:w-auto">Actualizar</Button>
            <Button className="w-full sm:w-auto">Registrar Hito</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
