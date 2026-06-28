import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kanha Jodhpurkar · Event Production & Field Marketing",
  description: "Events I've planned, hosted, and executed end to end.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
