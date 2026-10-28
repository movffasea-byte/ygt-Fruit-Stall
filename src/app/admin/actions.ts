"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { ORDER_STATUSES, type OrderStatus } from "./statuses";

export async function updateProduct(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  if (!id || !name) return;

  // Row-level security only lets admins change products.
  const supabase = await createClient();
  const { data: current } = await supabase.from("products").select("variants").eq("id", id).maybeSingle();
  if (!current) return;

  // Sizes stay as they are; only the prices are edited. A blank price means "price on request".
  const variants = (current.variants as { size: string; price: number | null; fromPrice?: boolean }[]).map((v, i) => {
    const raw = String(formData.get(`price_${i}`) ?? "").trim();
    const price = raw === "" ? null : Math.round(Number(raw));
    return { ...v, price: price !== null && Number.isFinite(price) && price >= 0 ? price : v.price };
  });

  await supabase
    .from("products")
    .update({
      name,
      description: String(formData.get("description") ?? "").trim() || null,
      available: formData.get("available") === "on",
      variants,
    })
    .eq("id", id);
  revalidatePath("/admin/products");
}

export async function updateOrderStatus(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as OrderStatus;
  if (!id || !ORDER_STATUSES.includes(status)) return;

  // Row-level security only lets staff and admins update orders.
  const supabase = await createClient();
  await supabase.from("orders").update({ status }).eq("id", id);
  revalidatePath("/admin");
}

export async function assignOrder(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const assignee = String(formData.get("assigned_to") ?? "");
  if (!id) return;

  // Only admins reassign; staff use releaseOrder to hand an order back.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user?.id ?? "").maybeSingle();
  if (profile?.role !== "admin") return;

  await supabase.from("orders").update({ assigned_to: assignee || null }).eq("id", id);
  revalidatePath("/admin");
}

export async function releaseOrder(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const supabase = await createClient();
  await supabase.rpc("release_order", { order_id: id });
  revalidatePath("/admin");
}
