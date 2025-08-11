import { useState } from "react"
import { Button } from "@/shared/components/design-system/button"
import { Plus } from "lucide-react"
import { CreateProjectDialog } from "./_components/project/CreateProjectDialog"
import CreateParentProjectDialog from "./_components/project/CreateParentProjectDialog"
import { ProjectList } from "./_components/project/ProjectList"
import type { ProyectoListItem } from "./_components/project/project.types"
import { useProyectos } from "@/lib/api/hooks/useProjects"
import FolderList from "./_components/folder/FolderList"
import ParentProjectView from "./_components/folder/ParentProjectView"

export default function HomePage() {
  const [selectedProject, setSelectedProject] = useState<ProyectoListItem | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isCreateParentDialogOpen, setIsCreateParentDialogOpen] = useState(false)

  // Obtener datos de la API directamente
  const { data: projectsResponse, isLoading, error } = useProyectos()
  const projects = projectsResponse?.data || []

  const handleUpdateProject = (updatedProject: ProyectoListItem) => {
    // Por ahora solo actualizamos el estado local
    // En el futuro, esto debería invalidar las queries para refrescar los datos
    console.log("Proyecto actualizado:", updatedProject);
    setSelectedProject(updatedProject)
  }

  const handleSelectProject = (project: ProyectoListItem, targetFolderId?: number) => {
    // Si hay un targetFolderId, lo almacenamos en el proyecto para que ProjectView lo use
    if (targetFolderId) {
      const projectWithTargetFolder = {
        ...project,
        targetFolderId // Agregar el ID de la carpeta objetivo
      }
      setSelectedProject(projectWithTargetFolder)
    } else {
      setSelectedProject(project)
    }
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
            <div className="flex gap-2">
              <Button onClick={() => setIsCreateParentDialogOpen(true)} variant="secundario">
                <Plus className="w-4 h-4 mr-2" />
                Proyecto padre
              </Button>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Nuevo proyecto
              </Button>
            </div>
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
    if (selectedProject.es_proyecto_padre) {
      return (
        <ParentProjectView
          project={selectedProject}
          onBack={() => setSelectedProject(null)}
          onOpenChild={(child) => {
            const found = projects.find((p) => p.id === child.id)
            setSelectedProject(found ?? child)
          }}
        />
      )
    }

    return (
      <FolderList
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
          <div className="flex gap-2">
            <Button onClick={() => setIsCreateParentDialogOpen(true)} variant="secundario">
              <Plus className="w-4 h-4 mr-2" />
              Proyecto padre
            </Button>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo proyecto
            </Button>
          </div>
        </div>
      </div>

      <ProjectList
        projects={projects}
        onSelectProject={handleSelectProject}
        onCreateProject={() => setIsCreateDialogOpen(true)}
      />

      <CreateProjectDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
      />
      <CreateParentProjectDialog
        isOpen={isCreateParentDialogOpen}
        onClose={() => setIsCreateParentDialogOpen(false)}
      />
    </div>
  )
}
