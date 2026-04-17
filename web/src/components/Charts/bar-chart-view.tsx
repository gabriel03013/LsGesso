"use client"

import { ChartResponse } from "@/types/dashboard"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"

export default function BarChartView({ chart }: { chart: ChartResponse<unknown> }) {
  const config = Object.fromEntries(
    chart.series.map(s => [s.dataKey, { label: s.label, color: s.color }])
  )

  return (
    <ChartContainer config={config} className="aspect-auto h-[250px] w-full">
      <BarChart
        accessibilityLayer
        data={chart.data as Record<string, unknown>[]}
        margin={{ left: 12, right: 12 }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey={chart.xKey}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip content={<ChartTooltipContent />} />
        {chart.series.map(s => (
          <Bar
            key={s.dataKey}
            dataKey={s.dataKey}
            fill={`var(--color-${s.dataKey})`}
            radius={[4, 4, 0, 0]}
          />
        ))}
      </BarChart>
    </ChartContainer>
  )
}
