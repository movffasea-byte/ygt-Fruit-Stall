"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { createClient as createPlainClient } from "@supabase/supabase-js";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  return profile?.role === "admin" ? { supabase, userId: user.id } : null;
}

const cleanNumber = (raw: FormDataEntryValue | null) => String(raw ?? "").replace(/[^\d]/g, "") || null;

export async function addTeamMember(formData: FormData) {
  const ctx = await requireAdmin();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const role = formData.get("role") === "admin" ? "admin" : "staff";
  if (!ctx || !email) return;

  const admin = createAdminClient();
  if (!admin) redirect("/admin/team?error=Server+key+missing");

  // Send the invite link back to the site the admin is using, not the default Site URL.
  const h = await headers();
  const origin = `${h.get("x-forwarded-proto") ?? "https"}://${h.get("host")}`;

  let userId: string | null = null;
  const invited = await admin.auth.admin.inviteUserByEmail(email, { redirectTo: `${origin}/admin` });
  if (invited.data.user) {
    userId = invited.data.user.id;
  } else {
    // Removing someone only deletes their team profile, so the login may already exist: reuse it
    // and email a sign-in link instead of an invite.
    const { data: list } = await admin.auth.admin.listUsers({ perPage: 1000 });
    const existing = list?.users.find((u) => u.email?.toLowerCase() === email);
    if (!existing) redirect(`/admin/team?error=${encodeURIComponent(invited.error?.message ?? "Could not send the invite")}`);
    userId = existing.id;
    const plain = createPlainClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!);
    await plain.auth.signInWithOtp({ email, options: { emailRedirectTo: `${origin}/admin`, shouldCreateUser: false } });
  }

  await admin.from("profiles").upsert({
    id: userId,
    email,
    full_name: String(formData.get("full_name") ?? "").trim() || null,
    role,
    whatsapp_number: cleanNumber(formData.get("whatsapp_number")),
  });
  revalidatePath("/admin/team");
}

export async function updateTeamMember(formData: FormData) {
  const ctx = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!ctx || !id) return;

  // An admin can't demote themselves, so the shop never ends up with no admin.
  const role = id === ctx.userId || formData.get("role") === "admin" ? "admin" : "staff";
  await ctx.supabase
    .from("profiles")
    .update({
      full_name: String(formData.get("full_name") ?? "").trim() || null,
      role,
      whatsapp_number: cleanNumber(formData.get("whatsapp_number")),
      on_duty: formData.get("on_duty") === "on",
    })
    .eq("id", id);
  revalidatePath("/admin/team");
}

export async function removeTeamMember(formData: FormData) {
  const ctx = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!ctx || !id || id === ctx.userId) return;
  await ctx.supabase.from("profiles").delete().eq("id", id);
  revalidatePath("/admin/team");
}
