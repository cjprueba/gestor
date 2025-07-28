import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import { Folder } from "lucide-react"
import CardActions from "../CardActions"
import type { CarpetaItem } from "./folder.types"

interface FolderCardProps {
  folder: CarpetaItem
  projectStage: string
  onNavigate: (folderId: number) => void
  onViewDetails: (folder: any) => void
  onConfig: (folder: any) => void
  onEdit: (folder: any) => void
  onDelete: (folder: any) => void
  onMove: (folder: any) => void
  onDuplicate: (folder: any) => void
  // onViewProjectDetails: () => void
}

// Función utilitaria para obtener el color de la carpeta
const getFolderColor = (folder: CarpetaItem): string | undefined => {
  // Si tiene carpeta_transversal y color, usar ese color
  if (folder.carpeta_transversal?.color) {
    return folder.carpeta_transversal.color
  }

  // Si no, usar el color de etapa_tipo
  if (folder.etapa_tipo?.color) {
    return folder.etapa_tipo.color
  }

  // Sin color definido
  return undefined
}

export const FolderCard: React.FC<FolderCardProps> = ({
  folder,
  onNavigate,
  onViewDetails,
  // onConfig,
  onEdit,
  onDelete,
  onMove,
  // onDuplicate,
  // onViewProjectDetails,
}) => {
  // Simular minDocuments para la lógica de colores (3 por defecto)
  const minDocuments = 3;

  // Obtener el color apropiado para la carpeta
  const folderColor = getFolderColor(folder);

  return (
    <Card
      key={folder.id}
      className={"cursor-pointer hover:shadow-lg transition-all border-1"}
      style={{ borderColor: folderColor || undefined, borderWidth: folderColor ? 1 : undefined }}
      onClick={() => onNavigate(folder.id)}
    >
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex space-x-2 flex-1">
            <Folder
              className="w-5 h-5 mt-0.5 flex-shrink-0"
              style={{ color: folderColor || '#3b82f6' }}
            />
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg leading-tight">{folder.nombre}</CardTitle>
              <div className="flex flex-wrap items-center gap-1 mt-1">
                {folder.carpeta_transversal ? (
                  <Badge
                    variant="secondary"
                    className="text-xs p-0 px-1"
                    style={{ backgroundColor: `${folder.carpeta_transversal.color}15`, color: folder.carpeta_transversal.color }}
                  >
                    Carpeta transversal
                  </Badge>
                ) : folder.etapa_tipo ? (
                  <>
                    <span className="text-xs text-gray-400">Carpeta de etapa:</span>
                    <Badge
                      variant="outline"
                      className="text-xs p-0 px-1"
                      style={{ borderColor: folder.etapa_tipo.color, color: folder.etapa_tipo.color }}
                    >
                      {folder.etapa_tipo.nombre}
                    </Badge>
                  </>
                ) : null}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {/* Comentado temporalmente: {folderAlerts.length > 0 && <Badge variant="destructive">{folderAlerts.length}</Badge>} */}
            <CardActions
              type="folder"
              item={folder}
              onViewDetails={() => onViewDetails(folder)}
              // onViewProjectDetails={onViewProjectDetails}
              // onConfig={() => onConfig(folder)}
              onEdit={() => onEdit(folder)}
              onDelete={() => onDelete(folder)}
              onMove={() => onMove(folder)}
            // onDuplicate={() => onDuplicate(folder)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Documentos:</span>
            <div className="flex items-center space-x-2">
              <span
                className={`text-sm font-semibold ${folder.total_documentos < minDocuments ? "text-red-600" : "text-emerald-600"
                  }`}
              >
                {folder.total_documentos}
              </span>
              <span className="text-sm text-gray-400">/</span>
              <span className="text-sm text-gray-500">{minDocuments} mín.</span>
            </div>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Total (con subcarpetas):</span>
            <span>{folder.total_documentos}</span>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Subcarpetas:</span>
            <span>{folder.total_carpetas_hijas}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 