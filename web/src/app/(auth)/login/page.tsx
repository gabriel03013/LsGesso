"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { LoginData } from "@/types";
import { login } from "@/services/auth";
import { useAuthStore } from "@/stores/auth.store";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/schemas/auth.schema";
import { CircleAlert } from "lucide-react";

const Login = () => {
  const [imageCounter, setImageCounter] = useState(1);

  const router = useRouter();

  const changeImage = () => {
    setTimeout(() => {
      if (imageCounter >= 1 && imageCounter < 5) {
        setImageCounter((prev) => prev + 1);
      } else {
        setImageCounter(1);
      }
    }, 1000);
  };

  useEffect(() => {
    changeImage();
  }, [imageCounter]);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<LoginData>({ resolver: zodResolver(LoginSchema) });

  const [loginError, setLoginError] = useState<string | null>(null);
  const loginUser = async (data: LoginData): Promise<void> => {
    try {
      const user = await login(data);
      useAuthStore.getState().setUser(user);

      router.push("/dashboard");
    } catch (err) {
      setLoginError("Email ou código inválidos!");
    }
  };

  return (
    <div className="w-screen h-screen flex overflow-hidden">
      <div className="w-[50%] h-full flex items-center justify-center bg-white">
        <form
          onSubmit={handleSubmit(loginUser)}
          className="gap-5 flex flex-col w-[40%]"
        >
          <div className="text-center flex flex-col gap-2">
            <h1 className="text-3xl font-semibold">Bem-vindo(a)!</h1>
            <p className="text-stone-500">
              Faça seu login para ver informações sobre os produtos, pedidos e
              mais!
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="" className="text-stone-600">
                E-mail
              </label>
              <input
                type="email"
                placeholder="Digite seu email"
                className="bg-zinc-100 p-2.5 rounded px-4 text-sm"
                {...register("email")}
              />
              {errors?.email && (
                <span className="text-red-500 text-sm">
                  {errors.email.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="" className="text-stone-600">
                Código de Admin
              </label>
              <input
                type="text"
                placeholder="Digite seu código"
                className="bg-zinc-100 p-2.5 rounded px-4 text-sm"
                {...register("adminCode")}
              />
              {errors.adminCode && (
                <span className="text-red-500 text-sm">
                  {errors.adminCode.message}
                </span>
              )}
            </div>
          </div>

          {loginError && (
            <div className="border-2 border-red-500 flex items-center py-3 rounded gap-4 bg-red-100">
              <CircleAlert className="text-red-400 ml-5" />
              <p className="text-[15px]">{loginError}</p>
            </div>
          )}

          <button
            type="submit"
            className="bg-blue-500 w-[50%] py-2 text-white font-medium text-base rounded self-center ease duration-300 mt-4 hover:bg-blue-700 cursor-pointer"
          >
            Entrar
          </button>
        </form>
      </div>

      <div className="relative w-[50%] h-full">
        <Image
          src={`/images/login${imageCounter}.jpg`}
          alt={`login${imageCounter}.jpg`}
          fill
          className="object-cover rounded-bl-lg rounded-tl-lg"
        />
      </div>
    </div>
  );
};

export default Login;
