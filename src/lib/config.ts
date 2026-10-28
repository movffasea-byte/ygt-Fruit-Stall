// Set NEXT_PUBLIC_WHATSAPP_NUMBER in Vercel (international format, no "+") to override.
// Falls back to the real shop number. The value is baked in at build time, so redeploy after changing it.
export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "2348103440445";

export const DELIVERY_CITIES = ["Abuja", "Kaduna", "Kano"] as const;
export type DeliveryCity = (typeof DELIVERY_CITIES)[number];
