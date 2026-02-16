import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FreshCheck - 식재료 보관법 검색",
  description: "식재료의 냉장, 냉동, 상온 보관 기간을 한눈에 확인하세요.",
  openGraph: {
    title: "FreshCheck - 식재료 보관법 검색",
    description: "식재료의 냉장, 냉동, 상온 보관 기간을 한눈에 확인하세요.",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "FreshCheck - 식재료 보관법 검색",
    description: "식재료의 냉장, 냉동, 상온 보관 기간을 한눈에 확인하세요.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        {process.env.NEXT_PUBLIC_ADSENSE_ID && (
          <Script
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_ID}`}
            strategy="afterInteractive"
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
