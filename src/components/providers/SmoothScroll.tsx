"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { registerGsap, gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Global smooth scroll (Lenis) synced with GSAP ScrollTrigger.
 * Disabled when the user prefers reduced motion.
 */
export function SmoothScroll() {
  useEffect(() => {
    registerGsap();

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Expose for other components (drawer/menu open -> stop scroll)
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      (window as unknown as { __lenis?: Lenis }).__lenis = undefined;
    };
  }, []);

  return null;
}

export function lockScroll(lock: boolean) {
  const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
  if (lenis) {
    if (lock) lenis.stop();
    else lenis.start();
  }
  document.documentElement.classList.toggle("lenis-stopped", lock);
  document.body.style.overflow = lock ? "hidden" : "";
}
