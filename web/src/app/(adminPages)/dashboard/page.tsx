"use client";

import { AppSidebar } from "@/components/Sidebar/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { DashboardCard } from "@/components/layout/Card";
import { KPI } from "@/types/kpi";
import { OrdersCharts } from "@/types/dashboard";
import Chart from "@/components/Charts/chart";

export default function Page() {
  const { data } = useQuery({
    queryKey: ["dashboard-data"],
    queryFn: async () => {
      const data = await api<KPI[]>("/dashboard/overview");
      return data;
    },
  });

  const financialKPIs =
    data?.filter((kpi) => kpi.category === "financial") || [];

  const { data: chartsData } = useQuery<OrdersCharts | undefined>({
    queryKey: ["dashboard-charts"],
    queryFn: async () => {
      const data = await api("/dashboard/orders/charts") as OrdersCharts;
      return data;
    },
  });

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader pageTitle="Início - Visão Geral" />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
                {financialKPIs.map((kpi) => (
                  <DashboardCard
                    key={kpi.title}
                    title={kpi.title}
                    data={kpi.data}
                    description={kpi.description}
                    icon={kpi.icon}
                    type={kpi.type}
                    isTrendingUp={kpi.isTrendingUp}
                    trendingPercentage={kpi.trendingPercentage}
                  />
                ))}
              </div>

              <div className="px-4 lg:px-6 flex flex-col gap-4">
                {chartsData && <Chart chart={chartsData.byStatus} className="w-100 h-100" />}
              </div>
              <div className="px-4 lg:px-6"></div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
