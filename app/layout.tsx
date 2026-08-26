import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kanha Jodhpurkar · Field Marketing, Event Coordination & Vendor Partnerships",
  description: "Events I've planned, hosted, and run from the first vendor call to the last chair stacked.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
