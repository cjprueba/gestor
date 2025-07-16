import { Input } from "@/shared/components/ui/input"
import { Button } from "@/shared/components/design-system/button"
import { Badge } from "@/shared/components/ui/badge"
import { Card, CardContent } from "@/shared/components/ui/card"
import { Search, Filter, X, FileText, FolderOpen, Loader2 } from "lucide-react"
import { useEtapasTipo, useTiposObras } from "@/lib/api"
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

  // Filtros por tipo de obra
  selectedTiposObra: string[]
  onTipoObraFilterChange: (tipos: string[]) => void

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
  selectedTiposObra,
  onTipoObraFilterChange,
  projectResults,
  documentResults,
  context,
  onClearFilters,
  isLoadingProjects = false,
  isLoadingDocuments = false,
}: SearchHeaderProps & { isLoadingProjects?: boolean; isLoadingDocuments?: boolean }) {
  // Obtener datos de etapas y tipos de obra desde la API
  const { data: etapasData, isFetching: isLoadingEtapas } = useEtapasTipo()
  const { data: tiposObraData, isFetching: isLoadingTiposObra } = useTiposObras()

  // Debug logging
  // console.log("Etapas data:", etapasData)
  // console.log("Tipos obra data:", tiposObraData)

  const hasActiveFilters = projectSearchTerm || documentSearchTerm || selectedStages.length > 0 || selectedTiposObra.length > 0

  const handleStageToggle = (stage: string) => {
    if (selectedStages.includes(stage)) {
      onStageFilterChange(selectedStages.filter((s) => s !== stage))
    } else {
      onStageFilterChange([...selectedStages, stage])
    }
  }

  const handleTipoObraToggle = (tipo: string) => {
    if (selectedTiposObra.includes(tipo)) {
      onTipoObraFilterChange(selectedTiposObra.filter((t) => t !== tipo))
    } else {
      onTipoObraFilterChange([...selectedTiposObra, tipo])
    }
  }

  return (
    <Card className="border-0 shadow-sm bg-blue-50">
      <CardContent>
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center flex-1">
            {/* Buscador de proyectos */}
            <div className="flex-1 min-w-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder={context === "projects" ? "Buscar proyectos..." : "Buscar carpetas..."}
                  value={projectSearchTerm}
                  onChange={(e) => onProjectSearchChange(e.target.value)}
                  className="pl-10 pr-10 bg-white/80 border-white/50 focus:bg-white focus:border-blue-200"
                />
                {projectSearchTerm && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onProjectSearchChange("")}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-0 hover:bg-gray-100"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                )}
                {/* Loader en input de proyectos */}
                {isLoadingProjects && (
                  <Loader2 className="absolute right-8 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400 animate-spin" />
                )}
              </div>
              {/* Resultados de búsqueda de proyectos */}
              {projectResults !== undefined && projectSearchTerm && (
                <div className="mt-1 flex items-center text-xs text-muted-foreground">
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
                  className="pl-10 pr-10 bg-white/80 border-white/50 focus:bg-white focus:border-blue-200"
                />
                {documentSearchTerm && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDocumentSearchChange("")}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-0 hover:bg-gray-100"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                )}
                {/* Loader en input de documentos */}
                {isLoadingDocuments && (
                  <Loader2 className="absolute right-8 top-1/2 -translate-y-1/2 w-4 h-4 text-green-400 animate-spin" />
                )}
              </div>
              {/* Resultados de búsqueda de documentos */}
              {documentResults !== undefined && documentSearchTerm && (
                <div className="mt-1 flex items-center text-xs text-muted-foreground">
                  <FileText className="w-3 h-3 mr-1" />
                  {documentResults} documentos encontrados
                </div>
              )}
            </div>
          </div>
          {/* Filtro por etapas */}
          <div className="flex gap-2">
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
                {isLoadingEtapas ? (
                  <div className="px-2 py-1 text-sm text-muted-foreground">Cargando...</div>
                ) : Array.isArray(etapasData) && etapasData.length > 0 ? (
                  etapasData.map((etapa) => (
                    <DropdownMenuCheckboxItem
                      key={etapa.id}
                      checked={selectedStages.includes(etapa.nombre)}
                      onCheckedChange={() => handleStageToggle(etapa.nombre)}
                    >
                      {etapa.nombre}
                    </DropdownMenuCheckboxItem>
                  ))
                ) : (
                  // Fallback con datos mock si la API no está disponible
                  <>
                    <DropdownMenuCheckboxItem
                      key="cartera"
                      checked={selectedStages.includes("Cartera de proyectos")}
                      onCheckedChange={() => handleStageToggle("Cartera de proyectos")}
                    >
                      Cartera de proyectos
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      key="licitacion"
                      checked={selectedStages.includes("Proyectos en Licitación")}
                      onCheckedChange={() => handleStageToggle("Proyectos en Licitación")}
                    >
                      Proyectos en Licitación
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      key="operacion"
                      checked={selectedStages.includes("Concesiones en Operación")}
                      onCheckedChange={() => handleStageToggle("Concesiones en Operación")}
                    >
                      Concesiones en Operación
                    </DropdownMenuCheckboxItem>
                  </>
                )}
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

            {/* Filtro por tipo de obra */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="secundario"
                  className={`bg-white/80 border-white/50 hover:bg-white ${selectedTiposObra.length > 0 ? "border-blue-200 bg-blue-50" : ""}`}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Tipo de Obra
                  {selectedTiposObra.length > 0 && (
                    <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-xs">
                      {selectedTiposObra.length}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72 max-h-80 overflow-y-auto">
                <DropdownMenuLabel>Filtrar por tipo de obra</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {isLoadingTiposObra ? (
                  <div className="px-2 py-1 text-sm text-muted-foreground">Cargando...</div>
                ) : Array.isArray(tiposObraData) && tiposObraData.length > 0 ? (
                  tiposObraData.map((tipo) => (
                    <DropdownMenuCheckboxItem
                      key={tipo.id}
                      checked={selectedTiposObra.includes(tipo.nombre)}
                      onCheckedChange={() => handleTipoObraToggle(tipo.nombre)}
                      className="text-sm"
                    >
                      {tipo.nombre}
                    </DropdownMenuCheckboxItem>
                  ))
                ) : (
                  // Fallback con datos mock si la API no está disponible
                  <>
                    <DropdownMenuCheckboxItem
                      key="carretera"
                      checked={selectedTiposObra.includes("Carretera")}
                      onCheckedChange={() => handleTipoObraToggle("Carretera")}
                      className="text-sm"
                    >
                      Carretera
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      key="puente"
                      checked={selectedTiposObra.includes("Puente")}
                      onCheckedChange={() => handleTipoObraToggle("Puente")}
                      className="text-sm"
                    >
                      Puente
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      key="tunel"
                      checked={selectedTiposObra.includes("Túnel")}
                      onCheckedChange={() => handleTipoObraToggle("Túnel")}
                      className="text-sm"
                    >
                      Túnel
                    </DropdownMenuCheckboxItem>
                  </>
                )}
                {selectedTiposObra.length > 0 && (
                  <>
                    <DropdownMenuSeparator />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onTipoObraFilterChange([])}
                      className="w-full justify-start h-8 px-2 text-xs"
                    >
                      Limpiar filtros
                    </Button>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

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

            {selectedTiposObra.map((tipo) => (
              <Badge key={tipo} variant="secondary" className="bg-orange-100 text-orange-800">
                {tipo}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleTipoObraToggle(tipo)}
                  className="ml-1 h-4 w-4 p-0 hover:bg-orange-200"
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
