"use client"

import { useState } from "react"
import { Button } from "@/shared/components/design-system/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover"
import { Calendar as CalendarComponent } from "@/shared/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Settings, Clock, CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/shared/lib/utils"

interface Document {
  id: string
  name: string
  uploadedAt: Date
  dueDate?: Date
  hasCustomAlert?: boolean
  alertConfig?: {
    hasAlert: boolean
    alertType: "due_date" | "days_after"
    alertDate: string
    alertDays: number
  }
}

interface DocumentConfigDialogProps {
  document: Document
  onUpdate: (updatedDoc: Document) => void
}

export default function DocumentConfigDialog({ document, onUpdate }: DocumentConfigDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [config, setConfig] = useState({
    hasAlert: document.hasCustomAlert || false,
    alertType: document.alertConfig?.alertType || ("due_date" as "due_date" | "days_after"),
    alertDate: document.dueDate ? document.dueDate.toISOString().split("T")[0] : "",
    alertDays: document.alertConfig?.alertDays || 7,
  })

  const saveConfig = () => {
    let dueDate: Date | undefined

    if (config.hasAlert) {
      if (config.alertType === "due_date" && config.alertDate) {
        dueDate = new Date(config.alertDate)
      } else if (config.alertType === "days_after") {
        dueDate = new Date(document.uploadedAt)
        dueDate.setDate(dueDate.getDate() + config.alertDays)
      }
    }

    const updatedDoc: Document = {
      ...document,
      dueDate,
      hasCustomAlert: config.hasAlert,
      alertConfig: config.hasAlert ? config : undefined,
    }

    onUpdate(updatedDoc)
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Settings className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Configurar alertas</DialogTitle>
          <DialogDescription>Configura alertas personalizadas para "{document.name}"</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="hasAlert"
              checked={config.hasAlert}
              onChange={(e) => setConfig({ ...config, hasAlert: e.target.checked })}
              className="w-4 h-4"
            />
            <Label htmlFor="hasAlert" className="text-sm font-medium">
              Activar alerta para este documento
            </Label>
          </div>

          {config.hasAlert && (
            <div className="space-y-3 ml-6">
              <div>
                <Label className="text-sm">Tipo de alerta</Label>
                <Select
                  value={config.alertType}
                  onValueChange={(value) =>
                    setConfig({
                      ...config,
                      alertType: value as "due_date" | "days_after",
                    })
                  }
                >
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="due_date">Fecha límite específica</SelectItem>
                    <SelectItem value="days_after">Días desde subida</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {config.alertType === "due_date" ? (
                <div>
                  <Label className="text-xs">Fecha límite</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="secundario"
                        className={cn(
                          "h-8 w-full justify-start text-left font-normal text-xs mt-1",
                          !config.alertDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-3 w-3" />
                        {config.alertDate ?
                          format(new Date(config.alertDate), "dd/MM/yyyy", { locale: es }) :
                          <span>Seleccionar fecha</span>
                        }
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={config.alertDate ? new Date(config.alertDate) : undefined}
                        onSelect={(date) => {
                          setConfig({
                            ...config,
                            alertDate: date ? date.toISOString().split('T')[0] : "",
                          })
                        }}
                        initialFocus
                        locale={es}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              ) : (
                <div>
                  <Label className="text-sm flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    Días para vencimiento
                  </Label>
                  <Input
                    type="number"
                    min="1"
                    value={config.alertDays}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        alertDays: Number.parseInt(e.target.value) || 7,
                      })
                    }
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Vencerá el:{" "}
                    {new Date(
                      document.uploadedAt.getTime() + config.alertDays * 24 * 60 * 60 * 1000,
                    ).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="flex space-x-2 pt-2">
            <Button onClick={saveConfig} className="flex-1">
              Guardar Configuración
            </Button>
            <Button variant="secundario" onClick={() => setIsOpen(false)} className="flex-1">
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
