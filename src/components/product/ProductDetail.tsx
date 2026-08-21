"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Watch } from "@/lib/products";
import { formatPrice, watches } from "@/lib/products";
import { WatchViewer } from "@/components/three/WatchViewer";
import { WatchDial } from "@/components/three/WatchDial";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { useCart } from "@/components/providers/CartProvider";
import { gsap } from "@/lib/gsap";
import { useIsoLayoutEffect } from "@/hooks/useIsoLayoutEffect";
import { CheckIcon, ArrowUpRight, ArrowRight } from "@/components/ui/icons";

export function ProductDetail({ watch }: { watch: Watch }) {
  const { add } = useCart();
  const router = useRouter();

  const [vi, setVi] = useState(0);
  const [strap, setStrap] = useState(watch.straps[0]);
  const [size, setSize] = useState(watch.sizes[Math.floor(watch.sizes.length / 2)] ?? watch.sizes[0]);
  const [added, setAdded] = useState(false);

  const variant = watch.variants[vi];
  const infoRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);

  const specs = [
    { label: "Reference", value: watch.name },
    { label: "Case Size", value: size },
    { label: "Material", value: variant.material },
    { label: "Movement", value: watch.movement },
    { label: "Power Reserve", value: watch.powerReserve },
    { label: "Water Resistance", value: watch.waterResistance },
    { label: "Crystal", value: watch.crystal },
    { label: "Bracelet", value: strap },
  ];

  const changeVariant = (i: number) => {
    if (i === vi) return;
    setVi(i);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    gsap.fromTo(flashRef.current, { opacity: 0.5 }, { opacity: 0, duration: 0.7, ease: "power2.out" });
    gsap.fromTo("[data-price]", { y: 8, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" });
  };

  const doAdd = () => {
    add({
      slug: watch.slug,
      name: watch.name,
      variantId: variant.id,
      variantName: variant.name,
      strap,
      size,
      price: variant.price,
      swatch: variant.swatch,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  const buyNow = () => {
    doAdd();
    router.push("/checkout");
  };

  useIsoLayoutEffect(() => {
    const el = infoRef.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const ctx = gsap.context(() => {
      gsap.from(el.querySelectorAll("[data-stagger]"), {
        y: 24,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.08,
        delay: 0.15,
      });
    }, el);
    return () => ctx.revert();
  }, []);

  const related = watches.filter((w) => w.slug !== watch.slug).slice(0, 3);

  return (
    <div className="pt-28">
      {/* breadcrumb */}
      <div className="section-pad flex items-center gap-2 text-xs text-muted">
        <Link href="/" className="hover:text-text">Home</Link>
        <span>/</span>
        <Link href="/collection" className="hover:text-text">Collection</Link>
        <span>/</span>
        <span className="text-text">{watch.name}</span>
      </div>

      <div className="section-pad grid grid-cols-1 gap-12 pt-6 lg:grid-cols-2">
        {/* visual */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="relative aspect-square overflow-hidden rounded-3xl border border-line bg-bg-2">
            <div
              className="pointer-events-none absolute inset-0"
              style={{ background: "radial-gradient(55% 50% at 50% 45%, var(--hero-glow), transparent 70%)" }}
            />
            <WatchViewer mat={variant.three} dialType={watch.dialType} autoRotate interactive spinSpeed={0.28} className="!h-full !w-full" />
            <div ref={flashRef} className="pointer-events-none absolute inset-0 bg-white opacity-0" />
            <span className="absolute left-5 top-5 eyebrow text-[0.58rem] text-muted">Drag · Auto-rotating</span>
          </div>

          {/* variant "gallery" thumbnails */}
          <div className="mt-4 flex gap-3">
            {watch.variants.map((v, i) => (
              <button
                key={v.id}
                onClick={() => changeVariant(i)}
                aria-label={v.name}
                className={`grid aspect-square w-20 place-items-center rounded-xl border p-2 transition-all duration-500 ${
                  i === vi ? "border-accent" : "border-line hover:border-line-strong"
                }`}
              >
                <WatchDial mat={v.three} dialType={watch.dialType} className="h-full w-full" seconds={false} />
              </button>
            ))}
          </div>
        </div>

        {/* details */}
        <div ref={infoRef} className="max-w-xl">
          <p data-stagger className="eyebrow mb-4">{watch.collection}</p>
          <h1 data-stagger className="font-display text-[clamp(2.6rem,6vw,4.5rem)] font-light leading-[0.98]">
            {watch.name}
          </h1>
          <p data-stagger className="mt-3 font-display text-xl italic text-accent">{watch.tagline}</p>
          <p data-stagger data-price className="mt-6 font-display text-3xl text-text">
            {formatPrice(variant.price)}
            <span className="ml-2 align-middle text-[0.6rem] uppercase tracking-wide-2 text-faint">Demo price</span>
          </p>

          <p data-stagger className="mt-6 text-[0.98rem] leading-relaxed text-muted">{watch.description}</p>

          {/* finish */}
          <div data-stagger className="mt-9">
            <div className="mb-3 flex items-center justify-between">
              <span className="eyebrow text-[0.6rem]">Finish · {variant.name}</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {watch.variants.map((v, i) => (
                <button
                  key={v.id}
                  onClick={() => changeVariant(i)}
                  data-cursor="hover"
                  aria-label={v.name}
                  className={`h-10 w-10 rounded-full border transition-all duration-400 ${
                    i === vi ? "scale-110 border-accent" : "border-line hover:border-line-strong"
                  }`}
                  style={{ background: v.swatch2 ? `linear-gradient(135deg, ${v.swatch} 50%, ${v.swatch2} 50%)` : v.swatch }}
                />
              ))}
            </div>
          </div>

          {/* strap */}
          <div data-stagger className="mt-8">
            <span className="eyebrow mb-3 block text-[0.6rem]">Bracelet / Strap</span>
            <div className="flex flex-wrap gap-2">
              {watch.straps.map((s) => (
                <Chip key={s} active={s === strap} onClick={() => setStrap(s)}>
                  {s}
                </Chip>
              ))}
            </div>
          </div>

          {/* size */}
          <div data-stagger className="mt-8">
            <span className="eyebrow mb-3 block text-[0.6rem]">Case Size</span>
            <div className="flex flex-wrap gap-2">
              {watch.sizes.map((s) => (
                <Chip key={s} active={s === size} onClick={() => setSize(s)}>
                  {s}
                </Chip>
              ))}
            </div>
          </div>

          {/* actions */}
          <div data-stagger className="mt-10 flex flex-col gap-3 sm:flex-row">
            <button onClick={doAdd} className={`btn ${added ? "btn-gold" : "btn-primary"} flex-1`}>
              {added ? (
                <>
                  <CheckIcon className="h-4 w-4" /> Added
                </>
              ) : (
                "Add to Cart"
              )}
            </button>
            <MagneticButton onClick={buyNow} className="btn btn-gold flex-1">
              Buy Now <ArrowRight className="h-4 w-4" />
            </MagneticButton>
          </div>
          <p data-stagger className="mt-4 text-xs text-faint">
            Complimentary white-glove delivery · 5-year international warranty · Demo checkout only.
          </p>

          {/* specs */}
          <div data-stagger className="mt-12 border-t border-line pt-8">
            <p className="eyebrow mb-6">Specifications</p>
            <dl className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
              {specs.map((s) => (
                <div key={s.label} className="flex flex-col gap-1 border-b border-line pb-4">
                  <dt className="eyebrow text-[0.58rem]">{s.label}</dt>
                  <dd className="text-[0.95rem] text-text">{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* related */}
      <div className="section-pad mt-28">
        <div className="mb-10 flex items-end justify-between">
          <h2 className="font-display text-3xl md:text-4xl">You may also admire</h2>
          <Link href="/collection" className="link-underline text-sm text-muted hover:text-text">
            All timepieces
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {related.map((w) => (
            <Link
              key={w.slug}
              href={`/product/${w.slug}`}
              className="group flex items-center gap-4 rounded-2xl border border-line bg-bg-2 p-5 transition-colors hover:border-line-strong"
            >
              <div className="w-20 shrink-0">
                <WatchDial mat={w.variants[0].three} dialType={w.dialType} className="h-full w-full" seconds={false} />
              </div>
              <div>
                <p className="font-display text-xl">{w.name}</p>
                <p className="text-xs text-muted">{w.descriptor}</p>
              </div>
              <ArrowUpRight className="ml-auto h-5 w-5 text-faint transition-all group-hover:text-accent group-hover:-translate-y-0.5" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function Chip({ children, active, onClick }: { children: React.ReactNode; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      data-cursor="hover"
      className={`rounded-full border px-5 py-2.5 text-sm transition-all duration-400 ${
        active ? "border-accent bg-accent/10 text-text" : "border-line text-muted hover:border-line-strong hover:text-text"
      }`}
    >
      {children}
    </button>
  );
}
