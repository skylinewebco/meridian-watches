"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useCart } from "@/components/providers/CartProvider";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { SearchIcon, BagIcon, MenuIcon, CloseIcon, UserIcon } from "@/components/ui/icons";
import { MobileMenu } from "./MobileMenu";
import { SearchOverlay } from "./SearchOverlay";

const LINKS = [
  { label: "Collection", href: "/collection" },
  { label: "The Icon", href: "/#icon" },
  { label: "Heritage", href: "/#heritage" },
  { label: "Contact", href: "/#contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { count, open } = useCart();
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[70] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          scrolled ? "glass py-3" : "bg-transparent py-5"
        }`}
      >
        <nav className="section-pad flex items-center justify-between gap-4">
          {/* left: menu (mobile) + links (desktop) */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              data-cursor="hover"
              className="lg:hidden -ml-1 p-1 text-text"
            >
              <MenuIcon className="h-6 w-6" />
            </button>
            <ul className="hidden lg:flex items-center gap-8 text-[0.78rem] uppercase tracking-wide-2 text-muted">
              {LINKS.slice(0, 2).map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="link-underline transition-colors hover:text-text" data-cursor="hover">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* brand */}
          <Link
            href="/"
            data-cursor="hover"
            className="absolute left-1/2 -translate-x-1/2 font-display text-2xl md:text-[1.7rem] tracking-[0.35em] pl-[0.35em] text-text"
          >
            MERIDIAN
          </Link>

          {/* right */}
          <div className="flex items-center gap-3 md:gap-5">
            <ul className="hidden lg:flex items-center gap-8 text-[0.78rem] uppercase tracking-wide-2 text-muted mr-1">
              {LINKS.slice(2).map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="link-underline transition-colors hover:text-text" data-cursor="hover">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>

            <button onClick={() => setSearchOpen(true)} aria-label="Search" data-cursor="hover" className="p-1 text-text/85 hover:text-accent transition-colors">
              <SearchIcon className="h-[1.15rem] w-[1.15rem]" />
            </button>
            <Link href="/account" aria-label="Account" data-cursor="hover" className="hidden sm:block p-1 text-text/85 hover:text-accent transition-colors">
              <UserIcon className="h-[1.15rem] w-[1.15rem]" />
            </Link>
            <div className="hidden sm:block"><ThemeToggle /></div>
            <button onClick={open} aria-label="Cart" data-cursor="hover" className="relative p-1 text-text/85 hover:text-accent transition-colors">
              <BagIcon className="h-[1.2rem] w-[1.2rem]" />
              {count > 0 && (
                <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-accent px-1 text-[0.6rem] font-semibold text-accent-ink">
                  {count}
                </span>
              )}
            </button>
          </div>
        </nav>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} links={LINKS} />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
