import type { FolderStructure } from '../types/project-types'

export const defaultStructure: FolderStructure[] = [
  {
    id: 'arch',
    name: 'Arquitectura',
    minDocuments: 3,
    documents: [],
    subfolders: [
      {
        id: 'arch-plans',
        name: 'Planos',
        minDocuments: 2,
        documents: [],
        subfolders: [],
        parentId: 'arch',
      },
      {
        id: 'arch-specs',
        name: 'Especificaciones',
        minDocuments: 1,
        documents: [],
        subfolders: [],
        parentId: 'arch',
      },
    ],
  },
  {
    id: 'const',
    name: 'Construcción',
    minDocuments: 3,
    documents: [],
    subfolders: [
      {
        id: 'const-permits',
        name: 'Permisos',
        minDocuments: 2,
        documents: [],
        subfolders: [],
        parentId: 'const',
      },
      {
        id: 'const-materials',
        name: 'Materiales',
        minDocuments: 1,
        documents: [],
        subfolders: [],
        parentId: 'const',
      },
    ],
  },
  {
    id: 'legal',
    name: 'Documentación Legal',
    minDocuments: 3,
    documents: [],
    subfolders: [
      {
        id: 'legal-contracts',
        name: 'Contratos',
        minDocuments: 1,
        documents: [],
        subfolders: [],
        parentId: 'legal',
      },
      {
        id: 'legal-licenses',
        name: 'Licencias',
        minDocuments: 2,
        documents: [],
        subfolders: [],
        parentId: 'legal',
      },
    ],
  },
  {
    id: 'budget',
    name: 'Presupuesto',
    minDocuments: 3,
    documents: [],
    subfolders: [
      {
        id: 'budget-estimates',
        name: 'Estimaciones',
        minDocuments: 1,
        documents: [],
        subfolders: [],
        parentId: 'budget',
      },
      {
        id: 'budget-invoices',
        name: 'Facturas',
        minDocuments: 2,
        documents: [],
        subfolders: [],
        parentId: 'budget',
      },
    ],
  },
  {
    id: 'schedule',
    name: 'Cronograma',
    minDocuments: 3,
    documents: [],
    subfolders: [
      {
        id: 'schedule-timeline',
        name: 'Línea de Tiempo',
        minDocuments: 1,
        documents: [],
        subfolders: [],
        parentId: 'schedule',
      },
      {
        id: 'schedule-milestones',
        name: 'Hitos',
        minDocuments: 1,
        documents: [],
        subfolders: [],
        parentId: 'schedule',
      },
    ],
  },
]
