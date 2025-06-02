import {
  ChevronDown,
  ChevronRight,
  Download,
  Edit,
  Eye,
  File,
  FileText,
  FolderOpen,
  Search,
  Share,
  Trash2,
} from "lucide-react"
import { useEffect, useState } from "react"

import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/design-system/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Checkbox } from "@/shared/components/ui/checkbox"
import { Collapsible, CollapsibleContent } from "@/shared/components/ui/collapsible"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog"
import { Input } from "@/shared/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"

interface ResourcePermissionsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: any
}

// Mock data structure
const projectsData = [
  {
    id: "proj-1",
    name: "Proyecto Alpha",
    contracts: [
      {
        id: "cont-1",
        name: "Contrato Principal Alpha",
        documents: [
          { id: "doc-1", name: "Contrato_Alpha_v1.pdf", type: "pdf" },
          { id: "doc-2", name: "Anexo_A_Alpha.docx", type: "docx" },
          { id: "doc-3", name: "Presupuesto_Alpha.xlsx", type: "xlsx" },
        ],
      },
      {
        id: "cont-2",
        name: "Contrato Secundario Alpha",
        documents: [
          { id: "doc-4", name: "Contrato_Sec_Alpha.pdf", type: "pdf" },
          { id: "doc-5", name: "Especificaciones_Alpha.docx", type: "docx" },
        ],
      },
    ],
  },
  {
    id: "proj-2",
    name: "Proyecto Beta",
    contracts: [
      {
        id: "cont-3",
        name: "Contrato Beta Principal",
        documents: [
          { id: "doc-6", name: "Contrato_Beta_v2.pdf", type: "pdf" },
          { id: "doc-7", name: "Cronograma_Beta.xlsx", type: "xlsx" },
        ],
      },
    ],
  },
  {
    id: "proj-3",
    name: "Proyecto Gamma",
    contracts: [
      {
        id: "cont-4",
        name: "Contrato Gamma",
        documents: [
          { id: "doc-8", name: "Propuesta_Gamma.pdf", type: "pdf" },
          { id: "doc-9", name: "Análisis_Gamma.docx", type: "docx" },
          { id: "doc-10", name: "Presupuesto_Gamma.xlsx", type: "xlsx" },
        ],
      },
    ],
  },
]

const permissionTypes = [
  { key: "view", label: "Ver", icon: Eye, color: "text-blue-600" },
  { key: "edit", label: "Editar", icon: Edit, color: "text-green-600" },
  { key: "download", label: "Descargar", icon: Download, color: "text-purple-600" },
  { key: "delete", label: "Eliminar", icon: Trash2, color: "text-red-600" },
  { key: "share", label: "Compartir", icon: Share, color: "text-orange-600" },
]

export function ResourcePermissionsDialog({ open, onOpenChange, user }: ResourcePermissionsDialogProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTab, setSelectedTab] = useState("hierarchy")
  const [expandedProjects, setExpandedProjects] = useState<string[]>([])
  const [expandedContracts, setExpandedContracts] = useState<string[]>([])
  const [permissions, setPermissions] = useState<Record<string, string[]>>({})
  const [inheritanceMode, setInheritanceMode] = useState<"inherit" | "explicit">("inherit")

  // Initialize permissions from user data
  useEffect(() => {
    if (user) {
      // Mock initialization - in real app, load from user's current permissions
      const initialPermissions: Record<string, string[]> = {}
      // Example: user has view access to specific documents
      initialPermissions["doc-1"] = ["view", "download"]
      initialPermissions["doc-6"] = ["view", "edit", "download"]
      initialPermissions["cont-1"] = ["view"]
      initialPermissions["proj-1"] = ["view"]
      setPermissions(initialPermissions)
    }
  }, [user])

  const toggleProjectExpansion = (projectId: string) => {
    setExpandedProjects((prev) =>
      prev.includes(projectId) ? prev.filter((id) => id !== projectId) : [...prev, projectId],
    )
  }

  const toggleContractExpansion = (contractId: string) => {
    setExpandedContracts((prev) =>
      prev.includes(contractId) ? prev.filter((id) => id !== contractId) : [...prev, contractId],
    )
  }

  const updatePermission = (resourceId: string, permissionType: string, granted: boolean) => {
    setPermissions((prev) => {
      const current = prev[resourceId] || []
      if (granted) {
        return {
          ...prev,
          [resourceId]: [...current.filter((p) => p !== permissionType), permissionType],
        }
      } else {
        return {
          ...prev,
          [resourceId]: current.filter((p) => p !== permissionType),
        }
      }
    })
  }

  const hasPermission = (resourceId: string, permissionType: string): boolean => {
    return permissions[resourceId]?.includes(permissionType) || false
  }

  const getInheritedPermissions = (resourceId: string, resourceType: "document" | "contract" | "project"): string[] => {
    if (inheritanceMode === "explicit") return []

    // Find parent permissions
    for (const project of projectsData) {
      if (resourceType === "project" && project.id === resourceId) {
        return []
      }

      for (const contract of project.contracts) {
        if (resourceType === "contract" && contract.id === resourceId) {
          return permissions[project.id] || []
        }

        for (const document of contract.documents) {
          if (resourceType === "document" && document.id === resourceId) {
            const contractPerms = permissions[contract.id] || []
            const projectPerms = permissions[project.id] || []
            return [...new Set([...contractPerms, ...projectPerms])]
          }
        }
      }
    }
    return []
  }

  const getEffectivePermissions = (resourceId: string, resourceType: "document" | "contract" | "project"): string[] => {
    const direct = permissions[resourceId] || []
    const inherited = getInheritedPermissions(resourceId, resourceType)
    return [...new Set([...direct, ...inherited])]
  }

  const filteredProjects = projectsData.filter(
    (project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.contracts.some(
        (contract) =>
          contract.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contract.documents.some((doc) => doc.name.toLowerCase().includes(searchTerm.toLowerCase())),
      ),
  )

  const handleSubmit = () => {
    console.log("Saving resource permissions:", permissions)
    onOpenChange(false)
  }

  const PermissionCheckbox = ({
    resourceId,
    resourceType,
    permissionType,
  }: {
    resourceId: string
    resourceType: "document" | "contract" | "project"
    permissionType: string
  }) => {
    const hasDirectPermission = hasPermission(resourceId, permissionType)
    const inheritedPermissions = getInheritedPermissions(resourceId, resourceType)
    const hasInheritedPermission = inheritedPermissions.includes(permissionType)
    const isChecked = hasDirectPermission || hasInheritedPermission

    return (
      <div className="flex items-center space-x-1">
        <Checkbox
          checked={isChecked}
          onCheckedChange={(checked) => updatePermission(resourceId, permissionType, checked as boolean)}
          disabled={hasInheritedPermission && !hasDirectPermission}
        />
        {hasInheritedPermission && !hasDirectPermission && (
          <Badge variant="outline" className="text-xs">
            Heredado
          </Badge>
        )}
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Permisos Específicos de Recursos</DialogTitle>
          <DialogDescription>
            Configura acceso granular a proyectos, contratos y documentos específicos para {user?.name}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col">
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="hierarchy">Vista Jerárquica</TabsTrigger>
              <TabsTrigger value="summary">Resumen de Permisos</TabsTrigger>
            </TabsList>

            <TabsContent value="hierarchy" className="flex-1 overflow-hidden flex flex-col space-y-4">
              {/* Controls */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar proyectos, contratos o documentos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <Select
                  value={inheritanceMode}
                  onValueChange={(value: "inherit" | "explicit") => setInheritanceMode(value)}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inherit">Herencia Activada</SelectItem>
                    <SelectItem value="explicit">Solo Permisos Explícitos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Permission Types Legend */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Tipos de Permisos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-4">
                    {permissionTypes.map((perm) => {
                      const Icon = perm.icon
                      return (
                        <div key={perm.key} className="flex items-center gap-2">
                          <Icon className={`w-4 h-4 ${perm.color}`} />
                          <span className="text-sm">{perm.label}</span>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Hierarchy Tree */}
              <div className="flex-1 min-h-0 overflow-y-auto border rounded-lg">
                <div className="p-4 space-y-2">
                  {filteredProjects.map((project) => (
                    <div key={project.id} className="space-y-2">
                      {/* Project Level */}
                      <Card>
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleProjectExpansion(project.id)}
                                className="p-0 h-6 w-6"
                              >
                                {expandedProjects.includes(project.id) ? (
                                  <ChevronDown className="w-4 h-4" />
                                ) : (
                                  <ChevronRight className="w-4 h-4" />
                                )}
                              </Button>
                              <FolderOpen className="w-5 h-5 text-blue-600" />
                              <span className="font-medium">{project.name}</span>
                              <Badge variant="outline" className="text-xs">
                                Proyecto
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              {permissionTypes.map((perm) => (
                                <PermissionCheckbox
                                  key={perm.key}
                                  resourceId={project.id}
                                  resourceType="project"
                                  permissionType={perm.key}
                                />
                              ))}
                            </div>
                          </div>
                        </CardHeader>

                        <Collapsible open={expandedProjects.includes(project.id)}>
                          <CollapsibleContent>
                            <CardContent className="pt-0">
                              <div className="space-y-3 ml-6">
                                {project.contracts.map((contract) => (
                                  <div key={contract.id} className="space-y-2">
                                    {/* Contract Level */}
                                    <div className="border rounded-lg p-3">
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => toggleContractExpansion(contract.id)}
                                            className="p-0 h-6 w-6"
                                          >
                                            {expandedContracts.includes(contract.id) ? (
                                              <ChevronDown className="w-4 h-4" />
                                            ) : (
                                              <ChevronRight className="w-4 h-4" />
                                            )}
                                          </Button>
                                          <FileText className="w-4 h-4 text-green-600" />
                                          <span className="text-sm font-medium">{contract.name}</span>
                                          <Badge variant="outline" className="text-xs">
                                            Contrato
                                          </Badge>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          {permissionTypes.map((perm) => (
                                            <PermissionCheckbox
                                              key={perm.key}
                                              resourceId={contract.id}
                                              resourceType="contract"
                                              permissionType={perm.key}
                                            />
                                          ))}
                                        </div>
                                      </div>

                                      <Collapsible open={expandedContracts.includes(contract.id)}>
                                        <CollapsibleContent>
                                          <div className="mt-3 space-y-2 ml-6">
                                            {contract.documents.map((document) => (
                                              <div
                                                key={document.id}
                                                className="flex items-center justify-between p-2 border rounded bg-gray-50"
                                              >
                                                <div className="flex items-center gap-2">
                                                  <File className="w-4 h-4 text-gray-600" />
                                                  <span className="text-sm">{document.name}</span>
                                                  <Badge variant="outline" className="text-xs">
                                                    {document.type.toUpperCase()}
                                                  </Badge>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                  {permissionTypes.map((perm) => (
                                                    <PermissionCheckbox
                                                      key={perm.key}
                                                      resourceId={document.id}
                                                      resourceType="document"
                                                      permissionType={perm.key}
                                                    />
                                                  ))}
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        </CollapsibleContent>
                                      </Collapsible>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </CollapsibleContent>
                        </Collapsible>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="summary" className="flex-1 overflow-hidden flex flex-col">
              <div className="flex-1 min-h-0 overflow-y-auto space-y-4 p-2">
                {/* Projects Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FolderOpen className="w-5 h-5" />
                      Proyectos
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {projectsData.map((project) => {
                      const effectivePerms = getEffectivePermissions(project.id, "project")
                      if (effectivePerms.length === 0) return null
                      return (
                        <div key={project.id} className="p-2 border rounded">
                          <div className="font-medium text-sm">{project.name}</div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {effectivePerms.map((perm) => (
                              <Badge key={perm} variant="secondary" className="text-xs">
                                {permissionTypes.find((p) => p.key === perm)?.label}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </CardContent>
                </Card>

                {/* Contracts Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Contratos
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {projectsData.flatMap((project) =>
                      project.contracts.map((contract) => {
                        const effectivePerms = getEffectivePermissions(contract.id, "contract")
                        if (effectivePerms.length === 0) return null
                        return (
                          <div key={contract.id} className="p-2 border rounded">
                            <div className="font-medium text-sm">{contract.name}</div>
                            <div className="text-xs text-muted-foreground">{project.name}</div>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {effectivePerms.map((perm) => (
                                <Badge key={perm} variant="secondary" className="text-xs">
                                  {permissionTypes.find((p) => p.key === perm)?.label}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )
                      }),
                    )}
                  </CardContent>
                </Card>

                {/* Documents Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <File className="w-5 h-5" />
                      Documentos
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {projectsData.flatMap((project) =>
                      project.contracts.flatMap((contract) =>
                        contract.documents.map((document) => {
                          const effectivePerms = getEffectivePermissions(document.id, "document")
                          if (effectivePerms.length === 0) return null
                          return (
                            <div key={document.id} className="p-2 border rounded">
                              <div className="font-medium text-sm">{document.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {project.name} → {contract.name}
                              </div>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {effectivePerms.map((perm) => (
                                  <Badge key={perm} variant="secondary" className="text-xs">
                                    {permissionTypes.find((p) => p.key === perm)?.label}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )
                        }),
                      ),
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>Guardar Permisos</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
