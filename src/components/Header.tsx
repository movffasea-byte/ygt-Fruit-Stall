"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart";

export default function Header() {
  const { count } = useCart();
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between bg-brand-green px-4 py-2 text-white">
      <Link href="/" className="flex items-center gap-2 font-bold">
        <Image src="/brand/logo.jpg" alt="" width={40} height={45} className="h-10 w-auto rounded-full" />
        Yandaki Fruit Stall
      </Link>
      <nav className="flex items-center gap-4 text-sm font-medium">
        <Link href="/shop">Shop</Link>
        <Link href="/cart" className="rounded-full bg-brand-gold px-3 py-1 text-brand-green">
          Cart ({count})
        </Link>
      </nav>
    </header>
  );
}
