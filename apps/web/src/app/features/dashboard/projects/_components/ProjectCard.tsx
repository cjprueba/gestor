import React from "react"
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card"
import { AlertTriangle, FolderOpen, FileText, Calendar } from "lucide-react"
import type { ProjectCardProps, FolderStructure } from "./types"

const getTotalAlerts = (folder: FolderStructure): number => {
  let alerts = 0

  // Alertas por documentos faltantes
  if (folder.documents.length < folder.minDocuments) {
    alerts++
  }

  // Alertas por fechas vencidas
  const overdueDocs = folder.documents.filter((doc) => doc.dueDate && doc.dueDate < new Date())
  alerts += overdueDocs.length

  // Alertas de subcarpetas
  folder.subfolders.forEach((subfolder) => {
    alerts += getTotalAlerts(subfolder)
  })

  return alerts
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onSelect }) => {
  const totalAlerts = getTotalAlerts(project.structure)
  const totalFolders = project.structure.subfolders.length
  const totalDocuments = project.structure.subfolders.reduce(
    (acc, folder) =>
      acc +
      folder.documents.length +
      folder.subfolders.reduce((subAcc, subfolder) => subAcc + subfolder.documents.length, 0),
    0,
  )

  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => onSelect(project)}
    >
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-lg font-semibold">{project.name}</h3>
            {project.etapa && (
              <p className="text-sm text-muted-foreground mt-1">Etapa: {project.etapa}</p>
            )}
          </div>
          {totalAlerts > 0 && (
            <div className="flex items-center text-destructive">
              <AlertTriangle className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">{totalAlerts}</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <FolderOpen className="w-4 h-4 mr-2" />
            {totalFolders} carpetas principales
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <FileText className="w-4 h-4 mr-2" />
            {totalDocuments} documentos totales
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="w-4 h-4 mr-2" />
            Creado {project.createdAt.toLocaleDateString()}
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 