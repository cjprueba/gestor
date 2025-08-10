import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import { getStageBadgeClasses } from "@/shared/utils/stage-colors";

interface TagStageProps {
  etapa: string;
  size?: "xs" | "sm" | "md" | "lg";
  bgColor?: string;
  textColor?: string;
  badgeStyle?: React.CSSProperties;
  labelStyle?: React.CSSProperties;
}

const TagStage = ({ etapa, size = "md", bgColor, textColor, badgeStyle, labelStyle }: TagStageProps) => {

  return (
    <Label htmlFor={etapa} style={{ ...labelStyle }}>
      <Badge variant="outline" className={`text-${size} ${getStageBadgeClasses(etapa)}`} style={{ backgroundColor: bgColor, color: textColor, ...badgeStyle }}>
        {etapa}
      </Badge>
    </Label>
  )
}

export default TagStage;