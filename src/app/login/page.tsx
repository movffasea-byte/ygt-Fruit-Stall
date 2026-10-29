"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const field = "mt-1 w-full rounded border border-brand-green/40 bg-white px-3 py-2";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [info, setInfo] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const { error } = await createClient().auth.signInWithPassword({ email, password });
    if (error) {
      setError("Wrong email or password.");
      setBusy(false);
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  // First time or forgotten password: email a link that signs them in and lets them choose a password.
  async function emailLink() {
    if (!email) {
      setError("Type your email first.");
      return;
    }
    setError("");
    const { error } = await createClient().auth.signInWithOtp({
      email,
      options: { shouldCreateUser: false, emailRedirectTo: `${window.location.origin}/set-password` },
    });
    if (error) setError("Could not send the link. Check the email or try again in a minute.");
    else setInfo("Check your email for a sign-in link.");
  }

  return (
    <main className="mx-auto w-full max-w-sm px-4 py-16">
      <h1 className="text-3xl font-bold text-brand-green">Staff login</h1>
      <form onSubmit={submit} className="mt-6 space-y-4">
        <label className="block">
          Email
          <input required type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={field} />
        </label>
        <label className="block">
          Password
          <input required type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className={field} />
        </label>
        {error && <p className="text-sm text-brand-red">{error}</p>}
        {info && <p className="text-sm text-brand-green">{info}</p>}
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-full bg-brand-green px-6 py-3 font-semibold text-white disabled:opacity-60"
        >
          {busy ? "Signing in..." : "Sign in"}
        </button>
        <button type="button" onClick={emailLink} className="w-full text-sm underline">
          First time or forgot your password? Email me a sign-in link
        </button>
      </form>
    </main>
  );
}
