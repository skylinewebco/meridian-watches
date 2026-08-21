"use client";

import { useEffect, useRef, useState } from "react";
import { WatchDial } from "./WatchDial";
import { registerGsap, gsap } from "@/lib/gsap";
import type { ThreeMaterial, DialType } from "@/lib/products";

/**
 * Integrated hero watch presentation (no WebGL, no rectangular image frame).
 *
 * Shows a transparent, isolated watch — the high-fidelity SVG dial by default,
 * or an `<img>` you provide at `imageSrc`. Each motion runs on its own nested
 * layer so transforms never collide:
 *   camera  → subtle simulated camera drift (scale + pan breathing)
 *   scroll  → ScrollTrigger-driven rotation + scale (scrub) when scrollDriven
 *   parallax→ mouse parallax (translate + 3D tilt)
 *   float   → gentle bob + slow dimensional rotation
 */
export function HeroWatch({
  mat,
  dialType,
  imageSrc,
  className = "",
  widthClass = "w-[80%] max-w-[560px]",
  scrollDriven = false,
}: {
  mat: ThreeMaterial;
  dialType?: DialType;
  imageSrc?: string;
  className?: string;
  widthClass?: string;
  scrollDriven?: boolean;
}) {
  const cameraEl = useRef<HTMLDivElement>(null);
  const scrollRotEl = useRef<HTMLDivElement>(null);
  const parallax = useRef<HTMLDivElement>(null);
  const floatEl = useRef<HTMLDivElement>(null);
  const sheen = useRef<HTMLDivElement>(null);
  const [imgOk, setImgOk] = useState(Boolean(imageSrc));

  useEffect(() => {
    registerGsap();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const ctx = gsap.context(() => {
      // Idle motion runs on GSAP's rAF ticker → matches the display's refresh
      // rate automatically (120Hz → 120fps, 60Hz → 60fps; never forced).
      // force3D promotes each layer to its own GPU compositor layer.

      // FLOAT — subtle vertical bob
      gsap.to(floatEl.current, {
        y: "+=12",
        duration: 4,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        force3D: true,
      });
      // CONTINUOUS SLOW ROTATION — gentle dimensional turn (never a flat spin)
      gsap.fromTo(
        floatEl.current,
        { rotateY: -6 },
        { rotateY: 6, duration: 9, ease: "sine.inOut", yoyo: true, repeat: -1, force3D: true }
      );

      // SUBTLE CAMERA MOVEMENT — simulated slow push-in + pan breathing
      gsap.to(cameraEl.current, {
        scale: 1.028,
        duration: 8,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        force3D: true,
      });
      gsap.fromTo(
        cameraEl.current,
        { xPercent: -1.4, yPercent: 1.2 },
        { xPercent: 1.4, yPercent: -1.2, duration: 11, ease: "sine.inOut", yoyo: true, repeat: -1, force3D: true }
      );

      // SCROLL — different angle + slight scale, damped via scrub (upward move
      // is handled on the wrapper). scrub adds inertia/damping for smoothness.
      if (scrollDriven) {
        const section = parallax.current?.closest("section");
        if (section) {
          gsap.fromTo(
            scrollRotEl.current,
            { rotateY: 0, scale: 1 },
            {
              rotateY: -16,
              scale: 1.1,
              ease: "none",
              force3D: true,
              scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: 1.2 },
            }
          );
        }
      }

      // animated highlight sweeping across the watch surface
      if (sheen.current) {
        gsap.set(sheen.current, { xPercent: -140, opacity: 0 });
        gsap
          .timeline({ repeat: -1, repeatDelay: 2.6 })
          .to(sheen.current, { opacity: 1, duration: 0.4 })
          .to(sheen.current, { xPercent: 140, duration: 2.4, ease: "power2.inOut" }, 0)
          .to(sheen.current, { opacity: 0, duration: 0.5 }, 2.1);
      }
    });

    // MOUSE PARALLAX (fine pointers only), eased
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const xTo = gsap.quickTo(parallax.current, "x", { duration: 0.9, ease: "power3" });
    const yTo = gsap.quickTo(parallax.current, "y", { duration: 0.9, ease: "power3" });
    const ryTo = gsap.quickTo(parallax.current, "rotationY", { duration: 0.9, ease: "power3" });
    const rxTo = gsap.quickTo(parallax.current, "rotationX", { duration: 0.9, ease: "power3" });

    const onMove = (e: MouseEvent) => {
      if (!fine) return;
      const px = e.clientX / window.innerWidth - 0.5;
      const py = e.clientY / window.innerHeight - 0.5;
      xTo(px * 22);
      yTo(py * 16);
      ryTo(px * 9);
      rxTo(-py * 9);
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      ctx.revert();
    };
  }, [scrollDriven]);

  return (
    <div className={`relative grid h-full w-full place-items-center ${className}`} style={{ perspective: 1100 }}>
      {/* camera drift layer */}
      <div ref={cameraEl} className="relative" style={{ transformStyle: "preserve-3d", willChange: "transform" }}>
        {/* scroll rotation + scale layer */}
        <div ref={scrollRotEl} style={{ transformStyle: "preserve-3d", willChange: "transform" }}>
          {/* mouse parallax layer */}
          <div ref={parallax} className={`relative ${widthClass}`} style={{ transformStyle: "preserve-3d", willChange: "transform" }}>
            {/* soft ground shadow (stays put while the watch floats) */}
            <div
              className="pointer-events-none absolute inset-x-[12%] -bottom-[3%] h-10 rounded-[50%] blur-2xl"
              style={{ background: "rgba(0,0,0,0.5)" }}
              aria-hidden
            />
            {/* float + slow rotation layer */}
            <div ref={floatEl} className="relative will-change-transform" style={{ transformStyle: "preserve-3d" }}>
              {imageSrc && imgOk ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imageSrc}
                  alt="Featured timepiece"
                  draggable={false}
                  onError={() => setImgOk(false)}
                  className="h-auto w-full select-none"
                  style={{ filter: "drop-shadow(0 34px 44px rgba(0,0,0,0.45))" }}
                />
              ) : (
                <WatchDial mat={mat} dialType={dialType} className="h-auto w-full drop-shadow-2xl" />
              )}

              {/* animated sheen — clipped to the round watch so no rectangle shows */}
              <div
                ref={sheen}
                className="pointer-events-none absolute inset-0"
                aria-hidden
                style={{
                  background:
                    "linear-gradient(100deg, transparent 42%, rgba(255,255,255,0.4) 50%, transparent 58%)",
                  mixBlendMode: "overlay",
                  maskImage: "radial-gradient(circle at 50% 50%, #000 47%, transparent 52%)",
                  WebkitMaskImage: "radial-gradient(circle at 50% 50%, #000 47%, transparent 52%)",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
