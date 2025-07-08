export const ETAPAS = [
  'Cartera de proyectos',
  'Proyectos en Licitación',
  'Concesiones en Operación',
  'Concesiones en Construcción',
  'Concesiones en Operación y Construcción',
  'Concesiones Finalizadas',
] as const

export const TIPOS_INICIATIVA = ['Pública', 'Privada'] as const

export const TIPOS_OBRA = {
  'Cartera de proyectos': [
    'Infraestructura Vial Interurbana',
    'Infraestructura Vial Urbana',
    'Soluciones Hídricas',
    'Infraestructura Aeroportuaria',
    'Infraestructura Hospitalaria',
    'Infraestructura Penitenciaria',
    'Edificación Pública y Equipamiento Urbano',
  ],
  'Proyectos en Licitación': [
    'Infraestructura Vial Interurbana',
    'Infraestructura Vial Urbana',
    'Soluciones Hídricas',
    'Infraestructura Aeroportuaria',
    'Infraestructura Hospitalaria',
    'Infraestructura Penitenciaria',
    'Edificación Pública y Equipamiento Urbano',
  ],
  'Concesiones en Operación': [
    'Infraestructura Vial Interurbana',
    'Infraestructura Vial Urbana',
    'Infraestructura Hospitalaria',
    'Soluciones Hídricas',
    'Edificación Pública y Equipamiento Urbano',
  ],
  'Concesiones en Construcción': [
    'Infraestructura Vial Interurbana',
    'Infraestructura Vial Urbana',
    'Infraestructura Hospitalaria',
    'Soluciones Hídricas',
    'Edificación Pública y Equipamiento Urbano',
  ],
  'Concesiones en Operación y Construcción': [
    'Infraestructura Vial Interurbana',
    'Infraestructura Vial Urbana',
    'Infraestructura Hospitalaria',
    'Soluciones Hídricas',
    'Edificación Pública y Equipamiento Urbano',
  ],
  'Concesiones Finalizadas': [
    'Infraestructura Vial Interurbana',
    'Infraestructura Vial Urbana',
    'Infraestructura Hospitalaria',
    'Soluciones Hídricas',
    'Edificación Pública y Equipamiento Urbano',
  ],
} as const

export const ROLES_INSPECTOR = ['Analista', 'Asesor'] as const

// Datos simulados de ubicación (Chile)
export const REGIONES = [{ id: '1', nombre: 'Región A' }]

export const PROVINCIAS: Record<
  string,
  Array<{ id: string; nombre: string }>
> = {
  '1': [{ id: '131', nombre: 'Provincia de Santiago' }],
  '131': [{ id: '51', nombre: 'Provincia de Valparaíso' }],
}

export const COMUNAS: Record<string, Array<{ id: string; nombre: string }>> = {
  '131': [
    { id: '13101', nombre: 'Santiago' },
    { id: '13102', nombre: 'Cerrillos' },
    { id: '13103', nombre: 'Cerro Navia' },
    { id: '13104', nombre: 'Conchalí' },
    { id: '13105', nombre: 'El Bosque' },
    { id: '13106', nombre: 'Estación Central' },
    { id: '13107', nombre: 'Huechuraba' },
    { id: '13108', nombre: 'Independencia' },
    { id: '13109', nombre: 'La Cisterna' },
    { id: '13110', nombre: 'La Florida' },
    { id: '13111', nombre: 'La Granja' },
    { id: '13112', nombre: 'La Pintana' },
    { id: '13113', nombre: 'La Reina' },
    { id: '13114', nombre: 'Las Condes' },
    { id: '13115', nombre: 'Lo Barnechea' },
    { id: '13116', nombre: 'Lo Espejo' },
    { id: '13117', nombre: 'Lo Prado' },
    { id: '13118', nombre: 'Macul' },
    { id: '13119', nombre: 'Maipú' },
    { id: '13120', nombre: 'Ñuñoa' },
    { id: '13121', nombre: 'Pedro Aguirre Cerda' },
    { id: '13122', nombre: 'Peñalolén' },
    { id: '13123', nombre: 'Providencia' },
    { id: '13124', nombre: 'Pudahuel' },
    { id: '13125', nombre: 'Quilicura' },
    { id: '13126', nombre: 'Quinta Normal' },
    { id: '13127', nombre: 'Recoleta' },
    { id: '13128', nombre: 'Renca' },
    { id: '13129', nombre: 'San Joaquín' },
    { id: '13130', nombre: 'San Miguel' },
    { id: '13131', nombre: 'San Ramón' },
    { id: '13132', nombre: 'Vitacura' },
  ],
  '51': [
    { id: '5101', nombre: 'Valparaíso' },
    { id: '5102', nombre: 'Casablanca' },
    { id: '5103', nombre: 'Concón' },
    { id: '5104', nombre: 'Juan Fernández' },
    { id: '5105', nombre: 'Puchuncaví' },
    { id: '5106', nombre: 'Quintero' },
    { id: '5107', nombre: 'Viña del Mar' },
  ],
}

export const PLANTILLAS_CARPETAS = {
  'Cartera de proyectos': [
    'Proceso de Licitación',
    'Documentación Técnica',
    'Estudios de Factibilidad',
    'Otros Documentos',
  ],
  'Proyectos en Licitación': [
    'Proceso de Licitación',
    'Proceso de Adjudicación',
    'Documentación Técnica',
    'Ofertas Técnicas',
    'Ofertas Económicas',
    'Otros Documentos',
  ],
  'Concesiones en Operación': [
    'Proceso de Licitación',
    'Proceso de Adjudicación',
    'Ejecución',
    'Modificación de Obras y Convenios',
    'Informe Mensual',
    'Documentación Operacional',
    'Otros Documentos',
  ],
  'Concesiones en Construcción': [
    'Proceso de Licitación',
    'Proceso de Adjudicación',
    'Ejecución',
    'Modificación de Obras y Convenios',
    'Informe Mensual',
    'Documentación de Construcción',
    'Otros Documentos',
  ],
  'Concesiones en Operación y Construcción': [
    'Proceso de Licitación',
    'Proceso de Adjudicación',
    'Ejecución',
    'Modificación de Obras y Convenios',
    'Informe Mensual',
    'Documentación Operacional',
    'Documentación de Construcción',
    'Otros Documentos',
  ],
  'Concesiones Finalizadas': [
    'Proceso de Licitación',
    'Proceso de Adjudicación',
    'Ejecución',
    'Documentación Final',
    'Cierre de Concesión',
    'Otros Documentos',
  ],
} as const
