import {
  CheckCircle,
  CheckSquare,
  CircleX,
  ClipboardList,
  Clock,
  DollarSign,
  FileText,
  Home,
  Percent,
  Receipt,
  Tag,
  TrendingUp,
  Wrench,
} from "lucide-react";
import { JSX } from "react/jsx-dev-runtime";

enum KpiIcon {
  CLIPBOARD_LIST = "clipboard-list", // total de pedidos
  DOLLAR_SIGN = "dollar-sign", // receita / valores monetários
  RECEIPT = "receipt", // receita bruta
  TAG = "tag", // descontos
  CHECK_CIRCLE = "check-circle", // pedidos pagos
  CLOCK = "clock", // em andamento
  X_CIRCLE = "x-circle", // cancelados
  FILE_TEXT = "file-text", // orçamentos
  WRENCH = "wrench", // manutenção
  CHECK_SQUARE = "check-square", // concluídos
  HOME = "home", // cômodos
  PERCENT = "percent", // percentual de desconto
  TRENDING_UP = "trending-up", // ticket médio / tendência
}

interface IKpiIconMap {
  [key: string]: JSX.Element;
}

const kpiIconMap: IKpiIconMap = {
  [KpiIcon.CLIPBOARD_LIST]: <ClipboardList />,
  [KpiIcon.DOLLAR_SIGN]: <DollarSign />,
  [KpiIcon.RECEIPT]: <Receipt />,
  [KpiIcon.TAG]: <Tag />,
  [KpiIcon.CHECK_CIRCLE]: <CheckCircle />,
  [KpiIcon.CLOCK]: <Clock />,
  [KpiIcon.X_CIRCLE]: <CircleX />,
  [KpiIcon.FILE_TEXT]: <FileText />,
  [KpiIcon.WRENCH]: <Wrench />,
  [KpiIcon.CHECK_SQUARE]: <CheckSquare />,
  [KpiIcon.HOME]: <Home />,
  [KpiIcon.PERCENT]: <Percent />,
  [KpiIcon.TRENDING_UP]: <TrendingUp />,
};

export function getKpiIcon(iconName: string): JSX.Element {
  return kpiIconMap[iconName] || <CircleX />;
};
