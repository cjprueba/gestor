

import { Plus, X } from "lucide-react"
import type React from "react"
import { useState } from "react"

import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/design-system/button"
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

interface InviteUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function InviteUserDialog({ open, onOpenChange }: InviteUserDialogProps) {
  const [emails, setEmails] = useState<string[]>([])
  const [currentEmail, setCurrentEmail] = useState("")
  const [role, setRole] = useState("")
  const [message, setMessage] = useState("")
  const [selectedProjects, setSelectedProjects] = useState<string[]>([])

  const projects = ["Proyecto Alpha", "Proyecto Beta", "Proyecto Gamma", "Proyecto Delta"]

  const roles = [
    { value: "project-manager", label: "Project Manager" },
    { value: "user", label: "User" },
    { value: "viewer", label: "Viewer" },
  ]

  const addEmail = () => {
    if (currentEmail && !emails.includes(currentEmail)) {
      setEmails([...emails, currentEmail])
      setCurrentEmail("")
    }
  }

  const removeEmail = (emailToRemove: string) => {
    setEmails(emails.filter((email) => email !== emailToRemove))
  }

  const handleProjectToggle = (project: string) => {
    setSelectedProjects((prev) => (prev.includes(project) ? prev.filter((p) => p !== project) : [...prev, project]))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí iría la lógica para enviar las invitaciones
    console.log("Sending invitations:", { emails, role, projects: selectedProjects, message })
    onOpenChange(false)
    // Reset form
    setEmails([])
    setCurrentEmail("")
    setRole("")
    setMessage("")
    setSelectedProjects([])
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Invitar Usuarios</DialogTitle>
          <DialogDescription>
            Envía invitaciones por email para que nuevos usuarios se unan al sistema.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Emails */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Emails de Invitación *</Label>
              <div className="flex gap-2">
                <Input
                  id="email"
                  type="email"
                  value={currentEmail}
                  onChange={(e) => setCurrentEmail(e.target.value)}
                  placeholder="usuario@empresa.com"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addEmail()
                    }
                  }}
                />
                <Button type="button" onClick={addEmail} variant="outline">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {emails.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {emails.map((email) => (
                    <Badge key={email} variant="secondary">
                      {email}
                      <button
                        type="button"
                        onClick={() => removeEmail(email)}
                        className="ml-1 hover:bg-gray-300 rounded-full"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Rol */}
          <div className="space-y-2">
            <Label htmlFor="role">Rol Asignado *</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un rol" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((roleOption) => (
                  <SelectItem key={roleOption.value} value={roleOption.value}>
                    {roleOption.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Proyectos */}
          <div className="space-y-2">
            <Label>Proyectos Asignados</Label>
            <div className="border rounded-md p-3 space-y-2">
              {projects.map((project) => (
                <div key={project} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`invite-${project}`}
                    checked={selectedProjects.includes(project)}
                    onChange={() => handleProjectToggle(project)}
                    className="rounded"
                  />
                  <Label htmlFor={`invite-${project}`} className="text-sm font-normal">
                    {project}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Mensaje personalizado */}
          <div className="space-y-2">
            <Label htmlFor="message">Mensaje Personalizado</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Mensaje adicional para incluir en la invitación..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={emails.length === 0 || !role}>
              Enviar Invitaciones ({emails.length})
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
