import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/ui/toast";

export const metadata: Metadata = {
  title: "KTŠ - Uradne ure",
  description: "Pregled trenutno aktivnih članov na uradnih urah Kluba Tržiških Študentov.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sl">
      <body className="bg-kts-black text-white antialiased selection:bg-kts-orange selection:text-black">
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}