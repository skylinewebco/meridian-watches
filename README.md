# MERIDIAN — Time, Redefined

An immersive, cinematic **3D luxury watch e‑commerce concept**. Built as a premium interactive brand campaign that happens to include full e‑commerce functionality.

> **Unofficial portfolio concept. Not affiliated with, endorsed by, or connected to Rolex SA.**
> Model family names are referenced for demonstration purposes only. **All prices are fictional demo prices** and no products are for actual sale. No real payments are processed.

---

## Tech stack

- **Next.js 16** (App Router) + **React 19**
- **Three.js** via **React Three Fiber** + **drei** — real, interactive 3D watch
- **GSAP** + **ScrollTrigger** — scroll-driven cinematic motion
- **Lenis** — smooth inertia scrolling
- **Tailwind CSS v4** — token-driven design system (dark + light themes)
- **TypeScript** throughout

## Getting started

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. (Developed against a portable Node 24 LTS install; any Node ≥ 18.18 works.)

```bash
npm run build && npm start   # production
```

## Feature map

| Area | Where |
| --- | --- |
| Cinematic hero + scroll-scaled 3D watch | `src/components/sections/Hero.tsx` |
| VIP "THE ICON" section (sticky 3D, progressive reveal, live finish switch) | `src/components/sections/FeaturedIcon.tsx` |
| 3×3 collection grid, hover tilt/scale | `src/components/sections/Collection.tsx`, `product/ProductCard.tsx` |
| Product detail (variant / strap / size, add-to-cart, buy-now) | `src/components/product/ProductDetail.tsx` |
| Cart drawer (qty, remove, subtotal, shipping, total) | `src/components/layout/CartDrawer.tsx` |
| Demo checkout (info → shipping → payment: Card / COD → confirmation) | `src/app/checkout/page.tsx` |
| Login / Sign-up / Forgot password (demo) | `src/app/account/page.tsx` |
| Navbar (glass on scroll), full-screen mobile menu, search overlay | `src/components/layout/*` |
| Animated theme switcher (dark ⇄ pearl light) | `src/components/ui/ThemeToggle.tsx` |
| Custom luxury cursor + magnetic buttons | `src/components/layout/CustomCursor.tsx`, `ui/MagneticButton.tsx` |
| Product catalogue (9 watches, variants, specs) | `src/lib/products.ts` |

## The 3D watch

The centrepiece watch is **procedurally modelled** from Three.js primitives (case, fluted/coin bezel, domed sapphire crystal with transmission, applied markers, hands, crown, lugs, chrono sub‑dials) so the demo is fully self‑contained — no external asset downloads, no external HDR (reflections come from an inline `<Environment>` light rig).

**Dropping in a real model:** the component is architected for it. Add `watch.glb` to `public/models/` and swap the body of `src/components/three/WatchModel.tsx`:

```tsx
const { scene } = useGLTF("/models/watch.glb");
return <primitive object={scene} />;
```

The surrounding Canvas — lighting, environment, shadows, auto‑rotation, pointer parallax, scroll response, loading state — needs no change.

Cards and galleries use a crisp **SVG dial** (`WatchDial.tsx`) instead of a WebGL canvas, so a page with nine watches stays fast; full WebGL is reserved for the hero, the icon section and product pages. A CSS fallback renders where WebGL is unavailable, and all motion respects `prefers-reduced-motion`.

## Notes

- Cart persists to `localStorage`; theme preference persists and respects system preference on first visit.
- Everything payment/auth related is a **UI demo only**.
