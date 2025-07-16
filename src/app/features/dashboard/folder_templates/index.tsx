import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"
import { PLANTILLAS_CARPETAS, ETAPAS } from "@/shared/data/project-data"
import type { FolderTemplate, TemplateUsageStats, TemplateSet } from "@/shared/types/template-types"
import TemplateManager from "./_components/template-manager"
import TemplateSetsManager from "./_components/template-sets-manager"

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<FolderTemplate[]>([])
  const [templateSets, setTemplateSets] = useState<TemplateSet[]>([])
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

    // Crear template sets por etapa
    const defaultTemplateSets: TemplateSet[] = ETAPAS.map((etapa, index) => {
      const templatesForEtapa = defaultTemplates.filter(t => t.etapas.includes(etapa))
      return {
        id: `set-${etapa.toLowerCase().replace(/\s+/g, "-")}`,
        name: `Plantilla Completa - ${etapa}`,
        description: `Conjunto completo de carpetas recomendadas para proyectos en etapa: ${etapa}`,
        etapa,
        folders: templatesForEtapa,
        createdAt: new Date(Date.now() - (ETAPAS.length - index) * 24 * 60 * 60 * 1000), // Fechas escalonadas
        createdBy: "Sistema",
        isDefault: true,
        isActive: true,
      }
    })

    // Agregar algunos template sets personalizados
    const customTemplateSets: TemplateSet[] = [
      {
        id: "set-custom-legal",
        name: "Paquete Legal Básico",
        description: "Conjunto mínimo de carpetas para aspectos legales y contractuales",
        etapa: "Proyectos en Licitación",
        folders: defaultTemplates.filter(t =>
          t.name.includes("Licitación") ||
          t.name.includes("Adjudicación") ||
          t.name.includes("Documentación Técnica")
        ),
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        createdBy: "Ana García",
        isDefault: false,
        isActive: true,
      },
      {
        id: "set-custom-construction",
        name: "Paquete Construcción Avanzado",
        description: "Plantilla especializada para proyectos de construcción con seguimiento detallado",
        etapa: "Concesiones en Construcción",
        folders: defaultTemplates.filter(t =>
          t.name.includes("Ejecución") ||
          t.name.includes("Modificaciones") ||
          t.name.includes("Informe") ||
          t.name.includes("Construcción")
        ),
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        createdBy: "Carlos Rodríguez",
        isDefault: false,
        isActive: true,
      },
      {
        id: "set-custom-operations",
        name: "Paquete Operacional Estándar",
        description: "Carpetas esenciales para la gestión operacional de concesiones activas",
        etapa: "Concesiones en Operación",
        folders: defaultTemplates.filter(t =>
          t.name.includes("Operacional") ||
          t.name.includes("Informe") ||
          t.name.includes("Modificaciones")
        ),
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        createdBy: "María López",
        isDefault: false,
        isActive: true,
      }
    ]

    setTemplateSets([...defaultTemplateSets, ...customTemplateSets])

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
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Gestión de plantillas</h1>
        <p className="text-muted-foreground mt-2">
          Administra plantillas de carpetas individuales y conjuntos de plantillas para diferentes etapas de proyecto
        </p>
      </div>

      <Tabs defaultValue="folders" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="folders">Carpetas individuales</TabsTrigger>
          <TabsTrigger value="sets">Plantillas</TabsTrigger>
        </TabsList>

        <TabsContent value="folders" className="space-y-4">
          <TemplateManager
            templates={templates}
            onTemplatesChange={setTemplates}
            usageStats={usageStats}
          />
        </TabsContent>

        <TabsContent value="sets" className="space-y-4">
          <TemplateSetsManager
            templateSets={templateSets}
            onTemplateSetsChange={setTemplateSets}
            availableTemplates={templates}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

