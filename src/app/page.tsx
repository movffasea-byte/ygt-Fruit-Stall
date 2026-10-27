import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-16 text-center">
      <Image
        src="/brand/logo.jpg"
        alt="YG Creative Ville logo"
        width={160}
        height={180}
        priority
        className="h-auto w-40"
      />
      <h1 className="text-4xl font-bold text-brand-green">Yandaki Fruit Stall</h1>
      <p className="max-w-md text-lg">
        Fresh juices, Greek yoghurt, granola and more. Delivery in Abuja, Kaduna and Kano.
      </p>
      <Link
        href="/shop"
        className="rounded-full bg-brand-red px-6 py-3 font-semibold text-white"
      >
        Shop now
      </Link>
    </main>
  );
}
