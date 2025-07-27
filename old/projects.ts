// import type { Project } from "@/app/features/dashboard/projects/_components/project/project.types";
// import type { FolderStructure, Document } from "@/app/features/dashboard/projects/_components/folder/folder.types";
// import { MOCK_DOCUMENTS } from "./documents";

// // Helper function to convert file size string to bytes
// const convertSizeToBytes = (sizeStr: string): number => {
//   const units: { [key: string]: number } = {
//     KB: 1024,
//     MB: 1024 * 1024,
//     GB: 1024 * 1024 * 1024,
//   };

//   const match = sizeStr.match(/^([\d.]+)\s*(KB|MB|GB)$/i);
//   if (!match) return 0;

//   const [, size, unit] = match;
//   return Math.round(parseFloat(size) * (units[unit.toUpperCase()] || 1));
// };

// // Helper function to create folder structure with documents
// const createFolderStructure = (
//   id: string,
//   name: string,
//   minDocuments: number,
//   parentId?: string,
//   projectId?: string,
//   subfolders: FolderStructure[] = []
// ): FolderStructure => {
//   const folderDocuments: Document[] = MOCK_DOCUMENTS.filter(
//     (doc) => doc.folderId === id && (!projectId || doc.projectId === projectId)
//   ).map((doc) => ({
//     id: doc.id,
//     name: doc.name,
//     uploadedAt: new Date(doc.uploadedAt),
//     dueDate: doc.dueDate ? new Date(doc.dueDate) : undefined,
//     hasCustomAlert: false,
//     metadata: {
//       size: convertSizeToBytes(doc.size),
//       type: doc.fileType,
//       uploadedBy: doc.uploadedBy,
//       lastModifiedAt: new Date(doc.uploadedAt),
//       lastModifiedBy: doc.uploadedBy,
//     },
//   }));

//   return {
//     id,
//     name,
//     minDocuments,
//     documents: folderDocuments,
//     subfolders,
//     parentId,
//     metadata: {
//       createdAt: new Date("2024-01-15T10:00:00Z"),
//       createdBy: "1",
//       lastModifiedAt: new Date(),
//       lastModifiedBy: "1",
//     },
//   };
// };

// // Project Alpha - Proyectos en Licitación
// const alphaStructure: FolderStructure = createFolderStructure(
//   "root-alpha",
//   "Proyecto Alpha",
//   0,
//   undefined,
//   "proj-alpha",
//   [
//     createFolderStructure(
//       "folder-licitacion-alpha",
//       "Proceso de Licitación",
//       3,
//       "root-alpha",
//       "proj-alpha"
//     ),
//     createFolderStructure(
//       "folder-adjudicacion-alpha",
//       "Proceso de Adjudicación",
//       2,
//       "root-alpha",
//       "proj-alpha"
//     ),
//     createFolderStructure(
//       "folder-otros-alpha",
//       "Otros Documentos",
//       1,
//       "root-alpha",
//       "proj-alpha"
//     ),
//   ]
// );

// // Project Beta - Concesiones en Operación y Construcción
// const betaStructure: FolderStructure = createFolderStructure(
//   "root-beta",
//   "Proyecto Beta",
//   0,
//   undefined,
//   "proj-beta",
//   [
//     createFolderStructure(
//       "folder-licitacion-beta",
//       "Proceso de Licitación",
//       2,
//       "root-beta",
//       "proj-beta"
//     ),
//     createFolderStructure(
//       "folder-adjudicacion-beta",
//       "Proceso de Adjudicación",
//       2,
//       "root-beta",
//       "proj-beta"
//     ),
//     createFolderStructure(
//       "folder-ejecucion-beta",
//       "Ejecución",
//       3,
//       "root-beta",
//       "proj-beta"
//     ),
//     createFolderStructure(
//       "folder-modificaciones-beta",
//       "Modificación de Obras y Convenios",
//       1,
//       "root-beta",
//       "proj-beta"
//     ),
//     createFolderStructure(
//       "folder-informe-beta",
//       "Informe Mensual de la Concesión",
//       2,
//       "root-beta",
//       "proj-beta"
//     ),
//     createFolderStructure(
//       "folder-operacional-beta",
//       "Documentación Operacional",
//       2,
//       "root-beta",
//       "proj-beta"
//     ),
//     createFolderStructure(
//       "folder-construccion-beta",
//       "Documentación de Construcción",
//       1,
//       "root-beta",
//       "proj-beta"
//     ),
//   ]
// );

// // Project Gamma - Concesiones Finalizadas
// const gammaStructure: FolderStructure = createFolderStructure(
//   "root-gamma",
//   "Proyecto Gamma",
//   0,
//   undefined,
//   "proj-gamma",
//   [
//     createFolderStructure(
//       "folder-licitacion-gamma",
//       "Proceso de Licitación",
//       1,
//       "root-gamma",
//       "proj-gamma"
//     ),
//     createFolderStructure(
//       "folder-adjudicacion-gamma",
//       "Proceso de Adjudicación",
//       1,
//       "root-gamma",
//       "proj-gamma"
//     ),
//     createFolderStructure(
//       "folder-ejecucion-gamma",
//       "Ejecución",
//       1,
//       "root-gamma",
//       "proj-gamma"
//     ),
//     createFolderStructure(
//       "folder-final-gamma",
//       "Documentación Final",
//       3,
//       "root-gamma",
//       "proj-gamma"
//     ),
//     createFolderStructure(
//       "folder-cierre-gamma",
//       "Cierre de Concesión",
//       2,
//       "root-gamma",
//       "proj-gamma"
//     ),
//   ]
// );

// export const MOCK_PROJECTS: Project[] = [
//   {
//     id: "proj-alpha",
//     name: "Autopista Norte - Región Metropolitana",
//     description:
//       "Proyecto de concesión vial para mejorar la conectividad entre Santiago y las comunas del norte",
//     createdAt: new Date("2024-01-15T10:00:00Z"),
//     structure: alphaStructure,
//     etapa: "Proyectos en Licitación",
//     projectData: {
//       tipoIniciativa: "Pública",
//       tipoObra: "Infraestructura Vial Interurbana",
//       region: "1",
//       provincia: "131",
//       comuna: "13101",
//       volumen: "45 km de autopista",
//       presupuestoOficial: "$850.000.000.000",
//       fechaLlamadoLicitacion: "2024-03-15",
//       fechaRecepcionOfertas: "2024-05-30",
//       fechaAperturaOfertas: "2024-06-15",
//       valorReferencia: "$800.000.000.000",
//       alertaFechaLimite: "2024-05-25",
//       alertaDescripcion: "Vencimiento recepción de ofertas",
//     },
//     metadata: {
//       createdBy: "1",
//       createdAt: new Date("2024-01-15T10:00:00Z"),
//       lastModifiedBy: "2",
//       lastModifiedAt: new Date("2024-01-26T16:20:00Z"),
//       currentStage: "Proyectos en Licitación",
//       history: [
//         {
//           id: "hist-1",
//           timestamp: new Date("2024-01-15T10:00:00Z"),
//           userId: "1",
//           userName: "Ana García",
//           userAvatar: "/placeholder.svg?height=32&width=32",
//           action: "created",
//           details: {
//             description: "Proyecto creado en etapa Proyectos en Licitación",
//           },
//         },
//         {
//           id: "hist-2",
//           timestamp: new Date("2024-01-20T14:15:00Z"),
//           userId: "2",
//           userName: "Carlos Rodríguez",
//           userAvatar: "/placeholder.svg?height=32&width=32",
//           action: "document_added",
//           details: {
//             description: 'Documento "Consultas_Respuestas_Alpha.docx" agregado',
//           },
//         },
//       ],
//     },
//   },
//   {
//     id: "proj-beta",
//     name: "Hospital Regional del Biobío",
//     description:
//       "Concesión hospitalaria en operación con obras de ampliación en construcción",
//     createdAt: new Date("2024-01-10T09:00:00Z"),
//     structure: betaStructure,
//     etapa: "Concesiones en Operación y Construcción",
//     projectData: {
//       tipoIniciativa: "Pública",
//       tipoObra: "Infraestructura Hospitalaria",
//       region: "1",
//       provincia: "131",
//       comuna: "13110",
//       volumen: "500 camas + ampliación 200 camas",
//       presupuestoOficial: "$1.200.000.000.000",
//       plazoTotalConcesion: "30 años",
//       sociedadConcesionaria: "Salud Integral S.A.",
//       inicioPlazoConcesion: "2019-08-01",
//       inspectorFiscal: "María López - Analista",
//       alertaFechaLimite: "2024-02-28",
//       alertaDescripcion: "Entrega informe mensual operacional",
//     },
//     metadata: {
//       createdBy: "2",
//       createdAt: new Date("2024-01-10T09:00:00Z"),
//       lastModifiedBy: "1",
//       lastModifiedAt: new Date("2024-02-01T14:45:00Z"),
//       currentStage: "Concesiones en Operación y Construcción",
//       history: [
//         {
//           id: "hist-3",
//           timestamp: new Date("2024-01-10T09:00:00Z"),
//           userId: "2",
//           userName: "Carlos Rodríguez",
//           userAvatar: "/placeholder.svg?height=32&width=32",
//           action: "created",
//           details: {
//             description: "Proyecto migrado desde sistema anterior",
//           },
//         },
//         {
//           id: "hist-4",
//           timestamp: new Date("2024-01-20T11:00:00Z"),
//           userId: "2",
//           userName: "Carlos Rodríguez",
//           action: "stage_changed",
//           details: {
//             field: "etapa",
//             oldValue: "Concesiones en Operación",
//             newValue: "Concesiones en Operación y Construcción",
//             description: "Inicio de obras de ampliación",
//           },
//         },
//       ],
//     },
//   },
//   {
//     id: "proj-gamma",
//     name: "Túnel Las Palmas",
//     description:
//       "Concesión vial finalizada - Túnel de conexión intercomunal completamente operativo",
//     createdAt: new Date("2024-01-05T14:30:00Z"),
//     structure: gammaStructure,
//     etapa: "Concesiones Finalizadas",
//     projectData: {
//       tipoIniciativa: "Pública",
//       tipoObra: "Infraestructura Vial Urbana",
//       region: "1",
//       provincia: "51",
//       comuna: "5101",
//       volumen: "2.8 km de túnel bidireccional",
//       presupuestoOficial: "$450.000.000.000",
//       plazoTotalConcesion: "25 años",
//       sociedadConcesionaria: "Túneles del Pacífico S.A.",
//       inicioPlazoConcesion: "1998-03-01",
//       fechaFinalizacion: "20232-12-31",
//       inspectorFiscal: "Juan Pérez - Asesor",
//       alertaDescripcion: "Concesión finalizada - Archivo documental completado",
//     },
//     metadata: {
//       createdBy: "3",
//       createdAt: new Date("2024-01-05T14:30:00Z"),
//       lastModifiedBy: "4",
//       lastModifiedAt: new Date("2024-02-05T13:20:00Z"),
//       currentStage: "Concesiones Finalizadas",
//       history: [
//         {
//           id: "hist-5",
//           timestamp: new Date("2024-01-05T14:30:00Z"),
//           userId: "3",
//           userName: "María López",
//           action: "created",
//           details: {
//             description: "Proyecto creado para archivo documental",
//           },
//         },
//         {
//           id: "hist-6",
//           timestamp: new Date("2023-12-31T23:59:59Z"),
//           userId: "2",
//           userName: "Carlos Rodríguez",
//           action: "stage_changed",
//           details: {
//             field: "etapa",
//             oldValue: "Concesiones en Operación",
//             newValue: "Concesiones Finalizadas",
//             description: "Finalización del plazo de concesión",
//           },
//         },
//       ],
//     },
//   },
// ];

// // Función helper para obtener documentos por proyecto
// export const getDocumentsByProject = (projectId: string) => {
//   return MOCK_DOCUMENTS.filter((doc) => doc.projectId === projectId);
// };

// // Función helper para obtener proyectos por etapa
// export const getProjectsByStage = (etapa: string) => {
//   return MOCK_PROJECTS.filter((project) => project.etapa === etapa);
// };

// // Templates de carpetas por etapa (usando las carpetas default requeridas)
// export const DEFAULT_FOLDER_TEMPLATES = {
//   "Cartera de proyectos": ["Proceso de Licitación", "Otros Documentos"],
//   "Proyectos en Licitación": [
//     "Proceso de Licitación",
//     "Proceso de Adjudicación",
//     "Otros Documentos",
//   ],
//   "Concesiones en Operación": [
//     "Proceso de Licitación",
//     "Proceso de Adjudicación",
//     "Ejecución",
//     "Modificación de Obras y Convenios",
//     "Informe Mensual de la Concesión",
//   ],
//   "Concesiones en Construcción": [
//     "Proceso de Licitación",
//     "Proceso de Adjudicación",
//     "Ejecución",
//     "Modificación de Obras y Convenios",
//     "Informe Mensual de la Concesión",
//   ],
//   "Concesiones en Operación y Construcción": [
//     "Proceso de Licitación",
//     "Proceso de Adjudicación",
//     "Ejecución",
//     "Modificación de Obras y Convenios",
//     "Informe Mensual de la Concesión",
//     "Otros Documentos",
//   ],
//   "Concesiones Finalizadas": [
//     "Proceso de Licitación",
//     "Proceso de Adjudicación",
//     "Ejecución",
//     "Otros Documentos",
//   ],
// } as const;
