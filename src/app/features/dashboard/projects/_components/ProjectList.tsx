import { useFileSearch, useFolderSearch } from "@/lib/api"
import { Button } from "@/shared/components/design-system/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { FileText, FolderOpen, Plus } from "lucide-react"
import React, { useMemo, useState } from "react"
import { ProjectCard } from "./ProjectCard"
import { SearchHeader } from "./search-header"
import type { ProjectListProps } from "./types"

// Función helper para obtener todos los documentos de un proyecto
// const getAllDocumentsFromProject = (structure: FolderStructure): Array<Document & { folderPath: string }> => {
//   const documents: Array<Document & { folderPath: string }> = []

//   const traverse = (folder: FolderStructure, path: string = "") => {
//     const currentPath = path ? `${path} - ${folder.name}` : folder.name

//     // Agregar documentos de la carpeta actual
//     folder.documents.forEach(doc => {
//       documents.push({
//         ...doc,
//         folderPath: currentPath
//       })
//     })

//     // Recursivamente obtener documentos de subcarpetas
//     folder.subfolders.forEach(subfolder => {
//       traverse(subfolder, currentPath)
//     })
//   }

//   traverse(structure)
//   return documents
// }

// Función helper para buscar texto en proyectos
const searchInProjects = (projects: any[], searchTerm: string) => {
  if (!searchTerm.trim()) return projects

  const term = searchTerm.toLowerCase()
  return projects.filter(project =>
    project.name.toLowerCase().includes(term) ||
    project.etapa.toLowerCase().includes(term) ||
    (project.projectData?.descripcion && project.projectData.descripcion.toLowerCase().includes(term))
  )
}

// Función helper para buscar documentos en todos los proyectos
// const searchDocumentsInProjects = (projects: any[], searchTerm: string) => {
//   if (!searchTerm.trim()) return []

//   const term = searchTerm.toLowerCase()
//   const allDocuments: Array<Document & { folderPath: string; projectName: string; projectId: string }> = []

//   projects.forEach(project => {
//     const projectDocs = getAllDocumentsFromProject(project.structure)
//     projectDocs.forEach(doc => {
//       if (doc.name.toLowerCase().includes(term)) {
//         allDocuments.push({
//           ...doc,
//           projectName: project.name,
//           projectId: project.id
//         })
//       }
//     })
//   })

//   return allDocuments
// }

// Función helper para filtrar por etapas
const filterByStages = (projects: any[], selectedStages: string[]) => {
  if (selectedStages.length === 0) return projects
  return projects.filter(project => selectedStages.includes(project.etapa))
}

// Función helper para filtrar por tipos de obra
const filterByTiposObra = (projects: any[], selectedTiposObra: string[]) => {
  if (selectedTiposObra.length === 0) return projects
  return projects.filter(project =>
    project.projectData?.tipoObra && selectedTiposObra.includes(project.projectData.tipoObra)
  )
}

export const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  onSelectProject,
  onCreateProject,
}) => {
  const [projectSearchTerm, setProjectSearchTerm] = useState("")
  const [documentSearchTerm, setDocumentSearchTerm] = useState("")
  const [selectedStages, setSelectedStages] = useState<string[]>([])
  const [selectedTiposObra, setSelectedTiposObra] = useState<string[]>([])

  // Hooks de búsqueda con la API
  // const { data: apiSearchResults, isFetching: isSearchingProjects } = useProjectSearch(projectSearchTerm) // Deshabilitado: búsqueda local
  const { data: apiFileResults, isFetching: isSearchingFiles, error: fileSearchError } = useFileSearch(documentSearchTerm)
  const { data: apiFolderResults } = useFolderSearch(documentSearchTerm)

  // Lógica de filtrado usando useMemo para optimizar performance (solo búsqueda local)
  const filteredProjects = useMemo(() => {
    let filtered = projects

    // Filtrar por término de búsqueda de proyectos (búsqueda local)
    filtered = searchInProjects(filtered, projectSearchTerm)

    // Filtrar por etapas seleccionadas
    filtered = filterByStages(filtered, selectedStages)

    // Filtrar por tipos de obra seleccionados
    filtered = filterByTiposObra(filtered, selectedTiposObra)

    return filtered
  }, [projects, projectSearchTerm, selectedStages, selectedTiposObra])

  // Búsqueda de documentos usando solo la API
  const searchedDocuments = useMemo(() => {
    if (!documentSearchTerm || !apiFileResults || !apiFileResults.archivos) {
      return []
    }

    return apiFileResults.archivos.map(file => {
      // Extraer información del proyecto desde s3_path
      const pathParts = file.s3_path.split('/')
      const projectNameFromPath = pathParts.length > 1 ? pathParts[1] : null

      // Determinar el nombre del proyecto
      let projectName = 'Sin proyecto'
      let projectId = '0'

      if (file.proyecto_id !== null) {
        // Buscar el nombre real del proyecto en la lista de proyectos
        const foundProject = projects.find(p => p.id === file.proyecto_id!.toString())
        projectName = foundProject ? foundProject.name : 'Proyecto'
        projectId = file.proyecto_id!.toString()
      } else if (projectNameFromPath) {
        // Si no hay proyecto_id pero hay información en el path, buscar el proyecto por nombre
        const normalizedProjectName = projectNameFromPath.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())

        const foundProject = projects.find(p =>
          p.name.toLowerCase().includes(projectNameFromPath.toLowerCase()) ||
          p.name.toLowerCase().includes(projectNameFromPath.replace(/_/g, ' ').toLowerCase())
        )

        if (foundProject) {
          projectName = foundProject.name
          projectId = foundProject.id
        } else {
          projectName = normalizedProjectName
          projectId = '0' // No encontramos el proyecto, pero al menos mostramos el nombre
        }
      }

      return {
        id: file.id,
        name: file.nombre_archivo,
        uploadedAt: new Date(file.fecha_creacion),
        folderPath: file.s3_path.split('/').slice(-2).join(' - '), // Extraer carpeta del s3_path
        projectName,
        projectId,
        tipo: file.tipo_mime,
        tamaño: file.tamano,
        extension: file.extension,
        carpetaId: file.carpeta_id // Agregar el ID de la carpeta para navegación
      }
    })
  }, [documentSearchTerm, apiFileResults])

  // Función para limpiar todos los filtros
  const clearAllFilters = () => {
    setProjectSearchTerm("")
    setDocumentSearchTerm("")
    setSelectedStages([])
    setSelectedTiposObra([])
  }

  if (projects.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <FolderOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No hay proyectos</h3>
          <p className="text-muted-foreground mb-4">
            Crea tu primer proyecto para comenzar a organizar tus documentos
          </p>
          <Button onClick={onCreateProject}>
            <Plus className="w-4 h-4 mr-2" />
            Crear primer proyecto
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <SearchHeader
        projectSearchTerm={projectSearchTerm}
        onProjectSearchChange={setProjectSearchTerm}
        documentSearchTerm={documentSearchTerm}
        onDocumentSearchChange={setDocumentSearchTerm}
        selectedStages={selectedStages}
        onStageFilterChange={setSelectedStages}
        selectedTiposObra={selectedTiposObra}
        onTipoObraFilterChange={setSelectedTiposObra}
        projectResults={filteredProjects.length}
        documentResults={isSearchingFiles ? undefined : (apiFileResults?.archivos?.length || 0)}
        context="projects"
        onClearFilters={clearAllFilters}
        isLoadingProjects={false} // Búsqueda local, no hay loading
        isLoadingDocuments={isSearchingFiles}
      />

      {/* Mostrar error en búsqueda de documentos */}
      {documentSearchTerm && fileSearchError && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-lg text-red-800">Error en la búsqueda</CardTitle>
            <CardDescription className="text-red-600">
              No se pudo completar la búsqueda de documentos. Inténtalo de nuevo más tarde.
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* Mostrar resultados de búsqueda de documentos */}
      {documentSearchTerm && !fileSearchError && searchedDocuments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Documentos encontrados</CardTitle>
            <CardDescription>
              {searchedDocuments.length} documentos coinciden con "{documentSearchTerm}"
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {searchedDocuments.map((doc) => (
                <div
                  key={`${doc.projectId}-${doc.id}`}
                  className="flex items-center justify-between p-2 hover:bg-muted rounded cursor-pointer"
                  onClick={() => {
                    console.log('Documento clickeado:', doc)
                    console.log('Carpeta ID:', doc.carpetaId)
                    console.log('Project ID:', doc.projectId)

                    // Buscar y seleccionar el proyecto que contiene este documento
                    const project = projects.find(p => p.id === doc.projectId)
                    console.log('Proyecto encontrado:', project)

                    if (project) {
                      // Navegar al proyecto y específicamente a la carpeta donde está el documento
                      console.log('Navegando a proyecto con carpeta:', doc.carpetaId)
                      onSelectProject(project, doc.carpetaId)
                    } else {
                      console.log('No se encontró el proyecto con ID:', doc.projectId)
                    }
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <FileText className="w-4 h-4 text-blue-500" />
                    <div>
                      <div className="font-medium">{doc.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {doc.projectName} - {doc.folderPath}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {doc.uploadedAt.toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mostrar mensaje cuando no hay resultados de documentos */}
      {documentSearchTerm && !fileSearchError && !isSearchingFiles && searchedDocuments.length === 0 && (
        <Card className="text-center py-8">
          <CardContent>
            <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
            <h3 className="text-lg font-semibold mb-2">No se encontraron documentos</h3>
            <p className="text-muted-foreground mb-4">
              No hay documentos que coincidan con "{documentSearchTerm}"
            </p>
            <Button variant="secundario" onClick={() => setDocumentSearchTerm("")}>
              Limpiar búsqueda
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Mostrar resultados de búsqueda de carpetas */}
      {documentSearchTerm && apiFolderResults && apiFolderResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Carpetas encontradas</CardTitle>
            <CardDescription>
              {apiFolderResults.length} carpetas coinciden con "{documentSearchTerm}"
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {apiFolderResults.map((folder) => (
                <div
                  key={`${folder.proyecto_id}-${folder.id}`}
                  className="flex items-center justify-between p-2 hover:bg-muted rounded cursor-pointer"
                  onClick={() => {
                    // Buscar y seleccionar el proyecto que contiene esta carpeta
                    const project = projects.find(p => p.id === folder.proyecto_id.toString())
                    if (project) {
                      // Navegar al proyecto y específicamente a la carpeta seleccionada
                      onSelectProject(project, folder.id)
                    }
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <FolderOpen className="w-4 h-4 text-green-500" />
                    <div>
                      <div className="font-medium">{folder.nombre}</div>
                      <div className="text-xs text-muted-foreground">
                        {folder.proyecto_nombre} - {folder.ruta}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mostrar mensaje si no hay resultados */}
      {(projectSearchTerm || selectedStages.length > 0 || selectedTiposObra.length > 0) && filteredProjects.length === 0 && (
        <Card className="text-center py-8">
          <CardContent>
            <FolderOpen className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
            <h3 className="text-lg font-semibold mb-2">No se encontraron resultados</h3>
            <p className="text-muted-foreground mb-4">
              Intenta cambiar los términos de búsqueda o filtros seleccionados
            </p>
            <Button variant="secundario" onClick={clearAllFilters}>
              Limpiar filtros
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Lista de proyectos filtrados */}
      {filteredProjects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onSelect={(project) => onSelectProject(project)}
              totalAlerts={0} // This will be calculated in ProjectCard
            />
          ))}
        </div>
      )}

      {/* Información adicional sobre filtros activos */}
      {(projectSearchTerm || documentSearchTerm || selectedStages.length > 0) && (
        <div className="text-sm text-muted-foreground text-center pt-4 border-t">
          {filteredProjects.length > 0 && (
            <p>
              Mostrando {filteredProjects.length} de {projects.length} proyectos
              {selectedStages.length > 0 && ` • Filtrado por: ${selectedStages.join(", ")}`}
            </p>
          )}
        </div>
      )}
    </div>
  )
} 