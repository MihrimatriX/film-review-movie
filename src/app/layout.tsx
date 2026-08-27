import { MotionEffectsGate } from "@/components/motion/MotionEffectsGate";
import { ThemeProvider } from "@/components/ThemeProvider";
import { getLocale } from "@/lib/i18n";
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

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
  applicationName: "Film Review",
  title: {
    default: "Film Review — Movie Database",
    template: "%s | Film Review",
  },
  description:
    "Movie and TV database with reviews, cast, TMDB discovery, and blog — Next.js portfolio demo.",
  keywords: [
    "movies",
    "TV series",
    "film reviews",
    "TMDB",
    "cinema",
    "dizi",
    "film",
    "actors",
  ],
  authors: [{ name: "Film Review", url: "/" }],
  creator: "Film Review",
  publisher: "Film Review",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "Film Review",
    locale: "en_US",
    alternateLocale: ["tr_TR"],
    title: "Film Review — Movie Database",
    description:
      "Movie and TV database with synopses, cast, TMDB-powered lists, and community features.",
    images: [
      {
        url: "/images/placeholders/cover.svg",
        width: 1200,
        height: 630,
        alt: "Film Review",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Film Review — Movie Database",
    description:
      "Movie and TV database with synopses, cast, TMDB-powered lists, and community features.",
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
      lang={locale}
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
