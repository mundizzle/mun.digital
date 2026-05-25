import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "mun.digital Public Reference",
  description: "Public reference documentation for the read-only mundigital MCP server, CLI, and supporting workflows.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
