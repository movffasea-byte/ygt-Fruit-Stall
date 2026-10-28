import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { formatDate } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Track your order", robots: { index: false } };

type Tracked = {
  status: "new" | "confirmed" | "delivered" | "cancelled";
  created_at: string;
  delivery_date: string;
  city: string;
  total: number;
  has_unpriced: boolean;
  items: { name: string; size: string; price: number | null; qty: number }[];
};

const steps = [
  { id: "new", label: "Received", text: "We have your order." },
  { id: "confirmed", label: "Confirmed", text: "Your order is confirmed and being prepared." },
  { id: "delivered", label: "Delivered", text: "Enjoy your fresh order!" },
] as const;

const naira = (n: number) => `₦${n.toLocaleString("en-NG")}`;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default function TrackPage({ params }: PageProps<"/track/[id]">) {
  return (
    <Suspense fallback={<p className="px-4 py-10 text-center">Loading your order...</p>}>
      <TrackOrder params={params} />
    </Suspense>
  );
}

async function TrackOrder({ params }: { params: PageProps<"/track/[id]">["params"] }) {
  const { id } = await params;
  if (!UUID.test(id)) notFound();

  const supabase = await createClient();
  const { data } = await supabase.rpc("track_order", { p_id: id });
  if (!data) notFound();
  const order = data as Tracked;
  const current = steps.findIndex((s) => s.id === order.status);

  return (
    <main className="mx-auto w-full max-w-xl px-4 py-10">
      <h1 className="text-3xl font-bold text-brand-green">Track your order</h1>
      <p className="mt-1 text-foreground/70">
        Placed {formatDate(order.created_at)} · Delivery to {order.city} on {formatDate(order.delivery_date)}
      </p>

      {order.status === "cancelled" ? (
        <p className="mt-6 rounded-lg border border-brand-red/40 bg-white p-4 font-semibold text-brand-red">
          This order was cancelled. Message us on WhatsApp if you have questions.
        </p>
      ) : (
        <ol className="mt-8">
          {steps.map((s, i) => {
            const done = i <= current;
            return (
              <li key={s.id} className="relative flex gap-4 pb-8 last:pb-0">
                {i < steps.length - 1 && (
                  <span className={`absolute left-[15px] top-8 h-full w-0.5 ${i < current ? "bg-brand-green" : "bg-brand-green/20"}`} />
                )}
                <span
                  className={`z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                    done ? "bg-brand-green text-white" : "border border-brand-green/30 bg-white text-brand-green/40"
                  }`}
                >
                  {done ? "✓" : i + 1}
                </span>
                <div className={done ? "" : "opacity-50"}>
                  <p className="font-semibold">
                    {s.label}
                    {i === current && <span className="ml-2 rounded-full bg-brand-gold px-2 py-0.5 text-xs text-brand-green">Now</span>}
                  </p>
                  <p className="text-sm text-foreground/70">{s.text}</p>
                </div>
              </li>
            );
          })}
        </ol>
      )}

      <section className="mt-10 rounded-lg border border-brand-green/20 bg-white p-4">
        <h2 className="font-bold text-brand-green">Your items</h2>
        <ul className="mt-2 divide-y divide-brand-green/15">
          {order.items.map((i, n) => (
            <li key={n} className="flex justify-between py-2 text-sm">
              <span>
                {i.qty} × {i.name} ({i.size})
              </span>
              <span>{i.price === null ? "Price on request" : naira(i.price * i.qty)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 flex justify-between font-semibold">
          <span>Total</span>
          <span>
            {naira(order.total)}
            {order.has_unpriced && " + items on request"}
          </span>
        </p>
      </section>

      <Link href="/shop" className="mt-8 inline-block text-sm font-medium text-brand-green underline">
        Back to the shop
      </Link>
    </main>
  );
}
