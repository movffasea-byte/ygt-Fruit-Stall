// TEST number (+234 807 268 3326). The real shop number is 2348103440445: switch back before launch.
export const WHATSAPP_NUMBER = "2348072683326";

export const DELIVERY_CITIES = ["Abuja", "Kaduna", "Kano"] as const;
export type DeliveryCity = (typeof DELIVERY_CITIES)[number];
