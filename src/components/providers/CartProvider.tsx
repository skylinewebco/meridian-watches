"use client";

import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";

export type CartItem = {
  key: string; // slug::variantId::strap::size
  slug: string;
  name: string;
  variantId: string;
  variantName: string;
  strap: string;
  size: string;
  price: number;
  swatch: string;
  qty: number;
};

type AddInput = Omit<CartItem, "key" | "qty"> & { qty?: number };

type Ctx = {
  items: CartItem[];
  count: number;
  subtotal: number;
  shipping: number;
  total: number;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  add: (item: AddInput) => void;
  remove: (key: string) => void;
  setQty: (key: string, qty: number) => void;
  clear: () => void;
  justAdded: string | null;
};

const CartContext = createContext<Ctx | null>(null);
const SHIPPING = 75; // fictional demo white-glove delivery

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [justAdded, setJustAdded] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("meridian-cart");
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem("meridian-cart", JSON.stringify(items));
    } catch {}
  }, [items, hydrated]);

  const add = useCallback((input: AddInput) => {
    const key = `${input.slug}::${input.variantId}::${input.strap}::${input.size}`;
    setItems((prev) => {
      const existing = prev.find((i) => i.key === key);
      if (existing) {
        return prev.map((i) => (i.key === key ? { ...i, qty: i.qty + (input.qty ?? 1) } : i));
      }
      return [...prev, { ...input, key, qty: input.qty ?? 1 }];
    });
    setJustAdded(key);
    setIsOpen(true);
    window.setTimeout(() => setJustAdded(null), 1400);
  }, []);

  const remove = useCallback((key: string) => setItems((p) => p.filter((i) => i.key !== key)), []);
  const setQty = useCallback(
    (key: string, qty: number) =>
      setItems((p) => p.map((i) => (i.key === key ? { ...i, qty: Math.max(1, qty) } : i))),
    []
  );
  const clear = useCallback(() => setItems([]), []);

  const { count, subtotal } = useMemo(() => {
    const count = items.reduce((n, i) => n + i.qty, 0);
    const subtotal = items.reduce((n, i) => n + i.qty * i.price, 0);
    return { count, subtotal };
  }, [items]);

  const shipping = items.length ? SHIPPING : 0;

  const value: Ctx = {
    items,
    count,
    subtotal,
    shipping,
    total: subtotal + shipping,
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    add,
    remove,
    setQty,
    clear,
    justAdded,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
