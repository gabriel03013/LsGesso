"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { DashboardCard } from "@/components/layout/Card";
import { KPI } from "@/types/kpi";

export default function Page() {
  const { data } = useQuery({
    queryKey: ["dashboard-data"],
    queryFn: async () => {
      const data = await api<KPI[]>("/dashboard/overview");
      return data;
    },
  });

  const financialKPIs = data?.filter((kpi) => kpi.category === "financial") || [];


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
              <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
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

              <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
