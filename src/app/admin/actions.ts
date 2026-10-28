"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { ORDER_STATUSES, type OrderStatus } from "./statuses";

export async function updateOrderStatus(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as OrderStatus;
  if (!id || !ORDER_STATUSES.includes(status)) return;

  // Row-level security only lets staff and admins update orders.
  const supabase = await createClient();
  await supabase.from("orders").update({ status }).eq("id", id);
  revalidatePath("/admin");
}
