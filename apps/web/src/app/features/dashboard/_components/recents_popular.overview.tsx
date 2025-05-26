import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/shared/components/ui/card";
import { formatFileSize } from "@/shared/lib/file-utils";
import { FileItem } from "@/shared/types/types";
import { Clock, TrendingUp, Star } from "lucide-react";

interface RecentsPopularOverviewProps {
  recentFiles: FileItem[]
  mostUsedFiles: FileItem[]
  onFileClick: (file: FileItem) => void
}


export function RecentsPopularOverview({ recentFiles, mostUsedFiles, onFileClick }: RecentsPopularOverviewProps) {

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Archivos Recientes</CardTitle>
            <CardDescription>Tus archivos modificados recientemente</CardDescription>
          </div>
          <Clock className="h-4 w-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center space-x-3 rounded-lg border p-3 hover:bg-gray-50 cursor-pointer"
                onClick={() => onFileClick(file)}
              >
                <div className="w-10 h-10 overflow-hidden rounded">
                  <img
                    src={file.thumbnail || "/placeholder.svg?height=40&width=40"}
                    alt={file.name}
                    width={40}
                    height={40}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-gray-500">
                    {file.type} • {formatFileSize(file.size || 0)}
                  </p>
                </div>
                <div className="text-xs text-gray-500">{file.modified.toLocaleDateString()}</div>
              </div>
            ))}
            {recentFiles.length === 0 && <div className="text-center py-6 text-gray-500">No hay archivos recientes</div>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Archivos Más Usados</CardTitle>
            <CardDescription>Tus archivos de acceso frecuente</CardDescription>
          </div>
          <TrendingUp className="h-4 w-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mostUsedFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center space-x-3 rounded-lg border p-3 hover:bg-gray-50 cursor-pointer"
                onClick={() => onFileClick(file)}
              >
                <div className="w-10 h-10 overflow-hidden rounded">
                  <img
                    src={file.thumbnail || "/placeholder.svg?height=40&width=40"}
                    alt={file.name}
                    width={40}
                    height={40}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    {file.starred && <Star className="h-3 w-3 ml-1 text-yellow-400" />}
                  </div>
                  <p className="text-xs text-gray-500">
                    {file.type} • {formatFileSize(file.size || 0)}
                  </p>
                </div>
                <div className="text-xs text-gray-500">{file.modified.toLocaleDateString()}</div>
              </div>
            ))}
            {mostUsedFiles.length === 0 && <div className="text-center py-6 text-gray-500">No hay archivos favoritos</div>}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}