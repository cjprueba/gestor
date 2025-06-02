import { LayoutGrid } from "lucide-react";
import { useMemo } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import type { Collection, FileItem } from "@/shared/types/file.type";

interface CollectionsOverviewProps {
  collections: Collection[]
  files: FileItem[]
  onCollectionClick: (collectionId: string) => void
}

export function CollectionsOverview({ collections, files, onCollectionClick }: CollectionsOverviewProps) {

  const popularCollections = useMemo(() => {
    return [...collections]
      .sort((a, b) => b.fileIds.length - a.fileIds.length)
      .slice(0, 3)
      .map((collection) => {
        const collectionFiles = files.filter((file) => collection.fileIds.includes(file.id))
        const thumbnailFile = collectionFiles.find((file) => file.type !== "folder") || collectionFiles[0]
        return {
          ...collection,
          fileCount: collection.fileIds.length,
          thumbnail: thumbnailFile?.thumbnail || "/placeholder.svg?height=100&width=100",
        }
      })
  }, [collections, files])


  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Colecciones Populares</CardTitle>
          <CardDescription>Tus colecciones más activas</CardDescription>
        </div>
        <LayoutGrid className="h-4 w-4 text-gray-500" />
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          {popularCollections.map((collection) => (
            <div
              key={collection.id}
              className="flex flex-col rounded-lg border overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onCollectionClick(collection.id)}
            >
              <div className="aspect-video bg-gray-100 relative">
                <img
                  src={collection.thumbnail || "/placeholder.svg"}
                  alt={collection.name}
                  width={100}
                  height={100}
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium">{collection.name}</h3>
                <p className="text-sm text-gray-500">{collection.fileCount} archivos</p>
              </div>
            </div>
          ))}
          {popularCollections.length === 0 && (
            <div className="col-span-3 text-center py-6 text-gray-500">Aún no hay colecciones</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}