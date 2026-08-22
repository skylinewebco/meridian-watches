# Watch models — how to add a real 3D model

The hero is wired to load a real `.glb`/`.gltf` model through `useGLTF` (drei),
with gold-case / green-dial recoloring and all existing hero animations. It's
**off by default** so no missing file is ever requested (keeps the console clean).

## Enable in two steps

1. Put a model you have the rights to at:

   ```
   public/models/luxury-watch.glb
   ```

2. In `src/components/sections/Hero.tsx`, set:

   ```ts
   const HERO_MODEL_URL: string = "/models/luxury-watch.glb";
   ```

That's it. The hero swaps the SVG watch for the 3D model. If the file is missing
or fails to load, it falls back to the procedural watch automatically
(`ModelErrorBoundary`).

## Recoloring to gold + green

The hero passes `recolor="goldGreen"`, which tints metallic materials → gold and
non-metal surfaces → green, and drops baked-in textures so no third-party logos
survive. Tune the target colours via `caseColor` / `dialColor` on `WatchGLTF`, or
set `recolor="none"` to keep the model's own materials.

## Where to get a LICENSE-CLEAN, UNBRANDED model

Use a **generic luxury/diver watch** — not a "Rolex/Omega/AP" model (those carry
trademarks even when the upload is tagged "free"). Good options:

- **Sketchfab** — filter *Downloadable* + license *CC0* or *CC-BY*; search
  "wristwatch"/"diver watch"/"chronograph" (avoid brand names). Requires a free
  account to download.
- **Meshy** (meshy.ai) — CC0 gallery + AI generation; export `.glb`. Free account
  to download. Pick an unbranded design.
- **Poly Haven / Quaternius / Kenney** — CC0, though watch coverage is limited.

Export as **`.glb`** (embedded), keep textures reasonable, and drop it at the path
above. Y-up and any real-world scale is fine — the loader auto-centers and scales.
If it faces the wrong way, pass a `rotation` prop to `WatchGLTF`.
