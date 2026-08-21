"use client";

import { useMemo } from "react";
import * as THREE from "three";
import type { ThreeMaterial } from "@/lib/products";

/**
 * Procedural, dimensional luxury watch built from primitives.
 *
 * To use a real model instead, drop a `.glb` in /public/models and swap the
 * body of <WatchModel> for:
 *
 *   const { scene } = useGLTF("/models/watch.glb");
 *   return <primitive object={scene} />;
 *
 * The surrounding Canvas (lighting, env, shadows, interaction) needs no change.
 */

type Props = { mat: ThreeMaterial };

const DEG = Math.PI / 180;

/** true when the dial is a light colour (white/silver) — for contrast choices. */
function isLightDial(hex: string): boolean {
  const m = hex.replace("#", "");
  if (m.length !== 6) return false;
  const r = parseInt(m.slice(0, 2), 16);
  const g = parseInt(m.slice(2, 4), 16);
  const b = parseInt(m.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6;
}

export function WatchModel({ mat }: Props) {
  const caseMat = useMemo(
    () =>
      ({
        color: mat.case,
        metalness: mat.metalness,
        roughness: Math.max(0.08, mat.roughness * 0.8), // higher polish
        envMapIntensity: 1.7,
      }) as const,
    [mat.case, mat.metalness, mat.roughness]
  );

  const bezelColor = mat.bezel;
  const isTachy = mat.bezelStyle === "tachy";

  // 12 applied hour markers
  const markers = useMemo(() => {
    const arr: { pos: [number, number, number]; rot: number; long: boolean }[] = [];
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      const r = 0.6;
      arr.push({
        pos: [Math.sin(a) * r, Math.cos(a) * r, 0.19],
        rot: -a,
        long: i % 3 === 0,
      });
    }
    return arr;
  }, []);

  // bezel notches (coin / fluted edge)
  const notches = useMemo(() => {
    if (mat.bezelStyle !== "coin" && mat.bezelStyle !== "fluted") return [];
    const count = mat.bezelStyle === "fluted" ? 60 : 44;
    const arr: { pos: [number, number, number]; rot: number }[] = [];
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2;
      const r = 0.96;
      arr.push({ pos: [Math.sin(a) * r, Math.cos(a) * r, 0.13], rot: -a });
    }
    return arr;
  }, [mat.bezelStyle]);

  // chronograph subdials for tachymetric (Daytona-style)
  const subdials = useMemo(() => {
    if (!isTachy) return [];
    return [
      [0, 0.34, 0.185],
      [-0.32, -0.18, 0.185],
      [0.32, -0.18, 0.185],
    ] as [number, number, number][];
  }, [isTachy]);

  return (
    <group rotation={[0, 0, 0]}>
      {/* ---------- CASE ---------- */}
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.02, 1.05, 0.34, 96]} />
        <meshStandardMaterial {...caseMat} />
      </mesh>

      {/* caseback bevel */}
      <mesh position={[0, 0, -0.17]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.9, 1.02, 0.06, 96]} />
        <meshStandardMaterial {...caseMat} roughness={mat.roughness + 0.1} />
      </mesh>

      {/* ---------- BEZEL ---------- */}
      <mesh position={[0, 0, 0.12]} castShadow>
        <torusGeometry args={[0.9, 0.11, 24, 96]} />
        <meshStandardMaterial
          color={bezelColor}
          metalness={mat.bezelStyle === "smooth" || mat.bezelStyle === "fluted" ? 1 : 0.55}
          roughness={mat.bezelStyle === "coin" || mat.bezelStyle === "tachy" ? 0.42 : mat.roughness}
          envMapIntensity={1.2}
        />
      </mesh>

      {/* bezel edge notches */}
      {notches.map((n, i) => (
        <mesh key={i} position={n.pos} rotation={[0, 0, n.rot]}>
          <boxGeometry args={[0.02, 0.12, 0.16]} />
          <meshStandardMaterial color={mat.case} metalness={1} roughness={mat.roughness} envMapIntensity={1.3} />
        </mesh>
      ))}

      {/* ---------- DIAL ---------- */}
      <mesh position={[0, 0, 0.14]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.8, 0.8, 0.04, 96]} />
        <meshPhysicalMaterial
          color={mat.dial}
          metalness={0.5}
          roughness={0.38}
          clearcoat={0.8}
          clearcoatRoughness={0.28}
          envMapIntensity={1.0}
        />
      </mesh>
      {/* dial sunburst ring */}
      <mesh position={[0, 0, 0.162]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.74, 0.8, 96]} />
        <meshStandardMaterial color={mat.dial} metalness={0.6} roughness={0.35} side={THREE.DoubleSide} />
      </mesh>

      {/* chronograph subdials — contrasting counters (champagne on dark dials) */}
      {subdials.map((p, i) => (
        <mesh key={i} position={p} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.16, 0.16, 0.011, 48]} />
          <meshStandardMaterial
            color={isLightDial(mat.dial) ? "#2b2b28" : "#d3c193"}
            metalness={0.45}
            roughness={0.5}
            envMapIntensity={0.9}
          />
        </mesh>
      ))}

      {/* ---------- HOUR MARKERS ---------- */}
      {markers.map((m, i) => (
        <mesh key={i} position={m.pos} rotation={[0, 0, m.rot]} castShadow>
          <boxGeometry args={[m.long ? 0.07 : 0.05, m.long ? 0.16 : 0.1, 0.03]} />
          <meshStandardMaterial color={mat.hands} metalness={1} roughness={0.2} envMapIntensity={1.4} />
        </mesh>
      ))}

      {/* ---------- HANDS (set to a poised 10:10:38) ---------- */}
      <group position={[0, 0, 0.2]}>
        {/* hour */}
        <group rotation={[0, 0, -60 * DEG]}>
          <mesh position={[0, 0.2, 0]} castShadow>
            <boxGeometry args={[0.045, 0.42, 0.02]} />
            <meshStandardMaterial color={mat.hands} metalness={1} roughness={0.22} envMapIntensity={1.4} />
          </mesh>
        </group>
        {/* minute */}
        <group rotation={[0, 0, 60 * DEG]}>
          <mesh position={[0, 0.3, 0.01]} castShadow>
            <boxGeometry args={[0.035, 0.6, 0.02]} />
            <meshStandardMaterial color={mat.hands} metalness={1} roughness={0.22} envMapIntensity={1.4} />
          </mesh>
        </group>
        {/* second */}
        <group rotation={[0, 0, 128 * DEG]}>
          <mesh position={[0, 0.34, 0.03]}>
            <boxGeometry args={[0.014, 0.72, 0.014]} />
            <meshStandardMaterial color={mat.bezelStyle === "tachy" ? "#c9a86a" : mat.hands} metalness={1} roughness={0.3} />
          </mesh>
          <mesh position={[0, -0.14, 0.03]}>
            <boxGeometry args={[0.03, 0.2, 0.014]} />
            <meshStandardMaterial color={mat.bezelStyle === "tachy" ? "#c9a86a" : mat.hands} metalness={1} roughness={0.3} />
          </mesh>
        </group>
        {/* center cap */}
        <mesh position={[0, 0, 0.05]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.05, 24]} />
          <meshStandardMaterial color={mat.hands} metalness={1} roughness={0.2} />
        </mesh>
      </group>

      {/* ---------- CRYSTAL (domed sapphire) ---------- */}
      <mesh position={[0, 0, 0.24]} rotation={[Math.PI / 2, 0, 0]}>
        <sphereGeometry args={[0.82, 48, 48, 0, Math.PI * 2, 0, Math.PI * 0.28]} />
        <meshPhysicalMaterial
          transparent
          transmission={0.92}
          thickness={0.4}
          roughness={0.02}
          ior={1.5}
          clearcoat={1}
          reflectivity={0.5}
          opacity={1}
          color="#ffffff"
        />
      </mesh>

      {/* ---------- CROWN + guard (3 o'clock) ---------- */}
      <group position={[1.06, 0, 0.02]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.075, 0.075, 0.12, 24]} />
          <meshStandardMaterial color={mat.case} metalness={1} roughness={mat.roughness} envMapIntensity={1.3} />
        </mesh>
      </group>

      {/* ---------- LUGS + short bracelet hint ---------- */}
      {[1, -1].map((s) => (
        <group key={s}>
          {/* two lugs top/bottom */}
          {[0.5, -0.5].map((x) => (
            <mesh key={x} position={[x, 1.02 * s, 0]} castShadow>
              <boxGeometry args={[0.24, 0.28, 0.34]} />
              <meshStandardMaterial color={mat.case} metalness={1} roughness={mat.roughness} envMapIntensity={1.2} />
            </mesh>
          ))}
          {/* bracelet links */}
          {[0, 1].map((k) => (
            <mesh key={k} position={[0, (1.26 + k * 0.32) * s, -0.02]} castShadow receiveShadow>
              <boxGeometry args={[0.98 - k * 0.08, 0.26, 0.16]} />
              <meshStandardMaterial color={mat.case} metalness={1} roughness={mat.roughness + 0.04} envMapIntensity={1.1} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}
