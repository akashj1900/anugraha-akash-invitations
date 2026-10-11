import { useEffect } from "react";
import { AccessibilityInfo, AppState } from "react-native";
import { Asset } from "expo-asset";
import { ClipPath, Defs, G, Image as SvgImage, LinearGradient, Path, Stop } from "react-native-svg";
import Animated, { cancelAnimation, Easing, SharedValue, useAnimatedProps, useAnimatedReaction, useDerivedValue, useReducedMotion, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";
import { colors } from "@/src/theme";
import { cameraAt } from "./journeyCamera";
import { WATER_BAND_COUNT, WATER_TEXTURE } from "./waterAssets";
import { FLOATING_LOTUSES, surfaceQuad, WATER_END, WATER_HALF_WIDTH, WATER_START, waterPoint } from "./waterGeometry";
import { WaterBanks, WaterProps } from "./WaterBanks";
import { WaterLotus } from "./WaterLotus";
import { WaterSwans } from "./WaterSwans";
import { usePreparedAsset } from "./ScenePreparation";

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedImage = Animated.createAnimatedComponent(SvgImage);
const WATER_URI = Asset.fromModule(WATER_TEXTURE).uri;
const BANDS = Array.from({ length: WATER_BAND_COUNT }, (_, index) => index);
type MotionProps = WaterProps & { phase: SharedValue<number> };

function useWaterPhase(progress: SharedValue<number>, active?: SharedValue<boolean>) {
  const phase = useSharedValue(0);
  const foreground = useSharedValue(AppState.currentState !== "background");
  const initialReduceMotion = useReducedMotion();
  const reduceMotion = useSharedValue(initialReduceMotion);
  useEffect(() => {
    let mounted = true;
    let preferenceChanged = false;
    const subscription = AppState.addEventListener("change", (state) => { foreground.value = state === "active"; });
    const preference = AccessibilityInfo.addEventListener("reduceMotionChanged", (enabled) => {
      preferenceChanged = true;
      reduceMotion.value = enabled;
    });
    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      if (mounted && !preferenceChanged) reduceMotion.value = enabled;
    }).catch(() => undefined);
    return () => { mounted = false; subscription.remove(); preference.remove(); cancelAnimation(phase); };
  }, [foreground, phase, reduceMotion]);
  useAnimatedReaction(() => foreground.value && progress.value < 1 && !reduceMotion.value && (active?.value ?? true), (active) => {
    cancelAnimation(phase);
    if (active) phase.value = withRepeat(withTiming(phase.value + Math.PI * 2, { duration: 10000, easing: Easing.linear }), -1, false);
  });
  return phase;
}

/** Spatial texture bands give water real perspective without WebGL/web-only APIs.
 * Every band clips the SAME cached source. No per-strip network requests.
 */
function WaterBand({ index, progress, viewport, phase }: MotionProps & { index: number }) {
  const { complete } = usePreparedAsset("svg-water-atlas");
  const projection = useDerivedValue(() => {
    const p = progress.value;
    const camera = cameraAt(p, viewport);
    const span = (WATER_END - WATER_START) / WATER_BAND_COUNT;
    const far = WATER_END - index * span;
    const near = Math.max(WATER_END - (index + 1) * span, camera.z + 0.3);
    if (near >= far) return { x: 0, y: 0, width: 0, height: 0, opacity: 0 };
    const a = waterPoint(-WATER_HALF_WIDTH, near, p, viewport);
    const b = waterPoint(WATER_HALF_WIDTH, near, p, viewport);
    const top = waterPoint(0, far, p, viewport);
    const shimmer = Math.sin(phase.value + index * 0.57) * 0.7;
    return { x: a.x - 1.5 + shimmer, y: top.y - 0.4, width: b.x - a.x + 3, height: a.y - top.y + 0.8, opacity: 1 };
  });
  const clipping = useAnimatedProps(() => {
    const { x, y, width, height } = projection.value;
    return { d: `M${x} ${y} h${width} v${height} h${-width}Z` };
  });
  const atlas = useAnimatedProps(() => {
    const { x, y, width, height, opacity } = projection.value;
    return { x, y: y - index * height, width, height: height * WATER_BAND_COUNT, opacity, href: WATER_URI };
  });
  const clipId = `water-atlas-band-${index}`;
  return <G>
    <Defs><ClipPath id={clipId}><AnimatedPath animatedProps={clipping} /></ClipPath></Defs>
    <G clipPath={`url(#${clipId})`}><AnimatedImage animatedProps={atlas} preserveAspectRatio="none" onLoad={complete} /></G>
  </G>;
}

function WaterGlints({ progress, viewport, phase }: MotionProps) {
  const waves = useAnimatedProps(() => {
    const camera = cameraAt(progress.value, viewport);
    let d = "";
    for (let i = 0; i < 18; i++) {
      const z = WATER_START + (i + 0.5) * (WATER_END - WATER_START) / 18 + Math.sin(phase.value + i) * 0.012;
      if (z <= camera.z + 0.3) continue;
      const start = -0.52 + Math.sin(i * 2.2) * 0.10;
      for (let j = 0; j <= 10; j++) {
        const x = start + j * 0.096;
        const point = waterPoint(x, z + Math.sin(j * 0.8 + phase.value + i) * 0.018, progress.value, viewport);
        d += `${j === 0 ? "M" : "L"}${point.x.toFixed(2)} ${point.y.toFixed(2)} `;
      }
    }
    return { d, opacity: 0.17 + 0.04 * Math.sin(phase.value) };
  });
  return <AnimatedPath testID="canal-moving-ripples" animatedProps={waves} fill="none" stroke={colors.waterLight} strokeWidth={0.8} strokeLinecap="round" />;
}

export function ReflectingWater({ progress, viewport, active }: WaterProps) {
  const phase = useWaterPhase(progress, active);
  const props = { progress, viewport, phase };
  const surface = useAnimatedProps(() => ({ d: surfaceQuad(-WATER_HALF_WIDTH, WATER_HALF_WIDTH, WATER_START, WATER_END, progress.value, viewport, true) }));
  return <G testID="reflecting-water-path" accessibilityLabel="A lotus-filled reflecting-water channel from the entrance to the dry mandap landing">
    <Defs>
      <ClipPath id="reflecting-canal-clip"><AnimatedPath animatedProps={surface} /></ClipPath>
      <LinearGradient id="canal-depth-glaze" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor={colors.waterShadow} stopOpacity="0.16" />
        <Stop offset="0.55" stopColor={colors.waterLight} stopOpacity="0.02" />
        <Stop offset="1" stopColor={colors.waterShadow} stopOpacity="0.07" />
      </LinearGradient>
    </Defs>
    <AnimatedPath testID="canal-water-surface" animatedProps={surface} fill={colors.pondDeep} />
    <G clipPath="url(#reflecting-canal-clip)">
      {BANDS.map((index) => <WaterBand key={index} index={index} {...props} />)}
      <AnimatedPath animatedProps={surface} fill="url(#canal-depth-glaze)" />
      <WaterGlints {...props} />
      {FLOATING_LOTUSES.map((lotus, index) => <WaterLotus key={index} {...props} lotus={lotus} index={index} />)}
      <WaterSwans {...{ progress, viewport, active }} />
    </G>
    <WaterBanks {...{ progress, viewport }} />
  </G>;
}