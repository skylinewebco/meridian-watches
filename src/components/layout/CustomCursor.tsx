"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

export function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine) return;

    document.body.classList.add("cursor-none-lux");
    const d = dot.current!;
    const r = ring.current!;
    gsap.set([d, r], { opacity: 0 });

    const xTo = gsap.quickTo(r, "x", { duration: 0.55, ease: "power3" });
    const yTo = gsap.quickTo(r, "y", { duration: 0.55, ease: "power3" });
    const xDot = gsap.quickTo(d, "x", { duration: 0.12, ease: "power2" });
    const yDot = gsap.quickTo(d, "y", { duration: 0.12, ease: "power2" });

    let shown = false;
    const move = (e: MouseEvent) => {
      if (!shown) {
        gsap.to([d, r], { opacity: 1, duration: 0.4 });
        shown = true;
      }
      xTo(e.clientX);
      yTo(e.clientY);
      xDot(e.clientX);
      yDot(e.clientY);
    };

    const over = (e: Event) => {
      const t = (e.target as HTMLElement).closest(
        "a, button, [data-cursor='hover'], input, textarea, select, [role='button']"
      );
      r.setAttribute("data-variant", t ? "hover" : "");
    };

    const leaveWin = () => gsap.to([d, r], { opacity: 0, duration: 0.3 });

    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mouseover", over, { passive: true });
    document.addEventListener("mouseleave", leaveWin);

    return () => {
      document.body.classList.remove("cursor-none-lux");
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      document.removeEventListener("mouseleave", leaveWin);
    };
  }, []);

  return (
    <>
      <div ref={ring} className="cursor-ring" aria-hidden />
      <div ref={dot} className="cursor-dot" aria-hidden />
    </>
  );
}
