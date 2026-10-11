import { StyleSheet } from "react-native";
import Svg, { Circle, Defs, LinearGradient, Path, Rect, Stop } from "react-native-svg";
import Animated, { SharedValue, useAnimatedProps } from "react-native-reanimated";
import { colors } from "@/src/theme";
import { cameraAt, groundPoint, JourneyViewport, projectionWidth } from "./journeyCamera";
import { ReflectingWater } from "./ReflectingWater";

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedRect = Animated.createAnimatedComponent(Rect);
type Props = { progress: SharedValue<number>; viewport: JourneyViewport; active?: SharedValue<boolean> };

function Pond({ progress, viewport, side }: Props & { side: -1 | 1 }) {
  const shape = useAnimatedProps(() => {
    const cam = cameraAt(progress.value, viewport);
    const near = Math.max(0.2, cam.z + 0.3);
    if (near >= 5.4) return { d: "M0 0Z" };
    const a = groundPoint(side * 1.8, 5.4, progress.value, viewport);
    const b = groundPoint(side * 4.8, 5.4, progress.value, viewport);
    const c = groundPoint(side * 4.8, near, progress.value, viewport);
    const d = groundPoint(side * 1.8, near, progress.value, viewport);
    return { d: `M${a.x} ${a.y} L${b.x} ${b.y} L${c.x} ${c.y} L${d.x} ${d.y}Z` };
  });
  return <AnimatedPath animatedProps={shape} fill={colors.pondWater} stroke={colors.paperStoneShade} strokeWidth={7} />;
}

export function VenueFloor({ progress, viewport, active }: Props) {
  const ground = useAnimatedProps(() => {
    const y = Math.max(0, cameraAt(progress.value, viewport).horizon);
    return { y, height: viewport.height - y };
  });
  const tiles = useAnimatedProps(() => {
    const cam = cameraAt(progress.value, viewport);
    let d = "";
    for (let z = -3; z <= 24; z += 1.2) {
      if (z <= cam.z + 0.35) continue;
      const worldEdge = Math.max(12, viewport.width / projectionWidth(viewport) * 16);
      const left = groundPoint(-worldEdge, z, progress.value, viewport);
      const right = groundPoint(worldEdge, z, progress.value, viewport);
      d += `M${left.x} ${left.y} L${right.x} ${right.y} `;
    }
    for (let x = -8; x <= 8; x += 1) {
      const far = groundPoint(x, 28, progress.value, viewport);
      const near = groundPoint(x, cam.z + 0.35, progress.value, viewport);
      d += `M${far.x} ${far.y} L${near.x} ${near.y} `;
    }
    return { d };
  });
  const aisle = useAnimatedProps(() => {
    const camera = cameraAt(progress.value, viewport);
    const a = groundPoint(-0.95, 20, progress.value, viewport);
    const b = groundPoint(0.95, 20, progress.value, viewport);
    const c = groundPoint(0.95, camera.z + 0.3, progress.value, viewport);
    const d = groundPoint(-0.95, camera.z + 0.3, progress.value, viewport);
    return { d: `M${a.x} ${a.y} L${b.x} ${b.y} L${c.x} ${c.y} L${d.x} ${d.y}Z` };
  });
  return <Svg testID="venue-ground-plane" style={styles.floor} width="100%" height="100%" viewBox={`0 0 ${viewport.width} ${viewport.height}`} preserveAspectRatio="none">
    <Defs><LinearGradient id="courtyard-sky" x1="0" y1="0" x2="0" y2="1"><Stop offset="0" stopColor={colors.surfaceSecondary} /><Stop offset="1" stopColor={colors.surfaceTertiary} /></LinearGradient></Defs>
    <Rect width={viewport.width} height={viewport.height} fill="url(#courtyard-sky)" />
    <Circle cx={viewport.centerX ?? viewport.width / 2} cy={viewport.height * 0.23} r={projectionWidth(viewport) * 0.38} fill={colors.goldSoft} opacity="0.12" />
    <AnimatedRect animatedProps={ground} x={0} width={viewport.width} fill={colors.paperStone} />
    <AnimatedPath animatedProps={aisle} fill={colors.surfaceSecondary} stroke={colors.gold} strokeWidth={1} />
    <AnimatedPath animatedProps={tiles} stroke={colors.paperStoneShade} strokeWidth={0.7} opacity={0.55} fill="none" />
    <Pond {...{ progress, viewport }} side={-1} /><Pond {...{ progress, viewport }} side={1} />
    <ReflectingWater {...{ progress, viewport, active }} />
  </Svg>;
}

const styles = StyleSheet.create({ floor: { ...StyleSheet.absoluteFill, pointerEvents: "none" } });