import Link from "next/link";
import { Suspense } from "react";
import ProductCard from "@/components/ProductCard";
import { categories } from "@/data/products";
import { getProducts } from "@/lib/products";

export const metadata = { title: "Shop | Yandaki Fruit Stall" };

export default function ShopPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10">
      <Link href="/" className="text-sm font-medium text-brand-green underline">
        Back to home
      </Link>
      <h1 className="mt-4 text-3xl font-bold text-brand-green">Shop</h1>
      <Suspense fallback={<p className="mt-10">Loading the menu...</p>}>
        <ShopProducts />
      </Suspense>
    </main>
  );
}

async function ShopProducts() {
  const products = await getProducts();
  return (
    <>
      {categories.map((category) => {
        const items = products.filter((p) => p.category === category.id);
        if (items.length === 0) return null;
        return (
          <section key={category.id} className="mt-10">
            <h2 className="inline-block rounded bg-brand-gold px-3 py-1 text-xl font-bold text-brand-green">
              {category.label}
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        );
      })}
    </>
  );
}
