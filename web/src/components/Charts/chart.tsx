import { ChartResponse } from "@/types/dashboard";
import ChartCard from "./chart-card";
import AreaChartView from "./area-chart-view";

type ChartProps = { chart: ChartResponse<unknown> };

const Chart = ({ chart }: ChartProps) => {
  switch (chart.chartType) {
    case "area":
      return (
        <ChartCard chart={chart}>
          <AreaChartView chart={chart} />
        </ChartCard>
      );
  }
};

export default Chart;
