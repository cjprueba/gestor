import { Button } from "@/shared/components/design-system/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Badge } from "@/shared/components/ui/badge";
import { FolderOpen, Plus, ArrowLeft, X } from "lucide-react";
import { useMemo, useState } from "react";
import type { ProyectoListItem } from "../project/project.types";
import { SearchHeader } from "../search-header";
import { useProyectos, useAsignarProyectosHijos, useProyectosHijos, useRemoverProyectosHijos } from "@/lib/api/hooks/useProjects";
import { useQueryClient } from "@tanstack/react-query";
import { ProjectCard } from "../project/ProjectCard";

interface ParentProjectViewProps {
  project: ProyectoListItem;
  onBack: () => void;
  onOpenChild: (childProject: ProyectoListItem) => void;
}

export default function ParentProjectView({ project, onBack, onOpenChild }: ParentProjectViewProps) {
  const queryClient = useQueryClient();
  const [projectSearchTerm, setProjectSearchTerm] = useState("");
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [isRemoveOpen, setIsRemoveOpen] = useState(false);
  const [selectedToAssign, setSelectedToAssign] = useState<number[]>([]);
  const [selectedToRemove, setSelectedToRemove] = useState<number[]>([]);
  const { data: projectsResponse } = useProyectos();
  const allProjects: ProyectoListItem[] = projectsResponse?.data || [];

  const asignarMutation = useAsignarProyectosHijos();
  const removerMutation = useRemoverProyectosHijos();
  const { data: hijosResponse } = useProyectosHijos(project.id);
  const hijosFromApi = hijosResponse?.data?.proyectos_hijos || [];

  // Derivar los hijos directamente desde GET /proyectos/{id}/hijos mapeando al shape usado por ProjectCard
  const childProjects: ProyectoListItem[] = useMemo(() => {
    return (hijosFromApi as any[]).map((h) => {
      const etapaTipo = h?.etapas_registro?.[0]?.etapa_tipo ?? undefined;
      return {
        id: h.id,
        nombre: h.nombre,
        created_at: h.created_at,
        carpeta_raiz_id: h.carpeta_raiz_id,
        es_proyecto_padre: h.es_proyecto_padre ?? false,
        proyectos_hijos_count: undefined,
        proyectos_hijos: undefined,
        etapas_registro: [
          {
            id: 0,
            etapa_tipo: etapaTipo,
            etapas_regiones: [],
          },
        ],
        creador: h.creador,
      } as ProyectoListItem;
    });
  }, [hijosFromApi]);

  const filteredChildren = useMemo(() => {
    const term = projectSearchTerm.trim().toLowerCase();
    if (!term) return childProjects;
    return childProjects.filter((p) => p.nombre.toLowerCase().includes(term));
  }, [childProjects, projectSearchTerm]);
  const selectedToAssignProjects = useMemo(
    () => allProjects.filter((p) => selectedToAssign.includes(p.id)),
    [selectedToAssign, allProjects]
  );
  const selectedToRemoveProjects = useMemo(
    () => hijosFromApi.filter((p) => selectedToRemove.includes(p.id)),
    [selectedToRemove, hijosFromApi]
  );

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Button variant="secundario" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{project.nombre}</h1>
            <p className="text-sm text-muted-foreground">Proyecto padre</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsAssignOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Agregar proyecto hijo
          </Button>
          <Button variant="secundario" onClick={() => setIsRemoveOpen(true)}>
            Remover proyectos hijos
          </Button>
        </div>
      </div>

      <SearchHeader
        projectSearchTerm={projectSearchTerm}
        onProjectSearchChange={setProjectSearchTerm}
        documentSearchTerm={""}
        onDocumentSearchChange={() => { }}
        selectedStages={[]}
        onStageFilterChange={() => { }}
        selectedTiposObra={[]}
        onTipoObraFilterChange={() => { }}
        projectResults={filteredChildren.length}
        documentResults={0}
        context="projects"
        onClearFilters={() => setProjectSearchTerm("")}
        isLoadingProjects={false}
        isLoadingDocuments={false}
      />

      {filteredChildren.length === 0 ? (
        <Card className="text-center py-12 mt-6">
          <CardContent>
            <FolderOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Sin proyectos hijos</h3>
            <p className="text-muted-foreground mb-4">Agrega proyectos a este proyecto padre para gestionarlos en conjunto</p>
            <Button onClick={() => setIsAssignOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Agregar proyecto hijo
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {filteredChildren.map((child) => (
            <ProjectCard
              key={child.id}
              project={child}
              onSelect={(p) => onOpenChild(p)}
              totalAlerts={0}
            />
          ))}
        </div>
      )}

      {/* Dialog: Asignar proyectos hijos */}
      <Dialog open={isAssignOpen} onOpenChange={setIsAssignOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Asignar proyectos hijos</DialogTitle>
            <DialogDescription>Selecciona uno o más proyectos para asignar como hijos.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Select onValueChange={(value) => {
              const id = parseInt(value);
              if (!Number.isNaN(id) && !selectedToAssign.includes(id)) {
                setSelectedToAssign((prev) => [...prev, id]);
              }
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Agregar proyecto..." />
              </SelectTrigger>
              <SelectContent className="max-h-72">
                {allProjects
                  .filter((p) => p.id !== project.id)
                  .map((p) => (
                    <SelectItem key={p.id} value={String(p.id)}>
                      {p.nombre}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            {selectedToAssign.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedToAssignProjects.map((p) => (
                  <Badge key={p.id} variant="secondary" className="text-xs">
                    {p.nombre}
                    <button
                      type="button"
                      className="ml-1 rounded-full hover:bg-muted"
                      onClick={() => setSelectedToAssign((prev) => prev.filter((id) => id !== p.id))}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="secundario" onClick={() => { setIsAssignOpen(false); setSelectedToAssign([]); }}>Cancelar</Button>
            <Button onClick={async () => {
              if (selectedToAssign.length === 0) return;
              await asignarMutation.mutateAsync({
                parentId: project.id,
                data: { proyectos_hijos_ids: selectedToAssign, usuario_operacion: 1 },
              });
              // Refrescar vistas relacionadas
              queryClient.invalidateQueries({ queryKey: ["carpeta-contenido", project.carpeta_raiz_id] });
              queryClient.invalidateQueries({ queryKey: ["proyectos-hijos", project.id] });
              setIsAssignOpen(false);
              setSelectedToAssign([]);
            }} disabled={asignarMutation.isPending}>
              {asignarMutation.isPending ? "Asignando..." : "Asignar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog: Remover proyectos hijos */}
      <Dialog open={isRemoveOpen} onOpenChange={setIsRemoveOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Remover proyectos hijos</DialogTitle>
            <DialogDescription>Selecciona los proyectos que deseas remover.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Select onValueChange={(value) => {
              const id = parseInt(value);
              if (!Number.isNaN(id) && !selectedToRemove.includes(id)) {
                setSelectedToRemove((prev) => [...prev, id]);
              }
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar proyecto hijo..." />
              </SelectTrigger>
              <SelectContent className="max-h-72">
                {hijosFromApi.map((hijo) => (
                  <SelectItem key={hijo.id} value={String(hijo.id)}>
                    {hijo.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedToRemove.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedToRemoveProjects.map((p) => (
                  <Badge key={p.id} variant="secondary" className="text-xs">
                    {p.nombre}
                    <button
                      type="button"
                      className="ml-1 rounded-full hover:bg-muted"
                      onClick={() => setSelectedToRemove((prev) => prev.filter((id) => id !== p.id))}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="secundario" onClick={() => { setIsRemoveOpen(false); setSelectedToRemove([]); }}>Cancelar</Button>
            <Button onClick={async () => {
              if (selectedToRemove.length === 0) return;
              await removerMutation.mutateAsync({
                parentId: project.id,
                data: { proyectos_hijos_ids: selectedToRemove, usuario_operacion: 1 },
              });
              // Refrescar vistas relacionadas
              queryClient.invalidateQueries({ queryKey: ["carpeta-contenido", project.carpeta_raiz_id] });
              queryClient.invalidateQueries({ queryKey: ["proyectos-hijos", project.id] });
              setIsRemoveOpen(false);
              setSelectedToRemove([]);
            }} disabled={removerMutation.isPending}>
              {removerMutation.isPending ? "Removiendo..." : "Remover"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}


