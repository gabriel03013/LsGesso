import { ChartResponse } from "@/types/dashboard";
import ChartCard from "./chart-card";
import AreaChartView from "./area-chart-view";
import BarChartView from "./bar-chart-view";
import PieChartView from "./pie-chart-view";

type ChartProps = { chart: ChartResponse<unknown>; className?: string };

const Chart = ({ chart, className }: ChartProps) => {
  switch (chart.chartType) {
    case "area":
      return (
        <ChartCard chart={chart} className={className}>
          <AreaChartView chart={chart} />
        </ChartCard>
      );
    case "bar":
      return (
        <ChartCard chart={chart} className={className}>
          <BarChartView chart={chart} />
        </ChartCard>
      );
    case "pie":
      return (
        <ChartCard chart={chart} className={className}>
          <PieChartView chart={chart} />
        </ChartCard>
      );
    default:
      return null;
  }
};

export default Chart;
