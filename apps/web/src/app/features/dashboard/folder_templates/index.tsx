// import { useState, useEffect } from "react"
// import { Button } from "@/shared/components/design-system/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card"
// import { Badge } from "@/shared/components/ui/badge"
// import { Input } from "@/shared/components/ui/input"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/shared/components/ui/dialog"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
// import { Separator } from "@/shared/components/ui/separator"
// import { SidebarInset } from "@/shared/components/ui/sidebar"
// import { Plus, FolderIcon, Edit, Trash2, Copy, Folder, Search } from "lucide-react"
// import { ETAPAS, PLANTILLAS_CARPETAS } from "@/shared/data/project-data"
// import type { FolderTemplate, TemplateSet } from "@/shared/types/template-types"
// import TemplateEditor from "./_components/template-editor"

// export default function FolderTemplatesPage() {
//   const [templates, setTemplates] = useState<FolderTemplate[]>([])
//   const [templateSets, setTemplateSets] = useState<TemplateSet[]>([])
//   const [selectedEtapa, setSelectedEtapa] = useState<string>("all")
//   const [searchTerm, setSearchTerm] = useState("")
//   const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
//   const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
//   const [selectedTemplate, setSelectedTemplate] = useState<FolderTemplate | null>(null)
//   const [activeTab, setActiveTab] = useState("templates")

//   // Inicializar con templates por defecto
//   useEffect(() => {
//     const defaultTemplates: FolderTemplate[] = []

//     // Crear templates por defecto basados en PLANTILLAS_CARPETAS
//     Object.entries(PLANTILLAS_CARPETAS).forEach(([etapa, carpetas]) => {
//       carpetas.forEach((carpeta, index) => {
//         const template: FolderTemplate = {
//           id: `default-${etapa}-${index}`,
//           name: carpeta,
//           description: `Template por defecto para ${carpeta} en ${etapa}`,
//           minDocuments: 3,
//           daysLimit: 30,
//           subfolders: [
//             { id: `sub-1`, name: "Documentos Principales", minDocuments: 2 },
//             { id: `sub-2`, name: "Documentos Adicionales", minDocuments: 1 },
//           ],
//           etapas: [etapa],
//           createdAt: new Date(),
//           createdBy: "Sistema",
//           lastModifiedAt: new Date(),
//           lastModifiedBy: "Sistema",
//           isDefault: true,
//         }
//         defaultTemplates.push(template)
//       })
//     })

//     setTemplates(defaultTemplates)

//     // Crear template sets por defecto
//     const defaultSets: TemplateSet[] = ETAPAS.map((etapa, index) => ({
//       id: `set-${index}`,
//       name: `Set ${etapa}`,
//       description: `Conjunto de templates para ${etapa}`,
//       etapa,
//       folders: defaultTemplates.filter((t) => t.etapas.includes(etapa)),
//       createdAt: new Date(),
//       createdBy: "Sistema",
//       isDefault: true,
//     }))

//     setTemplateSets(defaultSets)
//   }, [])

//   const filteredTemplates = templates.filter((template) => {
//     const matchesEtapa = selectedEtapa === "all" || template.etapas.includes(selectedEtapa)
//     const matchesSearch =
//       template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       template.description?.toLowerCase().includes(searchTerm.toLowerCase())
//     return matchesEtapa && matchesSearch
//   })

//   const handleCreateTemplate = (templateData: Partial<FolderTemplate>) => {
//     const newTemplate: FolderTemplate = {
//       id: `template-${Date.now()}`,
//       name: templateData.name || "",
//       description: templateData.description,
//       minDocuments: templateData.minDocuments || 3,
//       daysLimit: templateData.daysLimit,
//       subfolders: templateData.subfolders || [],
//       etapas: templateData.etapas || [],
//       createdAt: new Date(),
//       createdBy: "Usuario Actual",
//       lastModifiedAt: new Date(),
//       lastModifiedBy: "Usuario Actual",
//       isDefault: false,
//     }

//     setTemplates([...templates, newTemplate])
//     setIsCreateDialogOpen(false)
//   }

//   const handleEditTemplate = (templateData: Partial<FolderTemplate>) => {
//     if (!selectedTemplate) return

//     const updatedTemplate: FolderTemplate = {
//       ...selectedTemplate,
//       ...templateData,
//       lastModifiedAt: new Date(),
//       lastModifiedBy: "Usuario Actual",
//     }

//     setTemplates(templates.map((t) => (t.id === selectedTemplate.id ? updatedTemplate : t)))
//     setIsEditDialogOpen(false)
//     setSelectedTemplate(null)
//   }

//   const handleDuplicateTemplate = (template: FolderTemplate) => {
//     const duplicatedTemplate: FolderTemplate = {
//       ...template,
//       id: `template-${Date.now()}`,
//       name: `${template.name} (Copia)`,
//       createdAt: new Date(),
//       createdBy: "Usuario Actual",
//       lastModifiedAt: new Date(),
//       lastModifiedBy: "Usuario Actual",
//       isDefault: false,
//     }

//     setTemplates([...templates, duplicatedTemplate])
//   }

//   const handleDeleteTemplate = (templateId: string) => {
//     setTemplates(templates.filter((t) => t.id !== templateId))
//   }

//   const getEtapaColor = (etapa: string) => {
//     const colors = {
//       "Cartera de proyectos": "bg-blue-100 text-blue-800",
//       "Proyectos en Licitación": "bg-yellow-100 text-yellow-800",
//       "Concesiones en Operación": "bg-green-100 text-green-800",
//       "Concesiones en Construcción": "bg-orange-100 text-orange-800",
//       "Concesiones en Operación y Construcción": "bg-purple-100 text-purple-800",
//       "Concesiones Finalizadas": "bg-gray-100 text-gray-800",
//     }
//     return colors[etapa as keyof typeof colors] || "bg-gray-100 text-gray-800"
//   }

//   return (
//     <>
//       <div className="flex items-center space-x-2">
//         <div className="relative">
//           <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
//           <Input
//             placeholder="Buscar templates..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="pl-8 w-64"
//           />
//         </div>
//         <Select value={selectedEtapa} onValueChange={setSelectedEtapa}>
//           <SelectTrigger className="w-48">
//             <SelectValue placeholder="Filtrar por etapa" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="all">Todas las etapas</SelectItem>
//             {ETAPAS.map((etapa) => (
//               <SelectItem key={etapa} value={etapa}>
//                 {etapa}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//         <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
//           <DialogTrigger asChild>
//             <Button>
//               <Plus className="w-4 h-4 mr-2" />
//               Nuevo Template
//             </Button>
//           </DialogTrigger>
//           <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
//             <DialogHeader>
//               <DialogTitle>Crear Nuevo Template</DialogTitle>
//               <DialogDescription>
//                 Crea una nueva plantilla de carpeta que podrá ser utilizada en diferentes etapas
//               </DialogDescription>
//             </DialogHeader>
//             <TemplateEditor onSave={handleCreateTemplate} onCancel={() => setIsCreateDialogOpen(false)} />
//           </DialogContent>
//         </Dialog>
//       </div>

//       <div className="flex flex-1 flex-col gap-4 p-4">
//         <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//           <TabsList className="grid w-full grid-cols-2">
//             <TabsTrigger value="templates">Templates Individuales</TabsTrigger>
//             <TabsTrigger value="sets">Conjuntos de Templates</TabsTrigger>
//           </TabsList>

//           <TabsContent value="templates" className="space-y-4">
//             {filteredTemplates.length === 0 ? (
//               <Card className="text-center py-12">
//                 <CardContent>
//                   <FolderIcon className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
//                   <h3 className="text-xl font-semibold mb-2">No hay templates</h3>
//                   <p className="text-muted-foreground mb-4">
//                     {searchTerm || selectedEtapa !== "all"
//                       ? "No se encontraron templates con los filtros aplicados"
//                       : "Crea tu primer template para comenzar"}
//                   </p>
//                   {!searchTerm && selectedEtapa === "all" && (
//                     <Button onClick={() => setIsCreateDialogOpen(true)}>
//                       <Plus className="w-4 h-4 mr-2" />
//                       Crear Primer Template
//                     </Button>
//                   )}
//                 </CardContent>
//               </Card>
//             ) : (
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {filteredTemplates.map((template) => (
//                   <Card key={template.id} className="hover:shadow-lg transition-shadow">
//                     <CardHeader>
//                       <div className="flex justify-between items-start">
//                         <div className="flex-1">
//                           <CardTitle className="text-lg flex items-center">
//                             <Folder className="w-5 h-5 mr-2 text-blue-500" />
//                             {template.name}
//                             {template.isDefault && (
//                               <Badge variant="secondary" className="ml-2 text-xs">
//                                 Por defecto
//                               </Badge>
//                             )}
//                           </CardTitle>
//                           {template.description && (
//                             <CardDescription className="mt-1">{template.description}</CardDescription>
//                           )}
//                         </div>
//                         <div className="flex items-center space-x-1">
//                           <Button
//                             variant="ghost"
//                             size="sm"
//                             onClick={() => {
//                               setSelectedTemplate(template)
//                               setIsEditDialogOpen(true)
//                             }}
//                             className="h-8 w-8 p-0"
//                           >
//                             <Edit className="w-4 h-4" />
//                           </Button>
//                           <Button
//                             variant="ghost"
//                             size="sm"
//                             onClick={() => handleDuplicateTemplate(template)}
//                             className="h-8 w-8 p-0"
//                           >
//                             <Copy className="w-4 h-4" />
//                           </Button>
//                           {!template.isDefault && (
//                             <Button
//                               variant="ghost"
//                               size="sm"
//                               onClick={() => handleDeleteTemplate(template.id)}
//                               className="h-8 w-8 p-0 text-destructive hover:text-destructive"
//                             >
//                               <Trash2 className="w-4 h-4" />
//                             </Button>
//                           )}
//                         </div>
//                       </div>
//                     </CardHeader>
//                     <CardContent>
//                       <div className="space-y-3">
//                         <div className="flex items-center justify-between text-sm">
//                           <span className="text-muted-foreground">Documentos mínimos:</span>
//                           <span className="font-medium">{template.minDocuments}</span>
//                         </div>

//                         {template.daysLimit && (
//                           <div className="flex items-center justify-between text-sm">
//                             <span className="text-muted-foreground">Días límite:</span>
//                             <span className="font-medium">{template.daysLimit}</span>
//                           </div>
//                         )}

//                         <div className="flex items-center justify-between text-sm">
//                           <span className="text-muted-foreground">Subcarpetas:</span>
//                           <span className="font-medium">{template.subfolders.length}</span>
//                         </div>

//                         <div className="space-y-2">
//                           <span className="text-sm text-muted-foreground">Etapas disponibles:</span>
//                           <div className="flex flex-wrap gap-1">
//                             {template.etapas.map((etapa) => (
//                               <Badge key={etapa} variant="outline" className={`text-xs ${getEtapaColor(etapa)}`}>
//                                 {etapa.split(" ").slice(0, 2).join(" ")}
//                               </Badge>
//                             ))}
//                           </div>
//                         </div>

//                         <Separator />

//                         <div className="text-xs text-muted-foreground">
//                           <div>Creado: {template.createdAt.toLocaleDateString()}</div>
//                           <div>Por: {template.createdBy}</div>
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 ))}
//               </div>
//             )}
//           </TabsContent>

//           <TabsContent value="sets" className="space-y-4">
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {templateSets.map((set) => (
//                 <Card key={set.id} className="hover:shadow-lg transition-shadow">
//                   <CardHeader>
//                     <div className="flex justify-between items-start">
//                       <div className="flex-1">
//                         <CardTitle className="text-lg flex items-center">
//                           <FolderIcon className="w-5 h-5 mr-2 text-purple-500" />
//                           {set.name}
//                           {set.isDefault && (
//                             <Badge variant="secondary" className="ml-2 text-xs">
//                               Por defecto
//                             </Badge>
//                           )}
//                         </CardTitle>
//                         {set.description && <CardDescription className="mt-1">{set.description}</CardDescription>}
//                       </div>
//                     </div>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="space-y-3">
//                       <div className="flex items-center justify-between">
//                         <span className="text-sm text-muted-foreground">Etapa:</span>
//                         <Badge className={getEtapaColor(set.etapa)}>{set.etapa}</Badge>
//                       </div>

//                       <div className="flex items-center justify-between text-sm">
//                         <span className="text-muted-foreground">Templates incluidos:</span>
//                         <span className="font-medium">{set.folders.length}</span>
//                       </div>

//                       <div className="space-y-1">
//                         <span className="text-sm text-muted-foreground">Carpetas:</span>
//                         <div className="text-xs text-muted-foreground max-h-20 overflow-y-auto">
//                           {set.folders.map((folder, index) => (
//                             <div key={folder.id}>• {folder.name}</div>
//                           ))}
//                         </div>
//                       </div>

//                       <Separator />

//                       <div className="text-xs text-muted-foreground">
//                         <div>Creado: {set.createdAt.toLocaleDateString()}</div>
//                         <div>Por: {set.createdBy}</div>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           </TabsContent>
//         </Tabs>
//       </div>

//       {/* Dialog de edición */}
//       <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
//         <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle>Editar Template</DialogTitle>
//             <DialogDescription>Modifica la plantilla de carpeta "{selectedTemplate?.name}"</DialogDescription>
//           </DialogHeader>
//           {selectedTemplate && (
//             <TemplateEditor
//               template={selectedTemplate}
//               onSave={handleEditTemplate}
//               onCancel={() => {
//                 setIsEditDialogOpen(false)
//                 setSelectedTemplate(null)
//               }}
//             />
//           )}
//         </DialogContent>
//       </Dialog>
//     </>

//   )
// }

import { useState, useEffect } from "react"
import { PLANTILLAS_CARPETAS } from "@/shared/data/project-data"
import type { FolderTemplate, TemplateUsageStats } from "@/shared/types/template-types"
import TemplateManager from "./_components/template-manager"

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<FolderTemplate[]>([])
  const [usageStats, setUsageStats] = useState<TemplateUsageStats[]>([])

  // Inicializar con templates por defecto optimizados
  useEffect(() => {
    const templateMap = new Map<string, FolderTemplate>()

    // Crear templates únicos consolidando etapas
    Object.entries(PLANTILLAS_CARPETAS).forEach(([etapa, carpetas]) => {
      carpetas.forEach((carpeta) => {
        const templateKey = carpeta // Usar el nombre como clave única

        if (templateMap.has(templateKey)) {
          // Si ya existe, agregar la etapa
          const existingTemplate = templateMap.get(templateKey)!
          existingTemplate.etapas.push(etapa)
        } else {
          // Crear nuevo template
          const template: FolderTemplate = {
            id: `template-${carpeta.toLowerCase().replace(/\s+/g, "-")}`,
            name: carpeta,
            description: `Plantilla para ${carpeta} - Aplicable en múltiples etapas según necesidades del proyecto`,
            minDocuments: 3,
            daysLimit: 30,
            subfolders: getSubfoldersForTemplate(carpeta),
            etapas: [etapa], // Comenzar con una etapa
            createdAt: new Date(),
            createdBy: "Sistema",
            lastModifiedAt: new Date(),
            lastModifiedBy: "Sistema",
            isDefault: true,
            isActive: true,
            version: 1,
            tags: ["default", carpeta.toLowerCase().replace(/\s+/g, "-")],
          }
          templateMap.set(templateKey, template)
        }
      })
    })

    const defaultTemplates = Array.from(templateMap.values())
    setTemplates(defaultTemplates)

    // Generar estadísticas de uso mock
    const mockStats: TemplateUsageStats[] = defaultTemplates.map((template) => ({
      templateId: template.id,
      usageCount: Math.floor(Math.random() * 50) + template.etapas.length * 5, // Más uso si está en más etapas
      lastUsed: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      projectsUsing: [],
    }))

    setUsageStats(mockStats)
  }, [])

  // Función para generar subcarpetas específicas según el tipo de carpeta
  const getSubfoldersForTemplate = (carpetaName: string) => {
    const subfoldersMap: Record<string, any[]> = {
      "Proceso de Licitación": [
        { id: "sub-1", name: "Bases de Licitación", minDocuments: 2 },
        { id: "sub-2", name: "Consultas y Respuestas", minDocuments: 1 },
        { id: "sub-3", name: "Actas de Reuniones", minDocuments: 1 },
      ],
      "Proceso de Adjudicación": [
        { id: "sub-1", name: "Evaluación de Ofertas", minDocuments: 2 },
        { id: "sub-2", name: "Informes Técnicos", minDocuments: 2 },
        { id: "sub-3", name: "Decreto de Adjudicación", minDocuments: 1 },
      ],
      "Documentación Técnica": [
        { id: "sub-1", name: "Planos y Diseños", minDocuments: 3 },
        { id: "sub-2", name: "Especificaciones Técnicas", minDocuments: 2 },
        { id: "sub-3", name: "Memorias de Cálculo", minDocuments: 1 },
      ],
      Ejecución: [
        { id: "sub-1", name: "Contratos y Convenios", minDocuments: 2 },
        { id: "sub-2", name: "Órdenes de Cambio", minDocuments: 1 },
        { id: "sub-3", name: "Estados de Pago", minDocuments: 2 },
      ],
      "Modificaciones de Obras y Convenios": [
        { id: "sub-1", name: "Solicitudes de Modificación", minDocuments: 2 },
        { id: "sub-2", name: "Aprobaciones", minDocuments: 1 },
        { id: "sub-3", name: "Convenios Modificatorios", minDocuments: 1 },
      ],
      "Informe Mensual": [
        { id: "sub-1", name: "Informes de Avance", minDocuments: 1 },
        { id: "sub-2", name: "Fotografías", minDocuments: 1 },
        { id: "sub-3", name: "Indicadores", minDocuments: 1 },
      ],
      "Documentación Operacional": [
        { id: "sub-1", name: "Manuales de Operación", minDocuments: 2 },
        { id: "sub-2", name: "Protocolos de Mantenimiento", minDocuments: 1 },
        { id: "sub-3", name: "Reportes de Operación", minDocuments: 1 },
      ],
      "Documentación de Construcción": [
        { id: "sub-1", name: "Planos As-Built", minDocuments: 3 },
        { id: "sub-2", name: "Certificados de Calidad", minDocuments: 2 },
        { id: "sub-3", name: "Pruebas y Ensayos", minDocuments: 2 },
      ],
      "Estudios de Factibilidad": [
        { id: "sub-1", name: "Estudios Técnicos", minDocuments: 2 },
        { id: "sub-2", name: "Estudios Económicos", minDocuments: 2 },
        { id: "sub-3", name: "Estudios Ambientales", minDocuments: 1 },
      ],
      "Ofertas Técnicas": [
        { id: "sub-1", name: "Propuesta Técnica", minDocuments: 2 },
        { id: "sub-2", name: "Cronograma de Trabajo", minDocuments: 1 },
        { id: "sub-3", name: "Equipo de Trabajo", minDocuments: 1 },
      ],
      "Ofertas Económicas": [
        { id: "sub-1", name: "Propuesta Económica", minDocuments: 1 },
        { id: "sub-2", name: "Análisis de Precios", minDocuments: 2 },
        { id: "sub-3", name: "Garantías", minDocuments: 1 },
      ],
      "Documentación Final": [
        { id: "sub-1", name: "Acta de Entrega", minDocuments: 1 },
        { id: "sub-2", name: "Liquidación Final", minDocuments: 1 },
        { id: "sub-3", name: "Garantías de Obra", minDocuments: 1 },
      ],
      "Cierre de Concesión": [
        { id: "sub-1", name: "Acta de Cierre", minDocuments: 1 },
        { id: "sub-2", name: "Transferencia de Activos", minDocuments: 2 },
        { id: "sub-3", name: "Liquidación de Garantías", minDocuments: 1 },
      ],
    }

    return (
      subfoldersMap[carpetaName] || [
        { id: "sub-1", name: "Documentos Principales", minDocuments: 2 },
        { id: "sub-2", name: "Documentos Adicionales", minDocuments: 1 },
      ]
    )
  }

  return (
    <div className="flex flex-1 flex-col p-6">
      <TemplateManager templates={templates} onTemplatesChange={setTemplates} usageStats={usageStats} />
    </div>
  )
}

