import { LoginSchema } from "@/schemas/auth.schema";
import z from "zod";

export type LoginData = z.infer<typeof LoginSchema>;

export type User = {
  id: number;
  email: string;
  name: string;
};