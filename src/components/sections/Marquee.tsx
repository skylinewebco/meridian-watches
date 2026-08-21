"use client";

const WORDS = ["Precision", "Craftsmanship", "Heritage", "Performance", "Exclusivity", "Timeless Design"];

export function Marquee() {
  const row = [...WORDS, ...WORDS];
  return (
    <div className="relative overflow-hidden border-y border-line bg-bg py-8">
      <div className="marquee-track">
        {row.map((w, i) => (
          <span key={i} className="mx-8 flex items-center gap-8 font-display text-3xl text-text/70 md:text-5xl">
            {w}
            <span className="text-accent">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
