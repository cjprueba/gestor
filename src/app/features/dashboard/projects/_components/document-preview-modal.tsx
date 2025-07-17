import { Button } from "@/shared/components/design-system/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog"
import type { DocumentoItem } from "@/shared/types/project-types"
import {
  Download,
  ExternalLink,
  FileText,
  Image,
  RotateCw,
  Trash,
  ZoomIn,
  ZoomOut
} from "lucide-react"
import { useState, useEffect } from "react"
import { revokeBlobUrl } from "@/shared/lib/file-utils"

// Tipo extendido para documento con URL de preview temporal
interface DocumentoItemWithPreview extends DocumentoItem {
  previewUrl?: string;
}

interface DocumentPreviewModalProps {
  document: DocumentoItemWithPreview | null
  isOpen: boolean
  onClose: () => void
  onDownload: (documentId: string) => void
  onView: (documentId: string) => void
  onDelete: (documentId: string) => void
}

export function DocumentPreviewModal({
  document,
  isOpen,
  onClose,
  onDownload,
  onView,
  onDelete
}: DocumentPreviewModalProps) {
  const [zoom, setZoom] = useState(100)
  const [rotation, setRotation] = useState(0)
  const [pdfError, setPdfError] = useState(false)
  const [pdfLoaded, setPdfLoaded] = useState(false)

  // Limpiar URL de blob cuando se cierre el modal
  useEffect(() => {
    return () => {
      if (document?.previewUrl) {
        revokeBlobUrl(document.previewUrl)
      }
    }
  }, [document?.previewUrl])

  // Reset PDF error cuando cambia el documento
  useEffect(() => {
    setPdfError(false)
    setPdfLoaded(false)
  }, [document?.id, document?.tipo_mime, document?.previewUrl])

  if (!document) return null

  const isImage = document.tipo_mime?.startsWith('image/')
  const isPDF = document.tipo_mime === 'application/pdf'
  const isOffice = document.tipo_mime?.includes('word') ||
    document.tipo_mime?.includes('excel') ||
    document.tipo_mime?.includes('powerpoint')

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = () => {
    if (isImage) return <Image className="w-8 h-8 text-blue-500" />
    if (isPDF) return <FileText className="w-8 h-8 text-red-500" />
    if (isOffice) return <FileText className="w-8 h-8 text-green-500" />
    return <FileText className="w-8 h-8 text-gray-500" />
  }

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 200))
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 25))
  const handleRotate = () => setRotation(prev => (prev + 90) % 360)
  const handleReset = () => {
    setZoom(100)
    setRotation(0)
  }

  const handleClose = () => {
    // Limpiar URL de blob antes de cerrar
    if (document?.previewUrl) {
      revokeBlobUrl(document.previewUrl)
    }
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className={`min-w-[700px] min-h-[600px] max-h-[90vh] overflow-x-auto items-center justify-center`}>
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getFileIcon()}
              <div>
                <DialogTitle className="text-lg">{document.nombre_archivo}</DialogTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{document.extension?.toUpperCase()}</span>
                  <span>•</span>
                  <span>{formatFileSize(document.tamano)}</span>
                </div>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="flex flex-col h-full">
          {/* Toolbar */}
          <div className="flex items-center justify-between p-4 border-b bg-muted/30">
            <div className="flex items-center gap-2">
              <Button
                variant="secundario"
                size="sm"
                onClick={handleZoomOut}
                disabled={zoom <= 25}
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              <span className="text-sm font-medium  text-center">{zoom}%</span>
              <Button
                variant="secundario"
                size="sm"
                onClick={handleZoomIn}
                disabled={zoom >= 200}
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button
                variant="secundario"
                size="sm"
                onClick={handleRotate}
              >
                <RotateCw className="w-4 h-4" />
              </Button>
              <Button
                variant="secundario"
                size="sm"
                onClick={handleReset}
              >
                Reset
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="secundario"
                size="sm"
                onClick={() => onView(document.id)}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Abrir
              </Button>
              <Button
                variant="secundario"
                size="sm"
                onClick={() => onDownload(document.id)}
              >
                <Download className="w-4 h-4 mr-2" />
                Descargar
              </Button>
              <Button
                variant="secundario"
                size="sm"
                onClick={() => onDelete(document.id)}
                className=" text-red-500 border-red-500"
              >
                <Trash className="w-4 h-4 mr-2" />
                Eliminar
              </Button>
            </div>
          </div>

          {/* Preview Content */}
          <div className="flex-1 overflow-auto p-4">
            <div className="flex gap-6 h-full">
              {/* Document Preview */}
              <div className="flex-1 bg-white border rounded-lg overflow-hidden min-h-[500px]">
                <div
                  className="w-full h-full flex items-center justify-center bg-gray-50"
                  style={{
                    transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                    transition: 'transform 0.2s ease-in-out',
                    minHeight: '500px'
                  }}
                >
                  {isImage ? (
                    <img
                      src={document.previewUrl}
                      alt={document.nombre_archivo}
                      className="max-w-full max-h-full object-contain"
                    />
                  ) : isPDF ? (
                    pdfError && !pdfLoaded ? (
                      <div className="text-center p-8">
                        <FileText className="w-16 h-16 mx-auto text-red-400 mb-4" />
                        <p className="text-gray-500 mb-4">No se pudo cargar la vista previa del PDF</p>
                        <div className="flex gap-2 justify-center">
                          <Button
                            variant="secundario"
                            size="sm"
                            onClick={() => onDownload(document.id)}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Descargar PDF
                          </Button>
                          <Button
                            variant="secundario"
                            size="sm"
                            onClick={() => onView(document.id)}
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Abrir en nueva pestaña
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <iframe
                        src={`${document.previewUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH&pagemode=none`}
                        className="w-full h-full border-0"
                        style={{ minHeight: '600px' }}
                        title={document.nombre_archivo}
                        onError={() => {
                          setPdfError(true)
                          setPdfLoaded(false)
                        }}
                        onLoad={() => {
                          // Si el iframe se carga correctamente, limpiar el error
                          setPdfError(false)
                          setPdfLoaded(true)
                        }}
                      />
                    )
                  ) : (
                    <div className="text-center p-8">
                      <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-500">Vista previa no disponible</p>
                      <p className="text-sm text-gray-400 mt-2">
                        Este tipo de archivo no admite vista previa
                      </p>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 