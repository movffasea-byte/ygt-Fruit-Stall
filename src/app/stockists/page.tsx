import Link from "next/link";
import { stockists } from "@/data/stockists";

export const metadata = {
  title: "Buy near you",
  description: "Shops where you can pick up our drinking yoghurt.",
};

export default function StockistsPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold text-brand-green">Buy near you</h1>
      <p className="mt-2 text-lg">
        Healthy choices are closer to you. Walk in and pick up our <strong>drinking yoghurt</strong> from these
        trusted stockists. No waiting, no stress.
      </p>

      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        {stockists.map((s) => (
          <li
            key={`${s.name}-${s.area}`}
            className="rounded-lg border border-brand-green/20 bg-white p-4 shadow-sm"
          >
            <p className="font-semibold">{s.name}</p>
            <p className="text-sm text-foreground/70">{s.area}</p>
          </li>
        ))}
      </ul>

      <p className="mt-8">
        Want fresh juices, Greek yoghurt or granola delivered?{" "}
        <Link href="/shop" className="font-semibold text-brand-red underline">
          Order online
        </Link>
        .
      </p>
    </main>
  );
}
