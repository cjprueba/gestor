// ===== FUENTE ÚNICA DE LA VERDAD - DATOS MOCK CENTRALIZADOS =====
// Este archivo centraliza todos los datos mock/dummy del proyecto
// Todos los componentes deben importar desde aquí

// Datos de configuración del proyecto
export {
  ETAPAS,
  TIPOS_INICIATIVA,
  TIPOS_OBRA,
  ROLES_INSPECTOR,
  REGIONES,
  PROVINCIAS,
  COMUNAS,
  PLANTILLAS_CARPETAS,
} from './project-data'

// Datos de estructura por defecto de proyectos
export { defaultStructure } from './default-project-data'

// Datos de usuarios
export {
  MOCK_USERS,
  DEPARTMENTS,
  USER_ROLES,
  PERMISSION_TYPES,
  type User,
} from './users'

// Datos de documentos
export {
  MOCK_DOCUMENTS,
  DOCUMENT_TYPES,
  FILE_TYPES,
  DOCUMENT_STATUS,
  type MockDocument,
} from './documents'

// Datos de proyectos completos
export {
  MOCK_PROJECTS,
  getDocumentsByProject,
  getProjectsByStage,
  DEFAULT_FOLDER_TEMPLATES,
} from './projects'

// Datos de actividades documentales y hitos
export {
  MOCK_ACTIVIDADES_DOCUMENTALES,
  MOCK_HITOS,
  getActividadesByProject,
  getActividadesByUser,
  getActividadesConCambioEtapa,
} from './milestones'

// Importar para usar en funciones helper
import { MOCK_USERS } from './users'
import { MOCK_DOCUMENTS } from './documents'
import { MOCK_PROJECTS } from './projects'
import { MOCK_ACTIVIDADES_DOCUMENTALES } from './milestones'
import { ETAPAS } from './project-data'

// ===== DATOS ADICIONALES PARA OTRAS FUNCIONALIDADES =====

// Datos para unidades organizacionales (divisiones, departamentos, unidades)
export const MOCK_DIVISIONS = [
  {
    id: '1',
    name: 'División Operativa',
    type: 'OPERATIVA' as const,
    status: 'ACTIVA' as const,
    observations: 'División principal de operaciones',
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-10T10:00:00Z',
    createdBy: { id: '1', name: 'Ana García', email: 'ana.garcia@empresa.com' },
    departmentCount: 3,
    unitCount: 8,
  },
  {
    id: '2',
    name: 'División Administrativa',
    type: 'ADMINISTRATIVA' as const,
    status: 'ACTIVA' as const,
    observations: 'Gestión administrativa y financiera',
    createdAt: '2024-01-12T14:30:00Z',
    updatedAt: '2024-01-12T14:30:00Z',
    createdBy: {
      id: '2',
      name: 'Carlos Rodríguez',
      email: 'carlos.rodriguez@empresa.com',
    },
    departmentCount: 2,
    unitCount: 5,
  },
  {
    id: '3',
    name: 'División Técnica',
    type: 'TECNICA' as const,
    status: 'ACTIVA' as const,
    observations: 'Desarrollo y mantenimiento técnico',
    createdAt: '2024-01-15T09:15:00Z',
    updatedAt: '2024-01-15T09:15:00Z',
    createdBy: { id: '1', name: 'Ana García', email: 'ana.garcia@empresa.com' },
    departmentCount: 2,
    unitCount: 6,
  },
]

export const MOCK_DEPARTMENTS = [
  {
    id: '1',
    name: 'Gerencia de Operaciones',
    type: 'GERENCIA' as const,
    divisionId: '1',
    division: { id: '1', name: 'División Operativa' },
    status: 'ACTIVO' as const,
    observations: 'Coordinación general de operaciones',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    createdBy: { id: '1', name: 'Ana García', email: 'ana.garcia@empresa.com' },
    unitCount: 4,
  },
  {
    id: '2',
    name: 'Coordinación de Producción',
    type: 'COORDINACION' as const,
    divisionId: '1',
    division: { id: '1', name: 'División Operativa' },
    status: 'ACTIVO' as const,
    observations: 'Gestión de procesos productivos',
    createdAt: '2024-01-15T11:00:00Z',
    updatedAt: '2024-01-15T11:00:00Z',
    createdBy: { id: '2', name: 'Carlos López', email: 'carlos@empresa.com' },
    unitCount: 3,
  },
  {
    id: '3',
    name: 'Recursos Humanos',
    type: 'GERENCIA' as const,
    divisionId: '2',
    division: { id: '2', name: 'División Administrativa' },
    status: 'ACTIVO' as const,
    observations: 'Gestión del capital humano',
    createdAt: '2024-01-16T09:00:00Z',
    updatedAt: '2024-01-16T09:00:00Z',
    createdBy: { id: '3', name: 'Ana Martín', email: 'ana@empresa.com' },
    unitCount: 2,
  },
]

// Datos para archivos y colecciones (recursos)
export const MOCK_FILES = [
  {
    id: 'file-1',
    name: 'Reporte_Mensual_Enero.pdf',
    type: 'document' as const,
    size: 2456789,
    modified: new Date('2024-01-25T14:30:00Z'),
    starred: true,
    shared: false,
    thumbnail: undefined,
    path: '/Documentos/Reportes',
    parentId: null,
  },
  {
    id: 'file-2',
    name: 'Presentacion_Trimestral.pptx',
    type: 'presentation' as const,
    size: 5678901,
    modified: new Date('2024-01-20T16:45:00Z'),
    starred: false,
    shared: true,
    thumbnail: undefined,
    path: '/Documentos/Presentaciones',
    parentId: null,
  },
  {
    id: 'file-3',
    name: 'Presupuesto_2024.xlsx',
    type: 'spreadsheet' as const,
    size: 1234567,
    modified: new Date('2024-01-15T11:20:00Z'),
    starred: true,
    shared: false,
    thumbnail: undefined,
    path: '/Documentos/Finanzas',
    parentId: null,
  },
]

export const MOCK_COLLECTIONS = [
  {
    id: 'coll-1',
    name: 'Documentos Importantes',
    icon: 'star',
    fileIds: ['file-1', 'file-3'],
  },
  {
    id: 'coll-2',
    name: 'Trabajo en Progreso',
    icon: 'clock',
    fileIds: ['file-2'],
  },
  {
    id: 'coll-3',
    name: 'Archivos Compartidos',
    icon: 'users',
    fileIds: ['file-2'],
  },
]

// ===== FUNCIONES HELPER GLOBALES =====

// Obtener usuario por ID
export const getUserById = (userId: string) => {
  return MOCK_USERS.find((user) => user.id === userId)
}

// Obtener documento por ID
export const getDocumentById = (documentId: string) => {
  return MOCK_DOCUMENTS.find((doc) => doc.id === documentId)
}

// Obtener proyecto por ID
export const getProjectById = (projectId: string) => {
  return MOCK_PROJECTS.find((project) => project.id === projectId)
}

// Obtener todos los documentos de un usuario
export const getDocumentsByUser = (userId: string) => {
  return MOCK_DOCUMENTS.filter((doc) => doc.uploadedBy === userId)
}

// Obtener estadísticas generales
export const getGeneralStats = () => {
  return {
    totalProjects: MOCK_PROJECTS.length,
    totalDocuments: MOCK_DOCUMENTS.length,
    totalUsers: MOCK_USERS.length,
    totalActivities: MOCK_ACTIVIDADES_DOCUMENTALES.length,
    projectsByStage: ETAPAS.map((etapa) => ({
      stage: etapa,
      count: MOCK_PROJECTS.filter((p) => p.etapa === etapa).length,
    })),
  }
}
