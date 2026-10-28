export const ORDER_STATUSES = ["new", "confirmed", "delivered", "cancelled"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];
