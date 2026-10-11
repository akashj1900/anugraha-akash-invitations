import { Asset } from "expo-asset";
import { Ellipse, G, Image as SvgImage, Path } from "react-native-svg";
import Animated, { SharedValue, useAnimatedProps } from "react-native-reanimated";
import { colors } from "@/src/theme";
import { JOURNEY_ART } from "./journeyAssets";
import { cameraAt, JourneyViewport, projectionWidth } from "./journeyCamera";
import { FLOATING_LOTUSES, waterPoint } from "./waterGeometry";
import { usePreparedAsset } from "./ScenePreparation";

const AnimatedImage = Animated.createAnimatedComponent(SvgImage);
const AnimatedEllipse = Animated.createAnimatedComponent(Ellipse);
const AnimatedPath = Animated.createAnimatedComponent(Path);
const LOTUS_URI = Asset.fromModule(JOURNEY_ART.waterLotus).uri;

type Props = { lotus: typeof FLOATING_LOTUSES[number]; index: number; progress: SharedValue<number>; phase: SharedValue<number>; viewport: JourneyViewport };

/** One bloom, a flat lily pad and soft concentric surface ripples, not a bouquet. */
export function WaterLotus({ lotus, index, progress, phase, viewport }: Props) {
  const { complete } = usePreparedAsset("svg-water-lotus");
  const layout = () => {
    "worklet";
    const distance = lotus.z - cameraAt(progress.value, viewport).z;
    const point = waterPoint(lotus.x, lotus.z, progress.value, viewport);
    const focal = projectionWidth(viewport);
    const w = Math.min(focal * 2, focal * lotus.size / Math.max(0.3, distance));
    return { ...point, w, opacity: distance > 0.3 ? 1 : 0 };
  };
  const bloom = useAnimatedProps(() => {
    const { x, y, w, opacity } = layout();
    const bob = Math.sin(phase.value + index * 1.7) * Math.min(1, w * 0.02);
    return { x: x - w / 2, y: y - w * 0.61 + bob, width: w, height: w * 0.68, opacity, href: LOTUS_URI };
  });
  const pad = useAnimatedProps(() => {
    const { x, y, w, opacity } = layout();
    return { d: `M${x} ${y} L${x - w * 0.25} ${y - w * 0.1} C${x - w} ${y - w * 0.12} ${x - w} ${y + w * 0.25} ${x} ${y + w * 0.2} C${x + w} ${y + w * 0.23} ${x + w} ${y - w * 0.16} ${x + w * 0.12} ${y - w * 0.12}Z`, opacity };
  });
  const ripple = useAnimatedProps(() => {
    const { x, y, w, opacity } = layout();
    const breath = 1 + Math.sin(phase.value + index) * 0.07;
    return { cx: x, cy: y + w * 0.05, rx: w * breath, ry: w * 0.24 * breath, opacity: opacity * 0.45 };
  });
  return <G testID={`canal-lotus-${index + 1}`}>
    <AnimatedEllipse animatedProps={ripple} fill="none" stroke={colors.waterLight} strokeWidth={0.8} />
    <AnimatedPath animatedProps={pad} fill={colors.lotusLeaf} stroke={colors.pondDeep} strokeWidth={0.6} />
    <AnimatedImage animatedProps={bloom} preserveAspectRatio="none" onLoad={complete} />
  </G>;
}