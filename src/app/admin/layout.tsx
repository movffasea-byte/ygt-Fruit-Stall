import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import SignOutButton from "@/components/SignOutButton";
import { createClient } from "@/lib/supabase/server";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<p className="px-4 py-10 text-center">Loading...</p>}>
      <AdminGate>{children}</AdminGate>
    </Suspense>
  );
}

async function AdminGate({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Signing up isn't enough: only people the admin has added to `profiles` get in.
  const { data: profile } = await supabase.from("profiles").select("full_name, role").eq("id", user.id).maybeSingle();

  if (!profile) {
    return (
      <main className="mx-auto w-full max-w-md px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-brand-green">No access yet</h1>
        <p className="mt-2">This account hasn&apos;t been given staff access. Ask the admin to add you.</p>
        <div className="mt-4">
          <SignOutButton />
        </div>
      </main>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <nav className="flex gap-4 text-sm font-semibold text-brand-green">
          <Link href="/admin">Orders</Link>
          {profile.role === "admin" && <Link href="/admin/products">Products</Link>}
          {profile.role === "admin" && <Link href="/admin/team">Team</Link>}
        </nav>
        <div className="flex items-center gap-3">
          <p className="text-sm">
            {profile.full_name ?? user.email} · <span className="font-semibold capitalize">{profile.role}</span>
          </p>
          <SignOutButton />
        </div>
      </div>
      {children}
    </div>
  );
}
