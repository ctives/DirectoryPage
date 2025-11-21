import type { Metadata } from "next";
import localFont from "next/font/local";
import { Providers } from "./providers";
import Footer from "@/components/Footer";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Nashville Cleaning Directory",
  description: "Find trusted cleaning services in Nashville and surrounding areas",
  keywords: "cleaning services, Nashville, residential cleaning, commercial cleaning",
  authors: [{ name: "Nashville Cleaning Directory" }],
  openGraph: {
    title: "Nashville Cleaning Directory",
    description: "Find trusted cleaning services in Nashville and surrounding areas",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-neutral-50 flex flex-col min-h-screen`}
      >
        <Providers>
          <div className="flex-1">
            {children}
          </div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
