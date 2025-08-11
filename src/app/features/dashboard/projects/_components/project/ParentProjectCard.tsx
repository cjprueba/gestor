import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Calendar, FolderOpen } from "lucide-react";
import React from "react";
import type { ProyectoListItem } from "./project.types";
import { useCarpetaContenido } from "@/lib/api/hooks/useProjects";

interface ParentProjectCardProps {
  project: ProyectoListItem;
  onSelect: (project: ProyectoListItem) => void;
}

export const ParentProjectCard: React.FC<ParentProjectCardProps> = ({ project, onSelect }) => {
  // Usar el mismo endpoint y lógica que ProjectCard para contar elementos de primer nivel
  const { data: carpetaData } = useCarpetaContenido(project.carpeta_raiz_id);
  const childrenCount = carpetaData?.contenido?.carpetas?.length || 0;

  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-all relative border-1"
      onClick={() => onSelect(project)}
    >
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1 pr-2">
            <div className="flex gap-1 flex-col">
              <h3 className="text-lg font-semibold">{project.nombre}</h3>
              <Badge variant="secondary" className="text-xs">Proyecto padre</Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <FolderOpen className="w-4 h-4 mr-2" />
            {childrenCount} proyecto{childrenCount > 1 ? "s" : ""}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="w-4 h-4 mr-2" />
            Creado {new Date(project.created_at).toLocaleDateString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ParentProjectCard;


