import type { CartItem } from "./cart";
import { WHATSAPP_NUMBER } from "./config";

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
