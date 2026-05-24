import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "mun.digital Design System",
  description: "Public design-system documentation for mun.digital tokens, UI, Storybook, and agent workflows.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
