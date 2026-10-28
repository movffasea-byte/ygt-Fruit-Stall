import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import CartDrawer, { MobileCartBar } from "@/components/CartDrawer";
import { ToastProvider } from "@/components/Toast";
import { CartProvider } from "@/lib/cart";
import { SITE_URL } from "@/lib/config";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const description =
  "Fresh juices, Greek yoghurt, granola and more. Order online for delivery in Abuja, Kaduna and Kano.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Yandaki Fruit Stall", template: "%s | Yandaki Fruit Stall" },
  description,
  openGraph: { type: "website", siteName: "Yandaki Fruit Stall", title: "Yandaki Fruit Stall", description, locale: "en_NG" },
  twitter: { card: "summary_large_image", title: "Yandaki Fruit Stall", description },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <CartProvider>
          <ToastProvider>
            <Header />
            {children}
            <CartDrawer />
            <MobileCartBar />
          </ToastProvider>
        </CartProvider>
      </body>
    </html>
  );
}
