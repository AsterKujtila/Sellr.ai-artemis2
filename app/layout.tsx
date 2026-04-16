import type { Metadata, Viewport } from "next"
import { Figtree, Fraunces, JetBrains_Mono } from "next/font/google"
import "./globals.css"

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
  display: "swap",
})

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
})

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
})

export const metadata: Metadata = {
  title: "SELLR.AI - AI Sales Coach for Whop Sellers",
  description:
    "The AI sales coach built exclusively for Whop sellers. Get instant feedback on your offers, pricing, and store optimization.",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${figtree.variable} ${fraunces.variable} ${jetbrains.variable} bg-background`}
    >
      <body className="font-sans">{children}</body>
    </html>
  )
}
