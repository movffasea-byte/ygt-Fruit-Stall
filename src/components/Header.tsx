"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart";

export default function Header() {
  const { count, setDrawerOpen } = useCart();
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between bg-brand-green px-4 py-2 text-white">
      <Link href="/" className="flex items-center gap-2 font-bold">
        <Image src="/brand/logo.jpg" alt="" width={40} height={45} className="h-10 w-auto rounded-full" />
        <span className="sm:hidden">Yandaki</span>
        <span className="hidden sm:inline">Yandaki Fruit Stall</span>
      </Link>
      <nav className="flex items-center gap-3 text-sm font-medium sm:gap-4">
        <Link href="/shop">Shop</Link>
        <Link href="/stockists">Stockists</Link>
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="rounded-full bg-brand-gold px-3 py-1 text-brand-green"
        >
          Cart ({count})
        </button>
      </nav>
    </header>
  );
}
