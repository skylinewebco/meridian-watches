import type { NextConfig } from "next";

/**
 * Static export for GitHub Pages (served from https://<user>.github.io/meridian-watches/).
 *
 * - output: "export"      → emits a fully static site to /out on `next build`
 * - basePath              → the site lives under the /meridian-watches sub-path
 * - trailingSlash         → emits folder/index.html so GitHub Pages resolves routes
 *                           (and refreshes) without a server
 * - images.unoptimized    → no server image optimizer in a static export
 *
 * Note: with basePath set, local dev is served at
 *   http://localhost:3000/meridian-watches  (not the bare root).
 */
const nextConfig: NextConfig = {
  output: "export",
  basePath: "/meridian-watches",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
