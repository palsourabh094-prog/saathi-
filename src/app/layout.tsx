import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope, Noto_Sans_Devanagari } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/providers";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz", "SOFT"],
  display: "swap",
});

const notoDevanagari = Noto_Sans_Devanagari({
  variable: "--font-noto-devanagari",
  subsets: ["devanagari"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "SAATHI — Rural Resilience & Care Intelligence",
    template: "%s · SAATHI",
  },
  description:
    "SAATHI connects the health of the household with the health of the farm. Predict. Prevent. Plan. Protect.",
  applicationName: "SAATHI",
};

export const viewport: Viewport = {
  themeColor: "#1c1b17",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${fraunces.variable} ${notoDevanagari.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
