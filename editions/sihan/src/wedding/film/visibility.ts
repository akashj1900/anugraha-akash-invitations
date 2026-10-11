/** Any positive overlap counts. Merely touching an edge is still offscreen. */
export function intersectsViewport(top: number, height: number, scroll: number, viewport: number) {
  'worklet';
  return height > 0 && viewport > 0 && top < scroll + viewport && top + height > scroll;
}