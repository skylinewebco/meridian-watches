"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { registerGsap, gsap, ScrollTrigger } from "@/lib/gsap";
import { useIsoLayoutEffect } from "@/hooks/useIsoLayoutEffect";

type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** vertical travel in px */
  y?: number;
  /** seconds */
  delay?: number;
  duration?: number;
  /** animate direct children with a stagger instead of the container */
  stagger?: number;
  blur?: boolean;
  start?: string;
  once?: boolean;
};

export function Reveal({
  children,
  as,
  className,
  y = 44,
  delay = 0,
  duration = 1.05,
  stagger,
  blur = false,
  start = "top 85%",
  once = true,
}: RevealProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Tag = (as ?? "div") as any;
  const ref = useRef<HTMLElement>(null);

  useIsoLayoutEffect(() => {
    registerGsap();
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const targets = stagger ? Array.from(el.children) : el;

    if (reduce) {
      gsap.set(targets, { opacity: 1, y: 0, filter: "none" });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(targets, { opacity: 0, y, filter: blur ? "blur(10px)" : "none" });
      gsap.to(targets, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration,
        delay,
        ease: "power3.out",
        stagger: stagger ?? 0,
        scrollTrigger: { trigger: el, start, once, toggleActions: "play none none none" },
      });
    }, el);

    return () => ctx.revert();
  }, [y, delay, duration, stagger, blur, start, once]);

  return (
    <Tag ref={ref} className={className} data-reveal>
      {children}
    </Tag>
  );
}
