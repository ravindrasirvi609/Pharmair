import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import MainLayout from "@/components/layout/MainLayout";
import { Analytics } from "@vercel/analytics/next";
// Improved font loading with fallback
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap", // Ensures text remains visible during font loading
  fallback: ["system-ui", "Arial", "sans-serif"],
  preload: true,
  weight: ["400", "500", "600", "700"],
  adjustFontFallback: true, // Automatically adjusts the fallback font
});

export const metadata: Metadata = {
  title: "Pharmair Conference 2025",
  description:
    "The Premier International Conference for Pharmaceutical and Healthcare Innovation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <MainLayout>
          {children}
          <Analytics />
        </MainLayout>
      </body>
    </html>
  );
}
