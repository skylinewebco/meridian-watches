"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "@/components/providers/CartProvider";
import { formatPrice } from "@/lib/products";
import { CloseIcon, MinusIcon, PlusIcon, BagIcon, ArrowRight } from "@/components/ui/icons";
import { lockScroll } from "@/components/providers/SmoothScroll";

export function CartDrawer() {
  const { items, isOpen, close, remove, setQty, subtotal, shipping, total, count } = useCart();

  useEffect(() => {
    lockScroll(isOpen);
    return () => lockScroll(false);
  }, [isOpen]);

  return (
    <div className={`fixed inset-0 z-[100] ${isOpen ? "" : "pointer-events-none"}`} aria-hidden={!isOpen}>
      {/* scrim */}
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity duration-500 ${isOpen ? "opacity-100" : "opacity-0"}`}
        onClick={close}
      />
      {/* panel */}
      <aside
        className="absolute right-0 top-0 flex h-full w-full max-w-[440px] flex-col bg-bg-2 shadow-2xl transition-transform duration-[650ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ transform: isOpen ? "translateX(0)" : "translateX(100%)" }}
      >
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <div className="flex items-center gap-3">
            <BagIcon className="h-5 w-5 text-accent" />
            <h2 className="font-display text-xl tracking-wide">Your Selection</h2>
            <span className="text-sm text-muted">({count})</span>
          </div>
          <button onClick={close} aria-label="Close cart" className="p-1 text-muted hover:text-text">
            <CloseIcon className="h-6 w-6" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 text-center">
            <div className="grid h-20 w-20 place-items-center rounded-full border border-line">
              <BagIcon className="h-8 w-8 text-faint" />
            </div>
            <div>
              <p className="font-display text-2xl">Your selection is empty</p>
              <p className="mt-2 text-sm text-muted">Discover timepieces worthy of a lifetime.</p>
            </div>
            <Link href="/collection" onClick={close} className="btn btn-gold mt-2">
              Explore Collection
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto no-scrollbar px-6 py-4">
              <ul className="flex flex-col gap-5">
                {items.map((it) => (
                  <li key={it.key} className="flex gap-4 border-b border-line pb-5">
                    <div
                      className="grid h-20 w-20 shrink-0 place-items-center rounded-xl border border-line"
                      style={{ background: `radial-gradient(circle at 40% 35%, #ffffff18, transparent 60%), ${it.swatch}` }}
                    >
                      <div className="h-8 w-8 rounded-full border-2 border-black/20 bg-black/10" />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-medium leading-tight">{it.name}</p>
                          <p className="mt-0.5 text-xs text-muted">{it.variantName}</p>
                          <p className="text-xs text-faint">
                            {it.strap} · {it.size}
                          </p>
                        </div>
                        <button
                          onClick={() => remove(it.key)}
                          className="text-xs uppercase tracking-wide-2 text-faint hover:text-accent"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="mt-auto flex items-center justify-between pt-2">
                        <div className="flex items-center gap-3 rounded-full border border-line px-2 py-1">
                          <button onClick={() => setQty(it.key, it.qty - 1)} aria-label="Decrease" className="text-muted hover:text-text">
                            <MinusIcon className="h-4 w-4" />
                          </button>
                          <span className="w-5 text-center text-sm">{it.qty}</span>
                          <button onClick={() => setQty(it.key, it.qty + 1)} aria-label="Increase" className="text-muted hover:text-text">
                            <PlusIcon className="h-4 w-4" />
                          </button>
                        </div>
                        <span className="text-sm text-accent">{formatPrice(it.price * it.qty)}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-line px-6 py-5">
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between text-muted">
                  <dt>Subtotal</dt>
                  <dd>{formatPrice(subtotal)}</dd>
                </div>
                <div className="flex justify-between text-muted">
                  <dt>White-glove delivery</dt>
                  <dd>{formatPrice(shipping)}</dd>
                </div>
                <div className="flex justify-between border-t border-line pt-3 text-base font-medium text-text">
                  <dt>Total</dt>
                  <dd>{formatPrice(total)}</dd>
                </div>
              </dl>
              <Link href="/checkout" onClick={close} className="btn btn-gold mt-5 w-full">
                Checkout <ArrowRight className="h-4 w-4" />
              </Link>
              <p className="mt-3 text-center text-[0.7rem] text-faint">
                Demo checkout · no real payment is processed
              </p>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
