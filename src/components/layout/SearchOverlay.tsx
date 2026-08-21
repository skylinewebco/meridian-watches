"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { watches, formatPrice, priceRange } from "@/lib/products";
import { CloseIcon, SearchIcon, ArrowUpRight } from "@/components/ui/icons";
import { lockScroll } from "@/components/providers/SmoothScroll";

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    lockScroll(open);
    if (open) setTimeout(() => inputRef.current?.focus(), 350);
    else setQ("");
    return () => lockScroll(false);
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return watches;
    return watches.filter(
      (w) =>
        w.name.toLowerCase().includes(term) ||
        w.collection.toLowerCase().includes(term) ||
        w.descriptor.toLowerCase().includes(term)
    );
  }, [q]);

  return (
    <div
      className={`fixed inset-0 z-[95] transition-[opacity,visibility] duration-500 ${
        open ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
      aria-hidden={!open}
    >
      <div className="absolute inset-0 glass" onClick={onClose} />
      <div
        className="absolute inset-x-0 top-0 mx-auto max-w-4xl px-5 pt-24 pb-10 transition-transform duration-[700ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ transform: open ? "translateY(0)" : "translateY(-40px)" }}
      >
        <div className="flex items-center gap-4 border-b border-line-strong pb-4">
          <SearchIcon className="h-6 w-6 text-accent" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search the collection…"
            className="w-full bg-transparent font-display text-3xl md:text-4xl text-text placeholder:text-faint outline-none"
          />
          <button onClick={onClose} aria-label="Close search" className="p-1 text-muted hover:text-text">
            <CloseIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="mt-6 max-h-[60vh] overflow-y-auto no-scrollbar">
          {results.length === 0 && <p className="py-10 text-center text-muted">No timepieces match “{q}”.</p>}
          <ul className="divide-y divide-line">
            {results.map((w) => (
              <li key={w.slug}>
                <Link
                  href={`/product/${w.slug}`}
                  onClick={onClose}
                  className="group flex items-center justify-between gap-4 py-4"
                >
                  <div>
                    <p className="font-display text-xl text-text">{w.name}</p>
                    <p className="text-sm text-muted">{w.descriptor}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-accent">from {formatPrice(priceRange(w))}</span>
                    <ArrowUpRight className="h-5 w-5 text-muted transition-all group-hover:text-accent group-hover:translate-x-1" />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
