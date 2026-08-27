import { MotionEffectsGate } from "@/components/motion/MotionEffectsGate";
import { ThemeProvider } from "@/components/ThemeProvider";
import { getLocale, t } from "@/lib/i18n";
import { htmlLang, ogLocale } from "@/lib/seo/helpers";
import { getMetadataBase } from "@/lib/site-url";
import type { Metadata, Viewport } from "next";
import { Dosis, Nunito } from "next/font/google";
import "./globals.css";

const dosis = Dosis({
  variable: "--font-dosis",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["300", "400", "600"],
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const s = t(locale);
  const loc = ogLocale(locale);
  const alternate = loc === "tr_TR" ? "en_US" : "tr_TR";

  return {
    metadataBase: getMetadataBase(),
    applicationName: s.seo.siteName,
    title: {
      default: s.seo.homeDocumentTitle,
      template: `%s | ${s.seo.siteName}`,
    },
    description: s.seo.defaultDescription,
    keywords: [...s.seo.keywords],
    authors: [{ name: s.seo.siteName, url: "/" }],
    creator: s.seo.siteName,
    publisher: s.seo.siteName,
    category: "entertainment",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    alternates: {
      canonical: "/",
    },
    appleWebApp: {
      capable: true,
      title: s.seo.siteName,
      statusBarStyle: "black-translucent",
    },
    openGraph: {
      type: "website",
      siteName: s.seo.siteName,
      locale: loc,
      alternateLocale: [alternate],
      title: s.seo.homeDocumentTitle,
      description: s.seo.defaultDescription,
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: s.seo.ogImageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: s.seo.homeDocumentTitle,
      description: s.seo.defaultDescription,
      images: [
        {
          url: "/twitter-image",
          width: 1200,
          height: 630,
          alt: s.seo.ogImageAlt,
        },
      ],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f4f5" },
    { media: "(prefers-color-scheme: dark)", color: "#0c0c12" },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  return (
    <html
      lang={htmlLang(locale)}
      className={`${dosis.variable} ${nunito.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body
        className="flex min-h-full flex-col font-[family-name:var(--font-nunito)]"
        suppressHydrationWarning
      >
        <ThemeProvider>
          <div className="flex min-h-screen min-h-dvh flex-1 flex-col">
            <MotionEffectsGate />
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
