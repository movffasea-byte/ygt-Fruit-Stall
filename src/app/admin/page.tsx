import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { assignOrder, releaseOrder, updateOrderStatus } from "./actions";
import { ORDER_STATUSES, type OrderStatus } from "./statuses";

export const metadata = { title: "Admin | Yandaki Fruit Stall" };

type Order = {
  id: string;
  created_at: string;
  customer_name: string;
  phone: string;
  city: string;
  address: string;
  delivery_date: string;
  notes: string | null;
  total: number;
  has_unpriced: boolean;
  status: OrderStatus;
  assigned_to: string | null;
  order_items: { id: string; name: string; size: string; price: number | null; qty: number }[];
};

const badge: Record<OrderStatus, string> = {
  new: "bg-brand-gold text-brand-green",
  confirmed: "bg-brand-green text-white",
  delivered: "bg-foreground/10 text-foreground",
  cancelled: "bg-brand-red/10 text-brand-red",
};

const naira = (n: number) => `₦${Number(n).toLocaleString("en-NG")}`;

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ view?: string }> }) {
  const { view } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: me } = await supabase.from("profiles").select("role").eq("id", user?.id ?? "").maybeSingle();
  const isAdmin = me?.role === "admin";
  const mine = view === "mine";

  let query = supabase.from("orders").select("*, order_items(*)").order("created_at", { ascending: false }).limit(100);
  if (mine) query = query.eq("assigned_to", user?.id ?? "");
  const { data, error } = await query;
  const orders = (data ?? []) as Order[];

  // Admins can read every profile, so they get names and the reassign list.
  const { data: team } = isAdmin ? await supabase.from("profiles").select("id, full_name, email, role") : { data: [] };
  const people = (team ?? []) as { id: string; full_name: string | null; email: string | null; role: string }[];
  const nameOf = (id: string | null) => {
    if (!id) return "Unassigned";
    const p = people.find((x) => x.id === id);
    return p ? (p.full_name ?? p.email ?? "Team member") : id === user?.id ? "You" : "A teammate";
  };

  return (
    <main className="py-8">
      <h1 className="text-3xl font-bold text-brand-green">Orders</h1>
      <nav className="mt-3 flex gap-2 text-sm font-semibold">
        <Link href="/admin" className={`rounded-full border border-brand-green px-3 py-1 ${mine ? "text-brand-green" : "bg-brand-green text-white"}`}>
          All orders
        </Link>
        <Link href="/admin?view=mine" className={`rounded-full border border-brand-green px-3 py-1 ${mine ? "bg-brand-green text-white" : "text-brand-green"}`}>
          My orders
        </Link>
      </nav>
      {error && <p className="mt-4 text-brand-red">Could not load orders. Try refreshing the page.</p>}
      {!error && orders.length === 0 && <p className="mt-4">No orders yet.</p>}

      <ul className="mt-6 space-y-4">
        {orders.map((o) => (
          <li key={o.id} className="rounded-lg border border-brand-green/20 bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-lg font-semibold">{o.customer_name}</p>
                <p className="text-sm text-foreground/70">
                  Ordered{" "}
                  {new Date(o.created_at).toLocaleString("en-NG", {
                    dateStyle: "medium",
                    timeStyle: "short",
                    timeZone: "Africa/Lagos",
                  })}
                </p>
              </div>
              <span className={`rounded-full px-3 py-1 text-sm font-semibold capitalize ${badge[o.status]}`}>
                {o.status}
              </span>
            </div>

            <dl className="mt-3 grid gap-1 text-sm sm:grid-cols-2">
              <div>
                <dt className="inline font-semibold">Phone: </dt>
                <dd className="inline">
                  <a href={`tel:${o.phone}`} className="underline">
                    {o.phone}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="inline font-semibold">Deliver on: </dt>
                <dd className="inline">{o.delivery_date}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="inline font-semibold">Address: </dt>
                <dd className="inline">
                  {o.address}, {o.city}
                </dd>
              </div>
              {o.notes && (
                <div className="sm:col-span-2">
                  <dt className="inline font-semibold">Notes: </dt>
                  <dd className="inline">{o.notes}</dd>
                </div>
              )}
            </dl>

            <ul className="mt-3 divide-y divide-brand-green/10 text-sm">
              {o.order_items.map((i) => (
                <li key={i.id} className="flex justify-between gap-2 py-1">
                  <span>
                    {i.qty} x {i.name} ({i.size})
                  </span>
                  <span>{i.price === null ? "Price on request" : naira(i.price * i.qty)}</span>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-right font-bold">
              Total: {naira(o.total)}
              {o.has_unpriced && " + items priced on request"}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
              <span>
                <span className="font-semibold">Handled by: </span>
                {nameOf(o.assigned_to)}
              </span>
              {isAdmin && (
                <form action={assignOrder} className="flex gap-2">
                  <input type="hidden" name="id" value={o.id} />
                  <select name="assigned_to" defaultValue={o.assigned_to ?? ""} className="rounded border border-brand-green/40 bg-white px-2 py-1">
                    <option value="">Unassigned</option>
                    {people.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.full_name ?? p.email}
                      </option>
                    ))}
                  </select>
                  <button className="rounded-full border border-brand-green px-3 py-1 text-brand-green">Reassign</button>
                </form>
              )}
              {o.assigned_to === user?.id && o.status === "new" && (
                <form action={releaseOrder}>
                  <input type="hidden" name="id" value={o.id} />
                  <button className="rounded-full border border-brand-red px-3 py-1 text-brand-red">Can&apos;t take it</button>
                </form>
              )}
            </div>

            <form action={updateOrderStatus} className="mt-3 flex flex-wrap gap-2">
              <input type="hidden" name="id" value={o.id} />
              {ORDER_STATUSES.filter((s) => s !== o.status).map((s) => (
                <button
                  key={s}
                  type="submit"
                  name="status"
                  value={s}
                  className="rounded-full border border-brand-green px-3 py-1 text-sm capitalize text-brand-green"
                >
                  Mark {s}
                </button>
              ))}
            </form>
          </li>
        ))}
      </ul>
    </main>
  );
}
