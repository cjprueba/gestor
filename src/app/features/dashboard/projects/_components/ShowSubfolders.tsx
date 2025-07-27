import { Folder } from "lucide-react"
import { Badge } from "@/shared/components/ui/badge"
import type { CarpetaEstructura } from "./folder/folder.types"

const ShowSubfolders = ({ carpetas }: { carpetas: CarpetaEstructura[] }) => {
  // Componente para renderizar carpetas anidadas de manera visual
  const renderCarpeta = (carpeta: CarpetaEstructura) => (
    <div key={carpeta.id} className="relative">
      {/* Carpeta principal */}
      <div className={`flex items-center space-x-3 p-3 border rounded-lg bg-gray-50 ${carpeta.nivel > 0 ? 'ml-6' : ''}`}>
        <div className="flex items-center space-x-2 flex-1">
          <div className="w-4 h-4 bg-blue-100 rounded flex items-center justify-center">
            <Folder className="w-3 h-3 text-blue-600" />
          </div>
          <span className="text-sm font-medium">{carpeta.nombre}</span>
        </div>
        <Badge variant="outline" className="text-xs">
          {carpeta.nivel === 0 ? 'Principal' : 'Subcarpeta'}
        </Badge>
      </div>

      {/* Líneas de conexión para subcarpetas */}
      {carpeta.subcarpetas.length > 0 && (
        <div className="relative">
          {/* Línea vertical */}
          <div className={`absolute left-3 top-0 bottom-0 w-px bg-gray-300 ${carpeta.nivel > 0 ? 'ml-6' : ''}`} />

          {/* Subcarpetas */}
          <div className="mt-2 space-y-2">
            {carpeta.subcarpetas.map((subcarpeta) => (
              <div key={subcarpeta.id} className="relative">
                {/* Línea horizontal */}
                <div className={`absolute left-3 top-5 w-4 h-px bg-gray-300 ${carpeta.nivel > 0 ? 'ml-6' : ''}`} />
                {renderCarpeta(subcarpeta)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div className="space-y-3">
      {carpetas.map((carpeta) => renderCarpeta(carpeta))}
    </div>
  )
}

export default ShowSubfolders;