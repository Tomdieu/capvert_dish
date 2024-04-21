import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster"
import React from "react";
import { Analytics } from "@vercel/analytics/react"

const poppins = localFont({
  src: [
    {
      path: "../public/fonts/poppins/Poppins-Regular.ttf",
      weight: "400",
    },
    {
      path: "../public/fonts/poppins/Poppins-SemiBold.ttf",
      weight: "600",
    },
    {
      path: "../public/fonts/poppins/Poppins-Bold.ttf",
      weight: "700",
    },
    {
      path: "../public/fonts/poppins/Poppins-Black.ttf",
      weight: "800",
    },
  ],
  variable: "--font-poppins",
  display:"swap"
});

export const metadata: Metadata = {
  title: "Cap vert Dish",
  description:
    "Dishes from capvert",
  creator: "Tomdieu Ivan",
  metadataBase:new URL("https://cap-verd-dish.vercel.app"),
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "Culture",
  twitter: {
    card: "summary_large_image",
    title: "Cap Vert Dish",
    description:
      "Cap vert dishes",

    creator: "@tomdieu ivan",
    images: ["/logo.png"],
  },
  openGraph: {
    title: "Cap Vert Dish",
    description:
      "Cap vert dishes",

    images: ["/logo.png"],
    creators: ["@tomdieu ivan"],
  },
  icons:{
    icon:[
      {
        media:"(prefers-color-scheme:light)",
        url:"/logo.png",
        href:"/logo.png"
      },
      {
        media:"(prefers-color-scheme:dark)",
        url:"/logo.png",
        href:"/logo.png"
      }
    ]
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.variable} w-full h-screen flex font-poppins`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          <Analytics/>
          <Toaster />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
