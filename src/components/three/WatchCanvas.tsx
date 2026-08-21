"use client";

import { Suspense, useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, ContactShadows, AdaptiveDpr, PerformanceMonitor } from "@react-three/drei";
import * as THREE from "three";
import { WatchModel } from "./WatchModel";
import { WatchGLTF } from "./WatchGLTF";
import { ModelErrorBoundary } from "./ModelErrorBoundary";
import type { ScrollDriver } from "./scrollDriver";
import type { ThreeMaterial } from "@/lib/products";

type Props = {
  mat: ThreeMaterial;
  interactive?: boolean;
  autoRotate?: boolean;
  spinSpeed?: number;
  className?: string;
  /** Optional GLTF model URL; falls back to the procedural watch if it fails. */
  modelUrl?: string;
  /** GSAP-driven scroll state: adds rotation (radians) and multiplies scale. */
  scroll?: React.RefObject<ScrollDriver | null>;
  /** Recolor a loaded GLTF to the site's gold/green palette. */
  recolor?: "none" | "goldGreen";
};

/** The watch group: auto-rotation, gentle float, pointer parallax + scroll drive. */
function Stage({
  mat,
  interactive = true,
  autoRotate = true,
  spinSpeed = 0.35,
  modelUrl,
  scroll,
  recolor = "none",
}: {
  mat: ThreeMaterial;
  interactive?: boolean;
  autoRotate?: boolean;
  spinSpeed?: number;
  modelUrl?: string;
  scroll?: React.RefObject<ScrollDriver | null>;
  recolor?: "none" | "goldGreen";
}) {
  const group = useRef<THREE.Group>(null);
  const spin = useRef(0); // continuous auto-rotation accumulator
  const { pointer } = useThree();
  const reduce = useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );
  // camera base (matches the Canvas camera prop) + a reusable target vector
  const baseCam = useMemo(() => new THREE.Vector3(0, 0.1, 6.2), []);
  const camTarget = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    const s = scroll?.current;

    if (autoRotate && !reduce) {
      spin.current += delta * spinSpeed;
    }
    // base auto-rotation + scroll-driven rotation
    g.rotation.y = spin.current + (s ? s.rotate : 0);

    // scroll-driven scale, eased for smoothness
    const targetScale = s ? s.scale : 1;
    g.scale.setScalar(THREE.MathUtils.lerp(g.scale.x, targetScale, 0.1));

    // gentle float
    const floatY = reduce ? 0 : Math.sin(t * 0.8) * 0.05;
    g.position.y = floatY;

    // pointer parallax (subtle tilt toward cursor), eased
    if (interactive && !reduce) {
      const targetX = pointer.y * 0.14;
      const targetZ = pointer.x * -0.05;
      g.rotation.x += (targetX - g.rotation.x) * 0.05;
      g.rotation.z += (targetZ - g.rotation.z) * 0.05;
    }

    // ---- cinematic camera: scroll dolly/crane/pan + pointer parallax ----
    const px = interactive && !reduce ? pointer.x * 0.4 : 0;
    const py = interactive && !reduce ? pointer.y * 0.28 : 0;
    camTarget.set(
      baseCam.x + (s ? s.camX : 0) + px,
      baseCam.y + (s ? s.camY : 0) + py,
      baseCam.z + (s ? s.camZ : 0)
    );
    state.camera.position.lerp(camTarget, 0.06);
    state.camera.lookAt(0, 0, 0); // keep the watch framed as the camera moves
  });

  return (
    <group ref={group} scale={1}>
      {modelUrl ? (
        <ModelErrorBoundary fallback={<WatchModel mat={mat} />}>
          <WatchGLTF url={modelUrl} recolor={recolor} caseColor={mat.case} dialColor={mat.dial} />
        </ModelErrorBoundary>
      ) : (
        <WatchModel mat={mat} />
      )}
    </group>
  );
}

export default function WatchCanvas({
  mat,
  interactive = true,
  autoRotate = true,
  spinSpeed = 0.35,
  className = "",
  modelUrl,
  scroll,
  recolor = "none",
}: Props) {
  return (
    <Canvas
      className={className}
      shadows
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0.1, 6.2], fov: 32 }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
      }}
    >
      <PerformanceMonitor />
      <AdaptiveDpr pixelated={false} />

      {/* Lighting rig */}
      <ambientLight intensity={0.35} />
      <directionalLight
        position={[4, 6, 5]}
        intensity={2.4}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0004}
      />
      <directionalLight position={[-5, 2, -4]} intensity={1.1} color="#cfe0ff" />
      <spotLight position={[0, 3, 4]} angle={0.5} penumbra={1} intensity={1.2} />

      <Suspense fallback={null}>
        <Stage mat={mat} interactive={interactive} autoRotate={autoRotate} spinSpeed={spinSpeed} modelUrl={modelUrl} scroll={scroll} recolor={recolor} />

        {/* Self-contained studio environment for metallic reflections (no external HDR) */}
        <Environment resolution={512}>
          {/* large soft key overhead */}
          <Lightformer intensity={3} form="rect" position={[0, 4, 3]} scale={[8, 4, 1]} color="#ffffff" />
          {/* bright horizontal streak that sweeps across polished metal */}
          <Lightformer intensity={4} form="rect" position={[0, 1.5, 4]} scale={[10, 0.4, 1]} color="#ffffff" />
          {/* cool + warm side softboxes for depth */}
          <Lightformer intensity={2} form="rect" position={[-5, 1, 2]} scale={[3, 5, 1]} color="#cfe0ff" />
          <Lightformer intensity={2.2} form="rect" position={[5, 0.5, 2]} scale={[3, 5, 1]} color="#fff0d6" />
          {/* subtle rim from behind */}
          <Lightformer intensity={1.4} form="ring" position={[0, -2, -4]} scale={[5, 5, 1]} color="#ffffff" />
          <Lightformer intensity={1} form="rect" position={[0, -3, 2]} scale={[6, 2, 1]} color="#a9b6c8" />
        </Environment>

        <ContactShadows
          position={[0, -1.85, 0]}
          opacity={0.5}
          scale={9}
          blur={2.6}
          far={4}
          resolution={512}
          color="#000000"
        />
      </Suspense>
    </Canvas>
  );
}
