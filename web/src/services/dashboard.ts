import { api } from "./api";
import { formatCurrency } from "../lib/utils";

export const getTotalRevenue = async () : Promise<number> => {
  const res = await api<number>("/dashboard/financial/gross-revenue");
  return +res;
};

export const getNetRevenue = async () : Promise<number> => {
  const res = await api<number>("/dashboard/financial/net-revenue");
  return +res;
};
