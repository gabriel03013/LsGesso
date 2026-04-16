import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ReactNode } from "react"

type ChartCardProps = {
  title: string
  description: string
  children: ReactNode
}

export default function ChartCard({ title, description, children }: ChartCardProps) {
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {children}
      </CardContent>
    </Card>
  )
}
