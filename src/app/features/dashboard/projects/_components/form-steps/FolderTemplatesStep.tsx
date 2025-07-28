import React, { useState, useEffect } from "react"
import { Button } from "@/shared/components/design-system/button"
import { Badge } from "@/shared/components/ui/badge"
import { Checkbox } from "@/shared/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/components/ui/dialog"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Plus, Folder, Check, X, Pencil, Trash } from "lucide-react"
import { useFormContext } from 'react-hook-form'
import type { CreateProjectFormData } from "../project/project.validations"

interface Subcarpeta {
  id: string;
  nombre: string;
  parentId: string;
  subcarpetas?: Subcarpeta[];
}

interface CarpetaPersonalizada {
  id: string;
  nombre: string;
  subcarpetas: Subcarpeta[];
}

interface FolderTemplatesStepProps {
  carpetasIniciales: Array<{ nombre: string; tipo: string }>;
}

interface FolderConfigCardProps {
  folder: CarpetaPersonalizada;
  isSelected: boolean;
  onToggle: () => void;
  onSubfolderAdd: (subfolderName: string, parentId?: string) => void;
  onSubfolderEdit: (subfolderId: string, newName: string) => void;
  onSubfolderDelete: (subfolderId: string) => void;
  onFolderNameEdit: (folderId: string, newName: string) => void;
}

const FolderConfigCard: React.FC<FolderConfigCardProps> = ({
  folder,
  isSelected,
  onToggle,
  onSubfolderAdd,
  onSubfolderEdit,
  onSubfolderDelete,
  onFolderNameEdit,
}) => {
  const [isEditingFolderName, setIsEditingFolderName] = useState(false)
  const [editedFolderName, setEditedFolderName] = useState(folder.nombre)
  const [showAddSubfolder, setShowAddSubfolder] = useState<string | null>(null)
  const [newSubfolderName, setNewSubfolderName] = useState("")
  const [editingSubfolder, setEditingSubfolder] = useState<string | null>(null)
  const [editedSubfolderName, setEditedSubfolderName] = useState("")

  const handleFolderNameDoubleClick = () => {
    setIsEditingFolderName(true)
    setEditedFolderName(folder.nombre)
  }

  const saveFolderName = () => {
    if (editedFolderName.trim() && editedFolderName !== folder.nombre) {
      onFolderNameEdit(folder.id, editedFolderName.trim())
    }
    setIsEditingFolderName(false)
  }

  const addSubfolder = (parentId: string) => {
    if (newSubfolderName.trim()) {
      onSubfolderAdd(newSubfolderName.trim(), parentId)
      setNewSubfolderName("")
      setShowAddSubfolder(null)
    }
  }

  const saveSubfolderEdit = () => {
    if (editingSubfolder && editedSubfolderName.trim()) {
      onSubfolderEdit(editingSubfolder, editedSubfolderName.trim())
    }
    setEditingSubfolder(null)
    setEditedSubfolderName("")
  }

  const renderSubfolders = (subfolders: Subcarpeta[], depth = 0) => {
    if (depth >= 4) return null

    return subfolders.map((subfolder) => (
      <div key={subfolder.id} className="border-l border-gray-200 pl-3 mt-2 ml-4 ">
        <div className="flex items-center justify-between py-1 bg-white rounded border border-gray-200 px-2">
          <div className="flex items-center space-x-2 flex-1">
            {editingSubfolder === subfolder.id ? (
              <Input
                value={editedSubfolderName}
                onChange={(e) => setEditedSubfolderName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") saveSubfolderEdit()
                  if (e.key === "Escape") {
                    setEditingSubfolder(null)
                    setEditedSubfolderName("")
                  }
                }}
                className="h-6"
                autoFocus
              />
            ) : (
              <span
                className="text-sm cursor-pointer hover:bg-gray-100 px-1 rounded"
                onDoubleClick={() => {
                  setEditingSubfolder(subfolder.id)
                  setEditedSubfolderName(subfolder.nombre)
                }}
              >
                {subfolder.nombre}
              </span>
            )}
          </div>

          <div className="flex items-center">
            {editingSubfolder === subfolder.id ? (
              <>
                <Button variant="ghost" size="sm" onClick={saveSubfolderEdit} className=" text-green-600">
                  <Check className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setEditingSubfolder(null)
                    setEditedSubfolderName("")
                  }}
                  className=" text-red-600"
                >
                  <X className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <>
                {depth < 3 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAddSubfolder(subfolder.id)}
                    title="Agregar subcarpeta"
                  >
                    <Plus className="w-4 h-4 " />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setEditingSubfolder(subfolder.id)
                    setEditedSubfolderName(subfolder.nombre)
                  }}
                  title="Editar nombre"
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSubfolderDelete(subfolder.id)}
                  className=" text-red-600"
                  title="Eliminar subcarpeta"
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Input para agregar subcarpeta */}
        {showAddSubfolder === subfolder.id && (
          <div className="mt-2 flex items-center space-x-2 ml-4">
            <Input
              value={newSubfolderName}
              onChange={(e) => setNewSubfolderName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") addSubfolder(subfolder.id)
                if (e.key === "Escape") {
                  setShowAddSubfolder(null)
                  setNewSubfolderName("")
                }
              }}
              placeholder="Nombre de subcarpeta"
              className="text-xs"
              autoFocus
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => addSubfolder(subfolder.id)}
            >
              <Check className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowAddSubfolder(null)
                setNewSubfolderName("")
              }}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Renderizar subcarpetas anidadas */}
        {subfolder.subcarpetas && subfolder.subcarpetas.length > 0 && (
          <div className="mt-1">{renderSubfolders(subfolder.subcarpetas, depth + 1)}</div>
        )}
      </div>
    ))
  }

  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-center space-x-3 mb-3">
        <input type="checkbox" id={folder.id} checked={isSelected} onChange={onToggle} className="w-4 h-4" />

        {isEditingFolderName ? (
          <Input
            value={editedFolderName}
            onChange={(e) => setEditedFolderName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") saveFolderName()
              if (e.key === "Escape") setIsEditingFolderName(false)
            }}
            onBlur={saveFolderName}
            className="h-8 font-medium"
            autoFocus
          />
        ) : (
          <label
            htmlFor={folder.id}
            className="font-medium cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
            onDoubleClick={handleFolderNameDoubleClick}
            title="Doble click para editar"
          >
            {folder.nombre}
          </label>
        )}
      </div>

      {isSelected && (
        <div className="ml-7 space-y-3 bg-muted/60 p-3 rounded">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Subcarpetas</span>
            <Button
              variant="secundario"
              size="sm"
              onClick={() => setShowAddSubfolder(folder.id)}
              className="h-7 px-2 text-xs"
            >
              <Plus className="w-4 h-4" />
              Agregar subcarpeta
            </Button>
          </div>

          {/* Input para agregar subcarpeta principal */}
          {showAddSubfolder === folder.id && (
            <div className="flex items-center space-x-2">
              <Input
                value={newSubfolderName}
                onChange={(e) => setNewSubfolderName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") addSubfolder(folder.id)
                  if (e.key === "Escape") {
                    setShowAddSubfolder(null)
                    setNewSubfolderName("")
                  }
                }}
                placeholder="Nombre de la subcarpeta"
                className="text-xs"
                autoFocus
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => addSubfolder(folder.id)}
              >
                <Check className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowAddSubfolder(null)
                  setNewSubfolderName("")
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}

          {/* Renderizar subcarpetas */}
          {folder.subcarpetas && folder.subcarpetas.length > 0 && (
            <div className="space-y-1">{renderSubfolders(folder.subcarpetas)}</div>
          )}

          {(!folder.subcarpetas || folder.subcarpetas.length === 0) && showAddSubfolder !== folder.id && (
            <div className="text-xs text-muted-foreground">
              No hay subcarpetas. Haz clic en "Agregar Subcarpeta" para crear una.
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export const FolderTemplatesStep: React.FC<FolderTemplatesStepProps> = ({ carpetasIniciales }) => {
  const { watch, setValue, formState: { errors } } = useFormContext<CreateProjectFormData>();
  const [isCreateFolderDialogOpen, setIsCreateFolderDialogOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [customFolders, setCustomFolders] = useState<CarpetaPersonalizada[]>([]);

  const watchedCarpetas = watch('createProjectStepThree.carpetas');

  // Efecto para inicializar las carpetas iniciales cuando se cargan
  useEffect(() => {
    if (carpetasIniciales.length > 0 && (!watchedCarpetas || watchedCarpetas.length === 0)) {
      // Inicializar con las carpetas iniciales
      setValue('createProjectStepThree.carpetas', carpetasIniciales);
    }
  }, [carpetasIniciales, setValue, watchedCarpetas]);



  const isCustomFolderSelected = (carpeta: CarpetaPersonalizada) => {
    return watchedCarpetas?.some(c => c.nombre === carpeta.nombre) || false;
  };

  const handleCustomFolderToggle = (carpeta: CarpetaPersonalizada) => {
    const currentCarpetas = watchedCarpetas || [];
    const isSelected = currentCarpetas.some(c => c.nombre === carpeta.nombre);

    if (isSelected) {
      // Remover carpeta y todas sus subcarpetas del array plano
      const filteredCarpetas = currentCarpetas.filter(c =>
        c.nombre !== carpeta.nombre &&
        !(carpeta.subcarpetas || []).some(sub => sub.nombre === c.nombre)
      );
      setValue('createProjectStepThree.carpetas', filteredCarpetas);
    } else {
      // Agregar carpeta y todas sus subcarpetas al array plano
      const subcarpetasToAdd = (carpeta.subcarpetas || []).map(sub => ({ nombre: sub.nombre }));
      const carpetasToAdd = [{ nombre: carpeta.nombre }, ...subcarpetasToAdd];
      setValue('createProjectStepThree.carpetas', [...currentCarpetas, ...carpetasToAdd]);
    }
  };

  const handleCreateCustomFolder = () => {
    if (!newFolderName.trim()) return;

    const newFolder: CarpetaPersonalizada = {
      id: `custom-${Date.now()}`,
      nombre: newFolderName.trim(),
      subcarpetas: []
    };

    const updatedCustomFolders = [...customFolders, newFolder];
    setCustomFolders(updatedCustomFolders);

    // Actualizar directamente con estructura jerárquica completa
    const hierarchicalData = [
      ...carpetasIniciales.map(carpeta => ({
        tipo: 'inicial' as const,
        nombre: carpeta.nombre,
        subcarpetas: []
      })),
      ...updatedCustomFolders.map(carpeta => ({
        tipo: 'carpeta' as const,
        id: carpeta.id,
        nombre: carpeta.nombre,
        subcarpetas: carpeta.subcarpetas || []
      }))
    ];

    setValue('createProjectStepThree.carpetas', hierarchicalData);
    setNewFolderName("");
    setIsCreateFolderDialogOpen(false);
  };

  // Función para editar nombre de carpeta
  const editFolderName = (folderId: string, newName: string) => {
    const updatedFolders = customFolders.map(folder =>
      folder.id === folderId
        ? { ...folder, nombre: newName }
        : folder
    );

    setCustomFolders(updatedFolders);

    // Actualizar directamente con estructura jerárquica completa
    const hierarchicalData = [
      ...carpetasIniciales.map(carpeta => ({
        tipo: 'inicial' as const,
        nombre: carpeta.nombre,
        subcarpetas: []
      })),
      ...updatedFolders.map(carpeta => ({
        tipo: 'carpeta' as const,
        id: carpeta.id,
        nombre: carpeta.nombre,
        subcarpetas: carpeta.subcarpetas || []
      }))
    ];

    setValue('createProjectStepThree.carpetas', hierarchicalData);
  };

  // Función para eliminar subcarpeta
  const deleteSubfolder = (subfolderId: string) => {
    // const findSubfolderRecursively = (folders: CarpetaPersonalizada[]): Subcarpeta | null => {
    //   for (const folder of folders) {
    //     // Buscar en las subcarpetas directas de la carpeta
    //     const found = (folder.subcarpetas || []).find(sub => sub.id === subfolderId);
    //     if (found) return found;

    //     // Buscar recursivamente en las subcarpetas anidadas
    //     const foundNested = findInSubfolders(folder.subcarpetas || []);
    //     if (foundNested) return foundNested;
    //   }
    //   return null;
    // };

    const findInSubfolders = (subfolders: Subcarpeta[]): Subcarpeta | null => {
      for (const subfolder of subfolders) {
        if (subfolder.id === subfolderId) return subfolder;

        const found = findInSubfolders(subfolder.subcarpetas || []);
        if (found) return found;
      }
      return null;
    };

    const updateFoldersRecursively = (folders: CarpetaPersonalizada[]): CarpetaPersonalizada[] => {
      return folders.map(folder => ({
        ...folder,
        subcarpetas: updateSubfoldersRecursively(folder.subcarpetas || [])
      }));
    };

    const updateSubfoldersRecursively = (subfolders: Subcarpeta[]): Subcarpeta[] => {
      return subfolders
        .filter(sub => sub.id !== subfolderId)
        .map(sub => ({
          ...sub,
          subcarpetas: updateSubfoldersRecursively(sub.subcarpetas || [])
        }));
    };

    // Buscar la subcarpeta a eliminar antes de eliminarla
    // const subfolderToDelete = findSubfolderRecursively(customFolders);

    const updatedFolders = updateFoldersRecursively(customFolders);
    setCustomFolders(updatedFolders);

    // Actualizar directamente con estructura jerárquica completa
    const hierarchicalData = [
      ...carpetasIniciales.map(carpeta => ({
        tipo: 'inicial' as const,
        nombre: carpeta.nombre,
        subcarpetas: []
      })),
      ...updatedFolders.map(carpeta => ({
        tipo: 'carpeta' as const,
        id: carpeta.id,
        nombre: carpeta.nombre,
        subcarpetas: carpeta.subcarpetas || []
      }))
    ];

    setValue('createProjectStepThree.carpetas', hierarchicalData);
  };

  // Función para agregar subcarpeta
  const addSubfolder = (subfolderName: string, parentId?: string) => {
    if (!parentId) return;

    const newSubfolder: Subcarpeta = {
      id: `${parentId}-sub-${Date.now()}`,
      nombre: subfolderName,
      parentId: parentId,
      subcarpetas: []
    };

    const updateFolderRecursively = (folders: CarpetaPersonalizada[]): CarpetaPersonalizada[] => {
      return folders.map(folder => {
        if (folder.id === parentId) {
          return { ...folder, subcarpetas: [...(folder.subcarpetas || []), newSubfolder] };
        }
        return {
          ...folder,
          subcarpetas: updateSubfoldersRecursively(folder.subcarpetas || [])
        };
      });
    };

    const updateSubfoldersRecursively = (subfolders: Subcarpeta[]): Subcarpeta[] => {
      return subfolders.map(subfolder => {
        if (subfolder.id === parentId) {
          return { ...subfolder, subcarpetas: [...(subfolder.subcarpetas || []), newSubfolder] };
        }
        return {
          ...subfolder,
          subcarpetas: updateSubfoldersRecursively(subfolder.subcarpetas || [])
        };
      });
    };

    const updatedFolders = updateFolderRecursively(customFolders);
    setCustomFolders(updatedFolders);

    // Actualizar directamente con estructura jerárquica completa
    const hierarchicalData = [
      ...carpetasIniciales.map(carpeta => ({
        tipo: 'inicial' as const,
        nombre: carpeta.nombre,
        subcarpetas: []
      })),
      ...updatedFolders.map(carpeta => ({
        tipo: 'carpeta' as const,
        id: carpeta.id,
        nombre: carpeta.nombre,
        subcarpetas: carpeta.subcarpetas || []
      }))
    ];

    setValue('createProjectStepThree.carpetas', hierarchicalData);
  };

  // Función para editar subcarpeta
  const editSubfolder = (subfolderId: string, newName: string) => {
    // const findSubfolderRecursively = (folders: CarpetaPersonalizada[]): Subcarpeta | null => {
    //   for (const folder of folders) {
    //     const found = (folder.subcarpetas || []).find(sub => sub.id === subfolderId);
    //     if (found) return found;

    //     const foundNested = findInSubfolders(folder.subcarpetas || []);
    //     if (foundNested) return foundNested;
    //   }
    //   return null;
    // };

    const findInSubfolders = (subfolders: Subcarpeta[]): Subcarpeta | null => {
      for (const subfolder of subfolders) {
        if (subfolder.id === subfolderId) return subfolder;

        const found = findInSubfolders(subfolder.subcarpetas || []);
        if (found) return found;
      }
      return null;
    };

    const updateFoldersRecursively = (folders: CarpetaPersonalizada[]): CarpetaPersonalizada[] => {
      return folders.map(folder => ({
        ...folder,
        subcarpetas: updateSubfoldersRecursively(folder.subcarpetas || [])
      }));
    };

    const updateSubfoldersRecursively = (subfolders: Subcarpeta[]): Subcarpeta[] => {
      return subfolders.map(sub => ({
        ...sub,
        nombre: sub.id === subfolderId ? newName : sub.nombre,
        subcarpetas: updateSubfoldersRecursively(sub.subcarpetas || [])
      }));
    };

    // Buscar la subcarpeta antes de actualizarla
    // const subfolderToUpdate = findSubfolderRecursively(customFolders);

    const updatedFolders = updateFoldersRecursively(customFolders);
    setCustomFolders(updatedFolders);

    // Actualizar directamente con estructura jerárquica completa
    const hierarchicalData = [
      ...carpetasIniciales.map(carpeta => ({
        tipo: 'inicial' as const,
        nombre: carpeta.nombre,
        subcarpetas: []
      })),
      ...updatedFolders.map(carpeta => ({
        tipo: 'carpeta' as const,
        id: carpeta.id,
        nombre: carpeta.nombre,
        subcarpetas: carpeta.subcarpetas || []
      }))
    ];

    setValue('createProjectStepThree.carpetas', hierarchicalData);
  };

  return (
    <div className="space-y-6">
      {/* Carpetas iniciales - siempre marcadas y deshabilitadas */}
      {carpetasIniciales.length > 0 && (
        <div className="space-y-4">
          <div>
            <Label className="text-base font-medium">Carpetas Iniciales</Label>
            <p className="text-sm text-muted-foreground mt-1">
              Las carpetas iniciales se crean automáticamente según la etapa seleccionada
            </p>
          </div>

          {errors.createProjectStepThree?.carpetas && (
            <p className="text-sm text-red-500">
              {errors.createProjectStepThree.carpetas.message}
            </p>
          )}

          <h4 className="font-medium text-sm text-muted-foreground">Carpetas iniciales de la etapa:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {carpetasIniciales.map((carpeta) => (
              <div
                key={carpeta.nombre}
                className="p-4 border rounded-lg bg-muted/30"
              >
                <div className="flex items-center space-x-3">
                  <Checkbox
                    checked={true}
                    disabled={true}
                    className="mt-0"
                  />
                  <div className="flex items-center space-x-2 flex-1">
                    <Folder className="w-5 h-5 text-primary" />
                    <span className="text-sm font-medium">{carpeta.nombre}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    Inicial
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Carpetas personalizadas */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <Label className="text-base font-medium">Carpetas personalizadas</Label>
            <p className="text-sm text-muted-foreground mt-1">
              Agrega carpetas adicionales con subcarpetas opcionales.
            </p>
          </div>
          <Dialog open={isCreateFolderDialogOpen} onOpenChange={setIsCreateFolderDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="primario" size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Nueva carpeta
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Crear carpeta personalizada</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="folderName">Nombre de la carpeta</Label>
                  <Input
                    id="folderName"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    placeholder="Ej: Documentación Técnica"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleCreateCustomFolder();
                      }
                    }}
                  />
                </div>
                <Button onClick={handleCreateCustomFolder} className="w-full">
                  Crear carpeta
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Lista de carpetas personalizadas creadas */}
        <div className="space-y-3">
          {customFolders.map((folder) => (
            <FolderConfigCard
              key={folder.id}
              folder={folder}
              isSelected={isCustomFolderSelected(folder)}
              onToggle={() => handleCustomFolderToggle(folder)}
              onSubfolderAdd={(subfolderName, parentId) => addSubfolder(subfolderName, parentId)}
              onSubfolderEdit={(subfolderId, newName) => editSubfolder(subfolderId, newName)}
              onSubfolderDelete={(subfolderId) => deleteSubfolder(subfolderId)}
              onFolderNameEdit={(folderId, newName) => editFolderName(folderId, newName)}
            />
          ))}
        </div>

        {customFolders.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Folder className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No hay carpetas personalizadas. Haz clic en "Nueva Carpeta" para crear una.</p>
          </div>
        )}
      </div>
    </div>
  )
} 