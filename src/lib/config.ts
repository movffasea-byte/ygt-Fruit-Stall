// WhatsApp number in international format, no "+" (08103440445 -> 234 8103440445)
export const WHATSAPP_NUMBER = "2348103440445";

export const DELIVERY_CITIES = ["Abuja", "Kaduna", "Kano"] as const;
export type DeliveryCity = (typeof DELIVERY_CITIES)[number];
