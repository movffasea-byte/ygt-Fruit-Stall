"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from "react";

export type CartItem = {
  key: string; // `${productId}|${size}`
  name: string;
  size: string;
  price: number | null;
  qty: number;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  addItem: (item: Omit<CartItem, "qty">) => void;
  setQty: (key: string, qty: number) => void;
  clear: () => void;
};

const STORAGE_KEY = "yandaki-cart";
const EMPTY = "[]";
const CartContext = createContext<CartContextValue | null>(null);

// Cart lives in localStorage; memory is the fallback when storage is unavailable.
let memory = EMPTY;
const listeners = new Set<() => void>();

function read(): string {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? EMPTY;
  } catch {
    return memory;
  }
}

function write(items: CartItem[]) {
  memory = JSON.stringify(items);
  try {
    localStorage.setItem(STORAGE_KEY, memory);
  } catch {}
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}

function parse(raw: string): CartItem[] {
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const raw = useSyncExternalStore(subscribe, read, () => EMPTY);
  const items = useMemo(() => parse(raw), [raw]);

  const addItem = useCallback((item: Omit<CartItem, "qty">) => {
    const current = parse(read());
    const existing = current.find((i) => i.key === item.key);
    write(
      existing
        ? current.map((i) => (i.key === item.key ? { ...i, qty: i.qty + 1 } : i))
        : [...current, { ...item, qty: 1 }],
    );
  }, []);

  const setQty = useCallback((key: string, qty: number) => {
    const current = parse(read());
    write(qty <= 0 ? current.filter((i) => i.key !== key) : current.map((i) => (i.key === key ? { ...i, qty } : i)));
  }, []);

  const clear = useCallback(() => write([]), []);

  const value = useMemo(
    () => ({ items, count: items.reduce((n, i) => n + i.qty, 0), addItem, setQty, clear }),
    [items, addItem, setQty, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
