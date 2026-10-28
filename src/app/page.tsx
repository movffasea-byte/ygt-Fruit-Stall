import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { kitchen, reviews, tips } from "@/data/reviews";
import { SITE_URL } from "@/lib/config";

const heroBottles = [
  { src: "/products/the-quencher.jpg", alt: "The Quencher juice", className: "float-slow" },
  { src: "/products/beetbliss.jpg", alt: "Beetbliss juice", className: "float-slow [animation-delay:-2s]" },
  { src: "/products/tropical-sunshine.jpg", alt: "Tropical Sunshine juice", className: "float-slow [animation-delay:-4s]" },
];

const perks = [
  { title: "Cold-pressed", text: "100% organic juices, made fresh." },
  { title: "Delivered", text: "Abuja, Kaduna and Kano." },
  { title: "Order on WhatsApp", text: "Pick your drinks, we confirm fast." },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FoodEstablishment",
  name: "Yandaki Fruit Stall",
  description: "Cold-pressed fresh juices, Greek yoghurt, granola and salads, delivered in Abuja, Kaduna and Kano.",
  url: SITE_URL,
  image: `${SITE_URL}/opengraph-image.jpg`,
  telephone: "+2348103440445",
  address: {
    "@type": "PostalAddress",
    streetAddress: "No. 11 Zuba Road, Off Shooting Range",
    addressLocality: "Kaduna",
    addressCountry: "NG",
  },
  areaServed: ["Abuja", "Kaduna", "Kano"],
  servesCuisine: "Juices and healthy food",
};

function Stars({ count }: { count: number }) {
  return (
    <p aria-label={`${count} out of 5 stars`} className="text-brand-gold">
      {"★".repeat(count)}
      <span className="text-foreground/20">{"★".repeat(5 - count)}</span>
    </p>
  );
}

export default function Home() {
  return (
    <main className="flex-1">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <section className="bg-brand-green text-white">
        <div className="mx-auto grid max-w-5xl items-center gap-8 px-4 py-12 md:grid-cols-2 md:py-20">
          <div className="text-center md:text-left">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-gold">Kaduna&apos;s fresh juice stall</p>
            <h1 className="mt-3 text-4xl font-bold leading-tight sm:text-5xl">Fresh, cold-pressed and delivered to you</h1>
            <p className="mx-auto mt-4 max-w-md text-lg text-white/85 md:mx-0">
              Juices, Greek yoghurt, granola and more. Delivery in Abuja, Kaduna and Kano.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3 md:justify-start">
              <Link href="/shop" className="rounded-full bg-brand-red px-6 py-3 font-semibold text-white">
                Shop now
              </Link>
              <Link href="#reviews" className="rounded-full border border-white/60 px-6 py-3 font-semibold">
                See reviews
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {heroBottles.map((b) => (
              <div key={b.src} className={`relative aspect-[3/5] overflow-hidden rounded-2xl bg-white shadow-lg ${b.className}`}>
                <Image src={b.src} alt={b.alt} fill priority sizes="(min-width: 768px) 160px, 30vw" className="object-contain" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-brand-green/15 bg-white">
        <ul className="mx-auto grid max-w-5xl gap-4 px-4 py-6 text-center sm:grid-cols-3">
          {perks.map((p) => (
            <li key={p.title}>
              <p className="font-bold text-brand-green">{p.title}</p>
              <p className="text-sm text-foreground/70">{p.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="reviews" className="mx-auto max-w-5xl scroll-mt-16 px-4 py-14">
        <Reveal>
          <h2 className="text-3xl font-bold text-brand-green">Loved by our customers</h2>
          <p className="mt-2 text-foreground/70">Real reviews from our customers on Instagram.</p>
        </Reveal>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r, i) => (
            <Reveal key={r.text} delay={i * 80}>
              <figure className="flex h-full flex-col rounded-lg border border-brand-green/20 bg-white p-5 shadow-sm">
                <Stars count={r.stars} />
                <blockquote className="mt-3 flex-1">&ldquo;{r.text}&rdquo;</blockquote>
                <figcaption className="mt-4 text-sm">
                  <span className="font-semibold">{r.name}</span>
                  <span className="text-foreground/60">
                    {" "}
                    · {r.about} · {r.date}
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="mx-auto max-w-5xl px-4">
          <Reveal>
            <h2 className="text-3xl font-bold text-brand-green">From our kitchen</h2>
            <p className="mt-2 text-foreground/70">Salads, bowls and custom blends, made to order.</p>
          </Reveal>
          <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
            {kitchen.map((k, i) => (
              <Reveal key={k.src} delay={i * 80}>
                <figure className="overflow-hidden rounded-lg">
                  <div className="relative aspect-square">
                    <Image src={k.src} alt={k.label} fill sizes="(min-width: 768px) 240px, 45vw" className="object-cover" />
                  </div>
                  <figcaption className="bg-brand-green px-3 py-2 text-sm font-semibold text-white">{k.label}</figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-14">
        <Reveal>
          <h2 className="text-3xl font-bold text-brand-green">Did you know?</h2>
          <p className="mt-2 text-foreground/70">Healthy tips from our kitchen.</p>
        </Reveal>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tips.map((t, i) => (
            <Reveal key={t.title} delay={i * 80}>
              <article className="h-full overflow-hidden rounded-lg border border-brand-green/20 bg-white shadow-sm">
                {t.image && (
                  <div className="relative aspect-[16/10]">
                    <Image src={t.image} alt={t.title} fill sizes="(min-width: 1024px) 320px, (min-width: 640px) 45vw, 90vw" className="object-cover" />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="text-lg font-semibold">
                    <span aria-hidden>{t.emoji}</span> {t.title}
                  </h3>
                  <p className="mt-1 text-sm text-foreground/75">{t.text}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-brand-red px-4 py-12 text-center text-white">
        <Reveal>
          <h2 className="text-3xl font-bold">Ready for something fresh?</h2>
          <p className="mt-2">Order in minutes and we&apos;ll confirm on WhatsApp.</p>
          <Link href="/shop" className="mt-5 inline-block rounded-full bg-brand-gold px-6 py-3 font-semibold text-brand-green">
            Shop now
          </Link>
        </Reveal>
      </section>
    </main>
  );
}
