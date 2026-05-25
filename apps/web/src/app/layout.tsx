import type { Metadata } from "next";
import { loadResume } from "@mun.digital/profile";
import { SiteFooter } from "@/components/chrome/SiteFooter";
import { SiteNav } from "@/components/chrome/SiteNav";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const resume = await loadResume();
  const name =
    typeof resume.basics?.name === "string"
      ? resume.basics.name
      : "Mundi Morgado";
  const description =
    typeof resume.basics?.summary === "string"
      ? resume.basics.summary
      : "Agent-readable professional profile and resume for Mundi Morgado.";

  return {
    title: `${name} | mun.digital`,
    description,
    metadataBase: new URL("https://mun.digital"),
    applicationName: "mun.digital",
    openGraph: {
      title: `${name} | mun.digital`,
      description,
      url: "https://mun.digital",
      siteName: "mun.digital",
      type: "profile",
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: "Mundi Morgado - UX Engineer",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} | mun.digital`,
      description,
      images: ["/opengraph-image"],
    },
    alternates: {
      canonical: "https://mun.digital",
    },
    icons: {
      icon: "/icon",
      shortcut: "/icon",
      apple: "/icon",
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body>
        <SiteNav />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
