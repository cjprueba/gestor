import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Folder } from "lucide-react"
import ContextMenu from "./context-menu"

interface FolderCardProps {
  folder: {
    id: number
    nombre: string
    descripcion: string
    total_documentos: number
    total_carpetas_hijas: number
    fecha_creacion: string
    activa: boolean
    etapa_tipo?: {
      color: string;
    };
  }
  projectStage: string
  onNavigate: (folderId: number) => void
  onViewDetails: (folder: any) => void
  onConfig: (folder: any) => void
  onEdit: (folder: any) => void
  onDelete: (folder: any) => void
  onMove: (folder: any) => void
  onDuplicate: (folder: any) => void
  onViewProjectDetails: () => void
}

export const FolderCard: React.FC<FolderCardProps> = ({
  folder,
  onNavigate,
  onViewDetails,
  onConfig,
  onEdit,
  onDelete,
  onMove,
  onDuplicate,
  onViewProjectDetails,
}) => {
  // Simular minDocuments para la lógica de colores (3 por defecto)
  const minDocuments = 3;

  return (
    <Card
      key={folder.id}
      className={"cursor-pointer hover:shadow-lg transition-all border-1"}
      style={{ borderColor: folder.etapa_tipo?.color || undefined, borderWidth: folder.etapa_tipo?.color ? 2 : undefined }}
    >
      <CardHeader>
        <div className="flex justify-between items-start">
          <div
            className="flex items-center space-x-2 flex-1"
            onClick={() => onNavigate(folder.id)}
          >
            <Folder className="w-5 h-5 text-blue-500" />
            <CardTitle className="text-lg">{folder.nombre}</CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            {/* Comentado temporalmente: {folderAlerts.length > 0 && <Badge variant="destructive">{folderAlerts.length}</Badge>} */}
            <ContextMenu
              type="folder"
              item={folder}
              onViewDetails={() => onViewDetails(folder)}
              onViewProjectDetails={onViewProjectDetails}
              onConfig={() => onConfig(folder)}
              onEdit={() => onEdit(folder)}
              onDelete={() => onDelete(folder)}
              onMove={() => onMove(folder)}
              onDuplicate={() => onDuplicate(folder)}
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