"use client"

import { Clock,Copy, Link, Mail, Users } from "lucide-react"
import { useState } from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar"
import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Textarea } from "@/shared/components/ui/textarea"

interface ShareDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  document: any
}

// Mock users that can be shared with
const availableUsers = [
  {
    id: "3",
    name: "María López",
    email: "maria.lopez@empresa.com",
    department: "Finanzas",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "4",
    name: "Juan Pérez",
    email: "juan.perez@empresa.com",
    department: "Legal",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "5",
    name: "Laura Martín",
    email: "laura.martin@empresa.com",
    department: "RRHH",
    avatar: "/placeholder.svg?height=32&width=32",
  },
]

export function ShareDialog({ open, onOpenChange, document }: ShareDialogProps) {
  const [shareMethod, setShareMethod] = useState<"email" | "link">("email")
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [message, setMessage] = useState("")
  const [linkExpiry, setLinkExpiry] = useState("7")
  const [shareLink] = useState("https://empresa.com/share/doc-123-abc")

  const handleUserToggle = (userId: string) => {
    setSelectedUsers((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]))
  }

  const handleShare = () => {
    if (shareMethod === "email") {
      console.log("Sharing via email:", { users: selectedUsers, message, document: document?.id })
    } else {
      console.log("Sharing via link:", { expiry: linkExpiry, document: document?.id })
    }
    onOpenChange(false)
    // Reset form
    setSelectedUsers([])
    setMessage("")
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink)
    console.log("Link copied to clipboard")
  }

  if (!document) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Compartir Documento
          </DialogTitle>
          <DialogDescription>Comparte "{document.name}" con otros usuarios de la organización.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Share Method Selection */}
          <div className="flex gap-2">
            <Button
              variant={shareMethod === "email" ? "default" : "outline"}
              onClick={() => setShareMethod("email")}
              className="flex-1"
            >
              <Mail className="w-4 h-4 mr-2" />
              Por Email
            </Button>
            <Button
              variant={shareMethod === "link" ? "default" : "outline"}
              onClick={() => setShareMethod("link")}
              className="flex-1"
            >
              <Link className="w-4 h-4 mr-2" />
              Enlace Compartido
            </Button>
          </div>

          {shareMethod === "email" && (
            <>
              {/* User Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Seleccionar Usuarios</CardTitle>
                  <CardDescription>Elige los usuarios que recibirán acceso al documento</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {availableUsers.map((user) => (
                    <div
                      key={user.id}
                      className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedUsers.includes(user.id) ? "bg-blue-50 border-blue-200" : "hover:bg-gray-50"
                      }`}
                      onClick={() => handleUserToggle(user.id)}
                    >
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => {}}
                        className="rounded"
                      />
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                        <AvatarFallback>
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{user.name}</div>
                        <div className="text-xs text-muted-foreground">{user.email}</div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {user.department}
                      </Badge>
                    </div>
                  ))}

                  {selectedUsers.length > 0 && (
                    <div className="p-3 bg-blue-50 rounded border border-blue-200">
                      <p className="text-sm text-blue-800 font-medium">
                        {selectedUsers.length} usuario{selectedUsers.length !== 1 ? "s" : ""} seleccionado
                        {selectedUsers.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Message */}
              <div className="space-y-2">
                <Label htmlFor="message">Mensaje (Opcional)</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Agrega un mensaje personalizado para los destinatarios..."
                  rows={3}
                />
              </div>
            </>
          )}

          {shareMethod === "link" && (
            <>
              {/* Link Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Configuración del Enlace</CardTitle>
                  <CardDescription>Define las opciones de acceso para el enlace compartido</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expiración del enlace</Label>
                    <Select value={linkExpiry} onValueChange={setLinkExpiry}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 día</SelectItem>
                        <SelectItem value="7">7 días</SelectItem>
                        <SelectItem value="30">30 días</SelectItem>
                        <SelectItem value="never">Sin expiración</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Enlace generado</Label>
                    <div className="flex gap-2">
                      <Input value={shareLink} readOnly className="flex-1" />
                      <Button variant="outline" onClick={copyToClipboard}>
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Este enlace permite acceso de solo lectura al documento
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Link Info */}
              <div className="p-4 bg-yellow-50 rounded border border-yellow-200">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-800">Información del enlace</span>
                </div>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Cualquier persona con este enlace podrá ver el documento</li>
                  <li>
                    • El enlace expirará en{" "}
                    {linkExpiry === "never" ? "nunca" : `${linkExpiry} día${linkExpiry !== "1" ? "s" : ""}`}
                  </li>
                  <li>• Se registrará el acceso para auditoría</li>
                </ul>
              </div>
            </>
          )}

          {/* Document Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Documento a compartir</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="text-2xl">
                  {document.type === "pdf" ? "🔴" : document.type === "docx" ? "🔵" : "📄"}
                </div>
                <div>
                  <div className="font-medium">{document.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {document.size} • {document.type?.toUpperCase()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleShare} disabled={shareMethod === "email" && selectedUsers.length === 0}>
            {shareMethod === "email" ? (
              <>
                <Mail className="w-4 h-4 mr-2" />
                Enviar ({selectedUsers.length})
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                Copiar Enlace
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
