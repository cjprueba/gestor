"use client"

import { Button } from "@/shared/components/design-system/button"
import { Badge } from "@/shared/components/ui/badge"
import {
  AlertCircle,
  AlertTriangle,
  Clock,
  FileX,
  FolderOpen
} from "lucide-react"

interface Alert {
  id: string
  type: "missing" | "overdue"
  severity: "low" | "medium" | "high" | "critical"
  folderId: string
  folderName: string
  folderPath: string
  message: string
  documentName?: string
  count?: number
  total?: number
  current?: number
  dueDate?: Date
  daysOverdue?: number
}

interface AlertsPanelProps {
  alerts: Alert[]
  onNavigateToFolder: (folderId: string) => void
  onUploadDocument: (folderId: string) => void
}

export default function AlertsPanel({ alerts, onNavigateToFolder }: AlertsPanelProps) {
  if (alerts.length === 0) return null

  const criticalAlerts = alerts.filter((alert) => alert.severity === "critical")
  const highAlerts = alerts.filter((alert) => alert.severity === "high")
  const otherAlerts = alerts.filter((alert) => !["critical", "high"].includes(alert.severity))

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-red-600 bg-red-50 border-red-200"
      case "high":
        return "text-orange-600 bg-orange-50 border-orange-200"
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      default:
        return "text-blue-600 bg-blue-50 border-blue-200"
    }
  }

  const getAlertIcon = (type: string, severity: string) => {
    if (type === "overdue") {
      return <Clock className="w-4 h-4" />
    }
    if (severity === "critical") {
      return <AlertCircle className="w-4 h-4" />
    }
    return <FileX className="w-4 h-4" />
  }

  return (
    <div className="mb-4 sm:mb-6">
      {/* Resumen rápido */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 space-y-3 sm:space-y-0">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 text-destructive" />
          <h3 className="font-semibold text-base sm:text-lg">Alertas del proyecto</h3>
        </div>

        {/* Contadores por tipo de alerta */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {criticalAlerts.length > 0 && (
            <div className="flex items-center space-x-1 px-2 py-1 bg-red-50 border border-red-200 rounded-md">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <span className="text-sm font-medium text-red-600">{criticalAlerts.length}</span>
              <span className="text-xs text-red-600">crítico{criticalAlerts.length > 1 ? "s" : ""}</span>
            </div>
          )}
          {highAlerts.length > 0 && (
            <div className="flex items-center space-x-1 px-2 py-1 bg-orange-50 border border-orange-200 rounded-md">
              <AlertTriangle className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-medium text-orange-600">{highAlerts.length}</span>
              <span className="text-xs text-orange-600">importante{highAlerts.length > 1 ? "s" : ""}</span>
            </div>
          )}
          {otherAlerts.length > 0 && (
            <div className="flex items-center space-x-1 px-2 py-1 bg-yellow-50 border border-yellow-200 rounded-md">
              <Clock className="w-4 h-4 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-600">{otherAlerts.length}</span>
              <span className="text-xs text-yellow-600">requiere atención</span>
            </div>
          )}
        </div>
      </div>

      {/* Contenedor responsive - scroll horizontal en desktop, stack vertical en móvil */}
      <div className="block sm:hidden">
        {/* Vista móvil - stack vertical con scroll */}
        <div className="max-h-96 overflow-y-auto space-y-3 pr-1">
          {alerts.map((alert) => {
            return (
              <div
                key={alert.id}
                className={`border-l-4 sm:border-l-2 rounded-r-md ${getSeverityColor(alert.severity)} transition-all w-full`}
              >
                <div className="p-3">
                  <div className="space-y-3">
                    {/* Contenido principal */}
                    <div className="flex items-start space-x-2">
                      {getAlertIcon(alert.type, alert.severity)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm">{alert.message}</span>
                          <Badge variant="outline" className="text-xs ml-2">
                            {alert.severity === "critical" ? "Crítico" : alert.severity === "high" ? "Alto" : "Medio"}
                          </Badge>
                        </div>

                        <div className="flex items-center text-xs text-muted-foreground mb-3">
                          <FolderOpen className="w-3 h-3 mr-1 shrink-0" />
                          <span className="truncate" title={alert.folderPath}>
                            {alert.folderPath}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Acción */}
                    <div className="flex justify-end">
                      <Button
                        variant="secundario"
                        size="sm"
                        onClick={() => onNavigateToFolder(alert.folderId)}
                        className="h-8 px-3 text-xs"
                      >
                        <FolderOpen className="w-3 h-3 mr-1" />
                        Ir a carpeta
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Indicador de scroll si hay muchas alertas */}
        {alerts.length > 3 && (
          <div className="flex items-center justify-center mt-2 text-xs text-muted-foreground">
            <span>Desliza para ver más alertas ({alerts.length} total)</span>
          </div>
        )}
      </div>

      {/* Vista desktop - scroll horizontal */}
      <div className="hidden sm:block">
        <div className="overflow-x-auto pb-2">
          <div className="flex gap-3">
            {alerts.map((alert) => {
              return (
                <div
                  key={alert.id}
                  className={`border-l-2 rounded-r-md ${getSeverityColor(alert.severity)} transition-all min-w-72 max-w-96 flex-shrink-0`}
                >
                  <div className="p-3">
                    <div className="flex items-center justify-between">
                      {/* Contenido principal compacto */}
                      <div className="flex-1 min-w-0 pr-2">
                        <div className="flex items-center space-x-2 mb-1">
                          {getAlertIcon(alert.type, alert.severity)}
                          <span className="font-medium text-sm truncate flex-1 min-w-0">{alert.message}</span>
                          <Badge variant="outline" className="text-xs shrink-0">
                            {alert.severity === "critical" ? "Crítico" : alert.severity === "high" ? "Alto" : "Medio"}
                          </Badge>
                        </div>

                        <div className="flex items-center text-xs text-muted-foreground">
                          <FolderOpen className="w-3 h-3 mr-1 shrink-0" />
                          <span className="truncate flex-1 min-w-0" title={alert.folderPath}>
                            {alert.folderPath}
                          </span>
                        </div>
                      </div>

                      {/* Acciones compactas verticales */}
                      <div className="flex flex-col justify-center ml-2">
                        <Button
                          variant="secundario"
                          size="sm"
                          onClick={() => onNavigateToFolder(alert.folderId)}
                          className="h-6 px-2 text-xs whitespace-nowrap"
                        >
                          <FolderOpen className="w-3 h-3 mr-1" />
                          Ir
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
