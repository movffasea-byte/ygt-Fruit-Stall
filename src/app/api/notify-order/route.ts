import { NextResponse } from "next/server";
import { sendOrderAlert } from "@/lib/alerts";
import { createAdminClient } from "@/lib/supabase/admin";

const naira = (n: number) => `₦${Number(n).toLocaleString("en-NG")}`;

// Called by the cart right after an order is saved. Alerts the assigned staff member and every admin, once per order.
export async function POST(request: Request) {
  const { id } = (await request.json().catch(() => ({}))) as { id?: string };
  const admin = createAdminClient();
  if (!id || !admin) return NextResponse.json({ ok: false }, { status: 400 });

  // Claim the order: only a recent, not-yet-alerted order can be claimed, so this can't be replayed.
  const since = new Date(Date.now() - 10 * 60 * 1000).toISOString();
  const { data: order } = await admin
    .from("orders")
    .update({ alerted_at: new Date().toISOString() })
    .eq("id", id)
    .is("alerted_at", null)
    .gte("created_at", since)
    .select("customer_name, total, has_unpriced, assigned_to, order_items(name, size, qty)")
    .maybeSingle();
  if (!order) return NextResponse.json({ ok: false }, { status: 404 });

  const { data: people } = await admin
    .from("profiles")
    .select("id, role, whatsapp_number")
    .or(`role.eq.admin${order.assigned_to ? `,id.eq.${order.assigned_to}` : ""}`);
  const numbers = [...new Set((people ?? []).map((p) => p.whatsapp_number).filter((n): n is string => !!n))];

  const origin = new URL(request.url).origin;
  const items = (order.order_items as { name: string; size: string; qty: number }[])
    .map((i) => `${i.qty} x ${i.name} (${i.size})`)
    .join(", ");
  const params = {
    customer: order.customer_name,
    items,
    total: `${naira(order.total)}${order.has_unpriced ? " + items priced on request" : ""}`,
    link: `${origin}/admin`,
  };

  const results = await Promise.all(numbers.map((n) => sendOrderAlert(n, params)));
  return NextResponse.json({ ok: true, recipients: numbers.length, results });
}
