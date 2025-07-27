import TagStage from "@/shared/components/TagStage";
import type { AvanzarEtapaResponse, SiguienteEtapa } from "@/app/features/dashboard/projects/_components/project/project.types";
import ShowSubfolders from "../../ShowSubfolders";
import type { CarpetaEstructura } from "../../folder/folder.types";
import { FolderTemplatesStep } from "../../form-steps/FolderTemplatesStep";

interface AdvanceStageStepTwoProps {
  etapaAvanzarInfo: AvanzarEtapaResponse | null
  siguienteEtapa: SiguienteEtapa | null
}

const AdvanceStageStepTwo = ({ etapaAvanzarInfo, siguienteEtapa }: AdvanceStageStepTwoProps) => {

  // Función para convertir carpetas_iniciales a estructura jerárquica
  const getCarpetasEstructura = (): CarpetaEstructura[] => {
    if (!siguienteEtapa?.carpetas_iniciales) {
      return []
    }

    const buildHierarchy = (obj: any, nivel = 0, parentId = ""): CarpetaEstructura[] => {
      return Object.entries(obj).map(([nombre, subcarpetas], index) => {
        const id = parentId ? `${parentId}-${index}` : `${index}`

        return {
          id,
          nombre,
          tipo: "inicial" as const,
          subcarpetas: subcarpetas && typeof subcarpetas === "object" && Object.keys(subcarpetas).length > 0
            ? buildHierarchy(subcarpetas, nivel + 1, id)
            : [],
          nivel
        }
      })
    }

    return buildHierarchy(siguienteEtapa.carpetas_iniciales)
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-col gap-3">
        <div className="flex gap-1 flex-col">
          <h3 className="text-lg font-semibold">Carpetas de la nueva etapa</h3>
          {etapaAvanzarInfo?.data?.siguiente_etapa?.nombre && (
            <TagStage etapa={etapaAvanzarInfo.data.siguiente_etapa.nombre} size="xs" />
          )}
        </div>
        <div className="text-sm text-muted-foreground">
          Las siguientes carpetas se crearán automáticamente según la configuración de la nueva etapa.
        </div>
      </div>


      {/* Mostrar carpetas iniciales con estructura jerárquica */}
      <div className="space-y-4 mt-8">
        <h4 className="text-sm font-semibold text-gray-900">Carpetas incluidas automáticamente:</h4>
        <ShowSubfolders carpetas={getCarpetasEstructura()} />
      </div>

      {/* Separador */}
      <div className="border-t"></div>

      {/* Sección para carpetas personalizadas */}
      <div className="space-y-4">

        <FolderTemplatesStep carpetasIniciales={[]} />
      </div>
    </div>
  );
}

export default AdvanceStageStepTwo;