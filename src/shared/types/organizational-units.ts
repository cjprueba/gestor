export interface Division {
  id: string
  name: string
  type: 'OPERATIVA' | 'ADMINISTRATIVA' | 'COMERCIAL' | 'TECNICA'
  status: 'ACTIVA' | 'INACTIVA' | 'SUSPENDIDA'
  observations?: string
  createdAt: string
  updatedAt: string
  createdBy: {
    id: string
    name: string
    email: string
  }
  departmentCount: number
  unitCount: number
}

export interface Department {
  id: string
  name: string
  type: 'GERENCIA' | 'COORDINACION' | 'SUPERVISION' | 'OPERATIVO'
  divisionId: string
  division: {
    id: string
    name: string
  }
  observations?: string
  status: 'ACTIVO' | 'INACTIVO'
  createdAt: string
  updatedAt: string
  createdBy: {
    id: string
    name: string
    email: string
  }
  unitCount: number
}

export interface Unit {
  id: string
  name: string
  status: 'ACTIVA' | 'INACTIVA' | 'EN_MANTENIMIENTO'
  divisionId: string
  departmentId?: string
  projectId?: string
  assignmentType: 'DIVISION' | 'PROJECT'
  division: {
    id: string
    name: string
  }
  department?: {
    id: string
    name: string
  }
  project?: {
    id: string
    name: string
  }
  observations?: string
  createdAt: string
  updatedAt: string
  createdBy: {
    id: string
    name: string
    email: string
  }
}

export interface Project {
  id: string
  name: string
  status: 'ACTIVO' | 'PAUSADO' | 'FINALIZADO'
  description?: string
}

export interface OrganizationalFilters {
  divisionId?: string
  departmentId?: string
  status?: string
  type?: string
}
