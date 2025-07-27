import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar"
import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Separator } from "@/shared/components/ui/separator"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/shared/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"
import { ETAPAS } from "@/shared/data/project-data"
import { ArrowRight, Download, Edit, FileText, Folder, FolderOpen, Plus, Share, SortDesc, Loader2 } from "lucide-react"
import { useState } from "react"
import { useCarpetaDetalle } from "@/lib/api/hooks/useCarpetas"
import dayjs from "dayjs"

interface DetailsSheetProps {
  isOpen: boolean
  onClose: () => void
  item: any
  type: "project" | "folder" | "document"
  onStageChange?: (newStage: string) => void
  onUpdate?: (updatedItem: any) => void
}

export default function DetailsSheet({ isOpen, onClose, item, type, onStageChange }: DetailsSheetProps) {
  const [isEditingStage, setIsEditingStage] = useState(false)

  // Obtener detalle de carpeta si el tipo es "folder"
  const { data: carpetaDetalle, isLoading: isLoadingCarpeta } = useCarpetaDetalle(
    type === "folder" && item?.id ? item.id : undefined
  )

  if (!item) return null

  // Datos de la carpeta (reales o fallback)
  const carpetaData = type === "folder" ? carpetaDetalle?.data : null

  // Debug para verificar los datos
  if (type === "folder") {
    console.log("DetailsSheet Debug:", {
      item,
      carpetaData,
      isLoadingCarpeta,
      itemName: item?.name,
      carpetaName: carpetaData?.nombre
    })
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const getRelativeTime = (date: Date) => {
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "hace unos minutos"
    if (diffInHours < 24) return `hace ${diffInHours} hora${diffInHours > 1 ? "s" : ""}`
    if (diffInHours < 48) return "ayer"
    if (diffInHours < 72) return "anteayer"

    const diffInDays = Math.floor(diffInHours / 24)
    return `hace ${diffInDays} día${diffInDays > 1 ? "s" : ""}`
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-96 sm:w-96 overflow-y-auto">
        <SheetHeader className="space-y-4 p-4">
          <div className="flex items-center space-x-3">
            {type === "project" && <FolderOpen className="w-6 h-6 text-primary-500" />}
            {type === "folder" && <Folder className="w-6 h-6 text-primary-500" />}
            {type === "document" && <FileText className="w-6 h-6 text-primary-500" />}
            <div className="flex-1 min-w-0">
              <SheetTitle className="text-left truncate">
                {type === "folder" ? (
                  carpetaData?.nombre ||
                  item?.name ||
                  item?.nombre ||
                  `Carpeta ${item?.id || 'sin nombre'}`
                ) : (
                  item?.name || item?.nombre || 'Sin nombre'
                )}
              </SheetTitle>
              <p className="text-sm text-muted-foreground capitalize">
                {type === "project" ? "Proyecto" : type === "folder" ? "Carpeta" : "Documento"}
              </p>
              {type === "folder" && isLoadingCarpeta && (
                <div className="flex items-center gap-2 mt-1">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span className="text-xs text-muted-foreground">Cargando...</span>
                </div>
              )}
            </div>
          </div>
        </SheetHeader>

        <Tabs defaultValue="details">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Detalles</TabsTrigger>
            <TabsTrigger value="activities">Actividades</TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="space-y-6 p-6">
            {/* Preview Section */}
            <div className="space-y-4">
              <h3 className="font-medium text-sm text-muted-foreground">VISTA PREVIA</h3>
              <div className="flex items-center justify-center h-32 bg-muted rounded-lg">
                {type === "document" ? (
                  <div className="text-center">
                    <FileText className="w-12 h-12 mx-auto text-primary-500 mb-2" />
                    <p className="text-xs text-muted-foreground">Vista previa del documento</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <Folder className="w-12 h-12 mx-auto text-primary-500 mb-2" />
                    <p className="text-xs text-muted-foreground">Carpeta</p>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Información General */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-sm text-muted-foreground">INFORMACIÓN GENERAL</h3>
              </div>

              <div className="space-y-3">
                {type === "project" && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Etapa actual</span>
                    {isEditingStage ? (
                      <Select
                        value={item.etapa}
                        onValueChange={(value) => {
                          onStageChange?.(value)
                          setIsEditingStage(false)
                        }}
                      >
                        <SelectTrigger className="w-48">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ETAPAS.map((etapa) => (
                            <SelectItem key={etapa} value={etapa}>
                              {etapa}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{item.etapa}</Badge>
                        <Button variant="ghost" size="sm" onClick={() => setIsEditingStage(true)}>
                          <Edit className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  <span className="text-sm text-muted-foreground">Personas con acceso</span>
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <Avatar key={i} className="w-8 h-8 border-2 border-background">
                        <AvatarImage src={`/placeholder.svg`} />
                        <AvatarFallback className="text-xs">U{i}</AvatarFallback>
                      </Avatar>
                    ))}
                    <Button variant="ghost" size="sm" className="w-8 h-8 rounded-full border-2 border-dashed">
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Detalles del Archivo/Carpeta */}
            <div className="space-y-4">
              <h3 className="font-medium text-sm text-muted-foreground">
                {type === "document" ? "DETALLES DEL DOCUMENTO" : "DETALLES DE LA CARPETA"}
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Tipo</span>
                  <span className="text-sm">
                    {type === "document" ? item.metadata?.type || "Documento" : "Carpeta"}
                  </span>
                </div>

                {/* Información específica de carpetas */}
                {type === "folder" && carpetaData && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Descripción</span>
                      <span className="text-sm text-right max-w-32 truncate" title={carpetaData.descripcion}>
                        {carpetaData.descripcion || "Sin descripción"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Tamaño máximo</span>
                      <span className="text-sm">{carpetaData.max_tamaño_mb} MB</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Estado</span>
                      <Badge variant={carpetaData.activa ? "default" : "secondary"}>
                        {carpetaData.activa ? "Activa" : "Inactiva"}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Orden</span>
                      <span className="text-sm">{carpetaData.orden_visualizacion}</span>
                    </div>

                    {carpetaData.tipos_archivo_permitidos.length > 0 && (
                      <div className="space-y-2">
                        <span className="text-sm text-muted-foreground">Tipos permitidos</span>
                        <div className="flex flex-wrap gap-1">
                          {carpetaData.tipos_archivo_permitidos.slice(0, 3).map((tipo, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tipo}
                            </Badge>
                          ))}
                          {carpetaData.tipos_archivo_permitidos.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{carpetaData.tipos_archivo_permitidos.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* Información de documentos */}
                {type === "document" && item.metadata?.size && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Tamaño</span>
                    <span className="text-sm">{(item.metadata.size / 1024 / 1024).toFixed(1)} MB</span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Creado</span>
                  <span className="text-sm">
                    {type === "folder" && carpetaData
                      ? dayjs(carpetaData.fecha_creacion).format('DD/MM/YYYY HH:mm')
                      : formatDate(item.metadata?.createdAt || item.createdAt || new Date())
                    }
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Modificado</span>
                  <span className="text-sm">
                    {type === "folder" && carpetaData
                      ? dayjs(carpetaData.fecha_actualizacion).format('DD/MM/YYYY HH:mm')
                      : formatDate(item.metadata?.lastModifiedAt || item.createdAt || new Date())
                    }
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Abierto</span>
                  <span className="text-sm">{getRelativeTime(new Date())}</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Permisos de carpeta */}
            {type === "folder" && carpetaData && (
              <>
                <div className="space-y-4">
                  <h3 className="font-medium text-sm text-muted-foreground">PERMISOS</h3>
                  <div className="space-y-3">
                    {carpetaData.permisos_lectura.length > 0 && (
                      <div className="space-y-2">
                        <span className="text-sm text-muted-foreground">Lectura</span>
                        <div className="flex flex-wrap gap-1">
                          {carpetaData.permisos_lectura.slice(0, 2).map((permiso, index) => (
                            <Badge key={index} variant="outline" className="text-xs bg-green-50 text-green-700">
                              {permiso}
                            </Badge>
                          ))}
                          {carpetaData.permisos_lectura.length > 2 && (
                            <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                              +{carpetaData.permisos_lectura.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {carpetaData.permisos_escritura.length > 0 && (
                      <div className="space-y-2">
                        <span className="text-sm text-muted-foreground">Escritura</span>
                        <div className="flex flex-wrap gap-1">
                          {carpetaData.permisos_escritura.slice(0, 2).map((permiso, index) => (
                            <Badge key={index} variant="outline" className="text-xs bg-blue-50 text-blue-700">
                              {permiso}
                            </Badge>
                          ))}
                          {carpetaData.permisos_escritura.length > 2 && (
                            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                              +{carpetaData.permisos_escritura.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {carpetaData.s3_created && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Almacenamiento</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700">
                            S3 Configurado
                          </Badge>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <Separator />
              </>
            )}

            {/* Acciones */}
            <div className="space-y-4">
              <h3 className="font-medium text-sm text-muted-foreground">ACCIONES</h3>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                  <Download className="w-4 h-4 mr-2" />
                  {type === "project" ? "Exportar Proyecto" : type === "document" ? "Descargar" : "Exportar Carpeta"}
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                  <Share className="w-4 h-4 mr-2" />
                  Compartir
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                  <Plus className="w-4 h-4 mr-2" />
                  Invitar Colaboradores
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="activities" className="space-y-6 p-6">

            <div className="space-y-4 max-h-96 overflow-y-auto">
              <h3 className="font-medium text-sm text-muted-foreground">Actividades</h3>
              <div className="space-y-4">

                <div className="flex space-x-3 p-3 bg-blue-50 rounded-lg">
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback className="text-xs">MR</AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">María Rodríguez</span>
                      <span className="text-sm text-muted-foreground">ayer</span>
                    </div>
                    <span className="text-sm text-muted-foreground">agregó un documento</span>
                    <div className="text-sm text-muted-foreground bg-background p-2 rounded border mt-2">
                      Se agregó el documento "Contrato de Concesión Final.pdf" a la carpeta Documentación Legal
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3 p-3 bg-blue-50 rounded-lg">
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback className="text-xs">CS</AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Carlos Silva</span>
                      <span className="text-xs text-muted-foreground">hace 3 días</span>
                    </div>
                    <span className="text-sm text-muted-foreground">creó una carpeta</span>
                    <div className="text-sm text-muted-foreground bg-background p-2 rounded border mt-2">
                      Se creó la carpeta "Modificaciones de Obras y Convenios" con configuración de 5 documentos mínimos
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3 p-3 bg-blue-50 rounded-lg">
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback className="text-xs">JD</AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      {/* <FolderOpen className="w-4 h-4 text-green-600" /> */}
                      <span className="text-sm font-medium">Juan Díaz</span>
                      <span className="text-xs text-muted-foreground">hace 1 semana</span>
                    </div>

                    <span className="text-sm text-muted-foreground">creó el proyecto</span>

                    <div className="text-sm text-muted-foreground bg-background p-2 rounded border mt-2">
                      Proyecto creado en etapa: Cartera de proyectos
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Separator />
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-sm text-muted-foreground">HISTORIAL DE ETAPAS</h3>
                <div className="flex items-center">
                  <Button variant="ghost" size="sm" className="flex items-center">
                    <SortDesc className="w-1 h-1" />
                    <span className="text-xs text-muted-foreground">Más recientes primero</span>
                  </Button>
                </div>
              </div>

              <div className="flex space-x-3 p-3 bg-blue-50 rounded-lg">
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="text-xs">JD</AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Juan Díaz</span>
                    <span className="text-xs text-muted-foreground">hace 2 horas</span>
                  </div>

                  <span className="text-sm text-muted-foreground">cambió la etapa</span>

                  <div className="text-sm bg-background p-3 rounded border mt-2 w-full">
                    <div className="flex items-center gap-3 justify-start">
                      <div className="inline-flex items-center px-2 py-1 rounded border border-button-secondary text-primary-500  bg-background text-xs font-medium max-w-[100px] min-h-[24px]">
                        <span className="whitespace-normal break-words text-center leading-tight">
                          Proyectos en Licitación
                        </span>
                      </div>
                      <ArrowRight className="w-3 h-3 flex-shrink-0" />
                      <div className="inline-flex items-center px-2 py-1 rounded bg-primary-500 text-primary-foreground text-xs font-medium max-w-[100px] min-h-[24px]">
                        <span className="whitespace-normal break-words text-center leading-tight">
                          Concesiones en Operación
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}
