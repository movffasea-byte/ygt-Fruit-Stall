"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { DELIVERY_CITIES } from "@/lib/config";
import { buildWhatsAppUrl, cartTotal, saveOrder, type OrderDetails } from "@/lib/whatsapp";

const field = "mt-1 w-full rounded border border-brand-green/40 bg-white px-3 py-2";

export default function CartPage() {
  const { items, setQty, clear } = useCart();  const [form, setForm] = useState<OrderDetails>({
    name: "",
    phone: "",
    city: DELIVERY_CITIES[0],
    address: "",
    date: "",
    notes: "",
  });
  const { total, hasUnpriced } = cartTotal(items);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  const update = (k: keyof OrderDetails) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (form.date < new Date().toISOString().slice(0, 10)) {
      setError("Please choose today or a later date.");
      return;
    }
    setError("");
    setSending(true);
    // Customers can't read orders back, so the id is made here; it doubles as the tracking token.
    const id = crypto.randomUUID();
    const saved = await saveOrder(items, form, id);
    const url = buildWhatsAppUrl(items, form, saved ? `${window.location.origin}/track/${id}` : undefined);
    if (saved) {
      // Fire and forget: keepalive lets the request finish while the page moves on to WhatsApp.
      fetch("/api/notify-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
        keepalive: true,
      }).catch(() => {});
      clear();
    }
    // Same-tab navigation: a new window opened after an await is blocked on many phones.
    window.location.assign(url);
  }

  if (items.length === 0) {
    return (
      <main className="mx-auto w-full max-w-2xl px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-brand-green">Your cart is empty</h1>
        <Link href="/shop" className="mt-6 inline-block rounded-full bg-brand-red px-6 py-3 font-semibold text-white">
          Browse the shop
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-10">
      <h1 className="text-3xl font-bold text-brand-green">Your order</h1>

      <ul className="mt-6 divide-y divide-brand-green/20 rounded-lg border border-brand-green/20 bg-white">
        {items.map((i) => (
          <li key={i.key} className="flex items-center justify-between gap-3 p-3">
            <div>
              <p className="font-semibold">{i.name}</p>
              <p className="text-sm text-foreground/70">
                {i.size} · {i.price === null ? "Price on request" : `₦${(i.price * i.qty).toLocaleString("en-NG")}`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" aria-label={`Remove one ${i.name}`} onClick={() => setQty(i.key, i.qty - 1)} className="h-8 w-8 rounded-full border border-brand-green text-brand-green">
                -
              </button>
              <span className="w-6 text-center">{i.qty}</span>
              <button type="button" aria-label={`Add one ${i.name}`} onClick={() => setQty(i.key, i.qty + 1)} className="h-8 w-8 rounded-full border border-brand-green text-brand-green">
                +
              </button>
            </div>
          </li>
        ))}
      </ul>

      <p className="mt-4 text-right text-lg font-bold">
        Total: ₦{total.toLocaleString("en-NG")}
        {hasUnpriced && <span className="block text-sm font-normal text-foreground/70">+ items priced on request</span>}
      </p>

      <form onSubmit={submit} className="mt-8 space-y-4">
        <label className="block">
          Full name
          <input required value={form.name} onChange={update("name")} className={field} />
        </label>
        <label className="block">
          Phone number
          <input required type="tel" value={form.phone} onChange={update("phone")} className={field} />
        </label>
        <label className="block">
          City
          <select value={form.city} onChange={update("city")} className={field}>
            {DELIVERY_CITIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label className="block">
          Street / landmark
          <input required value={form.address} onChange={update("address")} className={field} />
        </label>
        <label className="block">
          Delivery date
          <input required type="date" value={form.date} onChange={update("date")} className={field} />
          {error && <span className="mt-1 block text-sm text-brand-red">{error}</span>}
        </label>
        <label className="block">
          Notes (optional)
          <textarea value={form.notes} onChange={update("notes")} rows={3} className={field} />
        </label>

        <button
          type="submit"
          disabled={sending}
          className="w-full rounded-full bg-brand-green px-6 py-3 text-lg font-semibold text-white disabled:opacity-60"
        >
          {sending ? "Sending..." : "Order on WhatsApp"}
        </button>
        <button type="button" onClick={clear} className="w-full text-sm text-brand-red underline">
          Clear cart
        </button>
      </form>
    </main>
  );
}
