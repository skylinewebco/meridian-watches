"use client";

import { useRef } from "react";
import Link from "next/link";
import { watches } from "@/lib/products";
import { ProductCard } from "@/components/product/ProductCard";
import { Reveal } from "@/components/ui/Reveal";
import { registerGsap, gsap } from "@/lib/gsap";
import { useIsoLayoutEffect } from "@/hooks/useIsoLayoutEffect";
import { ArrowRight } from "@/components/ui/icons";

export function Collection({ heading = true, cta = true }: { heading?: boolean; cta?: boolean }) {
  const gridRef = useRef<HTMLDivElement>(null);

  useIsoLayoutEffect(() => {
    registerGsap();
    const el = gridRef.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cards = el.querySelectorAll("[data-reveal-card]");
    if (reduce) {
      gsap.set(cards, { opacity: 1, y: 0 });
      return;
    }
    const ctx = gsap.context(() => {
      gsap.set(cards, { opacity: 0, y: 60 });
      gsap.to(cards, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        stagger: { each: 0.08, grid: "auto", from: "start" },
        scrollTrigger: { trigger: el, start: "top 78%", once: true },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section id="collection" className="relative border-t border-line bg-bg-2 py-24 md:py-32">
      <div className="section-pad">
        {heading && (
          <div className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <Reveal>
                <p className="eyebrow mb-4">The Collection</p>
              </Reveal>
              <Reveal y={30}>
                <h2 className="font-display text-[clamp(2.4rem,5.5vw,4.5rem)] font-light leading-[0.98]">
                  Nine expressions <br className="hidden sm:block" /> of <span className="gold-text italic">time.</span>
                </h2>
              </Reveal>
            </div>
            <Reveal y={20}>
              <p className="max-w-xs text-sm leading-relaxed text-muted">
                Each timepiece is a study in proportion and purpose — engineered to be worn for a lifetime and
                handed to the next.
              </p>
            </Reveal>
          </div>
        )}

        <div ref={gridRef} className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {watches.map((w, i) => (
            <ProductCard key={w.slug} watch={w} index={i} />
          ))}
        </div>

        {cta && (
          <div className="mt-14 flex justify-center">
            <Link href="/collection" className="btn btn-ghost" data-cursor="hover">
              View Full Collection <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
