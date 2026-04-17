import { ChartResponse } from "@/types/dashboard";
import ChartCard from "./chart-card";
import AreaChartView from "./area-chart-view";
import BarChartView from "./bar-chart-view";
import PieChartView from "./pie-chart-view";

type ChartProps = { chart: ChartResponse<unknown> };

const Chart = ({ chart }: ChartProps) => {
  switch (chart.chartType) {
    case "area":
      return (
        <ChartCard chart={chart}>
          <AreaChartView chart={chart} />
        </ChartCard>
      );
    case "bar":
      return (
        <ChartCard chart={chart}>
          <BarChartView chart={chart} />
        </ChartCard>
      );
    case "pie":
      return (
        <ChartCard chart={chart}>
          <PieChartView chart={chart} />
        </ChartCard>
      );
    default:
      return null;
  }
};

export default Chart;
