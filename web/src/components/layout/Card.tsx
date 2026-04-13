"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";

type CardProps = {
  icon: React.ReactNode;
  title: string;
  fetchData: (startDate?: Date, endDate?: Date) => Promise<string>;
};

const AppCard = ({ icon, title, fetchData }: CardProps) => {
  const [output, setOutput] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const result = await fetchData();
        setOutput(result);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [fetchData]);

  return (
    <Card className="flex flex-col gap-4 w-[20%] h-[30%]">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <div className="bg-blue-500 p-2 rounded-full">{icon}</div>
          <ArrowUpRight />
        </CardTitle>
      </CardHeader>

      <CardContent className="text-2xl font-normal flex flex-col gap-2">
        <h2 className="text-base text-stone-500">{title}</h2>

        {loading ? "Carregando..." : output}
      </CardContent>
    </Card>
  );
};

export default AppCard;
