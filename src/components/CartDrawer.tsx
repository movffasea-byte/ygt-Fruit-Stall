"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useCart } from "@/lib/cart";
import { cartTotal } from "@/lib/whatsapp";

const naira = (n: number) => `₦${n.toLocaleString("en-NG")}`;
const stepper = "h-8 w-8 rounded-full border border-brand-green/40 text-lg leading-none text-brand-green";

export default function CartDrawer() {
  const { items, setQty, drawerOpen, setDrawerOpen } = useCart();
  const { total, hasUnpriced } = cartTotal(items);

  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setDrawerOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawerOpen, setDrawerOpen]);

  if (!drawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Close cart"
        onClick={() => setDrawerOpen(false)}
        className="absolute inset-0 bg-black/50"
      />
      <aside
        role="dialog"
        aria-label="Your cart"
        className="drawer absolute right-0 top-0 flex h-full w-full max-w-sm flex-col bg-background shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-brand-green/20 px-4 py-3">
          <h2 className="text-lg font-bold text-brand-green">Your cart</h2>
          <button type="button" onClick={() => setDrawerOpen(false)} className="px-2 text-2xl leading-none" aria-label="Close cart">
            ×
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4 text-center">
            <p>Your cart is empty.</p>
            <Link
              href="/shop"
              onClick={() => setDrawerOpen(false)}
              className="rounded-full bg-brand-red px-5 py-2 font-semibold text-white"
            >
              Browse the shop
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-brand-green/15 overflow-y-auto px-4">
              {items.map((i) => (
                <li key={i.key} className="flex items-center justify-between gap-3 py-3">
                  <div>
                    <p className="font-semibold">{i.name}</p>
                    <p className="text-sm text-foreground/70">
                      {i.size} · {i.price === null ? "Price on request" : naira(i.price * i.qty)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button type="button" className={stepper} aria-label={`Remove one ${i.name}`} onClick={() => setQty(i.key, i.qty - 1)}>
                      −
                    </button>
                    <span className="w-5 text-center">{i.qty}</span>
                    <button type="button" className={stepper} aria-label={`Add one ${i.name}`} onClick={() => setQty(i.key, i.qty + 1)}>
                      +
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t border-brand-green/20 p-4">
              <p className="mb-3 flex justify-between font-semibold">
                <span>Total</span>
                <span>
                  {naira(total)}
                  {hasUnpriced && " + items on request"}
                </span>
              </p>
              <Link
                href="/cart"
                onClick={() => setDrawerOpen(false)}
                className="block rounded-full bg-brand-red px-4 py-3 text-center font-semibold text-white"
              >
                Checkout
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

// Sticky bar on phones: only shown when the cart has something and we're not already checking out.
export function MobileCartBar() {
  const { items, count, setDrawerOpen } = useCart();
  const pathname = usePathname();
  const { total } = cartTotal(items);
  const hidden = count === 0 || ["/cart", "/admin", "/login"].some((p) => pathname.startsWith(p));
  if (hidden) return null;

  return (
    <>
      <div className="h-16 md:hidden" />
      <button
        type="button"
        onClick={() => setDrawerOpen(true)}
        className="fixed inset-x-3 bottom-3 z-40 flex items-center justify-between rounded-full bg-brand-red px-5 py-3 font-semibold text-white shadow-lg md:hidden"
      >
        <span>
          View cart · {count} {count === 1 ? "item" : "items"}
        </span>
        <span>{total > 0 ? naira(total) : ""}</span>
      </button>
    </>
  );
}
