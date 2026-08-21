"use client";

import { useRef } from "react";
import Link from "next/link";
import { HeroWatch } from "@/components/three/HeroWatch";
import { WatchViewer } from "@/components/three/WatchViewer";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { iconWatch } from "@/lib/products";
import { registerGsap, gsap } from "@/lib/gsap";
import { useIsoLayoutEffect } from "@/hooks/useIsoLayoutEffect";
import { ArrowRight } from "@/components/ui/icons";

// ── Real 3D model switch ──────────────────────────────────────────────
// Add a rights-clean, UNBRANDED watch model at public/models/luxury-watch.glb,
// then set this to "/models/luxury-watch.glb". It loads via useGLTF (drei) with
// gold/green recoloring, keeping all hero animations. Empty = premium SVG watch
// (no network request, no console errors).
const HERO_MODEL_URL: string = "";

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const mat = iconWatch.variants[0].three;

  useIsoLayoutEffect(() => {
    registerGsap();
    const el = root.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      // intro
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      if (!reduce) {
        tl.from("[data-hero-line] > span", { yPercent: 120, duration: 1.2, stagger: 0.12 }, 0.1)
          .from("[data-hero-sub]", { y: 30, opacity: 0, duration: 1 }, 0.6)
          .from("[data-hero-cta]", { y: 24, opacity: 0, duration: 0.9, stagger: 0.1 }, 0.8)
          .from("[data-hero-meta]", { opacity: 0, duration: 1 }, 1)
          .from("[data-hero-canvas]", { opacity: 0, scale: 0.85, duration: 1.6, ease: "power3.out" }, 0.2);
      }

      if (!reduce) {
        // scroll moves the watch smoothly UPWARD (damped via scrub); the watch
        // owns its own rotation + scale via HeroWatch's ScrollTrigger.
        gsap.to("[data-hero-canvas]", {
          yPercent: -16,
          ease: "none",
          force3D: true,
          scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: 1.2 },
        });
        gsap.to("[data-hero-glow]", {
          yPercent: 26,
          scale: 1.15,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: 1.4 },
        });
        gsap.to("[data-hero-copy]", {
          yPercent: -30,
          opacity: 0,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top top", end: "70% top", scrub: 1 },
        });
      }
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative min-h-[100svh] w-full overflow-hidden">
      {/* ambient glow (parallax layer) */}
      <div
        data-hero-glow
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 70% 42%, var(--hero-glow), transparent 70%)",
        }}
      />
      {/* cinematic light streak sweeping past the watch (matches reference lighting) */}
      <div
        data-hero-glow
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "linear-gradient(115deg, transparent 30%, color-mix(in srgb, var(--text) 12%, transparent) 48%, color-mix(in srgb, var(--text) 3%, transparent) 56%, transparent 68%)",
          maskImage: "radial-gradient(70% 60% at 65% 45%, #000 40%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(70% 60% at 65% 45%, #000 40%, transparent 80%)",
        }}
      />

      {/* Featured watch — isolated, integrated, no rectangular frame.
          Swap in a photo/render you own by passing imageSrc="/images/hero-watch.png"
          (transparent PNG/WebP); it replaces the SVG with the same premium motion. */}
      <div data-hero-canvas className="absolute inset-0 md:left-[16%]" style={{ zIndex: 1 }}>
        {HERO_MODEL_URL ? (
          <WatchViewer
            mat={mat}
            dialType={iconWatch.dialType}
            modelUrl={HERO_MODEL_URL}
            recolor="goldGreen"
            autoRotate
            interactive
            spinSpeed={0.3}
            className="!h-full !w-full"
          />
        ) : (
          <HeroWatch mat={mat} dialType={iconWatch.dialType} scrollDriven className="!h-full !w-full" />
        )}
      </div>

      {/* copy */}
      <div className="section-pad relative flex min-h-[100svh] flex-col justify-center" style={{ zIndex: 2 }}>
        <div data-hero-copy className="max-w-2xl">
          <p data-hero-meta className="eyebrow mb-6">
            Maison of Fine Watchmaking · Est. 1908
          </p>
          <h1 className="font-display text-[clamp(3.2rem,11vw,9rem)] font-light leading-[0.92] text-text">
            <span data-hero-line className="block overflow-hidden">
              <span className="block">Time,</span>
            </span>
            <span data-hero-line className="block overflow-hidden">
              <span className="block gold-text italic">Redefined.</span>
            </span>
          </h1>
          <p data-hero-sub className="mt-8 max-w-md text-base leading-relaxed text-muted md:text-lg">
            A new expression of precision, craftsmanship and timeless design — presented as an immersive
            digital experience.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <div data-hero-cta>
              <MagneticButton href="/collection" className="btn btn-gold">
                Explore Collection <ArrowRight className="h-4 w-4" />
              </MagneticButton>
            </div>
            <div data-hero-cta>
              <MagneticButton href="/#icon" className="btn btn-ghost">
                Discover The Icon
              </MagneticButton>
            </div>
          </div>
        </div>
      </div>

      {/* scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3" style={{ zIndex: 2 }}>
        <span className="eyebrow text-[0.6rem]">Scroll</span>
        <span className="relative h-12 w-px overflow-hidden bg-line-strong">
          <span className="absolute inset-x-0 top-0 h-4 bg-accent" style={{ animation: "scrollcue 2s ease-in-out infinite" }} />
        </span>
      </div>

      <style>{`@keyframes scrollcue{0%{transform:translateY(-100%)}60%,100%{transform:translateY(300%)}}`}</style>
    </section>
  );
}
