"use client";

import Link from "next/link";
import { ArrowUpRight } from "@/components/ui/icons";

const COLS = [
  {
    title: "Collection",
    links: [
      { label: "All Timepieces", href: "/collection" },
      { label: "The Icon", href: "/#icon" },
      { label: "New Arrivals", href: "/collection" },
      { label: "Precious Metals", href: "/collection" },
    ],
  },
  {
    title: "Maison",
    links: [
      { label: "Heritage", href: "/#heritage" },
      { label: "Craftsmanship", href: "/#heritage" },
      { label: "Contact", href: "/#contact" },
      { label: "Boutiques", href: "/#contact" },
    ],
  },
  {
    title: "Client Care",
    links: [
      { label: "Shipping", href: "/#contact" },
      { label: "Returns", href: "/#contact" },
      { label: "Privacy", href: "/#contact" },
      { label: "Terms", href: "/#contact" },
    ],
  },
];

const SOCIAL = ["Instagram", "YouTube", "Pinterest", "LinkedIn"];

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line bg-bg-2">
      <div className="section-pad py-20">
        <div className="flex flex-col gap-14 lg:flex-row lg:justify-between">
          <div className="max-w-sm">
            <p className="font-display text-4xl tracking-[0.28em] pl-[0.28em]">MERIDIAN</p>
            <p className="mt-6 text-sm leading-relaxed text-muted">
              A concept house of fine watchmaking. Precision, heritage and timeless design —
              reimagined for the digital age.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="mt-8 flex items-center gap-2 border-b border-line-strong pb-2"
            >
              <input
                type="email"
                placeholder="Your email for private previews"
                className="w-full bg-transparent text-sm text-text placeholder:text-faint outline-none"
              />
              <button aria-label="Subscribe" className="text-muted hover:text-accent">
                <ArrowUpRight className="h-5 w-5" />
              </button>
            </form>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:gap-16">
            {COLS.map((c) => (
              <div key={c.title}>
                <p className="eyebrow mb-5">{c.title}</p>
                <ul className="space-y-3">
                  {c.links.map((l) => (
                    <li key={l.label}>
                      <Link href={l.href} className="text-sm text-muted transition-colors hover:text-text link-underline">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-6 border-t border-line pt-8 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-5">
            {SOCIAL.map((s) => (
              <a key={s} href="#" className="text-xs uppercase tracking-wide-2 text-muted hover:text-accent">
                {s}
              </a>
            ))}
          </div>
          <p className="text-xs text-faint">© {new Date().getFullYear()} Meridian — Demo. All rights reserved.</p>
        </div>

        <p className="mt-8 max-w-2xl text-xs leading-relaxed text-faint">
          <span className="text-accent">Disclaimer.</span> Unofficial portfolio concept. Not affiliated with,
          endorsed by, or connected to Rolex SA. Model family names are referenced for demonstration purposes only.
          All prices are fictional demo prices and no products are for actual sale.
        </p>
      </div>

      {/* oversized watermark */}
      <div className="pointer-events-none select-none px-4 pb-4">
        <p className="whitespace-nowrap text-center font-display text-[18vw] leading-none tracking-tight text-text/[0.03]">
          MERIDIAN
        </p>
      </div>
    </footer>
  );
}
