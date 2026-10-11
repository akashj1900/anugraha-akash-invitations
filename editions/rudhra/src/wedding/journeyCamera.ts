// Shared camera for BOTH buildings and paving. Ground contact is a world point,
// not an independently animated screen offset, so objects cannot hover/drift.
export type JourneyViewport = { width: number; height: number; centerX?: number };
export const CAMERA_START = -4;
export const CAMERA_END = 7.2;
export const MANDAP_DEPTH = 8.5;
export const MANDAP_WIDTH = 0.31;
export const MANDAP_ASPECT = 715 / 745;

// The canvas fills the screen; a separate focal length keeps the paper art
// proportional on ultrawide/landscape screens instead of scaling to their width.
export function projectionWidth(viewport: JourneyViewport) {
  "worklet";
  return Math.min(viewport.width, viewport.height * 0.52);
}

export function smoothRange(value: number, start: number, end: number) {
  "worklet";
  const t = Math.max(0, Math.min(1, (value - start) / (end - start)));
  return t * t * (3 - 2 * t);
}

export function cameraAt(progress: number, viewport: JourneyViewport) {
  "worklet";
  const z = CAMERA_START + (CAMERA_END - CAMERA_START) * progress;
  const heightProjection = viewport.height * 0.62;
  const focal = projectionWidth(viewport);
  const mandapHeight = focal * MANDAP_WIDTH / MANDAP_ASPECT * MANDAP_DEPTH;
  // Look toward the seated couple while approaching, not toward empty sky.
  const horizon = viewport.height * 0.4 - (heightProjection - mandapHeight * 0.28) / (MANDAP_DEPTH - z);
  const shrineLook = smoothRange(progress, 0.28, 0.45) * (1 - smoothRange(progress, 0.58, 0.77));
  return { z, horizon, heightProjection, centerX: (viewport.centerX ?? viewport.width / 2) + focal * shrineLook * 0.17 };
}

export function groundPoint(worldX: number, worldZ: number, progress: number, viewport: JourneyViewport) {
  "worklet";
  const camera = cameraAt(progress, viewport);
  const distance = Math.max(0.3, worldZ - camera.z);
  return {
    x: camera.centerX + worldX * projectionWidth(viewport) / distance,
    y: camera.horizon + camera.heightProjection / distance,
  };
}