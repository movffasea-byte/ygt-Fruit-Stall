"use client";

import Image from "next/image";
import { useState } from "react";
import { formatPrice, type Product } from "@/data/products";
import { useCart } from "@/lib/cart";

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [index, setIndex] = useState(0);
  const [added, setAdded] = useState(false);
  const variant = product.variants[index];

  function add() {
    addItem({
      key: `${product.id}|${variant.size}`,
      name: product.name,
      size: variant.size,
      price: variant.price,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  }

  return (
    <article
      className={`flex flex-col rounded-lg border border-brand-green/20 bg-white p-4 shadow-sm ${
        product.available ? "" : "opacity-60"
      }`}
    >
      <div className="relative mb-3 aspect-[4/3] overflow-hidden rounded bg-white">
        <Image
          src={product.image ?? "/brand/logo.jpg"}
          alt={product.image ? product.name : ""}
          fill
          sizes="(min-width: 1024px) 320px, (min-width: 640px) 45vw, 90vw"
          className={product.image ? "object-contain" : "object-contain p-8 opacity-40"}
        />
      </div>
      <h3 className="text-lg font-semibold">{product.name}</h3>
      {product.description && <p className="mt-1 text-sm text-foreground/70">{product.description}</p>}

      <div className="mt-3 flex flex-wrap gap-2">
        {product.variants.map((v, i) => (
          <button
            key={v.size}
            type="button"
            onClick={() => setIndex(i)}
            aria-pressed={i === index}
            className={`rounded-full border px-3 py-1 text-sm ${
              i === index
                ? "border-brand-green bg-brand-green text-white"
                : "border-brand-green/40 text-brand-green"
            }`}
          >
            {v.size}
          </button>
        ))}
      </div>

      <p className="mt-3 font-semibold text-brand-red">{formatPrice(variant)}</p>

      <div className="mt-auto pt-4">
        {product.available ? (
          <button
            type="button"
            onClick={add}
            className="w-full rounded-full bg-brand-red px-4 py-2 font-semibold text-white"
          >
            {added ? "Added" : "Add to cart"}
          </button>
        ) : (
          <p className="text-sm font-semibold text-brand-red">Currently unavailable</p>
        )}
      </div>
    </article>
  );
}
