// Colores de las etapas del proyecto - CENTRALIZADOS
export const STAGE_COLORS = {
  'Cartera de proyectos': '#3b82f6', // blue
  'Proyectos en Licitación': '#eab308', // yellow
  'Concesiones en Operación': '#10b981', // green
  'Concesiones en Construcción': '#ef4444', // red
  'Concesiones en Operación y Construcción': '#8b5cf6', // violet
  'Concesiones Finalizadas': '#06b6d4', // cyan
} as const

// Función helper para obtener el color de una etapa
export const getStageColor = (etapa: string): string => {
  return STAGE_COLORS[etapa as keyof typeof STAGE_COLORS] || '#6b7280' // gray como fallback
}

// Función helper para obtener clases de Tailwind CSS para bordes
export const getStageBorderClasses = (etapa: string): string => {
  const color = getStageColor(etapa)

  // Mapear colores hexadecimales a clases de Tailwind
  const colorMap: Record<string, string> = {
    '#3b82f6': 'border-blue-500', // Cartera de proyectos
    '#eab308': 'border-yellow-500', // Proyectos en Licitación
    '#10b981': 'border-green-500', // Concesiones en Operación
    '#ef4444': 'border-red-500', // Concesiones en Construcción
    '#8b5cf6': 'border-violet-500', // Concesiones en Operación y Construcción
    '#06b6d4': 'border-cyan-500', // Concesiones Finalizadas
  }

  return colorMap[color] || 'border-gray-300'
}

// Función helper para obtener clases de Tailwind CSS para bordes con hover
export const getStageBorderHoverClasses = (etapa: string): string => {
  const color = getStageColor(etapa)

  // Mapear colores hexadecimales a clases de Tailwind con hover
  const colorMap: Record<string, string> = {
    '#3b82f6': 'border-blue-500 hover:border-blue-600', // Cartera de proyectos
    '#eab308': 'border-yellow-500 hover:border-yellow-600', // Proyectos en Licitación
    '#10b981': 'border-green-500 hover:border-green-600', // Concesiones en Operación
    '#ef4444': 'border-red-500 hover:border-red-600', // Concesiones en Construcción
    '#8b5cf6': 'border-violet-500 hover:border-violet-600', // Concesiones en Operación y Construcción
    '#06b6d4': 'border-cyan-500 hover:border-cyan-600', // Concesiones Finalizadas
  }

  return colorMap[color] || 'border-gray-300 hover:border-gray-400'
}

// Función helper para obtener el color de fondo sutil
export const getStageBackgroundClasses = (etapa: string): string => {
  const color = getStageColor(etapa)

  // Mapear colores hexadecimales a clases de fondo sutil
  const colorMap: Record<string, string> = {
    '#3b82f6': 'bg-blue-50', // Cartera de proyectos
    '#eab308': 'bg-yellow-50', // Proyectos en Licitación
    '#10b981': 'bg-green-50', // Concesiones en Operación
    '#ef4444': 'bg-red-50', // Concesiones en Construcción
    '#8b5cf6': 'bg-violet-50', // Concesiones en Operación y Construcción
    '#06b6d4': 'bg-cyan-50', // Concesiones Finalizadas
  }

  return colorMap[color] || 'bg-gray-50'
}

// Helper global para clases de badge/fondo/texto por etapa
export const getStageBadgeClasses = (etapa: string): string => {
  const colors: Record<string, string> = {
    'Cartera de proyectos': 'bg-blue-100 text-blue-800 border-blue-300',
    'Proyectos en Licitación':
      'bg-yellow-100 text-yellow-800 border-yellow-300',
    'Concesiones en Operación': 'bg-green-100 text-green-800 border-green-300',
    'Concesiones en Construcción': 'bg-red-100 text-red-800 border-red-300',
    'Concesiones en Operación y Construcción':
      'bg-violet-100 text-violet-800 border-violet-300',
    'Concesiones Finalizadas': 'bg-cyan-100 text-cyan-800 border-cyan-300',
  }
  return (
    colors[etapa as keyof typeof colors] ||
    'bg-gray-100 text-gray-800 border-gray-300'
  )
}

// Helper para obtener solo la clase de borde a partir de getStageBadgeClasses
export const getStageBorderClassFromBadge = (etapa: string): string => {
  const badgeClasses = getStageBadgeClasses(etapa)
  const match = badgeClasses.match(/border-[a-z]+-[0-9]+/)
  return match ? match[0] : 'border-gray-300'
}
