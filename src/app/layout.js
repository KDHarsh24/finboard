import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import BackgroundDots from '@/components/BackgroundDots';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "FinBoard | Groww Assignment",
  description: "Customizable finance dashboard with real-time data",
  icons: {
    icon: '/groww-icon.svg',
    shortcut: '/groww-icon.svg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/groww-icon.svg" type="image/svg+xml" />
        <link rel="shortcut icon" href="/groww-icon.svg" />
        <link rel="apple-touch-icon" href="/groww-icon.svg" />
        {/* Fallback for browsers requesting /favicon.ico */}
        <link rel="icon" href="/groww-icon.png" sizes="32x32" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased relative`}
      >
        <BackgroundDots />
        {children}
      </body>
    </html>
  );
}
