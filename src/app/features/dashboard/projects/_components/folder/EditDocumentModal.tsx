import { useState, useEffect } from "react";
import { Button } from "@/shared/components/design-system/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { documentosService } from "@/lib/api/services/documentos.service";
import type { TipoDocumento } from "@/shared/types/document-types";
import type { DocumentoItem } from "./folder.types";
import { toast } from "sonner";

interface EditDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  documento: DocumentoItem | null;
  onDocumentUpdated: () => void;
}

export default function EditDocumentModal({
  isOpen,
  onClose,
  documento,
  onDocumentUpdated,
}: EditDocumentModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [tiposDocumento, setTiposDocumento] = useState<TipoDocumento[]>([]);
  const [selectedTipoDocumentoId, setSelectedTipoDocumentoId] = useState<number | null>(null);

  // Formulario
  const [formData, setFormData] = useState({
    nombre_archivo: "",
  });

  // Cargar tipos de documento al abrir el modal
  useEffect(() => {
    if (isOpen) {
      loadTiposDocumento();
    }
  }, [isOpen]);

  // Cargar datos del documento cuando cambie
  useEffect(() => {
    if (documento && isOpen) {
      setFormData({
        nombre_archivo: documento.nombre_archivo || "",
      });
      setSelectedTipoDocumentoId(documento.tipo_documento_id || null);
    }
  }, [documento, isOpen]);

  const loadTiposDocumento = async () => {
    try {
      const response = await documentosService.getTiposDocumento();
      if (response.success) {
        setTiposDocumento(response.tipos_documentos || []);
      }
    } catch (error) {
      console.error("Error al cargar tipos de documento:", error);
      toast.error("Error al cargar los tipos de documento");
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!documento || !selectedTipoDocumentoId) {
      toast.error("Faltan datos requeridos");
      return;
    }

    setIsLoading(true);
    try {
      const updateData = {
        nombre_archivo: formData.nombre_archivo,
        tipo_documento_id: selectedTipoDocumentoId,
      };

      const response = await documentosService.updateDocumento(documento.id, updateData);

      if (response.success) {
        toast.success("Documento actualizado correctamente");
        onDocumentUpdated();
        onClose();
      } else {
        toast.error(response.message || "Error al actualizar el documento");
      }
    } catch (error) {
      console.error("Error al actualizar documento:", error);
      toast.error("Error al actualizar el documento");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Documento</DialogTitle>
          <DialogDescription>
            Modifica la información del documento "{documento?.nombre_archivo}"
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {/* Nombre del archivo */}
            <div>
              <Label htmlFor="nombre_archivo" className="text-sm font-medium">
                Nombre del archivo *
              </Label>
              <Input
                id="nombre_archivo"
                value={formData.nombre_archivo}
                onChange={(e) => handleInputChange("nombre_archivo", e.target.value)}
                placeholder="Ingresa el nombre del archivo"
                className="mt-1"
                required
              />
            </div>

            {/* Tipo de documento */}
            <div>
              <Label className="text-sm font-medium">Tipo de documento *</Label>
              <Select
                value={selectedTipoDocumentoId?.toString() || ""}
                onValueChange={(value) => setSelectedTipoDocumentoId(value ? parseInt(value) : null)}
              >
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder="Seleccionar tipo de documento..." />
                </SelectTrigger>
                <SelectContent>
                  {tiposDocumento?.map((tipo) => (
                    <SelectItem key={tipo.id} value={tipo.id.toString()}>
                      <div className="flex flex-col gap-1">
                        <span className="font-medium">{tipo.nombre}</span>
                        <span className="text-xs text-muted-foreground">{tipo.descripcion}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="secundario"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primario"
              disabled={isLoading || !formData.nombre_archivo || !selectedTipoDocumentoId}
            >
              {isLoading ? "Actualizando..." : "Actualizar Documento"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 