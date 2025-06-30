import React, { useState, useMemo } from "react"
import { Button } from "@/shared/components/design-system/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { FileText, FolderOpen, Plus } from "lucide-react"
import { ProjectCard } from "./ProjectCard"
import type { ProjectListProps, FolderStructure, Document } from "./types"
import { SearchHeader } from "./search-header"

// Función helper para obtener todos los documentos de un proyecto
const getAllDocumentsFromProject = (structure: FolderStructure): Array<Document & { folderPath: string }> => {
  const documents: Array<Document & { folderPath: string }> = []

  const traverse = (folder: FolderStructure, path: string = "") => {
    const currentPath = path ? `${path} - ${folder.name}` : folder.name

    // Agregar documentos de la carpeta actual
    folder.documents.forEach(doc => {
      documents.push({
        ...doc,
        folderPath: currentPath
      })
    })

    // Recursivamente obtener documentos de subcarpetas
    folder.subfolders.forEach(subfolder => {
      traverse(subfolder, currentPath)
    })
  }

  traverse(structure)
  return documents
}

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
const searchDocumentsInProjects = (projects: any[], searchTerm: string) => {
  if (!searchTerm.trim()) return []

  const term = searchTerm.toLowerCase()
  const allDocuments: Array<Document & { folderPath: string; projectName: string; projectId: string }> = []

  projects.forEach(project => {
    const projectDocs = getAllDocumentsFromProject(project.structure)
    projectDocs.forEach(doc => {
      if (doc.name.toLowerCase().includes(term)) {
        allDocuments.push({
          ...doc,
          projectName: project.name,
          projectId: project.id
        })
      }
    })
  })

  return allDocuments
}

// Función helper para filtrar por etapas
const filterByStages = (projects: any[], selectedStages: string[]) => {
  if (selectedStages.length === 0) return projects
  return projects.filter(project => selectedStages.includes(project.etapa))
}

export const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  onSelectProject,
  onCreateProject,
}) => {
  const [projectSearchTerm, setProjectSearchTerm] = useState("")
  const [documentSearchTerm, setDocumentSearchTerm] = useState("")
  const [selectedStages, setSelectedStages] = useState<string[]>([])

  // Lógica de filtrado usando useMemo para optimizar performance
  const filteredProjects = useMemo(() => {
    let filtered = projects

    // Filtrar por término de búsqueda de proyectos
    filtered = searchInProjects(filtered, projectSearchTerm)

    // Filtrar por etapas seleccionadas
    filtered = filterByStages(filtered, selectedStages)

    return filtered
  }, [projects, projectSearchTerm, selectedStages])

  // Búsqueda de documentos en todos los proyectos
  const searchedDocuments = useMemo(() => {
    return searchDocumentsInProjects(projects, documentSearchTerm)
  }, [projects, documentSearchTerm])

  // Función para limpiar todos los filtros
  const clearAllFilters = () => {
    setProjectSearchTerm("")
    setDocumentSearchTerm("")
    setSelectedStages([])
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
        projectResults={filteredProjects.length}
        documentResults={searchedDocuments.length}
        context="projects"
        onClearFilters={clearAllFilters}
      />

      {/* Mostrar resultados de búsqueda de documentos */}
      {documentSearchTerm && searchedDocuments.length > 0 && (
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
                    // Buscar y seleccionar el proyecto que contiene este documento
                    const project = projects.find(p => p.id === doc.projectId)
                    if (project) {
                      onSelectProject(project)
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

      {/* Mostrar mensaje si no hay resultados */}
      {(projectSearchTerm || selectedStages.length > 0) && filteredProjects.length === 0 && (
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
              onSelect={onSelectProject}
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