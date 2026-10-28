"use client";

import Image from "next/image";
import { useState } from "react";
import { formatPrice, type Product } from "@/data/products";
import { useToast } from "@/components/Toast";
import { useCart } from "@/lib/cart";

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [index, setIndex] = useState(0);
  const [qty, setQty] = useState(1);
  const [zoomed, setZoomed] = useState(false);
  const toast = useToast();
  const variant = product.variants[index];

  function add() {
    addItem(
      {
        key: `${product.id}|${variant.size}`,
        name: product.name,
        size: variant.size,
        price: variant.price,
      },
      qty,
    );
    toast(`Added ${qty} × ${product.name} to your cart`);
    setQty(1);
  }

  return (
    <article
      className={`flex flex-col rounded-lg border border-brand-green/20 bg-white p-4 shadow-sm transition hover:shadow-md ${
        product.available ? "" : "opacity-60"
      }`}
    >
      <div className="relative mb-3 aspect-[4/3] overflow-hidden rounded bg-white">
        <span
          className={`absolute left-0 top-0 z-10 rounded-br px-2 py-0.5 text-xs font-semibold ${
            product.available ? "bg-brand-green text-white" : "bg-brand-red text-white"
          }`}
        >
          {product.available ? "Fresh today" : "Sold out"}
        </span>
        {product.image && (
          <button
            type="button"
            onClick={() => setZoomed(true)}
            aria-label={`View ${product.name} larger`}
            className="absolute inset-0 z-[5] cursor-zoom-in"
          />
        )}
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
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="h-9 w-9 rounded-full border border-brand-green/40 text-lg leading-none text-brand-green"
              >
                −
              </button>
              <span className="w-5 text-center font-semibold">{qty}</span>
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => setQty((q) => q + 1)}
                className="h-9 w-9 rounded-full border border-brand-green/40 text-lg leading-none text-brand-green"
              >
                +
              </button>
            </div>
          <button
            type="button"
            onClick={add}
            className="flex-1 rounded-full bg-brand-red px-4 py-2 font-semibold text-white transition active:scale-95"
          >
            Add to cart
          </button>
          </div>
        ) : (
          <p className="text-sm font-semibold text-brand-red">Currently unavailable</p>
        )}
      </div>
      {zoomed && product.image && (
        <div
          role="dialog"
          aria-label={product.name}
          onClick={() => setZoomed(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
        >
          <div className="relative h-[80vh] w-full max-w-2xl">
            <Image src={product.image} alt={product.name} fill sizes="90vw" className="object-contain" />
          </div>
        </div>
      )}
    </article>
  );
}
