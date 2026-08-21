"use client";

import { useRef, useState } from "react";
import { HeroWatch } from "@/components/three/HeroWatch";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Reveal } from "@/components/ui/Reveal";
import { iconWatch, formatPrice } from "@/lib/products";
import { registerGsap, gsap } from "@/lib/gsap";
import { useIsoLayoutEffect } from "@/hooks/useIsoLayoutEffect";
import { ArrowRight } from "@/components/ui/icons";

const SPECS = (v: number) => [
  { label: "Material", value: iconWatch.variants[v].material },
  { label: "Case", value: iconWatch.caseSize },
  { label: "Movement", value: iconWatch.movement },
  { label: "Water Resistance", value: iconWatch.waterResistance },
];

export function FeaturedIcon() {
  const root = useRef<HTMLElement>(null);
  const [vi, setVi] = useState(0);
  const variant = iconWatch.variants[vi];

  useIsoLayoutEffect(() => {
    registerGsap();
    const el = root.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const ctx = gsap.context(() => {
      // smooth scroll-based position + scale on the featured watch
      gsap.fromTo(
        "[data-icon-stage]",
        { yPercent: 6, scale: 0.96 },
        {
          yPercent: -8,
          scale: 1.05,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 1 },
        }
      );
      // giant background wordmark drift
      gsap.to("[data-icon-word]", {
        xPercent: -12,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 1.2 },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="icon" className="relative overflow-hidden border-t border-line bg-bg py-24 md:py-36">
      {/* background wordmark */}
      <p
        data-icon-word
        className="pointer-events-none absolute top-1/2 left-0 -translate-y-1/2 whitespace-nowrap font-display text-[26vw] leading-none text-text/[0.035]"
      >
        THE ICON · THE ICON ·
      </p>

      <div className="section-pad relative grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
        {/* sticky watch stage */}
        <div className="relative lg:sticky lg:top-24 order-1">
          <div data-icon-stage className="relative h-[52vh] min-h-[380px] lg:h-[72vh]">
            <div
              className="pointer-events-none absolute inset-0"
              style={{ background: "radial-gradient(50% 45% at 50% 50%, var(--hero-glow), transparent 70%)" }}
            />
            <HeroWatch mat={variant.three} dialType={iconWatch.dialType} className="!h-full !w-full" widthClass="w-[74%] max-w-[440px]" />
          </div>
        </div>

        {/* progressive content */}
        <div className="order-2">
          <Reveal>
            <p className="eyebrow mb-5">The Icon of the Collection</p>
          </Reveal>
          <Reveal y={30}>
            <h2 className="font-display text-[clamp(2.6rem,6vw,5rem)] font-light leading-[0.95]">
              {iconWatch.name}
            </h2>
          </Reveal>
          <Reveal y={24}>
            <p className="mt-3 text-lg italic text-accent font-display">{iconWatch.tagline}</p>
          </Reveal>
          <Reveal y={24}>
            <p className="mt-6 max-w-md text-[0.98rem] leading-relaxed text-muted">{iconWatch.description}</p>
          </Reveal>

          {/* variant selector */}
          <Reveal y={20}>
            <div className="mt-8 flex items-center gap-4">
              <span className="eyebrow text-[0.62rem]">Finish</span>
              <div className="flex items-center gap-3">
                {iconWatch.variants.map((v, i) => (
                  <button
                    key={v.id}
                    onClick={() => setVi(i)}
                    data-cursor="hover"
                    aria-label={v.name}
                    className={`h-8 w-8 rounded-full border transition-all duration-500 ${
                      i === vi ? "scale-110 border-accent" : "border-line hover:border-line-strong"
                    }`}
                    style={{
                      background: v.swatch2
                        ? `linear-gradient(135deg, ${v.swatch} 50%, ${v.swatch2} 50%)`
                        : v.swatch,
                    }}
                  />
                ))}
              </div>
            </div>
          </Reveal>

          {/* specs */}
          <Reveal stagger={0.12} y={24} className="mt-10 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-line pt-8">
            {SPECS(vi).map((s) => (
              <div key={s.label}>
                <p className="eyebrow mb-1.5 text-[0.6rem]">{s.label}</p>
                <p className="text-[0.95rem] text-text">{s.value}</p>
              </div>
            ))}
          </Reveal>

          <Reveal y={20}>
            <div className="mt-10 flex flex-wrap items-center gap-6">
              <MagneticButton href={`/product/${iconWatch.slug}`} className="btn btn-gold">
                View Details <ArrowRight className="h-4 w-4" />
              </MagneticButton>
              <div>
                <p className="eyebrow text-[0.58rem]">Demo price from</p>
                <p className="font-display text-2xl text-text">{formatPrice(variant.price)}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
