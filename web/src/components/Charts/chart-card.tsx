import { ChartResponse } from "@/types/dashboard"
import { ReactNode } from "react";

type ChartCardProps = {chart: {title: string}, children: ReactNode};

const ChartCard = <T,>(props: ChartCardProps) => {
  return (
    <div>chart-card</div>
  )
}

export default ChartCard;