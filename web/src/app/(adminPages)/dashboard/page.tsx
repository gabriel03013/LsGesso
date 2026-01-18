"use client";

import { Separator } from "@/components/ui/separator";
import { Plus, ShoppingCart, DollarSign, Users} from "lucide-react";
import AppCard from "@/components/layout/Card";
import { getTotalRevenue } from "@/services/dashboard";
import { formatCurrency } from "@/lib/utils";
import { useEffect, useState } from "react";

const page = () => {
  const [netRevenue, setNetRevenue] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const result = await getTotalRevenue();
        setNetRevenue(result.toString());
      } catch (err) {
        console.error(err);
      }
    };

    load();
  }, []);

  return (
    <section>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <button className="flex items-center justify-center gap-2 bg-blue-500 cursor-pointer p-1.5 px-2 rounded text-white font-medium text-center text-sm hover:bg-blue-700">
          {" "}
          <Plus />
          Novo Orçamento
        </button>
      </div>
      <Separator className="my-4" />

      <div className="flex gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-medium">Receita Líquida</h2>
          <p className="text-3xl font-semibold">
            {netRevenue ? formatCurrency(+netRevenue) : "Carregando..."}
          </p>
        </div>

        <AppCard
          icon={<DollarSign className="text-white"/>}
          title="Receita Total"
          fetchData={async () => formatCurrency(await getTotalRevenue())}
        />

        <AppCard
          icon={<ShoppingCart className="text-white"/>}
          title="Receita Total"
          fetchData={async () => formatCurrency(await getTotalRevenue())}
        />

        <AppCard
          icon={<Users className="text-white"/>}
          title="Receita Total"
          fetchData={async () => formatCurrency(await getTotalRevenue())}
        />
      </div>
    </section>
  );
};

export default page;
