import { User } from "@/types";
import { api } from "./api";
import { LoginData } from "@/types";

export const login = async (payload: LoginData) => {
  const res = await api<{user: User}>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return res.user;
};
