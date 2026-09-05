import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dark Souls II: Scholar of the First Sin — Interactive World Map",
  description: "Original schematic map of Drangleic with every bonfire, boss, item, NPC, shortcut and farming spot, plus graph-based routing between locations.",
};

export const viewport: Viewport = {
  themeColor: "#0a0908",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full antialiased">{children}</body>
    </html>
  );
}
