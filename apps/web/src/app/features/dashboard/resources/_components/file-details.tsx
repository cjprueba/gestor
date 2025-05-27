import { Collection } from "@/shared/types/types"

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/shared/components/ui/sheet"
import { formatFileSize } from "@/shared/lib/file-utils"
import { FileItem } from "@/shared/types/types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"
import { Clock } from "lucide-react"



export function FileDetails({
  file, 
  collections,
  open,
  setOpen,
}: {
  file: FileItem
  collections: Collection[]
  open: boolean
  setOpen: (open: boolean) => void
}) {

  const activities = [
    { id: 1, action: "Creado", date: new Date(file.modified.getTime() - 86400000 * 5), user: "John Doe" },
    { id: 2, action: "Modificado", date: new Date(file.modified.getTime() - 86400000 * 3), user: "Jane Smith" },
    { id: 3, action: "Compartido", date: new Date(file.modified.getTime() - 86400000 * 2), user: "John Doe" },
    { id: 4, action: "Modificado", date: file.modified, user: "Usuario Actual" },
  ]

  const getFileCollections = (fileId: string) => {
    return collections.filter((collection) => collection.fileIds.includes(fileId))
  }

  const fileCollections = getFileCollections(file.id)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
    <SheetContent className="sm:max-w-md">
      <SheetHeader>
        <SheetTitle>{file.name}</SheetTitle>
        <SheetDescription>
          {file.type === "folder" ? "Carpeta" : file.type} • {file.size ? formatFileSize(file.size) : ""}
        </SheetDescription>
      </SheetHeader>
      <div className="py-6">
        <Tabs defaultValue="details">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Detalles</TabsTrigger>
            <TabsTrigger value="activities">Actividades</TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-gray-500">Tipo</div>
              <div className="font-medium">{file.type}</div>

              <div className="text-gray-500">Tamaño</div>
              <div className="font-medium">{file.size ? formatFileSize(file.size) : "N/A"}</div>

              <div className="text-gray-500">Creado</div>
              <div className="font-medium">{new Date(file.modified.getTime() - 86400000 * 5).toLocaleString()}</div>

              <div className="text-gray-500">Modificado</div>
              <div className="font-medium">{file.modified.toLocaleString()}</div>

              <div className="text-gray-500">Ruta</div>
              <div className="font-medium truncate">{file.path}</div>

              <div className="text-gray-500">Favorito</div>
              <div className="font-medium">{file.starred ? "Sí" : "No"}</div>

              <div className="text-gray-500">Compartido</div>
              <div className="font-medium">{file.shared ? "Sí" : "No"}</div>

              <div className="text-gray-500">Colecciones</div>
              <div className="font-medium">
                {fileCollections.length > 0 ? fileCollections.map((c) => c.name).join(", ") : "Ninguna"}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="activities" className="mt-4">
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 border-b pb-3">
                  <div className="rounded-full bg-gray-100 p-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">
                      {activity.action} por {activity.user}
                    </p>
                    <p className="text-sm text-gray-500">{activity.date.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </SheetContent>
  </Sheet>
  )
}