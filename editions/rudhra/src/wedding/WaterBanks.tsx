import { G, Path } from "react-native-svg";
import Animated, { SharedValue, useAnimatedProps } from "react-native-reanimated";
import { colors } from "@/src/theme";
import { cameraAt, groundPoint, JourneyViewport } from "./journeyCamera";
import { BANK_HALF_WIDTH, SHRINE_PLATFORM, surfaceQuad, WATER_END, WATER_HALF_WIDTH, WATER_START, waterPoint } from "./waterGeometry";

const AnimatedPath = Animated.createAnimatedComponent(Path);
export type WaterProps = { progress: SharedValue<number>; viewport: JourneyViewport; active?: SharedValue<boolean> };

function Bank({ progress, viewport, side }: WaterProps & { side: -1 | 1 }) {
  const top = useAnimatedProps(() => ({ d: surfaceQuad(side * BANK_HALF_WIDTH, side * WATER_HALF_WIDTH, WATER_START, WATER_END, progress.value, viewport) }));
  const wall = useAnimatedProps(() => {
    const p = progress.value;
    const z = Math.max(WATER_START, cameraAt(p, viewport).z + 0.3);
    if (z >= WATER_END) return { d: "M0 0Z" };
    const x = side * WATER_HALF_WIDTH;
    const a = groundPoint(x, WATER_END, p, viewport), b = waterPoint(x, WATER_END, p, viewport);
    const c = waterPoint(x, z, p, viewport), d = groundPoint(x, z, p, viewport);
    return { d: `M${a.x} ${a.y} L${b.x} ${b.y} L${c.x} ${c.y} L${d.x} ${d.y}Z` };
  });
  return <G testID={`canal-stone-bank-${side === -1 ? "left" : "right"}`}>
    <AnimatedPath animatedProps={wall} fill={side === -1 ? colors.waterShadow : colors.paperStoneShade} />
    <AnimatedPath animatedProps={top} fill={colors.surfaceTertiary} stroke={colors.goldSoft} strokeWidth={0.8} />
  </G>;
}

function Landing({ progress, viewport, id, left, right, near, far }: WaterProps & { id: string; left: number; right: number; near: number; far: number }) {
  const outline = useAnimatedProps(() => ({ d: surfaceQuad(left, right, near, far, progress.value, viewport) }));
  const inset = useAnimatedProps(() => ({ d: surfaceQuad(left + 0.06, right - 0.06, near + 0.06, far - 0.06, progress.value, viewport) }));
  return <G testID={id}>
    <AnimatedPath animatedProps={outline} fill={colors.paperStoneShade} stroke={colors.paperStoneShade} strokeWidth={1.5} />
    <AnimatedPath animatedProps={inset} fill={colors.surfaceTertiary} stroke={colors.goldSoft} strokeWidth={0.8} />
  </G>;
}

export function WaterBanks(props: WaterProps) {
  return <G>
    <Bank {...props} side={-1} /><Bank {...props} side={1} />
    <Landing {...props} id="ganpati-dry-platform" {...SHRINE_PLATFORM} />
    <Landing {...props} id="mandap-dry-landing" left={-1.76} right={1.76} near={7.94} far={8.95} />
    <Landing {...props} id="gate-dry-threshold" left={-1.04} right={1.04} near={3.18} far={3.43} />
  </G>;
}