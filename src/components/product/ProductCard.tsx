"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import type { Watch } from "@/lib/products";
import { formatPrice, priceRange } from "@/lib/products";
import { WatchDial } from "@/components/three/WatchDial";
import { gsap } from "@/lib/gsap";
import { ArrowUpRight } from "@/components/ui/icons";

export function ProductCard({ watch, index = 0 }: { watch: Watch; index?: number }) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const dialRef = useRef<HTMLDivElement>(null);
  const [vi, setVi] = useState(0);
  const variant = watch.variants[vi];

  const fine = () =>
    typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  const onMove = (e: React.MouseEvent) => {
    if (!fine()) return;
    const el = cardRef.current!;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    gsap.to(dialRef.current, {
      rotateY: px * 16,
      rotateX: -py * 16,
      x: px * 14,
      y: py * 10,
      duration: 0.6,
      ease: "power3.out",
      transformPerspective: 800,
    });
  };

  const onEnter = () => {
    if (!fine()) return;
    gsap.to(dialRef.current, { scale: 1.12, duration: 0.7, ease: "power3.out" });
  };
  const onLeave = () => {
    gsap.to(dialRef.current, { rotateX: 0, rotateY: 0, x: 0, y: 0, scale: 1, duration: 0.9, ease: "power3.out" });
  };

  return (
    <Link
      ref={cardRef}
      href={`/product/${watch.slug}`}
      onMouseMove={onMove}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      data-reveal-card
      style={{ transitionDelay: `${index * 60}ms` }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-bg-2 p-6 transition-colors duration-500 hover:border-line-strong"
    >
      {/* top row */}
      <div className="mb-2 flex items-start justify-between">
        <span className="eyebrow text-[0.58rem]">{watch.collection}</span>
        <ArrowUpRight className="h-5 w-5 text-faint transition-all duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
      </div>

      {/* dial */}
      <div className="relative grid aspect-square place-items-center py-4" style={{ perspective: 800 }}>
        <div
          className="pointer-events-none absolute inset-4 rounded-full opacity-0 blur-2xl transition-opacity duration-700 group-hover:opacity-100"
          style={{ background: "radial-gradient(circle, var(--hero-glow), transparent 70%)" }}
        />
        <div ref={dialRef} className="w-[78%] will-change-transform" style={{ transformStyle: "preserve-3d" }}>
          <WatchDial mat={variant.three} dialType={watch.dialType} className="h-full w-full drop-shadow-2xl" />
        </div>
      </div>

      {/* info */}
      <div className="mt-auto">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h3 className="font-display text-2xl leading-tight text-text">{watch.name}</h3>
            <p className="mt-1 text-xs text-muted">{watch.descriptor}</p>
          </div>
          <div className="text-right">
            <p className="text-[0.6rem] uppercase tracking-wide-2 text-faint">from</p>
            <p className="text-sm text-accent">{formatPrice(priceRange(watch))}</p>
          </div>
        </div>

        {/* variant swatches */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {watch.variants.map((v, i) => (
              <button
                key={v.id}
                onClick={(e) => {
                  e.preventDefault();
                  setVi(i);
                }}
                aria-label={v.name}
                className={`h-5 w-5 rounded-full border transition-all duration-300 ${
                  i === vi ? "scale-110 border-accent" : "border-line hover:border-line-strong"
                }`}
                style={{
                  background: v.swatch2 ? `linear-gradient(135deg, ${v.swatch} 50%, ${v.swatch2} 50%)` : v.swatch,
                }}
              />
            ))}
          </div>
          <span className="text-[0.66rem] uppercase tracking-wide-2 text-muted transition-colors group-hover:text-accent">
            Explore →
          </span>
        </div>
      </div>
    </Link>
  );
}
