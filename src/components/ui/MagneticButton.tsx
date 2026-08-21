"use client";

import Link from "next/link";
import { useRef, type ReactNode, type MouseEvent } from "react";
import { gsap } from "@/lib/gsap";

type Props = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  strength?: number;
  ariaLabel?: string;
  type?: "button" | "submit";
};

/**
 * Magnetic hover: the element eases toward the cursor and returns on leave.
 * Auto-disabled on touch / coarse pointers.
 */
export function MagneticButton({
  children,
  href,
  onClick,
  className,
  strength = 0.35,
  ariaLabel,
  type = "button",
}: Props) {
  const ref = useRef<HTMLElement>(null);

  const move = (e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) * strength;
    const y = (e.clientY - (r.top + r.height / 2)) * strength;
    gsap.to(el, { x, y, duration: 0.6, ease: "power3.out" });
  };

  const leave = () => {
    const el = ref.current;
    if (!el) return;
    gsap.to(el, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.4)" });
  };

  const shared = {
    ref: ref as never,
    className,
    onMouseMove: move,
    onMouseLeave: leave,
    "data-cursor": "hover",
    "aria-label": ariaLabel,
  };

  if (href) {
    return (
      <Link href={href} {...shared}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} {...shared}>
      {children}
    </button>
  );
}
