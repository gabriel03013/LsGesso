import type { Metadata } from "next";
import Providers from "@/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "LsGesso",
  description: "Sistema de gestão LsGesso",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
