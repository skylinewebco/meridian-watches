"use client";

import { useId } from "react";
import type { ThreeMaterial, DialType } from "@/lib/products";

/**
 * Photoreal, model-accurate SVG watch face — original artwork (no branding /
 * no product photography). Rendered where a full WebGL canvas would be
 * excessive (cards, galleries), keeping the page light while looking premium.
 */
export function WatchDial({
  mat,
  dialType = "date",
  className = "",
  seconds = true,
}: {
  mat: ThreeMaterial;
  dialType?: DialType;
  className?: string;
  seconds?: boolean;
}) {
  const uid = useId().replace(/:/g, "");
  const lume = lumeColor(mat.dial);
  const hasDate = ["diver", "gmt", "date", "daydate", "skydweller", "yachtmaster"].includes(dialType);
  const isSport = ["diver", "gmt", "yachtmaster"].includes(dialType);

  return (
    <svg viewBox="0 0 200 200" className={className} role="img" aria-label="Luxury watch">
      <defs>
        {/* polished case metal */}
        <radialGradient id={`case-${uid}`} cx="36%" cy="30%" r="78%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="26%" stopColor={shade(mat.case, 0.12)} />
          <stop offset="70%" stopColor={mat.case} />
          <stop offset="100%" stopColor={shade(mat.case, -0.45)} />
        </radialGradient>
        <linearGradient id={`caseRim-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.7" />
          <stop offset="50%" stopColor={mat.case} />
          <stop offset="100%" stopColor={shade(mat.case, -0.35)} />
        </linearGradient>
        {/* bezel metal / insert */}
        <radialGradient id={`bezel-${uid}`} cx="38%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
          <stop offset="45%" stopColor={shade(mat.bezel, 0.05)} />
          <stop offset="100%" stopColor={shade(mat.bezel, -0.5)} />
        </radialGradient>
        {/* dial base (radial depth) */}
        <radialGradient id={`dial-${uid}`} cx="44%" cy="36%" r="82%">
          <stop offset="0%" stopColor={shade(mat.dial, 0.28)} />
          <stop offset="52%" stopColor={mat.dial} />
          <stop offset="100%" stopColor={shade(mat.dial, -0.4)} />
        </radialGradient>
        {/* sub-dial snailing */}
        <radialGradient id={`sub-${uid}`} cx="42%" cy="38%" r="72%">
          <stop offset="0%" stopColor={shade(mat.dial, 0.18)} />
          <stop offset="100%" stopColor={shade(mat.dial, -0.3)} />
        </radialGradient>
        {/* metallic marker/hand */}
        <linearGradient id={`metal-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="45%" stopColor={mat.hands} />
          <stop offset="100%" stopColor={shade(mat.hands, -0.45)} />
        </linearGradient>
        {/* glass glare */}
        <linearGradient id={`glare-${uid}`} x1="0" y1="0" x2="0.7" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
          <stop offset="42%" stopColor="#ffffff" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <filter id={`soft-${uid}`} x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="2.2" stdDeviation="2.4" floodColor="#000000" floodOpacity="0.5" />
        </filter>
      </defs>

      {/* ---------- CASE ---------- */}
      <circle cx="100" cy="100" r="97" fill={`url(#case-${uid})`} />
      <circle cx="100" cy="100" r="97" fill="none" stroke="#00000040" strokeWidth="0.6" />
      <circle cx="100" cy="100" r="90" fill={`url(#caseRim-${uid})`} />

      {/* ---------- BEZEL ---------- */}
      <Bezel uid={uid} mat={mat} dialType={dialType} lume={lume} />

      {/* ---------- DIAL ---------- */}
      <circle cx="100" cy="100" r="70" fill={`url(#dial-${uid})`} filter={`url(#soft-${uid})`} />
      {/* sunburst brushing */}
      <g opacity={mat.dial === "#08090b" || mat.dial === "#0c0c0e" ? 0.5 : 0.32}>
        {Array.from({ length: 90 }).map((_, i) => {
          const a = (i / 90) * 360;
          const [x1, y1] = polar(100, 100, 6, a);
          const [x2, y2] = polar(100, 100, 70, a);
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={i % 2 ? shade(mat.dial, 0.22) : shade(mat.dial, -0.16)}
              strokeWidth="0.7"
            />
          );
        })}
      </g>
      {/* rehaut (inner chapter ring) */}
      <circle cx="100" cy="100" r="70" fill="none" stroke="#00000030" strokeWidth="1" />
      <g>
        {Array.from({ length: 60 }).map((_, i) => {
          const a = (i / 60) * 360;
          const [x1, y1] = polar(100, 100, 68, a);
          const [x2, y2] = polar(100, 100, i % 5 === 0 ? 64 : 66, a);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={mat.hands} strokeWidth={i % 5 === 0 ? 0.9 : 0.5} opacity="0.7" />;
        })}
      </g>

      {/* wordmark (original brand) */}
      <text
        x="100"
        y="60"
        textAnchor="middle"
        fontSize="6.5"
        letterSpacing="1.1"
        fill={mat.hands}
        style={{ fontFamily: "var(--font-display, Georgia), serif", opacity: 0.92 }}
      >
        MERIDIAN
      </text>
      <text
        x="100"
        y="150"
        textAnchor="middle"
        fontSize="4.4"
        letterSpacing="1.4"
        fill={mat.hands}
        opacity="0.7"
        style={{ fontFamily: "var(--font-inter, sans-serif)" }}
      >
        CHRONOMETER
      </text>

      {/* ---------- COMPLICATIONS ---------- */}
      {dialType === "chrono" && <SubDials uid={uid} mat={mat} which="chrono" />}
      {dialType === "dress" && <SubDials uid={uid} mat={mat} which="seconds" />}
      {dialType === "skydweller" && <SkyDisc uid={uid} mat={mat} lume={lume} />}

      {/* ---------- MARKERS ---------- */}
      <Markers uid={uid} mat={mat} dialType={dialType} lume={lume} hasDate={hasDate} />

      {/* ---------- DATE (cyclops) ---------- */}
      {hasDate && <DateWindow mat={mat} />}

      {/* ---------- HANDS ---------- */}
      <Hands uid={uid} mat={mat} dialType={dialType} lume={lume} seconds={seconds} isSport={isSport} />

      {/* center cap */}
      <circle cx="100" cy="100" r="4.4" fill={`url(#metal-${uid})`} />
      <circle cx="100" cy="100" r="1.5" fill={shade(mat.hands, -0.4)} />

      {/* ---------- SAPPHIRE GLARE ---------- */}
      <ellipse cx="78" cy="70" rx="40" ry="26" fill={`url(#glare-${uid})`} transform="rotate(-24 78 70)" />
      <ellipse cx="128" cy="132" rx="20" ry="10" fill="#ffffff" opacity="0.05" transform="rotate(-24 128 132)" />
    </svg>
  );
}

/* ================= sub-components ================= */

function Bezel({ uid, mat, dialType, lume }: { uid: string; mat: ThreeMaterial; dialType: DialType; lume: string }) {
  const style = mat.bezelStyle ?? "smooth";

  // colored insert bezels (diver / gmt) use the bezel colour as an insert
  if (dialType === "diver" || dialType === "gmt" || dialType === "yachtmaster") {
    const ticks = 60;
    return (
      <>
        <circle cx="100" cy="100" r="90" fill={`url(#bezel-${uid})`} />
        <circle cx="100" cy="100" r="82" fill={shade(mat.bezel, -0.1)} />
        <circle cx="100" cy="100" r="82" fill="none" stroke="#00000060" strokeWidth="0.8" />
        {/* lume pip at 12 */}
        <circle cx="100" cy={100 - 78} r="2.6" fill={lume} stroke="#00000050" strokeWidth="0.4" />
        {/* minute ticks / numerals */}
        {Array.from({ length: ticks }).map((_, i) => {
          const a = (i / ticks) * 360;
          if (i === 0) return null;
          const major = i % 5 === 0;
          const [x1, y1] = polar(100, 100, 84, a);
          const [x2, y2] = polar(100, 100, major ? 79 : 81, a);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={lume} strokeWidth={major ? 1.4 : 0.7} opacity="0.85" />;
        })}
        {dialType === "yachtmaster" &&
          [0, 15, 30, 45].map((n) => {
            const a = (n / 60) * 360;
            const [x, y] = polar(100, 100, 86, a);
            return (
              <text key={n} x={x} y={y + 2} textAnchor="middle" fontSize="6.5" fill="#ffffff" style={{ fontFamily: "var(--font-inter, sans-serif)" }}>
                {n === 0 ? "60" : n}
              </text>
            );
          })}
      </>
    );
  }

  if (dialType === "chrono") {
    // tachymeter metal bezel with engraved scale
    return (
      <>
        <circle cx="100" cy="100" r="90" fill={`url(#bezel-${uid})`} />
        <circle cx="100" cy="100" r="82" fill="none" stroke={shade(mat.bezel, -0.4)} strokeWidth="1" />
        {Array.from({ length: 60 }).map((_, i) => {
          const a = (i / 60) * 360;
          const major = i % 5 === 0;
          const [x1, y1] = polar(100, 100, 88, a);
          const [x2, y2] = polar(100, 100, major ? 83 : 85.5, a);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#e9e7e1" strokeWidth={major ? 1 : 0.5} opacity="0.8" />;
        })}
        {[400, 250, 175, 130].map((n, i) => {
          const a = 60 + i * 40;
          const [x, y] = polar(100, 100, 86, a);
          return (
            <text key={n} x={x} y={y + 1.6} textAnchor="middle" fontSize="4.6" fill="#e9e7e1" opacity="0.85" style={{ fontFamily: "var(--font-inter, sans-serif)" }}>
              {n}
            </text>
          );
        })}
      </>
    );
  }

  // metal bezels: fluted or smooth
  return (
    <>
      <circle cx="100" cy="100" r="90" fill={`url(#bezel-${uid})`} />
      {style === "fluted" &&
        Array.from({ length: 60 }).map((_, i) => {
          const a = (i / 60) * 360;
          const [x1, y1] = polar(100, 100, 82, a);
          const [x2, y2] = polar(100, 100, 90, a);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={i % 2 ? "#ffffff" : "#00000055"} strokeWidth="1.1" opacity="0.5" />;
        })}
      <circle cx="100" cy="100" r="82" fill="none" stroke="#00000045" strokeWidth="0.8" />
    </>
  );
}

function Markers({
  uid,
  mat,
  dialType,
  lume,
  hasDate,
}: {
  uid: string;
  mat: ThreeMaterial;
  dialType: DialType;
  lume: string;
  hasDate: boolean;
}) {
  const els: React.ReactNode[] = [];
  const numerals369 = dialType === "explorer";
  const roundDots = dialType === "diver" || dialType === "gmt" || dialType === "yachtmaster";

  for (let h = 0; h < 12; h++) {
    const a = (h / 12) * 360;
    // date models: skip the 3 o'clock marker (window sits there)
    if (hasDate && h === 3) continue;

    if (h === 0) {
      // triangle at 12 for sport dials, else long baton
      if (roundDots || dialType === "explorer") {
        const [x, y] = polar(100, 100, 58, a);
        els.push(
          <polygon
            key={h}
            points={triangle(x, y, 7)}
            fill={lume}
            stroke={mat.hands}
            strokeWidth="1.2"
          />
        );
        continue;
      }
    }

    if (numerals369 && (h === 3 || h === 6 || h === 9)) {
      const [x, y] = polar(100, 100, 56, a);
      els.push(
        <text key={h} x={x} y={y + 4} textAnchor="middle" fontSize="12" fill={mat.hands} style={{ fontFamily: "var(--font-inter, sans-serif)", fontWeight: 600 }}>
          {h}
        </text>
      );
      continue;
    }

    // applied index (metal frame + lume core)
    const [ox, oy] = polar(100, 100, 58, a);
    const w = 3.4;
    if (roundDots) {
      els.push(
        <g key={h}>
          <circle cx={ox} cy={oy} r="3.2" fill={mat.hands} />
          <circle cx={ox} cy={oy} r="2.1" fill={lume} />
        </g>
      );
    } else {
      els.push(
        <g key={h} transform={`rotate(${a} ${ox} ${oy})`}>
          <rect x={ox - w / 2} y={oy - 6} width={w} height={12} rx="1" fill={`url(#metal-${uid})`} stroke="#00000040" strokeWidth="0.3" />
          <rect x={ox - (w - 1.4) / 2} y={oy - 5} width={w - 1.4} height={10} rx="0.6" fill={lume} opacity="0.9" />
        </g>
      );
    }
  }

  return <>{els}</>;
}

function SubDials({ uid, mat, which }: { uid: string; mat: ThreeMaterial; which: "chrono" | "seconds" }) {
  const subs =
    which === "chrono"
      ? ([
          [100, 68],
          [76, 112],
          [124, 112],
        ] as const)
      : ([[100, 132]] as const);

  return (
    <>
      {subs.map(([cx, cy], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r="15" fill={`url(#sub-${uid})`} stroke="#00000040" strokeWidth="0.6" />
          {/* concentric snailing */}
          {[12, 9, 6].map((rr) => (
            <circle key={rr} cx={cx} cy={cy} r={rr} fill="none" stroke="#00000018" strokeWidth="0.4" />
          ))}
          {/* ticks */}
          {Array.from({ length: 12 }).map((_, k) => {
            const a = (k / 12) * 360;
            const [x1, y1] = polar(cx, cy, 14, a);
            const [x2, y2] = polar(cx, cy, 12, a);
            return <line key={k} x1={x1} y1={y1} x2={x2} y2={y2} stroke={mat.hands} strokeWidth="0.5" opacity="0.6" />;
          })}
          {/* little hand */}
          <line x1={cx} y1={cy} x2={polar(cx, cy, 11, 40 + i * 60)[0]} y2={polar(cx, cy, 11, 40 + i * 60)[1]} stroke={mat.hands} strokeWidth="1" />
          <circle cx={cx} cy={cy} r="1.4" fill={mat.hands} />
        </g>
      ))}
    </>
  );
}

function SkyDisc({ uid, mat, lume }: { uid: string; mat: ThreeMaterial; lume: string }) {
  const cx = 100;
  const cy = 128;
  return (
    <g>
      <circle cx={cx} cy={cy} r="16" fill={`url(#sub-${uid})`} stroke="#00000040" strokeWidth="0.6" />
      {Array.from({ length: 24 }).map((_, k) => {
        const a = (k / 24) * 360;
        const [x1, y1] = polar(cx, cy, 15, a);
        const [x2, y2] = polar(cx, cy, k % 6 === 0 ? 11 : 13, a);
        return <line key={k} x1={x1} y1={y1} x2={x2} y2={y2} stroke={k < 12 ? mat.hands : lume} strokeWidth="0.6" opacity="0.7" />;
      })}
      <text x={cx} y={cy - 6} textAnchor="middle" fontSize="4" fill={mat.hands} opacity="0.7">
        24
      </text>
    </g>
  );
}

function DateWindow({ mat }: { mat: ThreeMaterial }) {
  const x = 154;
  const y = 100;
  return (
    <g>
      {/* magnifier bubble (cyclops) */}
      <rect x={x - 12} y={y - 8.5} width="21" height="17" rx="1.5" fill="#f5f2ea" stroke={mat.hands} strokeWidth="0.8" />
      <text x={x - 1.5} y={y + 3.4} textAnchor="middle" fontSize="10" fill="#16161a" style={{ fontFamily: "var(--font-inter, sans-serif)", fontWeight: 600 }}>
        28
      </text>
      {/* cyclops glare */}
      <line x1={x - 10} y1={y - 6} x2={x + 6} y2={y - 6} stroke="#ffffff" strokeWidth="1.2" opacity="0.5" />
    </g>
  );
}

function Hands({
  uid,
  mat,
  dialType,
  lume,
  seconds,
  isSport,
}: {
  uid: string;
  mat: ThreeMaterial;
  dialType: DialType;
  lume: string;
  seconds: boolean;
  isSport: boolean;
}) {
  const metal = `url(#metal-${uid})`;
  const chronoAccent = "#c9a86a";

  // hour ~10:09, minute ~ :09
  const hourA = 305;
  const minA = 54;

  const HourHand = () => {
    if (isSport || dialType === "diver" || dialType === "gmt") {
      // broad hand + lume, Mercedes-style circle
      return (
        <g transform={`rotate(${hourA} 100 100)`}>
          <rect x="97.5" y="52" width="5" height="52" rx="2.2" fill={metal} stroke="#00000040" strokeWidth="0.3" />
          <rect x="98.6" y="56" width="2.8" height="40" rx="1.4" fill={lume} opacity="0.9" />
          <circle cx="100" cy="72" r="5.2" fill="none" stroke={metal} strokeWidth="2.4" />
          <circle cx="100" cy="72" r="4" fill={lume} opacity="0.9" />
        </g>
      );
    }
    // dauphine / baton
    return (
      <g transform={`rotate(${hourA} 100 100)`}>
        <polygon points="100,54 103,100 100,106 97,100" fill={metal} stroke="#00000040" strokeWidth="0.3" />
        <rect x="98.8" y="60" width="2.4" height="40" rx="1" fill={lume} opacity="0.85" />
      </g>
    );
  };

  const MinuteHand = () => {
    if (isSport || dialType === "diver" || dialType === "gmt") {
      return (
        <g transform={`rotate(${minA} 100 100)`}>
          <rect x="98" y="30" width="4" height="74" rx="2" fill={metal} stroke="#00000040" strokeWidth="0.3" />
          <rect x="98.9" y="34" width="2.2" height="58" rx="1.1" fill={lume} opacity="0.9" />
        </g>
      );
    }
    return (
      <g transform={`rotate(${minA} 100 100)`}>
        <polygon points="100,32 102.4,100 100,105 97.6,100" fill={metal} stroke="#00000040" strokeWidth="0.3" />
        <rect x="99" y="38" width="2" height="58" rx="1" fill={lume} opacity="0.85" />
      </g>
    );
  };

  return (
    <>
      <HourHand />
      <MinuteHand />
      {/* GMT 24h hand */}
      {dialType === "gmt" && (
        <g transform={`rotate(200 100 100)`}>
          <line x1="100" y1="100" x2="100" y2="42" stroke={chronoAccent} strokeWidth="1.8" />
          <polygon points="100,38 104,48 96,48" fill={chronoAccent} />
        </g>
      )}
      {/* seconds */}
      {seconds && (
        <g transform={`rotate(128 100 100)`}>
          <line x1="100" y1="112" x2="100" y2="34" stroke={dialType === "chrono" ? chronoAccent : mat.hands} strokeWidth="1" />
          <circle cx="100" cy="100" r="2.4" fill={dialType === "chrono" ? chronoAccent : mat.hands} />
        </g>
      )}
    </>
  );
}

/* ================= helpers ================= */

function r(n: number) {
  return Math.round(n * 100) / 100;
}

function polar(cx: number, cy: number, radius: number, angleDeg: number): [number, number] {
  const a = (angleDeg * Math.PI) / 180;
  return [r(cx + Math.sin(a) * radius), r(cy - Math.cos(a) * radius)];
}

function triangle(x: number, y: number, size: number): string {
  return `${r(x)},${r(y - size)} ${r(x - size * 0.86)},${r(y + size * 0.5)} ${r(x + size * 0.86)},${r(y + size * 0.5)}`;
}

/** Lighten (t>0) or darken (t<0) a #rrggbb hex by ratio. */
function shade(hex: string, t: number): string {
  const p = parse(hex);
  if (!p) return hex;
  const mix = t >= 0 ? 255 : 0;
  const k = Math.abs(t);
  const c = p.map((v) => Math.round(v + (mix - v) * k)) as [number, number, number];
  return `rgb(${c[0]},${c[1]},${c[2]})`;
}

function lumeColor(dial: string): string {
  const p = parse(dial);
  if (!p) return "#cfe8d6";
  const lum = (0.299 * p[0] + 0.587 * p[1] + 0.114 * p[2]) / 255;
  return lum > 0.62 ? "#d8d2be" : "#cfe8d6"; // cream on light dials, pale-green lume on dark
}

function parse(h: string): [number, number, number] | null {
  const m = h.replace("#", "");
  if (m.length !== 6) return null;
  return [parseInt(m.slice(0, 2), 16), parseInt(m.slice(2, 4), 16), parseInt(m.slice(4, 6), 16)];
}
