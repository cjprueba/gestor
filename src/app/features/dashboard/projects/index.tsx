import { useState } from "react"
import { Button } from "@/shared/components/design-system/button"
import { Plus } from "lucide-react"
import { CreateProjectDialog } from "./_components/CreateProjectDialog"
import ProjectView from "./_components/project-view"
import { ProjectList } from "./_components/ProjectList"
import type { Project } from "./_components/types"
import { MOCK_PROJECTS } from "@/shared/data"

export default function HomePage() {
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS as Project[])
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const handleCreateProject = (newProject: Project) => {
    setProjects([...projects, newProject])
  }

  const handleUpdateProject = (updatedProject: Project) => {
    setProjects(projects.map((p) => (p.id === updatedProject.id ? updatedProject : p)))
    setSelectedProject(updatedProject)
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
