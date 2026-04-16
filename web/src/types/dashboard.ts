// Enums (espelham os enums da API)

export type ChartType = 'area' | 'bar' | 'pie'

export type KpiIcon =
  | 'clipboard-list'
  | 'dollar-sign'
  | 'receipt'
  | 'tag'
  | 'check-circle'
  | 'clock'
  | 'x-circle'
  | 'file-text'
  | 'wrench'
  | 'check-square'
  | 'home'
  | 'percent'
  | 'trending-up'

export type KpiCategory = 'financial' | 'order' | 'product'

// Chart series (define cada linha/barra/fatia do gráfico)

export type ChartSeries = {
  dataKey: string
  label: string
  color?: string
}

// Chart wrapper genérico

export type ChartResponse<T> = {
  title: string
  chartType: ChartType
  xKey: string
  series: ChartSeries[]
  data: T[]
}

// Chart data items

export type OrdersMonthlyTrendItem = {
  month: string
  orders_count: number
  net_revenue: number
}

export type TopEmployeeItem = {
  employee_id: number
  name: string
  role: string
  orders_count: number
  total_revenue: number
}

export type RoomsPerOrderItem = {
  rooms: number
  total: number
}

export type OrdersByStatusItem = {
  status: string | null
  total: number
}

export type DiscountImpactItem = {
  group: 'with_discount' | 'without_discount'
  orders_count: number
  avg_ticket: number
  total_revenue: number
}

export type MonthlyGrossVsNetItem = {
  month: string
  gross_revenue: number
  net_revenue: number
  total_discount: number
}

export type TopSellingProductItem = {
  product_id: number
  name: string
  type: string
  total_quantity: number
  total_revenue: number
}

export type RevenueByProductTypeItem = {
  type: string
  products_count: number
  total_quantity: number
  total_revenue: number
}

// Grouped chart responses (one per tab)

export type OrdersCharts = {
  monthlyTrend: ChartResponse<OrdersMonthlyTrendItem>
  topEmployees: ChartResponse<TopEmployeeItem>
  roomsPerOrder: ChartResponse<RoomsPerOrderItem>
  byStatus: ChartResponse<OrdersByStatusItem>
}

export type FinancialCharts = {
  discountImpact: ChartResponse<DiscountImpactItem>
  monthlyGrossVsNet: ChartResponse<MonthlyGrossVsNetItem>
  overview: FinancialOverview
}

export type ProductsCharts = {
  topSelling: ChartResponse<TopSellingProductItem>
  revenueByType: ChartResponse<RevenueByProductTypeItem>
}

// Financial overview (KPI cards nomeados, usado na aba financeiro)

export type FinancialOverview = {
  totalNetRevenue: KpiCard
  totalGrossRevenue: KpiCard
  totalDiscount: KpiCard
  paidNetRevenue: KpiCard
}

// KPI card (usado no flat array do overview)

export type KpiCard = {
  title: string
  description: string
  data: string
  type: 'money' | 'number' | 'percentage'
  icon: KpiIcon
  category: KpiCategory
  isTrendingUp?: boolean
  trendingPercentage?: number
}

// Mega response (/dashboard/all)

export type DashboardAll = {
  overview: KpiCard[]
  ordersCharts: OrdersCharts
  financialCharts: FinancialCharts
  productsCharts: ProductsCharts
}
