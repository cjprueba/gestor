export interface User {
  id: string
  name: string
  email: string
  role: string
  department: string
  avatar: string
  status: 'ACTIVO' | 'INACTIVO'
  permissions: string[]
  createdAt: string
  lastLogin?: string
}

export const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Ana García',
    email: 'ana.garcia@empresa.com',
    role: 'Admin',
    department: 'IT',
    avatar: '/placeholder.svg?height=32&width=32',
    status: 'ACTIVO',
    permissions: ['view', 'edit', 'download', 'share', 'delete', 'admin'],
    createdAt: '2024-01-15T10:30:00Z',
    lastLogin: '2024-01-25T14:30:00Z',
  },
  {
    id: '2',
    name: 'Carlos Rodríguez',
    email: 'carlos.rodriguez@empresa.com',
    role: 'Project Manager',
    department: 'Operaciones',
    avatar: '/placeholder.svg?height=32&width=32',
    status: 'ACTIVO',
    permissions: ['view', 'edit', 'download', 'share'],
    createdAt: '2024-01-16T09:00:00Z',
    lastLogin: '2024-01-25T16:45:00Z',
  },
  {
    id: '3',
    name: 'María López',
    email: 'maria.lopez@empresa.com',
    role: 'User',
    department: 'Finanzas',
    avatar: '/placeholder.svg?height=32&width=32',
    status: 'ACTIVO',
    permissions: ['view', 'download'],
    createdAt: '2024-01-17T11:15:00Z',
    lastLogin: '2024-01-24T10:20:00Z',
  },
  {
    id: '4',
    name: 'Juan Pérez',
    email: 'juan.perez@empresa.com',
    role: 'Viewer',
    department: 'Legal',
    avatar: '/placeholder.svg?height=32&width=32',
    status: 'ACTIVO',
    permissions: ['view'],
    createdAt: '2024-01-18T08:30:00Z',
    lastLogin: '2024-01-23T09:15:00Z',
  },
  {
    id: '5',
    name: 'Laura Martín',
    email: 'laura.martin@empresa.com',
    role: 'User',
    department: 'RRHH',
    avatar: '/placeholder.svg?height=32&width=32',
    status: 'ACTIVO',
    permissions: ['view', 'edit', 'download'],
    createdAt: '2024-01-19T12:00:00Z',
    lastLogin: '2024-01-25T11:30:00Z',
  },
  {
    id: '6',
    name: 'Diego Silva',
    email: 'diego.silva@empresa.com',
    role: 'User',
    department: 'Ventas',
    avatar: '/placeholder.svg?height=32&width=32',
    status: 'ACTIVO',
    permissions: ['view', 'download', 'share'],
    createdAt: '2024-01-20T13:45:00Z',
    lastLogin: '2024-01-22T15:20:00Z',
  },
]

export const DEPARTMENTS = [
  'IT',
  'Operaciones',
  'Finanzas',
  'Legal',
  'RRHH',
  'Ventas',
  'Gerencia',
  'Coordinación',
  'Supervisión',
] as const

export const USER_ROLES = [
  'Admin',
  'Project Manager',
  'User',
  'Viewer',
  'Supervisor',
  'Coordinator',
] as const

export const PERMISSION_TYPES = [
  'view',
  'edit',
  'download',
  'share',
  'delete',
  'admin',
] as const
