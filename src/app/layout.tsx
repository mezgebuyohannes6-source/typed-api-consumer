import type { Metadata } from "next";
// Suppress TS error about missing CSS module declarations for side-effect import
// @ts-ignore
import "./globals.css";

export const metadata: Metadata = {
  title: "Weather Search",
  description: "Search any city and see its current weather and hourly forecast",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}