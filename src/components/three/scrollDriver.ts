/**
 * Bridge between GSAP (JS/DOM side) and the R3F render loop.
 * GSAP ScrollTrigger tweens the fields of this object; the watch's useFrame
 * reads them each frame to apply scroll-driven rotation, scale and camera move.
 */
export type ScrollDriver = {
  rotate: number; // added to auto-rotation (radians)
  scale: number; // multiplies watch scale
  camX: number; // camera pan (world units, added to base position)
  camY: number; // camera crane
  camZ: number; // camera dolly (negative = closer)
};

export const createScrollDriver = (): ScrollDriver => ({
  rotate: 0,
  scale: 1,
  camX: 0,
  camY: 0,
  camZ: 0,
});
