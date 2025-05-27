"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog"
import { Button } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Download, Share, Heart, Eye, FileText, Calendar, User } from "lucide-react"

interface DocumentViewerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  document: any
}

export function DocumentViewer({ open, onOpenChange, document }: DocumentViewerProps) {
  if (!document) return null

  const handleDownload = () => {
    console.log("Downloading document:", document.name)
    // Simulate download
  }

  const handleShare = () => {
    console.log("Sharing document:", document.name)
    // Open share dialog
  }

  const getFileIcon = (type: string) => {
    const icons = {
      pdf: "🔴",
      docx: "🔵",
      xlsx: "🟢",
      default: "📄",
    }
    return icons[type as keyof typeof icons] || icons.default
  }

  const getPermissionBadges = (permissions: string[]) => {
    const permissionLabels = {
      view: { label: "Ver", color: "bg-blue-100 text-blue-800" },
      edit: { label: "Editar", color: "bg-green-100 text-green-800" },
      download: { label: "Descargar", color: "bg-purple-100 text-purple-800" },
      share: { label: "Compartir", color: "bg-orange-100 text-orange-800" },
    }

    return permissions.map((perm) => {
      const config = permissionLabels[perm as keyof typeof permissionLabels]
      return (
        <Badge key={perm} variant="outline" className={`text-xs ${config.color}`}>
          {config.label}
        </Badge>
      )
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="text-3xl">{getFileIcon(document.type)}</div>
            <div>
              <div>{document.name}</div>
              <div className="text-sm font-normal text-muted-foreground">
                {document.project && `${document.project} → ${document.contract}`}
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Document Actions */}
          <div className="flex gap-2">
            {document.userPermissions?.includes("download") && (
              <Button onClick={handleDownload}>
                <Download className="w-4 h-4 mr-2" />
                Descargar
              </Button>
            )}
            {document.userPermissions?.includes("share") && (
              <Button variant="outline" onClick={handleShare}>
                <Share className="w-4 h-4 mr-2" />
                Compartir
              </Button>
            )}
            <Button variant="outline">
              <Heart className="w-4 h-4 mr-2" />
              Favorito
            </Button>
          </div>

          {/* Document Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Información del Documento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Nombre:</span>
                  <span className="text-sm text-muted-foreground">{document.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Tipo:</span>
                  <span className="text-sm text-muted-foreground">{document.type?.toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Tamaño:</span>
                  <span className="text-sm text-muted-foreground">{document.size}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Modificado:</span>
                  <span className="text-sm text-muted-foreground">{document.modified}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Último acceso:</span>
                  <span className="text-sm text-muted-foreground">{document.lastAccessed}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Mis Permisos
                </CardTitle>
                <CardDescription>Acciones que puedes realizar con este documento</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {document.userPermissions && getPermissionBadges(document.userPermissions)}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Document Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Vista Previa</CardTitle>
              <CardDescription>Contenido del documento</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-8 bg-gray-50 text-center">
                <div className="text-6xl mb-4">{getFileIcon(document.type)}</div>
                <p className="text-muted-foreground">
                  Vista previa no disponible para archivos {document.type?.toUpperCase()}
                </p>
                <p className="text-sm text-muted-foreground mt-2">Descarga el archivo para ver su contenido completo</p>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Actividad Reciente
              </CardTitle>
              <CardDescription>Últimas acciones realizadas en este documento</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">Documento visualizado</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Hace 2 horas</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <div className="flex items-center gap-2">
                    <Download className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">Documento descargado</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Hace 1 día</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <Share className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">Documento compartido</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Hace 3 días</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
