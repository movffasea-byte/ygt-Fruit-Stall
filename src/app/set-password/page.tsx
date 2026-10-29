"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const field = "mt-1 w-full rounded border border-brand-green/40 bg-white px-3 py-2";

// Landing page for invite and sign-in links: the link signs the person in, then they choose a password.
export default function SetPasswordPage() {
  const router = useRouter();
  const [state, setState] = useState<"loading" | "ready" | "expired">("loading");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    // getSession waits for the link's token or code to be handled before answering.
    supabase.auth.getSession().then(({ data }) => setState(data.session ? "ready" : "expired"));
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) {
      setError("Use at least 8 characters.");
      return;
    }
    setBusy(true);
    setError("");
    const { error } = await createClient().auth.updateUser({ password });
    if (error) {
      setError("Could not save the password. Try again.");
      setBusy(false);
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  if (state === "loading") return <p className="px-4 py-16 text-center">Signing you in...</p>;

  if (state === "expired") {
    return (
      <main className="mx-auto w-full max-w-sm px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-brand-green">Link expired</h1>
        <p className="mt-2">Go to the staff login and ask for a new sign-in link.</p>
        <a href="/login" className="mt-4 inline-block underline">
          Staff login
        </a>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-sm px-4 py-16">
      <h1 className="text-3xl font-bold text-brand-green">Choose a password</h1>
      <p className="mt-1 text-sm text-foreground/70">You&apos;ll use it with your email to sign in next time.</p>
      <form onSubmit={submit} className="mt-6 space-y-4">
        <label className="block">
          New password
          <input required type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} className={field} />
        </label>
        {error && <p className="text-sm text-brand-red">{error}</p>}
        <button type="submit" disabled={busy} className="w-full rounded-full bg-brand-green px-6 py-3 font-semibold text-white disabled:opacity-60">
          {busy ? "Saving..." : "Save password"}
        </button>
      </form>
    </main>
  );
}
