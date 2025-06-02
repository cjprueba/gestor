"use client"

import {
  ArrowLeft,
  Clock,
  Download,
  Eye,
  File,
  FileText,
  FolderOpen,
  Grid,
  Heart,
  List,
  MoreHorizontal,
  Search,
  Share,
} from "lucide-react"
import { useState } from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar"
import { Badge } from "@/shared/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/shared/components/ui/breadcrumb"
import { Button } from "@/shared/components/design-system/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import { Input } from "@/shared/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"

import { DocumentViewer } from "./_components/document-viewer"
import { ShareDialog } from "./_components/share-dialog"

// Mock data for current user (Carlos Rodríguez - Project Manager)
const currentUser = {
  id: "2",
  name: "Carlos Rodríguez",
  email: "carlos.rodriguez@empresa.com",
  role: "Project Manager",
  avatar: "/placeholder.svg?height=32&width=32",
}

// Mock data - only resources the user has access to
const userProjectsData = [
  {
    id: "proj-1",
    name: "Proyecto Alpha",
    description: "Desarrollo de plataforma empresarial",
    status: "active",
    lastAccessed: "2024-01-25",
    isFavorite: true,
    userPermissions: ["view", "edit", "download"],
    contracts: [
      {
        id: "cont-1",
        name: "Contrato Principal Alpha",
        description: "Contrato marco del proyecto",
        status: "approved",
        lastAccessed: "2024-01-24",
        isFavorite: false,
        userPermissions: ["view", "download"],
        documents: [
          {
            id: "doc-1",
            name: "Contrato_Alpha_v1.pdf",
            type: "pdf",
            size: "2.4 MB",
            modified: "2024-01-25",
            lastAccessed: "2024-01-25",
            isFavorite: true,
            userPermissions: ["view", "download"],
          },
          {
            id: "doc-2",
            name: "Anexo_A_Alpha.docx",
            type: "docx",
            size: "1.2 MB",
            modified: "2024-01-23",
            lastAccessed: "2024-01-23",
            isFavorite: false,
            userPermissions: ["view", "download"],
          },
        ],
      },
    ],
  },
  {
    id: "proj-2",
    name: "Proyecto Beta",
    description: "Modernización de sistemas legacy",
    status: "active",
    lastAccessed: "2024-01-20",
    isFavorite: false,
    userPermissions: ["view", "edit", "download", "share"],
    contracts: [
      {
        id: "cont-3",
        name: "Contrato Beta Principal",
        description: "Migración completa de sistemas",
        status: "approved",
        lastAccessed: "2024-01-20",
        isFavorite: true,
        userPermissions: ["view", "edit", "download", "share"],
        documents: [
          {
            id: "doc-6",
            name: "Contrato_Beta_v2.pdf",
            type: "pdf",
            size: "4.1 MB",
            modified: "2024-02-10",
            lastAccessed: "2024-01-20",
            isFavorite: false,
            userPermissions: ["view", "edit", "download", "share"],
          },
        ],
      },
    ],
  },
]

// Recent documents across all projects
const recentDocuments = [
  {
    id: "doc-1",
    name: "Contrato_Alpha_v1.pdf",
    type: "pdf",
    project: "Proyecto Alpha",
    contract: "Contrato Principal Alpha",
    lastAccessed: "2024-01-25",
    userPermissions: ["view", "download"],
  },
  {
    id: "doc-2",
    name: "Anexo_A_Alpha.docx",
    type: "docx",
    project: "Proyecto Alpha",
    contract: "Contrato Principal Alpha",
    lastAccessed: "2024-01-23",
    userPermissions: ["view", "download"],
  },
  {
    id: "doc-6",
    name: "Contrato_Beta_v2.pdf",
    type: "pdf",
    project: "Proyecto Beta",
    contract: "Contrato Beta Principal",
    lastAccessed: "2024-01-20",
    userPermissions: ["view", "edit", "download", "share"],
  },
]

export default function UserDashboard() {
  const [currentView, setCurrentView] = useState<"projects" | "contracts" | "documents">("projects")
  const [selectedProject, setSelectedProject] = useState<any>(null)
  const [selectedContract, setSelectedContract] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedDocument, setSelectedDocument] = useState<any>(null)
  const [documentViewerOpen, setDocumentViewerOpen] = useState(false)
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [selectedTab, setSelectedTab] = useState("all")

  const handleProjectClick = (project: any) => {
    setSelectedProject(project)
    setSelectedContract(null)
    setCurrentView("contracts")
  }

  const handleContractClick = (contract: any) => {
    setSelectedContract(contract)
    setCurrentView("documents")
  }

  const handleBackToProjects = () => {
    setSelectedProject(null)
    setSelectedContract(null)
    setCurrentView("projects")
  }

  const handleBackToContracts = () => {
    setSelectedContract(null)
    setCurrentView("contracts")
  }

  const handleDocumentView = (document: any) => {
    setSelectedDocument(document)
    setDocumentViewerOpen(true)
  }

  const handleDocumentShare = (document: any) => {
    setSelectedDocument(document)
    setShareDialogOpen(true)
  }

  const handleDocumentDownload = (document: any) => {
    console.log("Downloading document:", document.name)
    // Simulate download
  }

  const toggleFavorite = (item: any, type: string) => {
    console.log("Toggling favorite:", item.name, type)
    // Update favorite status
  }

  const getStatusBadge = (status: string) => {
    const colors = {
      active: "text-green-800 bg-green-100",
      approved: "text-blue-800 bg-blue-100",
      draft: "text-gray-800 bg-gray-100",
    }
    return (
      <Badge variant="outline" className={colors[status as keyof typeof colors]}>
        {status === "active" ? "Activo" : status === "approved" ? "Aprobado" : "Borrador"}
      </Badge>
    )
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

  const filteredData = () => {
    if (currentView === "projects") {
      return userProjectsData.filter((project) => project.name.toLowerCase().includes(searchTerm.toLowerCase()))
    } else if (currentView === "contracts" && selectedProject) {
      return selectedProject.contracts.filter((contract: any) =>
        contract.name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    } else if (currentView === "documents" && selectedContract) {
      return selectedContract.documents.filter((document: any) =>
        document.name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }
    return []
  }

  const getFavoriteItems = () => {
    const favorites: any[] = []
    userProjectsData.forEach((project) => {
      if (project.isFavorite) favorites.push({ ...project, type: "project" })
      project.contracts.forEach((contract) => {
        if (contract.isFavorite) favorites.push({ ...contract, type: "contract", projectName: project.name })
        contract.documents.forEach((document) => {
          if (document.isFavorite)
            favorites.push({
              ...document,
              type: "document",
              projectName: project.name,
              contractName: contract.name,
            })
        })
      })
    })
    return favorites
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Mi Espacio de Trabajo</h1>
          <p className="text-muted-foreground">Accede a tus proyectos, contratos y documentos</p>
        </div>
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={currentUser.avatar || "/placeholder.svg"} alt={currentUser.name} />
            <AvatarFallback>
              {currentUser.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{currentUser.name}</div>
            <div className="text-sm text-muted-foreground">{currentUser.role}</div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mis Proyectos</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userProjectsData.length}</div>
            <p className="text-xs text-muted-foreground">Proyectos activos</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documentos</CardTitle>
            <File className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userProjectsData.reduce(
                (acc, p) => acc + p.contracts.reduce((acc2, c) => acc2 + c.documents.length, 0),
                0,
              )}
            </div>
            <p className="text-xs text-muted-foreground">Documentos disponibles</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Favoritos</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getFavoriteItems().length}</div>
            <p className="text-xs text-muted-foreground">Elementos marcados</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recientes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentDocuments.length}</div>
            <p className="text-xs text-muted-foreground">Accedidos recientemente</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Todos los Recursos</TabsTrigger>
          <TabsTrigger value="favorites">Favoritos</TabsTrigger>
          <TabsTrigger value="recent">Recientes</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {/* Breadcrumb Navigation */}
          {currentView !== "projects" && (
            <Card>
              <CardContent className="pt-6">
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink
                        onClick={handleBackToProjects}
                      // className={currentView === "projects" ? "font-semibold" : "cursor-pointer"}
                      >
                        Mis Proyectos
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    {selectedProject && (
                      <>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                          <BreadcrumbLink
                            onClick={handleBackToContracts}
                            className={currentView === "contracts" ? "font-semibold" : "cursor-pointer"}
                          >
                            {selectedProject.name}
                          </BreadcrumbLink>
                        </BreadcrumbItem>
                      </>
                    )}
                    {selectedContract && (
                      <>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                          <BreadcrumbLink className="font-semibold">{selectedContract.name}</BreadcrumbLink>
                        </BreadcrumbItem>
                      </>
                    )}
                  </BreadcrumbList>
                </Breadcrumb>
              </CardContent>
            </Card>
          )}

          {/* Search and View Controls */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder={`Buscar ${currentView === "projects"
                        ? "proyectos"
                        : currentView === "contracts"
                          ? "contratos"
                          : "documentos"
                        }...`}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  {currentView !== "projects" && (
                    <Button
                      variant="secundario"
                      onClick={currentView === "contracts" ? handleBackToProjects : handleBackToContracts}
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Volver
                    </Button>
                  )}
                  <Button
                    variant="secundario"
                    size="sm"
                    onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                  >
                    {viewMode === "grid" ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content Grid */}
          <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
            {filteredData().map((item: any) => (
              <Card key={item.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      {currentView === "projects" && <FolderOpen className="w-8 h-8 text-blue-600" />}
                      {currentView === "contracts" && <FileText className="w-8 h-8 text-green-600" />}
                      {currentView === "documents" && <div className="text-2xl">{getFileIcon(item.type)}</div>}
                      <div className="flex-1">
                        <CardTitle
                          className="text-lg cursor-pointer hover:text-blue-600"
                          onClick={() => {
                            if (currentView === "projects") handleProjectClick(item)
                            else if (currentView === "contracts") handleContractClick(item)
                            else if (currentView === "documents") handleDocumentView(item)
                          }}
                        >
                          {item.name}
                        </CardTitle>
                        {item.description && <CardDescription>{item.description}</CardDescription>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleFavorite(item, currentView.slice(0, -1))}
                        className={item.isFavorite ? "text-red-500" : "text-gray-400"}
                      >
                        <Heart className={`w-4 h-4 ${item.isFavorite ? "fill-current" : ""}`} />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                          {item.userPermissions.includes("view") && (
                            <DropdownMenuItem
                              onClick={() => {
                                if (currentView === "documents") handleDocumentView(item)
                              }}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              Ver
                            </DropdownMenuItem>
                          )}
                          {item.userPermissions.includes("download") && (
                            <DropdownMenuItem onClick={() => handleDocumentDownload(item)}>
                              <Download className="w-4 h-4 mr-2" />
                              Descargar
                            </DropdownMenuItem>
                          )}
                          {item.userPermissions.includes("share") && (
                            <DropdownMenuItem onClick={() => handleDocumentShare(item)}>
                              <Share className="w-4 h-4 mr-2" />
                              Compartir
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Status and permissions */}
                    <div className="flex items-center justify-between">
                      {item.status && getStatusBadge(item.status)}
                      <div className="text-sm text-muted-foreground">Último acceso: {item.lastAccessed}</div>
                    </div>

                    {/* Additional info */}
                    {currentView === "projects" && (
                      <div className="text-sm text-muted-foreground">
                        {item.contracts.length} contrato{item.contracts.length !== 1 ? "s" : ""}
                      </div>
                    )}
                    {currentView === "contracts" && (
                      <div className="text-sm text-muted-foreground">
                        {item.documents.length} documento{item.documents.length !== 1 ? "s" : ""}
                      </div>
                    )}
                    {currentView === "documents" && (
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{item.size}</span>
                        <span>{item.type.toUpperCase()}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="favorites" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getFavoriteItems().map((item: any) => (
              <Card key={`${item.type}-${item.id}`} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      {item.type === "project" && <FolderOpen className="w-8 h-8 text-blue-600" />}
                      {item.type === "contract" && <FileText className="w-8 h-8 text-green-600" />}
                      {item.type === "document" && <div className="text-2xl">{getFileIcon(item.type)}</div>}
                      <div className="flex-1">
                        <CardTitle className="text-lg">{item.name}</CardTitle>
                        <CardDescription>
                          {item.type === "contract" && `${item.projectName}`}
                          {item.type === "document" && `${item.projectName} → ${item.contractName}`}
                        </CardDescription>
                      </div>
                    </div>
                    <Heart className="w-4 h-4 text-red-500 fill-current" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">Último acceso: {item.lastAccessed}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          <div className="space-y-4">
            {recentDocuments.map((doc) => (
              <Card key={doc.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-2xl">{getFileIcon(doc.type)}</div>
                      <div>
                        <h3 className="font-medium">{doc.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {doc.project} → {doc.contract}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm text-muted-foreground">{doc.lastAccessed}</div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleDocumentView(doc)}>
                            <Eye className="w-4 h-4 mr-2" />
                            Ver
                          </DropdownMenuItem>
                          {doc.userPermissions.includes("download") && (
                            <DropdownMenuItem onClick={() => handleDocumentDownload(doc)}>
                              <Download className="w-4 h-4 mr-2" />
                              Descargar
                            </DropdownMenuItem>
                          )}
                          {doc.userPermissions.includes("share") && (
                            <DropdownMenuItem onClick={() => handleDocumentShare(doc)}>
                              <Share className="w-4 h-4 mr-2" />
                              Compartir
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <DocumentViewer open={documentViewerOpen} onOpenChange={setDocumentViewerOpen} document={selectedDocument} />
      <ShareDialog open={shareDialogOpen} onOpenChange={setShareDialogOpen} document={selectedDocument} />
    </div>
  )
}
