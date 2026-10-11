import { cameraAt, JourneyViewport, projectionWidth } from "../journeyCamera";
import { waterPoint } from "../waterGeometry";

// Intentional, repeatable world positions, not viewport percentages or random values.
export const WATER_SWANS = [
  { id: "alpha", x: -0.18, z: 4.85, size: 0.28, facing: 1, period: 6400, offset: 0, amplitude: 1.8 },
  { id: "beta", x: 0.22, z: 6.10, size: 0.23, facing: -1, period: 7600, offset: 1.0, amplitude: 1.4 },
] as const;
export type SwanPlacement = typeof WATER_SWANS[number];
export const SWAN_ART_WIDTH = 208;
export const SWAN_ART_HEIGHT = 140;

export function projectSwan(swan: SwanPlacement, progress: number, viewport: JourneyViewport) {
  "worklet";
  const distance = swan.z - cameraAt(progress, viewport).z;
  const point = waterPoint(swan.x, swan.z, progress, viewport);
  const width = projectionWidth(viewport) * swan.size / Math.max(0.3, distance);
  const scale = width / SWAN_ART_WIDTH;
  const top = point.y - SWAN_ART_HEIGHT * scale - swan.amplitude;
  const visible = distance > 0.3 && top < viewport.height && point.y + width * 0.12 > 0
    && point.x + width * 0.65 > 0 && point.x - width * 0.65 < viewport.width;
  return { ...point, width, scale, visible };
}