import type { ActividadDocumental, Hito } from '../types/milestones'

export const MOCK_ACTIVIDADES_DOCUMENTALES: ActividadDocumental[] = [
  // ACTIVIDADES PARA PROYECTO ALPHA (5 documentos)
  {
    id: 'act-1',
    nombre: 'Creación de Bases de Licitación',
    descripcion: 'Documento inicial para proceso licitatorio',
    tipoActividad: 'creacion_documento',
    fechaActividad: '2024-01-15T10:30:00Z',
    fechaVencimiento: '2024-02-15T23:59:59Z',
    proyecto: {
      id: 'proj-alpha',
      nombre: 'Autopista Norte - Región Metropolitana',
      tipo: 'Proyecto',
    },
    carpeta: {
      id: 'folder-licitacion-alpha',
      nombre: 'Proceso de licitacion',
      rutaCarpeta: '/Autopista Norte/Proceso de licitacion',
    },
    documento: {
      id: 'doc-1',
      nombre: 'Bases_Licitacion_Alpha_v1.pdf',
      tipo: 'otro',
      tamaño: '2.4 MB',
      extension: 'pdf',
    },
    usuario: {
      id: '1',
      name: 'Ana García',
      email: 'ana.garcia@empresa.com',
    },
    estado: 'activo',
    etapaAnterior: null, // No hubo cambio de etapa
    etapaActual: 'Proyectos en Licitación',
    metadatos: {
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      dispositivo: 'Desktop - Windows',
    },
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 'act-2',
    nombre: 'Subida de Consultas y Respuestas',
    descripcion: 'Documento de clarificaciones del proceso',
    tipoActividad: 'subida_archivo',
    fechaActividad: '2024-01-20T14:15:00Z',
    proyecto: {
      id: 'proj-alpha',
      nombre: 'Autopista Norte - Región Metropolitana',
      tipo: 'Proyecto',
    },
    carpeta: {
      id: 'folder-licitacion-alpha',
      nombre: 'Proceso de licitacion',
      rutaCarpeta: '/Autopista Norte/Proceso de licitacion',
    },
    documento: {
      id: 'doc-2',
      nombre: 'Consultas_Respuestas_Alpha.docx',
      tipo: 'Oficio',
      tamaño: '1.2 MB',
      extension: 'docx',
    },
    usuario: {
      id: '2',
      name: 'Carlos Rodríguez',
      email: 'carlos.rodriguez@empresa.com',
    },
    estado: 'activo',
    etapaAnterior: null,
    etapaActual: 'Proyectos en Licitación',
    metadatos: {
      ipAddress: '192.168.1.105',
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      dispositivo: 'MacBook Pro',
    },
    createdAt: '2024-01-20T14:15:00Z',
    updatedAt: '2024-01-20T14:15:00Z',
  },
  {
    id: 'act-3',
    nombre: 'Actualización de Acta de Reunión',
    descripcion: 'Modificación de acta después de revisión',
    tipoActividad: 'actualizacion_documento',
    fechaActividad: '2024-01-22T09:30:00Z',
    proyecto: {
      id: 'proj-alpha',
      nombre: 'Autopista Norte - Región Metropolitana',
      tipo: 'Proyecto',
    },
    carpeta: {
      id: 'folder-licitacion-alpha',
      nombre: 'Proceso de licitacion',
      rutaCarpeta: '/Autopista Norte/Proceso de licitacion',
    },
    documento: {
      id: 'doc-3',
      nombre: 'Acta_Reunion_001_Alpha.pdf',
      tipo: 'otro',
      tamaño: '800 KB',
      extension: 'pdf',
    },
    usuario: {
      id: '3',
      name: 'María López',
      email: 'maria.lopez@empresa.com',
    },
    estado: 'activo',
    etapaAnterior: null,
    etapaActual: 'Proyectos en Licitación',
    metadatos: {
      ipAddress: '192.168.1.102',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Edge/120.0.0.0',
      dispositivo: 'Desktop - Windows',
    },
    createdAt: '2024-01-22T09:30:00Z',
    updatedAt: '2024-01-22T09:30:00Z',
  },
  {
    id: 'act-4',
    nombre: 'Subida de Informe Técnico',
    descripcion: 'Informe técnico para adjudicación',
    tipoActividad: 'subida_archivo',
    fechaActividad: '2024-01-25T11:45:00Z',
    proyecto: {
      id: 'proj-alpha',
      nombre: 'Autopista Norte - Región Metropolitana',
      tipo: 'Proyecto',
    },
    carpeta: {
      id: 'folder-adjudicacion-alpha',
      nombre: 'Proceso de adjudicacion',
      rutaCarpeta: '/Autopista Norte/Proceso de adjudicacion',
    },
    documento: {
      id: 'doc-4',
      nombre: 'Informe_Tecnico_Alpha.pdf',
      tipo: 'otro',
      tamaño: '3.1 MB',
      extension: 'pdf',
    },
    usuario: {
      id: '1',
      name: 'Ana García',
      email: 'ana.garcia@empresa.com',
    },
    estado: 'activo',
    etapaAnterior: null,
    etapaActual: 'Proyectos en Licitación',
    metadatos: {
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      dispositivo: 'Desktop - Windows',
    },
    createdAt: '2024-01-25T11:45:00Z',
    updatedAt: '2024-01-25T11:45:00Z',
  },
  {
    id: 'act-5',
    nombre: 'Creación de Decreto de Adjudicación',
    descripcion: 'Decreto oficial de adjudicación del proyecto',
    tipoActividad: 'creacion_documento',
    fechaActividad: '2024-01-26T16:20:00Z',
    proyecto: {
      id: 'proj-alpha',
      nombre: 'Autopista Norte - Región Metropolitana',
      tipo: 'Proyecto',
    },
    carpeta: {
      id: 'folder-adjudicacion-alpha',
      nombre: 'Proceso de adjudicacion',
      rutaCarpeta: '/Autopista Norte/Proceso de adjudicacion',
    },
    documento: {
      id: 'doc-5',
      nombre: 'Decreto_Adjudicacion_Alpha.pdf',
      tipo: 'otro',
      tamaño: '1.8 MB',
      extension: 'pdf',
    },
    usuario: {
      id: '2',
      name: 'Carlos Rodríguez',
      email: 'carlos.rodriguez@empresa.com',
    },
    estado: 'activo',
    etapaAnterior: null,
    etapaActual: 'Proyectos en Licitación',
    metadatos: {
      ipAddress: '192.168.1.105',
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      dispositivo: 'MacBook Pro',
    },
    createdAt: '2024-01-26T16:20:00Z',
    updatedAt: '2024-01-26T16:20:00Z',
  },

  // ACTIVIDADES PARA PROYECTO BETA (5 documentos con cambio de etapa)
  {
    id: 'act-6',
    nombre: 'Subida de Contrato Principal',
    descripcion: 'Contrato marco del proyecto hospitalario',
    tipoActividad: 'subida_archivo',
    fechaActividad: '2024-01-18T13:00:00Z',
    proyecto: {
      id: 'proj-beta',
      nombre: 'Hospital Regional del Biobío',
      tipo: 'concesión',
    },
    carpeta: {
      id: 'folder-ejecucion-beta',
      nombre: 'Ejecucion',
      rutaCarpeta: '/Hospital Biobío/Ejecucion',
    },
    documento: {
      id: 'doc-6',
      nombre: 'Contrato_Principal_Beta.pdf',
      tipo: 'otro',
      tamaño: '4.2 MB',
      extension: 'pdf',
    },
    usuario: {
      id: '1',
      name: 'Ana García',
      email: 'ana.garcia@empresa.com',
    },
    estado: 'activo',
    etapaAnterior: 'Concesiones en Operación', // Había un cambio de etapa
    etapaActual: 'Concesiones en Operación y Construcción',
    metadatos: {
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      dispositivo: 'Desktop - Windows',
    },
    createdAt: '2024-01-18T13:00:00Z',
    updatedAt: '2024-01-20T11:00:00Z', // Actualizado cuando cambió la etapa
  },
  {
    id: 'act-7',
    nombre: 'Creación de Estados de Pago',
    descripcion: 'Estados de pago mensuales del proyecto',
    tipoActividad: 'creacion_documento',
    fechaActividad: '2024-01-31T17:30:00Z',
    proyecto: {
      id: 'proj-beta',
      nombre: 'Hospital Regional del Biobío',
      tipo: 'concesión',
    },
    carpeta: {
      id: 'folder-ejecucion-beta',
      nombre: 'Ejecucion',
      rutaCarpeta: '/Hospital Biobío/Ejecucion',
    },
    documento: {
      id: 'doc-7',
      nombre: 'Estados_Pago_Enero_Beta.xlsx',
      tipo: 'otro',
      tamaño: '1.5 MB',
      extension: 'xlsx',
    },
    usuario: {
      id: '3',
      name: 'María López',
      email: 'maria.lopez@empresa.com',
    },
    estado: 'activo',
    etapaAnterior: null,
    etapaActual: 'Concesiones en Operación y Construcción',
    metadatos: {
      ipAddress: '192.168.1.102',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Edge/120.0.0.0',
      dispositivo: 'Desktop - Windows',
    },
    createdAt: '2024-01-31T17:30:00Z',
    updatedAt: '2024-01-31T17:30:00Z',
  },
  {
    id: 'act-8',
    nombre: 'Subida de Informe Mensual',
    descripcion: 'Informe mensual de operación del hospital',
    tipoActividad: 'subida_archivo',
    fechaActividad: '2024-02-01T10:15:00Z',
    proyecto: {
      id: 'proj-beta',
      nombre: 'Hospital Regional del Biobío',
      tipo: 'concesión',
    },
    carpeta: {
      id: 'folder-informe-beta',
      nombre: 'Informe de estado mensual de la consecion',
      rutaCarpeta: '/Hospital Biobío/Informe de estado mensual de la consecion',
    },
    documento: {
      id: 'doc-8',
      nombre: 'Informe_Mensual_Enero_Beta.pdf',
      tipo: 'otro',
      tamaño: '2.8 MB',
      extension: 'pdf',
    },
    usuario: {
      id: '2',
      name: 'Carlos Rodríguez',
      email: 'carlos.rodriguez@empresa.com',
    },
    estado: 'activo',
    etapaAnterior: null,
    etapaActual: 'Concesiones en Operación y Construcción',
    metadatos: {
      ipAddress: '192.168.1.105',
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      dispositivo: 'MacBook Pro',
    },
    createdAt: '2024-02-01T10:15:00Z',
    updatedAt: '2024-02-01T10:15:00Z',
  },
  {
    id: 'act-9',
    nombre: 'Subida de Fotografías de Avance',
    descripcion: 'Fotografías del progreso de construcción',
    tipoActividad: 'subida_archivo',
    fechaActividad: '2024-02-01T14:45:00Z',
    proyecto: {
      id: 'proj-beta',
      nombre: 'Hospital Regional del Biobío',
      tipo: 'concesión',
    },
    carpeta: {
      id: 'folder-informe-beta',
      nombre: 'Informe de estado mensual de la consecion',
      rutaCarpeta: '/Hospital Biobío/Informe de estado mensual de la consecion',
    },
    documento: {
      id: 'doc-9',
      nombre: 'Fotografias_Avance_Enero.zip',
      tipo: 'otro',
      tamaño: '12.4 MB',
      extension: 'jpg',
    },
    usuario: {
      id: '4',
      name: 'Juan Pérez',
      email: 'juan.perez@empresa.com',
    },
    estado: 'activo',
    etapaAnterior: null,
    etapaActual: 'Concesiones en Operación y Construcción',
    metadatos: {
      ipAddress: '192.168.1.103',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
      dispositivo: 'Desktop - Windows',
    },
    createdAt: '2024-02-01T14:45:00Z',
    updatedAt: '2024-02-01T14:45:00Z',
  },
  {
    id: 'act-10',
    nombre: 'Creación de Manual de Operación',
    descripcion: 'Manual de operación del hospital',
    tipoActividad: 'creacion_documento',
    fechaActividad: '2024-01-28T12:20:00Z',
    proyecto: {
      id: 'proj-beta',
      nombre: 'Hospital Regional del Biobío',
      tipo: 'concesión',
    },
    carpeta: {
      id: 'folder-operacional-beta',
      nombre: 'Documentación Operacional',
      rutaCarpeta: '/Hospital Biobío/Documentación Operacional',
    },
    documento: {
      id: 'doc-10',
      nombre: 'Manual_Operacion_Beta.pdf',
      tipo: 'otro',
      tamaño: '5.6 MB',
      extension: 'pdf',
    },
    usuario: {
      id: '1',
      name: 'Ana García',
      email: 'ana.garcia@empresa.com',
    },
    estado: 'activo',
    etapaAnterior: 'Concesiones en Operación', // Cambio de etapa
    etapaActual: 'Concesiones en Operación y Construcción',
    metadatos: {
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      dispositivo: 'Desktop - Windows',
    },
    createdAt: '2024-01-28T12:20:00Z',
    updatedAt: '2024-01-28T12:20:00Z',
  },

  // ACTIVIDADES PARA PROYECTO GAMMA (5 documentos - proyecto finalizado)
  {
    id: 'act-11',
    nombre: 'Subida de Acta de Entrega Final',
    descripcion: 'Acta oficial de entrega del proyecto',
    tipoActividad: 'subida_archivo',
    fechaActividad: '2024-01-30T15:30:00Z',
    proyecto: {
      id: 'proj-gamma',
      nombre: 'Túnel Las Palmas',
      tipo: 'concesión',
    },
    carpeta: {
      id: 'folder-final-gamma',
      nombre: 'Documentación Final',
      rutaCarpeta: '/Túnel Las Palmas/Documentación Final',
    },
    documento: {
      id: 'doc-11',
      nombre: 'Acta_Entrega_Final_Gamma.pdf',
      tipo: 'otro',
      tamaño: '2.1 MB',
      extension: 'pdf',
    },
    usuario: {
      id: '2',
      name: 'Carlos Rodríguez',
      email: 'carlos.rodriguez@empresa.com',
    },
    estado: 'activo',
    etapaAnterior: 'Concesiones en Operación', // Cambio de etapa al finalizar
    etapaActual: 'Concesiones Finalizadas',
    metadatos: {
      ipAddress: '192.168.1.105',
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      dispositivo: 'MacBook Pro',
    },
    createdAt: '2024-01-30T15:30:00Z',
    updatedAt: '2024-01-30T15:30:00Z',
  },
  {
    id: 'act-12',
    nombre: 'Creación de Liquidación Final',
    descripcion: 'Liquidación financiera final del proyecto',
    tipoActividad: 'creacion_documento',
    fechaActividad: '2024-02-02T11:00:00Z',
    proyecto: {
      id: 'proj-gamma',
      nombre: 'Túnel Las Palmas',
      tipo: 'concesión',
    },
    carpeta: {
      id: 'folder-final-gamma',
      nombre: 'Documentación Final',
      rutaCarpeta: '/Túnel Las Palmas/Documentación Final',
    },
    documento: {
      id: 'doc-12',
      nombre: 'Liquidacion_Final_Gamma.xlsx',
      tipo: 'otro',
      tamaño: '2.4 MB',
      extension: 'xlsx',
    },
    usuario: {
      id: '3',
      name: 'María López',
      email: 'maria.lopez@empresa.com',
    },
    estado: 'activo',
    etapaAnterior: null,
    etapaActual: 'Concesiones Finalizadas',
    metadatos: {
      ipAddress: '192.168.1.102',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Edge/120.0.0.0',
      dispositivo: 'Desktop - Windows',
    },
    createdAt: '2024-02-02T11:00:00Z',
    updatedAt: '2024-02-02T11:00:00Z',
  },
  {
    id: 'act-13',
    nombre: 'Subida de Garantías de Obra',
    descripcion: 'Documentos de garantías del proyecto',
    tipoActividad: 'subida_archivo',
    fechaActividad: '2024-02-03T09:45:00Z',
    proyecto: {
      id: 'proj-gamma',
      nombre: 'Túnel Las Palmas',
      tipo: 'concesión',
    },
    carpeta: {
      id: 'folder-final-gamma',
      nombre: 'Documentación Final',
      rutaCarpeta: '/Túnel Las Palmas/Documentación Final',
    },
    documento: {
      id: 'doc-13',
      nombre: 'Garantias_Obra_Gamma.pdf',
      tipo: 'otro',
      tamaño: '1.7 MB',
      extension: 'pdf',
    },
    usuario: {
      id: '1',
      name: 'Ana García',
      email: 'ana.garcia@empresa.com',
    },
    estado: 'activo',
    etapaAnterior: null,
    etapaActual: 'Concesiones Finalizadas',
    metadatos: {
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      dispositivo: 'Desktop - Windows',
    },
    createdAt: '2024-02-03T09:45:00Z',
    updatedAt: '2024-02-03T09:45:00Z',
  },
  {
    id: 'act-14',
    nombre: 'Creación de Informe de Cierre',
    descripcion: 'Informe final de cierre del proyecto',
    tipoActividad: 'creacion_documento',
    fechaActividad: '2024-02-04T16:15:00Z',
    proyecto: {
      id: 'proj-gamma',
      nombre: 'Túnel Las Palmas',
      tipo: 'concesión',
    },
    carpeta: {
      id: 'folder-cierre-gamma',
      nombre: 'Cierre de Concesión',
      rutaCarpeta: '/Túnel Las Palmas/Cierre de Concesión',
    },
    documento: {
      id: 'doc-14',
      nombre: 'Informe_Cierre_Gamma.pdf',
      tipo: 'otro',
      tamaño: '3.2 MB',
      extension: 'pdf',
    },
    usuario: {
      id: '2',
      name: 'Carlos Rodríguez',
      email: 'carlos.rodriguez@empresa.com',
    },
    estado: 'activo',
    etapaAnterior: 'Concesiones en Operación', // Cambio de etapa al finalizar
    etapaActual: 'Concesiones Finalizadas',
    metadatos: {
      ipAddress: '192.168.1.105',
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      dispositivo: 'MacBook Pro',
    },
    createdAt: '2024-02-04T16:15:00Z',
    updatedAt: '2024-02-04T16:15:00Z',
  },
  {
    id: 'act-15',
    nombre: 'Archivo de Documentación Final',
    descripcion: 'Archivado completo de documentos del proyecto',
    tipoActividad: 'subida_archivo',
    fechaActividad: '2024-02-05T13:20:00Z',
    proyecto: {
      id: 'proj-gamma',
      nombre: 'Túnel Las Palmas',
      tipo: 'concesión',
    },
    carpeta: {
      id: 'folder-cierre-gamma',
      nombre: 'Cierre de Concesión',
      rutaCarpeta: '/Túnel Las Palmas/Cierre de Concesión',
    },
    documento: {
      id: 'doc-15',
      nombre: 'Documentacion_Archivo_Gamma.pdf',
      tipo: 'otro',
      tamaño: '8.5 MB',
      extension: 'pdf',
    },
    usuario: {
      id: '4',
      name: 'Juan Pérez',
      email: 'juan.perez@empresa.com',
    },
    estado: 'archivado',
    etapaAnterior: null,
    etapaActual: 'Concesiones Finalizadas',
    metadatos: {
      ipAddress: '192.168.1.103',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
      dispositivo: 'Desktop - Windows',
    },
    createdAt: '2024-02-05T13:20:00Z',
    updatedAt: '2024-02-05T13:20:00Z',
  },
]

// Hitos mock relacionados con los documentos
export const MOCK_HITOS: Hito[] = [
  {
    id: 'hito-1',
    nombre: 'Entrega de Bases de Licitación',
    descripcion: 'Publicación oficial de las bases del proceso licitatorio',
    fechaVencimiento: '2024-02-15T23:59:59Z',
    periodo: 'mensual',
    estado: 'Por Cumplir',
    proyecto: {
      id: 'proj-alpha',
      nombre: 'Autopista Norte - Región Metropolitana',
      tipo: 'Proyecto',
    },
    hitoContractual: 'Proceso de Licitación',
    recepcionado: false,
    aprobado: false,
    documentos: [
      {
        id: 'doc-1',
        nombre: 'Bases_Licitacion_Alpha_v1.pdf',
        tipo: 'otro',
        archivo: '/uploads/doc-1.pdf',
        fechaSubida: '2024-01-15T10:30:00Z',
        fechaVencimiento: '2024-02-15T23:59:59Z',
        subidoPor: {
          id: '1',
          name: 'Ana García',
          email: 'ana.garcia@empresa.com',
        },
      },
    ],
    responsable: 'Ana García',
    fechaEntrega: '2024-01-15T10:30:00Z',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    createdBy: {
      id: '1',
      name: 'Ana García',
      email: 'ana.garcia@empresa.com',
    },
  },
  {
    id: 'hito-2',
    nombre: 'Informe Mensual de Operación',
    descripcion: 'Reporte mensual del estado operacional del hospital',
    fechaVencimiento: '2024-02-28T23:59:59Z',
    periodo: 'mensual',
    estado: 'Por Vencer',
    proyecto: {
      id: 'proj-beta',
      nombre: 'Hospital Regional del Biobío',
      tipo: 'concesión',
    },
    hitoContractual: 'Operación y Mantenimiento',
    recepcionado: false,
    aprobado: false,
    documentos: [
      {
        id: 'doc-8',
        nombre: 'Informe_Mensual_Enero_Beta.pdf',
        tipo: 'otro',
        archivo: '/uploads/doc-8.pdf',
        fechaSubida: '2024-02-01T10:15:00Z',
        subidoPor: {
          id: '2',
          name: 'Carlos Rodríguez',
          email: 'carlos.rodriguez@empresa.com',
        },
      },
    ],
    responsable: 'Carlos Rodríguez',
    fechaEntrega: '2024-02-01T10:15:00Z',
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-02-01T10:15:00Z',
    createdBy: {
      id: '2',
      name: 'Carlos Rodríguez',
      email: 'carlos.rodriguez@empresa.com',
    },
  },
  {
    id: 'hito-3',
    nombre: 'Cierre de Concesión',
    descripcion: 'Documentación final para el cierre de la concesión del túnel',
    fechaVencimiento: '2024-01-31T23:59:59Z',
    periodo: 'anual',
    estado: 'Recepcionado',
    proyecto: {
      id: 'proj-gamma',
      nombre: 'Túnel Las Palmas',
      tipo: 'concesión',
    },
    hitoContractual: 'Cierre de Concesión',
    recepcionado: true,
    aprobado: true,
    documentos: [
      {
        id: 'doc-14',
        nombre: 'Informe_Cierre_Gamma.pdf',
        tipo: 'otro',
        archivo: '/uploads/doc-14.pdf',
        fechaSubida: '2024-02-04T16:15:00Z',
        subidoPor: {
          id: '2',
          name: 'Carlos Rodríguez',
          email: 'carlos.rodriguez@empresa.com',
        },
      },
    ],
    responsable: 'Carlos Rodríguez',
    fechaEntrega: '2024-02-04T16:15:00Z',
    createdAt: '2024-01-05T14:30:00Z',
    updatedAt: '2024-02-04T16:15:00Z',
    createdBy: {
      id: '3',
      name: 'María López',
      email: 'maria.lopez@empresa.com',
    },
  },
]

// Función helper para obtener actividades por proyecto
export const getActividadesByProject = (projectId: string) => {
  return MOCK_ACTIVIDADES_DOCUMENTALES.filter(
    (act) => act.proyecto.id === projectId
  )
}

// Función helper para obtener actividades por usuario
export const getActividadesByUser = (userId: string) => {
  return MOCK_ACTIVIDADES_DOCUMENTALES.filter(
    (act) => act.usuario.id === userId
  )
}

// Función helper para obtener actividades con cambio de etapa
export const getActividadesConCambioEtapa = () => {
  return MOCK_ACTIVIDADES_DOCUMENTALES.filter(
    (act) => act.etapaAnterior !== null
  )
}
