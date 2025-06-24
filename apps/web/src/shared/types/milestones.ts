export type HitoEstado =
  | 'Por Cumplir'
  | 'Por Vencer'
  | 'Vencido'
  | 'Recepcionado'
  | 'Aprobado'

export type HitoPeriodo = 'mensual' | 'trimestral' | 'semestral' | 'anual'

export type TipoActividad =
  | 'creacion_documento'
  | 'subida_archivo'
  | 'actualizacion_documento'
  | 'eliminacion_documento'

export interface ActividadDocumental {
  id: string
  nombre: string
  descripcion?: string
  tipoActividad: TipoActividad
  fechaActividad: string
  fechaVencimiento?: string
  proyecto: {
    id: string
    nombre: string
    tipo: 'concesión' | 'Proyecto' | 'Contrato' | 'Edificio Residencial'
  }
  carpeta: {
    id: string
    nombre: string
    rutaCarpeta: string
  }
  documento: {
    id: string
    nombre: string
    tipo:
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
    tamaño: string
    extension: string
  }
  usuario: {
    id: string
    name: string
    email: string
  }
  estado: 'activo' | 'archivado' | 'eliminado'
  metadatos?: {
    ipAddress?: string
    userAgent?: string
    dispositivo?: string
  }
  createdAt: string
  updatedAt: string
}

export interface Hito {
  id: string
  nombre: string
  descripcion?: string
  fechaVencimiento: string
  periodo: HitoPeriodo
  estado: HitoEstado
  proyecto: {
    id: string
    nombre: string
    tipo: 'concesión' | 'Proyecto' | 'Contrato' | 'Edificio Residencial'
  }
  hitoContractual: string
  recepcionado: boolean
  aprobado: boolean
  documentos: HitoDocumento[]
  responsable?: string
  fechaEntrega?: string
  createdAt: string
  updatedAt: string
  createdBy: {
    id: string
    name: string
    email: string
  }
}

export interface HitoDocumento {
  id: string
  nombre: string
  tipo:
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
  archivo: string
  fechaSubida: string
  fechaVencimiento?: string
  subidoPor: {
    id: string
    name: string
    email: string
  }
}

export interface HitoFiltros {
  division?: string
  etapa?: string
  estado?: string
  periodoAnio?: string
  periodoMes?: string
  busqueda?: string
  tipoActividad?: string
  proyecto?: string
}

export interface Division {
  id: string
  nombre: string
}

export interface Etapa {
  id: string
  nombre: string
}
