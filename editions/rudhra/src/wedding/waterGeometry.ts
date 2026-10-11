import { cameraAt, groundPoint, JourneyViewport, projectionWidth } from "./journeyCamera";

// The gate is at Z=3.15, the mandap at 8.5. Neither is inside the pool.
export const WATER_START = 3.48;
export const WATER_END = 7.90;
export const WATER_HALF_WIDTH = 0.68;
export const BANK_HALF_WIDTH = 0.86;
export const WATER_DROP = 0.045;
export const SHRINE_PLATFORM = { left: -3.10, right: -0.92, near: 5.80, far: 7.08 };
export const FLOATING_LOTUSES = [
  { x: -0.24, z: 4.25, size: 0.25 },
  { x: 0.27, z: 5.45, size: 0.22 },
  { x: -0.20, z: 6.65, size: 0.24 },
  { x: 0.23, z: 7.38, size: 0.21 },
];

export function waterPoint(x: number, z: number, p: number, viewport: JourneyViewport) {
  "worklet";
  const point = groundPoint(x, z, p, viewport);
  const distance = Math.max(0.3, z - cameraAt(p, viewport).z);
  return { x: point.x, y: point.y + projectionWidth(viewport) * WATER_DROP / distance };
}

export function surfaceQuad(left: number, right: number, near: number, far: number,
  p: number, viewport: JourneyViewport, water = false) {
  "worklet";
  const z = Math.max(near, cameraAt(p, viewport).z + 0.3);
  if (z >= far) return "M0 0Z";
  const point = water ? waterPoint : groundPoint;
  const a = point(left, far, p, viewport);
  const b = point(right, far, p, viewport);
  const c = point(right, z, p, viewport);
  const d = point(left, z, p, viewport);
  return `M${a.x} ${a.y} L${b.x} ${b.y} L${c.x} ${c.y} L${d.x} ${d.y}Z`;
}