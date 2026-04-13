import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email("Email inválido!").nonempty("Email obrigatório!"),
  adminCode: z.string().nonempty("Código obrigatório!"),
});
