import { Users } from "lucide-react";

import { Folder } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { FileText } from "lucide-react";
import { Progress } from "@/shared/components/ui/progress";
import { formatFileSize } from "@/shared/lib/file-utils";
import { HardDrive } from "lucide-react";
import { Collection, FileItem } from "@/shared/types/types";

interface StorageOverViewProps{
  files: FileItem[]
  collections: Collection[]
  storageStats: {
    totalStorageFormatted: string;
    storageUsedPercentage: number;
    storageLimit: number;
    totalFiles: number;
    totalFolders: number;
  }
}

export function StorageOverview({ files, collections, storageStats }: StorageOverViewProps) {


  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Almacenamiento Total Usado</CardTitle>
        <HardDrive className="h-4 w-4 text-gray-500" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{storageStats.totalStorageFormatted}</div>
        <Progress value={storageStats.storageUsedPercentage} className="mt-2 h-2" />
        <p className="text-xs text-gray-500 mt-2">
          {storageStats.storageUsedPercentage.toFixed(1)}% de {formatFileSize(storageStats.storageLimit)} usado
        </p>
      </CardContent>
    </Card>

    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total de Archivos</CardTitle>
        <FileText className="h-4 w-4 text-gray-500" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{storageStats.totalFiles}</div>
        <p className="text-xs text-gray-500 mt-2">En {collections.length} colecciones</p>
      </CardContent>
    </Card>

    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total de Carpetas</CardTitle>
        <Folder className="h-4 w-4 text-gray-500" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{storageStats.totalFolders}</div>
        <p className="text-xs text-gray-500 mt-2">Contenido organizado</p>
      </CardContent>
    </Card>

    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Archivos Compartidos</CardTitle>
        <Users className="h-4 w-4 text-gray-500" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{files.filter((file) => file.shared).length}</div>
        <p className="text-xs text-gray-500 mt-2">Con miembros del equipo</p>
      </CardContent>
    </Card>
  </div>
  )
}