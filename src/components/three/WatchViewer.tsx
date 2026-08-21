"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import type { ThreeMaterial, DialType } from "@/lib/products";
import type { ScrollDriver } from "./scrollDriver";
import { WatchDial } from "./WatchDial";

const WatchCanvas = dynamic(() => import("./WatchCanvas"), {
  ssr: false,
  loading: () => <WatchLoader />,
});

type Props = {
  mat: ThreeMaterial;
  interactive?: boolean;
  autoRotate?: boolean;
  spinSpeed?: number;
  className?: string;
  /** Optional GLTF to load (e.g. "/models/luxury_watch.glb"). */
  modelUrl?: string;
  /** GSAP-driven scroll state for rotation + scale. */
  scroll?: React.RefObject<ScrollDriver | null>;
  /** Complication layout for the SVG fallback. */
  dialType?: DialType;
  /** Recolor a loaded GLTF to the site's gold/green palette. */
  recolor?: "none" | "goldGreen";
};

function supportsWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && (c.getContext("webgl") || c.getContext("experimental-webgl")));
  } catch {
    return false;
  }
}

export function WatchLoader() {
  return (
    <div className="grid h-full w-full place-items-center">
      <div className="relative h-16 w-16">
        <div className="absolute inset-0 rounded-full border border-line" />
        <div
          className="absolute inset-0 rounded-full border-2 border-transparent"
          style={{ borderTopColor: "var(--accent)", animation: "spin 1s linear infinite" }}
        />
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

/** Premium SVG fallback used only when WebGL is unavailable — the same
 *  high-fidelity dial as the product cards, floated with a soft shadow. */
function StaticWatch({ mat, dialType }: { mat: ThreeMaterial; dialType?: DialType }) {
  return (
    <div className="grid h-full w-full place-items-center">
      <div className="relative aspect-square w-[68%] max-w-[420px]">
        <div
          className="pointer-events-none absolute inset-x-[12%] bottom-[6%] h-6 rounded-[50%] blur-xl"
          style={{ background: "rgba(0,0,0,0.45)" }}
        />
        <WatchDial mat={mat} dialType={dialType} className="relative h-full w-full drop-shadow-2xl" />
      </div>
    </div>
  );
}

export function WatchViewer({ modelUrl, ...props }: Props) {
  const [ok, setOk] = useState<boolean | null>(null);
  const [resolvedUrl, setResolvedUrl] = useState<string | undefined>(undefined);

  useEffect(() => setOk(supportsWebGL()), []);

  // Only load the GLTF if the file actually exists — keeps the console clean
  // and lets the procedural watch stand in until a model is dropped in.
  useEffect(() => {
    if (!modelUrl) return;
    let alive = true;
    fetch(modelUrl, { method: "HEAD" })
      .then((r) => {
        if (!alive || !r.ok) return;
        setResolvedUrl(modelUrl);
        import("./WatchGLTF").then((m) => m.preloadWatch(modelUrl)).catch(() => {});
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [modelUrl]);

  if (ok === null) return <WatchLoader />;
  if (!ok) return <StaticWatch mat={props.mat} dialType={props.dialType} />;
  return <WatchCanvas {...props} modelUrl={resolvedUrl} />;
}
