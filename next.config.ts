import type { NextConfig } from "next";

/**
 * Static export for GitHub Pages, served from the domain root (meridian.skylinewebx.com).
 *
 * - output: "export"      → emits a fully static site to /out on `next build`
 * - trailingSlash         → emits folder/index.html so GitHub Pages resolves routes
 *                           (and refreshes) without a server
 * - images.unoptimized    → no server image optimizer in a static export
 */
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
