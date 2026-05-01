import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Claro Kalender",
  description: "Rüfi Family Kalender für Claro",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
