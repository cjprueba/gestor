import type { Project, FolderStructure } from "../types/project-types";

/**
 * Cuenta el total de carpetas principales en carpeta_inicial
 * @param carpetaInicial - Objeto con la estructura de carpetas iniciales
 * @returns Número total de carpetas principales
 */
export const getTotalCarpetasPrincipales = (
  carpetaInicial: Record<string, any>
): number => {
  if (!carpetaInicial || typeof carpetaInicial !== "object") {
    return 0;
  }

  return Object.keys(carpetaInicial).length;
};

/**
 * Calcula el total de documentos en una carpeta y todas sus subcarpetas
 * @param folder - Estructura de carpeta
 * @returns Total de documentos
 */
export const getTotalDocumentsInFolder = (folder: FolderStructure): number => {
  let total = folder.documents.length;
  // Sumar documentos de subcarpetas recursivamente
  folder.subfolders.forEach((subfolder) => {
    total += getTotalDocumentsInFolder(subfolder);
  });
  return total;
};

/**
 * Calcula el total de subcarpetas en una carpeta y todas sus subcarpetas
 * @param folder - Estructura de carpeta
 * @returns Total de subcarpetas
 */
export const getTotalSubfoldersInFolder = (folder: FolderStructure): number => {
  let total = folder.subfolders.length;

  // Sumar subcarpetas de subcarpetas recursivamente
  folder.subfolders.forEach((subfolder) => {
    total += getTotalSubfoldersInFolder(subfolder);
  });

  return total;
};

/**
 * Crea una estructura de carpetas basada en carpeta_inicial
 * @param carpetaInicial - Objeto con la estructura de carpetas
 * @param projectId - ID del proyecto
 * @returns Array de estructuras de carpetas
 */
export const createFolderStructureFromCarpetaInicial = (
  carpetaInicial: Record<string, any>,
  projectId: number
): FolderStructure[] => {
  const folders: FolderStructure[] = [];

  Object.entries(carpetaInicial).forEach(([folderName, subfolders], index) => {
    const folder: FolderStructure = {
      id: `folder-${projectId}-${index}`,
      name: folderName,
      minDocuments: 3, // Valor por defecto
      documents: [], // Sin documentos mock
      subfolders: [],
      parentId: `root-${projectId}`,
    };
    // Si hay subcarpetas, crearlas recursivamente
    if (
      subfolders &&
      typeof subfolders === "object" &&
      Object.keys(subfolders).length > 0
    ) {
      folder.subfolders = createFolderStructureFromCarpetaInicial(
        subfolders,
        projectId
      );
    }
    folders.push(folder);
  });
  return folders;
};

/**
 * Transforma los datos de la API al formato esperado por los componentes
 */
export const transformApiProjectToComponent = (
  proyectoLista: {
    id: number;
    nombre: string;
    created_at: string;
    etapas_registro: Array<{
      etapa_tipo: {
        id: number;
        nombre: string;
      };
    }>;
    creador: {
      id: number;
      nombre_completo: string;
    };
  },
  proyectoDetalle?: {
    id: number;
    nombre: string;
    carpeta_inicial: string;
    carpeta_raiz_id: number;
    created_at: string;
    etapas_registro: Array<{
      id: number;
      etapa_tipo: {
        id: number;
        nombre: string;
        descripcion: string;
      };
      tipo_iniciativa: {
        id: number;
        nombre: string;
      };
      tipo_obra: {
        id: number;
        nombre: string;
      };
      region: {
        id: number;
        codigo: string;
        nombre: string;
        nombre_corto: string;
      };
      provincia: {
        id: number;
        codigo: string;
        nombre: string;
      };
      comuna: {
        id: number;
        codigo: string;
        nombre: string;
      };
      volumen: string;
      presupuesto_oficial: string;
      fecha_llamado_licitacion: string;
      fecha_recepcion_ofertas_tecnicas: string;
      fecha_apertura_ofertas_economicas: string;
      decreto_adjudicacion: string;
      sociedad_concesionaria: string;
      fecha_inicio_concesion: string;
      plazo_total_concesion: string;
      inspector_fiscal: {
        id: number;
        nombre_completo: string;
        correo_electronico: string;
      };
      fecha_creacion: string;
      fecha_actualizacion: string;
      activa: boolean;
    }>;
    division: {
      id: number;
      nombre: string;
      descripcion: string;
    };
    departamento: {
      id: number;
      nombre: string;
      descripcion: string;
    };
    unidad: {
      id: number;
      nombre: string;
      descripcion: string;
    };
    creador: {
      id: number;
      nombre_completo: string;
      correo_electronico: string;
    };
  }
): Project => {
  // Parsear carpeta_inicial si existe
  let carpetaInicialParsed: Record<string, any> = {};
  if (proyectoDetalle?.carpeta_inicial) {
    if (typeof proyectoDetalle.carpeta_inicial === "string") {
      try {
        carpetaInicialParsed = JSON.parse(proyectoDetalle.carpeta_inicial);
      } catch (error) {
        console.warn("Error parsing carpeta_inicial:", error);
        carpetaInicialParsed = {};
      }
    } else if (typeof proyectoDetalle.carpeta_inicial === "object") {
      carpetaInicialParsed = proyectoDetalle.carpeta_inicial;
    }
  }

  // Obtener la etapa del primer registro de etapas
  const etapa =
    proyectoLista.etapas_registro?.[0]?.etapa_tipo?.nombre || "Sin etapa";

  // Obtener el tipo de obra del detalle si existe
  const tipoObra =
    proyectoDetalle?.etapas_registro?.[0]?.tipo_obra?.nombre ||
    "Sin especificar";

  // Crear estructura de carpetas basada en carpeta_inicial
  const structure: FolderStructure = {
    id: `root-${proyectoLista.id}`,
    name: proyectoLista.nombre,
    minDocuments: 0,
    documents: [], // Por ahora sin documentos
    subfolders: createFolderStructureFromCarpetaInicial(
      carpetaInicialParsed,
      proyectoLista.id
    ),
  };

  return {
    id: proyectoLista.id.toString(),
    name: proyectoLista.nombre,
    description: "", // No viene en la API
    createdAt: new Date(proyectoLista.created_at),
    carpeta_raiz_id: proyectoDetalle?.carpeta_raiz_id,
    structure,
    etapa,
    projectData: {
      nombre: proyectoLista.nombre,
      etapa,
      tipoObra,
      carpetaInicial: carpetaInicialParsed,
      // Agregar otros datos del detalle si están disponibles
      ...(proyectoDetalle?.etapas_registro?.[0] && {
        tipoIniciativa:
          proyectoDetalle.etapas_registro[0].tipo_iniciativa?.nombre,
        region: proyectoDetalle.etapas_registro[0].region?.nombre,
        provincia: proyectoDetalle.etapas_registro[0].provincia?.nombre,
        comuna: proyectoDetalle.etapas_registro[0].comuna?.nombre,
        volumen: proyectoDetalle.etapas_registro[0].volumen,
        presupuestoOficial:
          proyectoDetalle.etapas_registro[0].presupuesto_oficial,
        fechaLlamadoLicitacion:
          proyectoDetalle.etapas_registro[0].fecha_llamado_licitacion,
        fechaRecepcionOfertas:
          proyectoDetalle.etapas_registro[0].fecha_recepcion_ofertas_tecnicas,
        fechaAperturaOfertas:
          proyectoDetalle.etapas_registro[0].fecha_apertura_ofertas_economicas,
        decretoAdjudicacion:
          proyectoDetalle.etapas_registro[0].decreto_adjudicacion,
        sociedadConcesionaria:
          proyectoDetalle.etapas_registro[0].sociedad_concesionaria,
        fechaInicioConcesion:
          proyectoDetalle.etapas_registro[0].fecha_inicio_concesion,
        plazoTotalConcesion:
          proyectoDetalle.etapas_registro[0].plazo_total_concesion,
        inspectorFiscal:
          proyectoDetalle.etapas_registro[0].inspector_fiscal?.nombre_completo,
      }),
    },
    metadata: {
      createdBy: proyectoLista.creador.nombre_completo,
      createdAt: new Date(proyectoLista.created_at),
      lastModifiedBy:
        proyectoDetalle?.creador?.nombre_completo ||
        proyectoLista.creador.nombre_completo,
      lastModifiedAt: new Date(
        proyectoDetalle?.etapas_registro?.[0]?.fecha_actualizacion ||
          proyectoLista.created_at
      ),
      currentStage: etapa,
      history: [], // Por ahora sin historial
    },
  };
};
