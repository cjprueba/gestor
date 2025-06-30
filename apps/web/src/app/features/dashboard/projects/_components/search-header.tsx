import { Input } from "@/shared/components/ui/input"
import { Button } from "@/shared/components/design-system/button"
import { Badge } from "@/shared/components/ui/badge"
import { Card, CardContent } from "@/shared/components/ui/card"
import { Search, Filter, X, FileText, FolderOpen } from "lucide-react"
import { ETAPAS } from "@/shared/data/project-data"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"

interface SearchHeaderProps {
  // Búsqueda de proyectos
  projectSearchTerm: string
  onProjectSearchChange: (term: string) => void

  // Búsqueda de documentos
  documentSearchTerm: string
  onDocumentSearchChange: (term: string) => void

  // Filtros por etapa
  selectedStages: string[]
  onStageFilterChange: (stages: string[]) => void

  // Resultados
  projectResults?: number
  documentResults?: number

  // Contexto (para mostrar diferentes opciones)
  context: "projects" | "project-detail"

  // Función para limpiar filtros
  onClearFilters: () => void
}

export function SearchHeader({
  projectSearchTerm,
  onProjectSearchChange,
  documentSearchTerm,
  onDocumentSearchChange,
  selectedStages,
  onStageFilterChange,
  projectResults,
  documentResults,
  context,
  onClearFilters,
}: SearchHeaderProps) {
  // const [isExpanded, setIsExpanded] = useState(false)

  const hasActiveFilters = projectSearchTerm || documentSearchTerm || selectedStages.length > 0

  const handleStageToggle = (stage: string) => {
    if (selectedStages.includes(stage)) {
      onStageFilterChange(selectedStages.filter((s) => s !== stage))
    } else {
      onStageFilterChange([...selectedStages, stage])
    }
  }

  return (
    <Card className="mb-6 border-0 shadow-sm bg-blue-50">
      <CardContent >
        {/* Header principal con buscadores */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
          {/* Buscador de proyectos */}
          <div className="flex-1 min-w-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder={context === "projects" ? "Buscar proyectos..." : "Buscar en proyecto actual..."}
                value={projectSearchTerm}
                onChange={(e) => onProjectSearchChange(e.target.value)}
                className="pl-10 bg-white/80 border-white/50 focus:bg-white focus:border-blue-200"
              />
              {projectSearchTerm && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onProjectSearchChange("")}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-100"
                >
                  <X className="w-3 h-3" />
                </Button>
              )}
            </div>
            {projectResults !== undefined && projectSearchTerm && (
              <div className="flex items-center mt-1 text-xs text-muted-foreground">
                <FolderOpen className="w-3 h-3 mr-1" />
                {projectResults} {context === "projects" ? "proyectos" : "carpetas"} encontradas
              </div>
            )}
          </div>

          {/* Buscador de documentos */}
          <div className="flex-1 min-w-0">
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Buscar documentos..."
                value={documentSearchTerm}
                onChange={(e) => onDocumentSearchChange(e.target.value)}
                className="pl-10 bg-white/80 border-white/50 focus:bg-white focus:border-blue-200"
              />
              {documentSearchTerm && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDocumentSearchChange("")}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-100"
                >
                  <X className="w-3 h-3" />
                </Button>
              )}
            </div>
            {documentResults !== undefined && documentSearchTerm && (
              <div className="flex items-center mt-1 text-xs text-muted-foreground">
                <FileText className="w-3 h-3 mr-1" />
                {documentResults} documentos encontrados
              </div>
            )}
          </div>

          {/* Filtros y acciones */}
          <div className="flex items-center gap-2">
            {/* Filtro por etapas */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="secundario"
                  className={`bg-white/80 border-white/50 hover:bg-white ${selectedStages.length > 0 ? "border-blue-200 bg-blue-50" : ""}`}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Etapas
                  {selectedStages.length > 0 && (
                    <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-xs">
                      {selectedStages.length}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Filtrar por etapas</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {ETAPAS.map((etapa) => (
                  <DropdownMenuCheckboxItem
                    key={etapa}
                    checked={selectedStages.includes(etapa)}
                    onCheckedChange={() => handleStageToggle(etapa)}
                  >
                    {etapa}
                  </DropdownMenuCheckboxItem>
                ))}
                {selectedStages.length > 0 && (
                  <>
                    <DropdownMenuSeparator />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onStageFilterChange([])}
                      className="w-full justify-start h-8 px-2 text-xs"
                    >
                      Limpiar filtros
                    </Button>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Botón para expandir/contraer */}
            {/* <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="bg-white/80 border border-white/50 hover:bg-white"
            >
              {isExpanded ? "Menos" : "Más"}
            </Button> */}

            {/* Limpiar todos los filtros */}
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearFilters}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <X className="w-4 h-4 mr-1" />
                Limpiar
              </Button>
            )}
          </div>
        </div>

        {/* Sección expandida con filtros adicionales */}
        {/* {isExpanded && (
          <div className="mt-4 pt-4 border-t border-white/50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Fecha de creación</label>
                <div className="flex gap-2">
                  <Input type="date" className="bg-white/80 border-white/50 text-xs" />
                  <Input type="date" className="bg-white/80 border-white/50 text-xs" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Estado</label>
                <select className="w-full p-2 text-xs border border-white/50 rounded-md bg-white/80">
                  <option value="">Todos los estados</option>
                  <option value="active">Activos</option>
                  <option value="completed">Completados</option>
                  <option value="on-hold">En pausa</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Tipo de documento</label>
                <select className="w-full p-2 text-xs border border-white/50 rounded-md bg-white/80">
                  <option value="">Todos los tipos</option>
                  <option value="pdf">PDF</option>
                  <option value="doc">Documentos</option>
                  <option value="img">Imágenes</option>
                </select>
              </div>
            </div>
          </div>
        )} */}

        {/* Badges de filtros activos */}
        {hasActiveFilters && (
          <div className="mt-3 flex flex-wrap gap-2">
            {projectSearchTerm && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {context === "projects" ? "Proyecto" : "Carpeta"}: "{projectSearchTerm}"
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onProjectSearchChange("")}
                  className="ml-1 h-4 w-4 p-0 hover:bg-blue-200"
                >
                  <X className="w-2 h-2" />
                </Button>
              </Badge>
            )}

            {documentSearchTerm && (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Documento: "{documentSearchTerm}"
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDocumentSearchChange("")}
                  className="ml-1 h-4 w-4 p-0 hover:bg-green-200"
                >
                  <X className="w-2 h-2" />
                </Button>
              </Badge>
            )}

            {selectedStages.map((stage) => (
              <Badge key={stage} variant="secondary" className="bg-purple-100 text-purple-800">
                {stage}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleStageToggle(stage)}
                  className="ml-1 h-4 w-4 p-0 hover:bg-purple-200"
                >
                  <X className="w-2 h-2" />
                </Button>
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
