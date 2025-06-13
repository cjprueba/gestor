export type HitoEstado = "Por Cumplir" | "Por Vencer" | "Vencido" | "Recepcionado" | "Aprobado"

export type HitoPeriodo = "mensual" | "trimestral" | "semestral" | "anual"

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
    tipo: "concesión" | "Proyecto" | "Contrato"
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
  tipo: "carta" | "Oficio" | "Memorandum" | "Providencia" | "Folio" | "Correo" | "LOE" | "otro"
  archivo: string
  fechaSubida: string
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
}

export interface Division {
  id: string
  nombre: string
}

export interface Etapa {
  id: string
  nombre: string
}
