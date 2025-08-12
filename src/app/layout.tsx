import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider";
import { defaultSEO } from "@/lib/seo";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Kültür Sanat İş",
  description: defaultSEO.description,
  keywords: "sendika, işçi hakları, çalışan hakları, birlik, dayanışma",
  authors: [{ name: process.env.NEXT_PUBLIC_SITE_NAME || "Kültür Sanat İş" }],
  creator: process.env.NEXT_PUBLIC_SITE_NAME || "Kültür Sanat İş",
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: process.env.NEXT_PUBLIC_SITE_NAME || "Kültür Sanat İş",
    title: defaultSEO.title,
    description: defaultSEO.description,
  },
  twitter: {
    card: "summary_large_image",
    title: defaultSEO.title,
    description: defaultSEO.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
