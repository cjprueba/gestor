import React, { useMemo, useState } from "react";
import { Button } from "@/shared/components/design-system/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Badge } from "@/shared/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { X } from "lucide-react";
import type { ProyectoListItem } from "./project.types";
import { useCreateParentProject, useProyectos } from "@/lib/api/hooks/useProjects";
import { CreateProjectDialog } from "./CreateProjectDialog";

interface CreateParentProjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateParentProjectDialog: React.FC<CreateParentProjectDialogProps> = ({ isOpen, onClose }) => {
  const { data: projectsResponse } = useProyectos();
  const allProjects: ProyectoListItem[] = projectsResponse?.data || [];

  const [nombre, setNombre] = useState("");
  const [selectedChildIds, setSelectedChildIds] = useState<number[]>([]);
  const [isCreateChildOpen, setIsCreateChildOpen] = useState(false);

  const createParentMutation = useCreateParentProject();

  const availableProjects = useMemo(
    () => allProjects.filter((p) => !selectedChildIds.includes(p.id)),
    [allProjects, selectedChildIds]
  );

  const handleAddChild = (idString: string) => {
    const id = Number(idString);
    if (!Number.isNaN(id) && !selectedChildIds.includes(id)) {
      setSelectedChildIds((prev) => [...prev, id]);
    }
  };

  const handleRemoveChild = (id: number) => {
    setSelectedChildIds((prev) => prev.filter((x) => x !== id));
  };

  const resetAndClose = () => {
    setNombre("");
    setSelectedChildIds([]);
    onClose();
  };

  const handleSubmit = async () => {
    if (!nombre.trim()) return;

    await createParentMutation.mutateAsync({
      nombre,
      division_id: 1,
      departamento_id: 1,
      unidad_id: 1,
      creado_por: 1,
      proyectos_hijos_ids: selectedChildIds,
    });
    resetAndClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => (!open ? resetAndClose() : undefined)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Crear proyecto padre</DialogTitle>
            <DialogDescription>
              Agrupa proyectos existentes como hijos de un proyecto padre.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nombre del proyecto padre</Label>
              <Input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej. Programa de obras 2025" />
            </div>

            <div className="space-y-2 mt-6">
              <Label>Agregar proyectos hijos</Label>
              <Select onValueChange={handleAddChild}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona un proyecto para agregar" />
                </SelectTrigger>
                <SelectContent>
                  {availableProjects.length === 0 ? (
                    <SelectItem value="" disabled>
                      No hay proyectos disponibles
                    </SelectItem>
                  ) : (
                    availableProjects.map((p) => (
                      <SelectItem key={p.id} value={String(p.id)}>
                        {p.nombre}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>

              <div className="flex flex-col gap-2 text-sm text-muted-foreground items-start mt-4">
                <span className="text-xs">¿No encuentras el proyecto en la lista? Puedes crearlo.</span>
                <Button size="sm" className="text-xs w-fit" variant="secundario" onClick={() => setIsCreateChildOpen(true)}>Nuevo proyecto</Button>
              </div>
              {selectedChildIds.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedChildIds.map((id) => {
                    const proj = allProjects.find((p) => p.id === id);
                    const label = proj ? proj.nombre : `ID ${id}`;
                    return (
                      <Badge key={id} variant="secondary" className="text-xs">
                        {label}
                        <button type="button" className="ml-1 rounded-full hover:bg-muted" onClick={() => handleRemoveChild(id)}>
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="secundario" onClick={resetAndClose}>Cancelar</Button>
            <Button onClick={handleSubmit} disabled={!nombre.trim() || createParentMutation.isPending}>
              {createParentMutation.isPending ? "Creando..." : "Crear"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reutilizamos el modal multi-step existente para creación de proyectos */}
      <CreateProjectDialog isOpen={isCreateChildOpen} onClose={() => setIsCreateChildOpen(false)} />
    </>
  );
};

export default CreateParentProjectDialog;


