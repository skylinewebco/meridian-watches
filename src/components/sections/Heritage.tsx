"use client";

import { useRef } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { registerGsap, gsap } from "@/lib/gsap";
import { useIsoLayoutEffect } from "@/hooks/useIsoLayoutEffect";

const PILLARS = [
  {
    n: "01",
    title: "Precision",
    body: "Every calibre is regulated to the second. Certified accuracy that answers to no one but time itself.",
  },
  {
    n: "02",
    title: "Craftsmanship",
    body: "Hands that have trained for decades finish each component — bevelled, polished, perfected by eye.",
  },
  {
    n: "03",
    title: "Heritage",
    body: "A lineage of invention, carried forward. What we make today will be worn a century from now.",
  },
];

const STATS = [
  { k: "1908", v: "Year of origin" },
  { k: "220+", v: "Hand-finished parts" },
  { k: "72h", v: "Power reserve" },
  { k: "∞", v: "Guaranteed for life" },
];

export function Heritage() {
  const root = useRef<HTMLElement>(null);

  useIsoLayoutEffect(() => {
    registerGsap();
    const el = root.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const ctx = gsap.context(() => {
      gsap.to("[data-parallax-slow]", {
        yPercent: -18,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 1 },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="heritage" className="relative overflow-hidden border-t border-line bg-bg py-24 md:py-36">
      <div className="section-pad">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="eyebrow mb-5">The Maison</p>
            </Reveal>
            <Reveal y={30}>
              <h2 className="font-display text-[clamp(2.4rem,5vw,4.2rem)] font-light leading-[1.02]">
                A century in <span className="gold-text italic">pursuit</span> of the perfect movement.
              </h2>
            </Reveal>
            <Reveal y={24}>
              <p className="mt-8 max-w-md text-[0.98rem] leading-relaxed text-muted">
                Meridian is a concept house built on a single conviction: that a watch is not measured by what it
                costs, but by what it endures. We design for the long horizon — objects made to outlast trends,
                owners and generations.
              </p>
            </Reveal>

            <div className="mt-12 grid grid-cols-2 gap-8">
              {STATS.map((s) => (
                <Reveal key={s.v} y={20}>
                  <p className="font-display text-4xl text-text">{s.k}</p>
                  <p className="mt-1 text-xs uppercase tracking-wide-2 text-muted">{s.v}</p>
                </Reveal>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="flex flex-col gap-4" data-parallax-slow>
              {PILLARS.map((p) => (
                <Reveal key={p.n} y={30}>
                  <div className="group relative overflow-hidden rounded-2xl border border-line bg-bg-2 p-8 transition-colors hover:border-line-strong md:p-10">
                    <div
                      className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100"
                      style={{ background: "radial-gradient(circle, var(--hero-glow), transparent 70%)" }}
                    />
                    <div className="flex items-start gap-6">
                      <span className="font-display text-3xl text-accent">{p.n}</span>
                      <div>
                        <h3 className="font-display text-3xl text-text">{p.title}</h3>
                        <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">{p.body}</p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
