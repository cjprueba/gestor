import { useState } from "react"
import { Button } from "@/shared/components/design-system/button"
import { Plus } from "lucide-react"
import { CreateProjectDialog } from "./_components/CreateProjectDialog"
import ProjectView from "./_components/project-view"
import { ProjectList } from "./_components/ProjectList"
import type { Project } from "./_components/types"
import { useProyectosCompletos } from "@/lib/api/hooks/useProjects"
import { transformApiProjectToComponent } from "@/shared/utils/project-utils"

export default function HomePage() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  // Obtener datos de la API
  const {
    proyectosLista,
    proyectosDetalles,
    isLoading,
    error
  } = useProyectosCompletos()

  // Transformar los datos de la API al formato esperado por los componentes
  const projects: Project[] = proyectosLista.map(proyectoLista => {
    const proyectoDetalle = proyectosDetalles.find(p => p.id === proyectoLista.id)?.data?.data;
    return transformApiProjectToComponent(proyectoLista, proyectoDetalle);
  });

  const handleCreateProject = (newProject: Project) => {
    // Por ahora solo actualizamos el estado local
    // En el futuro, esto debería invalidar las queries para refrescar los datos
    console.log("Proyecto creado:", newProject);
  }

  const handleUpdateProject = (updatedProject: Project) => {
    // Por ahora solo actualizamos el estado local
    // En el futuro, esto debería invalidar las queries para refrescar los datos
    console.log("Proyecto actualizado:", updatedProject);
    setSelectedProject(updatedProject)
  }

  // Mostrar loading mientras se cargan los datos
  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Gestión de proyectos</h1>
              <p className="text-muted-foreground mt-2">
                Administra tus proyectos con estructura de carpetas automática y alertas inteligentes
              </p>
            </div>
            <Button disabled>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo proyecto
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Cargando proyectos...</p>
          </div>
        </div>
      </div>
    )
  }

  // Mostrar error si hay algún problema
  if (error) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Gestión de proyectos</h1>
              <p className="text-muted-foreground mt-2">
                Administra tus proyectos con estructura de carpetas automática y alertas inteligentes
              </p>
            </div>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo proyecto
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-destructive mb-4">Error al cargar los proyectos</p>
            <Button variant="secundario" onClick={() => window.location.reload()}>
              Reintentar
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (selectedProject) {
    return (
      <ProjectView
        project={selectedProject}
        onBack={() => setSelectedProject(null)}
        onUpdateProject={handleUpdateProject}
      />
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Gestión de proyectos</h1>
            <p className="text-muted-foreground mt-2">
              Administra tus proyectos con estructura de carpetas automática y alertas inteligentes
            </p>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nuevo proyecto
          </Button>
        </div>
      </div>

      <ProjectList
        projects={projects}
        onSelectProject={setSelectedProject}
        onCreateProject={() => setIsCreateDialogOpen(true)}
      />

      <CreateProjectDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onCreateProject={handleCreateProject}
      />
    </div>
  )
}
