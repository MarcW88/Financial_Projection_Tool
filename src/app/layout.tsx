import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Financial Projection Tool",
  description: "Outil de projection d'épargne pour cuisine",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
