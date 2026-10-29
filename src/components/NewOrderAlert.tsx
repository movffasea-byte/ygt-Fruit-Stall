"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

// Live backup alert on the admin screen: a banner and a short beep when an order comes in
// (only for orders assigned to this person, or all orders for admins).
export default function NewOrderAlert({ userId, isAdmin }: { userId: string; isAdmin: boolean }) {
  const router = useRouter();
  const [alert, setAlert] = useState<string | null>(null);
  const [soundOn, setSoundOn] = useState(false);
  const audio = useRef<AudioContext | null>(null);

  function enableSound() {
    audio.current = new AudioContext();
    setSoundOn(true);
  }

  useEffect(() => {
    const supabase = createClient();
    const beep = () => {
      const ctx = audio.current;
      if (!ctx) return;
      [0, 0.25].forEach((delay) => {
        const osc = ctx.createOscillator();
        osc.frequency.value = 880;
        osc.connect(ctx.destination);
        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + 0.15);
      });
    };

    const channel = supabase
      .channel("new-orders")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "orders" }, (payload) => {
        const row = payload.new as { customer_name: string; assigned_to: string | null };
        if (!isAdmin && row.assigned_to !== userId) return;
        setAlert(`New order from ${row.customer_name}`);
        beep();
        router.refresh();
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, isAdmin, router]);

  return (
    <>
      {!soundOn && (
        <button onClick={enableSound} className="mt-2 text-sm underline">
          Turn on order sound
        </button>
      )}
      {alert && (
        <div role="alert" className="mt-3 flex items-center justify-between rounded bg-brand-gold px-4 py-3 font-semibold text-brand-green">
          <span>{alert}</span>
          <button onClick={() => setAlert(null)} aria-label="Dismiss">
            ✕
          </button>
        </div>
      )}
    </>
  );
}
