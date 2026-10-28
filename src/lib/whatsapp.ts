import type { CartItem } from "./cart";
import { WHATSAPP_NUMBER } from "./config";
import { createClient } from "./supabase/client";

export type OrderDetails = {
  name: string;
  phone: string;
  city: string;
  address: string;
  date: string;
  notes: string;
};

const naira = (n: number) => `₦${n.toLocaleString("en-NG")}`;

export function cartTotal(items: CartItem[]) {
  const priced = items.filter((i) => i.price !== null);
  return {
    total: priced.reduce((sum, i) => sum + (i.price as number) * i.qty, 0),
    hasUnpriced: priced.length < items.length,
  };
}

// Saves the order so staff can see it in the admin. Returns false on failure; the caller
// still sends the WhatsApp message so the customer's order is never lost.
export async function saveOrder(items: CartItem[], d: OrderDetails): Promise<boolean> {
  try {
    const supabase = createClient();
    const id = crypto.randomUUID(); // customers can't read orders back, so the id is made here
    const { total, hasUnpriced } = cartTotal(items);
    const { error } = await supabase.from("orders").insert({
      id,
      customer_name: d.name,
      phone: d.phone,
      city: d.city,
      address: d.address,
      delivery_date: d.date,
      notes: d.notes.trim() || null,
      total,
      has_unpriced: hasUnpriced,
    });
    if (error) return false;
    const { error: itemsError } = await supabase.from("order_items").insert(
      items.map((i) => ({ order_id: id, name: i.name, size: i.size, price: i.price, qty: i.qty })),
    );
    return !itemsError;
  } catch {
    return false;
  }
}

export function buildWhatsAppUrl(items: CartItem[], d: OrderDetails) {
  const { total, hasUnpriced } = cartTotal(items);
  const lines = [
    "Hello Yandaki Fruit Stall, I would like to place an order:",
    "",
    ...items.map(
      (i) => `- ${i.qty} x ${i.name} (${i.size}) - ${i.price === null ? "price on request" : naira(i.price * i.qty)}`,
    ),
    "",
    `Total: ${naira(total)}${hasUnpriced ? " + items priced on request" : ""}`,
    "",
    `Name: ${d.name}`,
    `Phone: ${d.phone}`,
    `City: ${d.city}`,
    `Address: ${d.address}`,
    `Delivery date: ${d.date}`,
  ];
  if (d.notes.trim()) lines.push(`Notes: ${d.notes.trim()}`);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
}
