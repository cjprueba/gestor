export interface MockDocument {
  id: string
  name: string
  type:
    | 'carta'
    | 'Oficio'
    | 'Memorandum'
    | 'Providencia'
    | 'Folio'
    | 'Correo'
    | 'LOE'
    | 'Plano'
    | 'Especificacion'
    | 'Permiso'
    | 'Material'
    | 'otro'
  fileType: 'pdf' | 'docx' | 'xlsx' | 'pptx' | 'jpg' | 'png' | 'dwg'
  size: string
  uploadedAt: string
  dueDate?: string
  uploadedBy: string
  folderId: string
  projectId: string
  status: 'activo' | 'archivado' | 'eliminado'
  version: number
  tags?: string[]
}

export const MOCK_DOCUMENTS: MockDocument[] = [
  // Documentos para Proyecto Alpha
  {
    id: 'doc-1',
    name: 'Bases_Licitacion_Alpha_v1.pdf',
    type: 'otro',
    fileType: 'pdf',
    size: '2.4 MB',
    uploadedAt: '2024-01-15T10:30:00Z',
    dueDate: '2024-02-15T23:59:59Z',
    uploadedBy: '1', // Ana García
    folderId: 'folder-licitacion-alpha',
    projectId: 'proj-alpha',
    status: 'activo',
    version: 1,
    tags: ['licitacion', 'bases'],
  },
  {
    id: 'doc-2',
    name: 'Consultas_Respuestas_Alpha.docx',
    type: 'Oficio',
    fileType: 'docx',
    size: '1.2 MB',
    uploadedAt: '2024-01-20T14:15:00Z',
    uploadedBy: '2', // Carlos Rodríguez
    folderId: 'folder-licitacion-alpha',
    projectId: 'proj-alpha',
    status: 'activo',
    version: 1,
    tags: ['consultas', 'respuestas'],
  },
  {
    id: 'doc-3',
    name: 'Acta_Reunion_001_Alpha.pdf',
    type: 'otro',
    fileType: 'pdf',
    size: '800 KB',
    uploadedAt: '2024-01-22T09:30:00Z',
    uploadedBy: '3', // María López
    folderId: 'folder-licitacion-alpha',
    projectId: 'proj-alpha',
    status: 'activo',
    version: 1,
    tags: ['acta', 'reunion'],
  },
  {
    id: 'doc-4',
    name: 'Informe_Tecnico_Alpha.pdf',
    type: 'otro',
    fileType: 'pdf',
    size: '3.1 MB',
    uploadedAt: '2024-01-25T11:45:00Z',
    uploadedBy: '1',
    folderId: 'folder-adjudicacion-alpha',
    projectId: 'proj-alpha',
    status: 'activo',
    version: 1,
    tags: ['tecnico', 'informe'],
  },
  {
    id: 'doc-5',
    name: 'Decreto_Adjudicacion_Alpha.pdf',
    type: 'otro',
    fileType: 'pdf',
    size: '1.8 MB',
    uploadedAt: '2024-01-26T16:20:00Z',
    uploadedBy: '2',
    folderId: 'folder-adjudicacion-alpha',
    projectId: 'proj-alpha',
    status: 'activo',
    version: 1,
    tags: ['decreto', 'adjudicacion'],
  },

  // Documentos para Proyecto Beta
  {
    id: 'doc-6',
    name: 'Contrato_Principal_Beta.pdf',
    type: 'otro',
    fileType: 'pdf',
    size: '4.2 MB',
    uploadedAt: '2024-01-18T13:00:00Z',
    uploadedBy: '1',
    folderId: 'folder-ejecucion-beta',
    projectId: 'proj-beta',
    status: 'activo',
    version: 1,
    tags: ['contrato', 'principal'],
  },
  {
    id: 'doc-7',
    name: 'Estados_Pago_Enero_Beta.xlsx',
    type: 'otro',
    fileType: 'xlsx',
    size: '1.5 MB',
    uploadedAt: '2024-01-31T17:30:00Z',
    uploadedBy: '3',
    folderId: 'folder-ejecucion-beta',
    projectId: 'proj-beta',
    status: 'activo',
    version: 1,
    tags: ['estados', 'pago'],
  },
  {
    id: 'doc-8',
    name: 'Informe_Mensual_Enero_Beta.pdf',
    type: 'otro',
    fileType: 'pdf',
    size: '2.8 MB',
    uploadedAt: '2024-02-01T10:15:00Z',
    uploadedBy: '2',
    folderId: 'folder-informe-beta',
    projectId: 'proj-beta',
    status: 'activo',
    version: 1,
    tags: ['informe', 'mensual'],
  },
  {
    id: 'doc-9',
    name: 'Fotografias_Avance_Enero.zip',
    type: 'otro',
    fileType: 'jpg',
    size: '12.4 MB',
    uploadedAt: '2024-02-01T14:45:00Z',
    uploadedBy: '4',
    folderId: 'folder-informe-beta',
    projectId: 'proj-beta',
    status: 'activo',
    version: 1,
    tags: ['fotografias', 'avance'],
  },
  {
    id: 'doc-10',
    name: 'Manual_Operacion_Beta.pdf',
    type: 'otro',
    fileType: 'pdf',
    size: '5.6 MB',
    uploadedAt: '2024-01-28T12:20:00Z',
    uploadedBy: '1',
    folderId: 'folder-operacional-beta',
    projectId: 'proj-beta',
    status: 'activo',
    version: 1,
    tags: ['manual', 'operacion'],
  },

  // Documentos para Proyecto Gamma
  {
    id: 'doc-11',
    name: 'Acta_Entrega_Final_Gamma.pdf',
    type: 'otro',
    fileType: 'pdf',
    size: '2.1 MB',
    uploadedAt: '2024-01-30T15:30:00Z',
    uploadedBy: '2',
    folderId: 'folder-final-gamma',
    projectId: 'proj-gamma',
    status: 'activo',
    version: 1,
    tags: ['acta', 'entrega', 'final'],
  },
  {
    id: 'doc-12',
    name: 'Liquidacion_Final_Gamma.xlsx',
    type: 'otro',
    fileType: 'xlsx',
    size: '2.4 MB',
    uploadedAt: '2024-02-02T11:00:00Z',
    uploadedBy: '3',
    folderId: 'folder-final-gamma',
    projectId: 'proj-gamma',
    status: 'activo',
    version: 1,
    tags: ['liquidacion', 'final'],
  },
  {
    id: 'doc-13',
    name: 'Garantias_Obra_Gamma.pdf',
    type: 'otro',
    fileType: 'pdf',
    size: '1.7 MB',
    uploadedAt: '2024-02-03T09:45:00Z',
    uploadedBy: '1',
    folderId: 'folder-final-gamma',
    projectId: 'proj-gamma',
    status: 'activo',
    version: 1,
    tags: ['garantias', 'obra'],
  },
  {
    id: 'doc-14',
    name: 'Informe_Cierre_Gamma.pdf',
    type: 'otro',
    fileType: 'pdf',
    size: '3.2 MB',
    uploadedAt: '2024-02-04T16:15:00Z',
    uploadedBy: '2',
    folderId: 'folder-cierre-gamma',
    projectId: 'proj-gamma',
    status: 'activo',
    version: 1,
    tags: ['informe', 'cierre'],
  },
  {
    id: 'doc-15',
    name: 'Documentacion_Archivo_Gamma.pdf',
    type: 'otro',
    fileType: 'pdf',
    size: '8.5 MB',
    uploadedAt: '2024-02-05T13:20:00Z',
    uploadedBy: '4',
    folderId: 'folder-cierre-gamma',
    projectId: 'proj-gamma',
    status: 'activo',
    version: 1,
    tags: ['documentacion', 'archivo'],
  },
]

export const DOCUMENT_TYPES = [
  'carta',
  'Oficio',
  'Memorandum',
  'Providencia',
  'Folio',
  'Correo',
  'LOE',
  'Plano',
  'Especificacion',
  'Permiso',
  'Material',
  'otro',
] as const

export const FILE_TYPES = [
  'pdf',
  'docx',
  'xlsx',
  'pptx',
  'jpg',
  'png',
  'dwg',
] as const

export const DOCUMENT_STATUS = ['activo', 'archivado', 'eliminado'] as const
