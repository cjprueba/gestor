import { Button } from "@/shared/components/design-system/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/shared/components/ui/collapsible";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import type { EtapaRegistro } from "./project/project.types";
import dayjs from "dayjs";
import { ChevronDown } from "lucide-react";

interface ShowPreviusStagesProps {
  etapasAnteriores: EtapaRegistro[];
}

// Componente Item para renderizar datos de manera reutilizable
interface ItemProps {
  label: string;
  value: string | number | null | undefined;
  isDate?: boolean;
}

// TODO: hacer flexible, utilizar el mapper de stage-form-mapper.ts
const Item: React.FC<ItemProps> = ({ label, value, isDate = false }) => {
  if (!value) return null;

  const displayValue = isDate
    ? dayjs(value as string).format('DD/MM/YYYY')
    : value.toString();

  return (
    <div className="flex flex-col gap-2">
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      <Input value={displayValue} readOnly className="bg-gray-50" />
    </div>
  );
};

const ShowPreviusStages = ({ etapasAnteriores }: ShowPreviusStagesProps) => {
  const etapas = etapasAnteriores || []
  if (!etapas.length) return null

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-semibold">Detalles de etapas anteriores</h3>
      </div>

      {etapas.map((etapa) => (
        <Collapsible key={etapa.id} className="group">
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full p-0 h-auto hover:bg-transparent focus:bg-transparent active:bg-transparent"
            >
              {/* Background que se anima de full width a fit */}
              <div className="flex items-center justify-between w-full">
                <div
                  className="py-2 px-2 rounded-md w-fit flex items-center justify-between cursor-pointer hover:opacity-90 transition-opacity duration-200"
                  style={{ backgroundColor: etapa.etapa_tipo?.color }}
                >
                  <span className="text-sm font-medium flex items-center gap-2 text-white transition-all duration-300 ease-out">
                    <span>{etapa.etapa_tipo?.nombre}</span>
                    <div className="w-4 h-4 rounded transition-all duration-300 ease-out" style={{ backgroundColor: etapa.etapa_tipo.color }} />
                  </span>
                  <ChevronDown className="w-4 h-4 text-white transition-transform duration-400 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-data-[state=open]:rotate-180 ml-2" />
                </div>
              </div>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4 transition-all duration-600 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-top-4 data-[state=open]:slide-in-from-top-4 data-[state=open]:duration-500 data-[state=closed]:duration-400">
            <Card
              className="border-l-4 transition-all duration-400 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] transform hover:scale-[1.01] hover:shadow-lg"
              style={{ borderLeftColor: etapa.etapa_tipo?.color }}
            >
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Item
                    label="Tipo de iniciativa"
                    value={etapa.tipo_iniciativa?.nombre}
                  />
                  <Item
                    label="Tipo de obra"
                    value={etapa.tipo_obra?.nombre}
                  />
                  <Item
                    label="Región"
                    value={etapa.region?.nombre}
                  />
                  <Item
                    label="Provincia"
                    value={etapa.provincia?.nombre}
                  />
                  <Item
                    label="Comuna"
                    value={etapa.comuna?.nombre}
                  />
                  <Item
                    label="Volumen"
                    value={etapa.volumen}
                  />
                  <Item
                    label="Presupuesto oficial"
                    value={etapa.presupuesto_oficial}
                  />
                  <Item
                    label="Valor referencia"
                    value={etapa.valor_referencia}
                  />
                  <Item
                    label="BIP"
                    value={etapa.bip}
                  />
                  <Item
                    label="Fecha llamado a licitación"
                    value={etapa.fecha_llamado_licitacion}
                    isDate={true}
                  />
                  <Item
                    label="Fecha recepción ofertas técnicas"
                    value={etapa.fecha_recepcion_ofertas_tecnicas}
                    isDate={true}
                  />
                  <Item
                    label="Fecha apertura ofertas económicas"
                    value={etapa.fecha_apertura_ofertas_economicas}
                    isDate={true}
                  />
                  <Item
                    label="Fecha inicio concesión"
                    value={etapa.fecha_inicio_concesion}
                    isDate={true}
                  />
                  <Item
                    label="Plazo total concesión"
                    value={etapa.plazo_total_concesion}
                  />
                  <Item
                    label="Decreto adjudicación"
                    value={etapa.decreto_adjudicacion}
                  />
                  <Item
                    label="Sociedad concesionaria"
                    value={etapa.sociedad_concesionaria}
                  />
                  <Item
                    label="Inspector fiscal"
                    value={etapa.inspector_fiscal?.nombre_completo}
                  />
                </div>
              </CardContent>
            </Card>
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  )
}

export default ShowPreviusStages;