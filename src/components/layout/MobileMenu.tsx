"use client";

import Link from "next/link";
import { useEffect } from "react";
import { CloseIcon, ArrowUpRight } from "@/components/ui/icons";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { lockScroll } from "@/components/providers/SmoothScroll";

type Props = {
  open: boolean;
  onClose: () => void;
  links: { label: string; href: string }[];
};

export function MobileMenu({ open, onClose, links }: Props) {
  useEffect(() => {
    lockScroll(open);
    return () => lockScroll(false);
  }, [open]);

  return (
    <div
      className={`fixed inset-0 z-[90] lg:hidden transition-[opacity,visibility] duration-500 ${
        open ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
      aria-hidden={!open}
    >
      <div
        className="absolute inset-0 bg-bg transition-transform duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ transform: open ? "translateY(0)" : "translateY(-100%)" }}
      >
        <div className="noise absolute inset-0" />
        <div className="section-pad flex items-center justify-between py-5">
          <span className="font-display text-2xl tracking-[0.35em] pl-[0.35em]">MERIDIAN</span>
          <button onClick={onClose} aria-label="Close menu" className="p-1 text-text">
            <CloseIcon className="h-7 w-7" />
          </button>
        </div>

        <nav className="section-pad mt-8 flex flex-col">
          {links.map((l, i) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={onClose}
              className="group flex items-center justify-between border-b border-line py-5"
              style={{
                transition: "opacity .6s, transform .6s",
                transitionDelay: open ? `${180 + i * 70}ms` : "0ms",
                opacity: open ? 1 : 0,
                transform: open ? "translateY(0)" : "translateY(24px)",
              }}
            >
              <span className="font-display text-4xl sm:text-5xl text-text">{l.label}</span>
              <ArrowUpRight className="h-6 w-6 text-muted transition-all group-hover:text-accent group-hover:translate-x-1" />
            </Link>
          ))}
        </nav>

        <div className="section-pad mt-10 flex items-center justify-between">
          <Link href="/account" onClick={onClose} className="eyebrow hover:text-accent">
            Account
          </Link>
          <div className="flex items-center gap-3">
            <span className="eyebrow">Theme</span>
            <ThemeToggle />
          </div>
        </div>

        <p className="section-pad mt-10 max-w-sm text-xs leading-relaxed text-faint">
          Unofficial portfolio concept. Not affiliated with Rolex. All prices are fictional demo prices.
        </p>
      </div>
    </div>
  );
}
