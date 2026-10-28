import { createClient } from "@/lib/supabase/server";
import { updateOrderStatus } from "./actions";
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
  order_items: { id: string; name: string; size: string; price: number | null; qty: number }[];
};

const badge: Record<OrderStatus, string> = {
  new: "bg-brand-gold text-brand-green",
  confirmed: "bg-brand-green text-white",
  delivered: "bg-foreground/10 text-foreground",
  cancelled: "bg-brand-red/10 text-brand-red",
};

const naira = (n: number) => `₦${Number(n).toLocaleString("en-NG")}`;

export default async function AdminPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .order("created_at", { ascending: false })
    .limit(100);
  const orders = (data ?? []) as Order[];

  return (
    <main className="py-8">
      <h1 className="text-3xl font-bold text-brand-green">Orders</h1>
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
