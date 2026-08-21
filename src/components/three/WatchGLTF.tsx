"use client";

import { useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

/**
 * Loads a real watch model via useGLTF and frames it to match the procedural
 * watch (auto-centered + scaled to a target size, shadows + reflections on).
 *
 * Drop a model at `public/models/luxury_watch.glb` and it renders here.
 * If the file is absent or fails to load, <ModelErrorBoundary> swaps in the
 * procedural <WatchModel> instead — nothing breaks.
 */
export function WatchGLTF({
  url,
  targetSize = 2.6,
  rotation = [0, 0, 0],
  recolor = "none",
  caseColor = "#d8b24c",
  dialColor = "#125236",
}: {
  url: string;
  targetSize?: number;
  rotation?: [number, number, number];
  /** "goldGreen" tints metals → gold and non-metal surfaces → green to match the site. */
  recolor?: "none" | "goldGreen";
  caseColor?: string;
  dialColor?: string;
}) {
  const { scene } = useGLTF(url);

  const { object, scale, center } = useMemo(() => {
    const object = scene.clone(true);
    const box = new THREE.Box3().setFromObject(object);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const scale = targetSize / maxDim;

    const gold = new THREE.Color(caseColor);
    const green = new THREE.Color(dialColor);

    object.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      // clone material so we never mutate a shared/cached one
      const src = mesh.material as THREE.MeshStandardMaterial | THREE.MeshStandardMaterial[];
      const mats = Array.isArray(src) ? src : [src];
      mesh.material = mats.map((m) => {
        if (!m) return m;
        const mat = m.clone() as THREE.MeshStandardMaterial;
        if ("envMapIntensity" in mat) mat.envMapIntensity = 1.35;
        if (recolor === "goldGreen" && "metalness" in mat) {
          const metallic = (mat.metalness ?? 0) >= 0.55;
          if (metallic) {
            mat.color.copy(gold);
            mat.metalness = 1;
            mat.roughness = Math.min(mat.roughness ?? 0.3, 0.28);
          } else {
            mat.color.copy(green);
          }
          if (mat.map) mat.map = null; // drop baked-in branded textures when recoloring
        }
        mat.needsUpdate = true;
        return mat;
      });
      mesh.material = Array.isArray(src) ? (mesh.material as THREE.Material[]) : (mesh.material as THREE.Material[])[0];
    });

    return { object, scale, center };
  }, [scene, targetSize, recolor, caseColor, dialColor]);

  return (
    <group scale={scale} rotation={rotation}>
      <primitive object={object} position={[-center.x, -center.y, -center.z]} />
    </group>
  );
}

// Preload only when explicitly asked (after an existence check) to avoid 404s.
export const preloadWatch = (url: string) => useGLTF.preload(url);
