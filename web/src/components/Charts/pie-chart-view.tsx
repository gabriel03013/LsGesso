"use client"

import { ChartResponse } from "@/types/dashboard"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart"
import { Pie, PieChart } from "recharts"

const FALLBACK_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
]

export default function PieChartView({ chart }: { chart: ChartResponse<unknown> }) {
  const rawData = chart.data as Record<string, unknown>[]

  const dataWithColors = rawData.map((item, i) => {
    const key = String(item[chart.xKey] ?? i)
    const color = chart.colorMap?.[key] ?? FALLBACK_COLORS[i % FALLBACK_COLORS.length]
    return { ...item, fill: color }
  })

  const config = Object.fromEntries(
    rawData.map((item, i) => {
      const key = String(item[chart.xKey] ?? i)
      const color = chart.colorMap?.[key] ?? FALLBACK_COLORS[i % FALLBACK_COLORS.length]
      return [key, { label: key, color }]
    })
  )

  return (
    <ChartContainer config={config} className="mx-auto aspect-square max-h-[250px]">
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        <Pie
          data={dataWithColors}
          dataKey={chart.series[0].dataKey}
          nameKey={chart.xKey}
          innerRadius={50}
          strokeWidth={2}
        />
      </PieChart>
    </ChartContainer>
  )
}
