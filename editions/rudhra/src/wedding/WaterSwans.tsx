import { Ellipse, G } from "react-native-svg";
import Animated, { useAnimatedProps, useDerivedValue } from "react-native-reanimated";
import { colors } from "@/src/theme";
import { WaterProps } from "./WaterBanks";
import { useAmbientPhase } from "./useAmbientPhase";
import { PaperSwan } from "./swans/PaperSwan";
import { projectSwan, SwanPlacement, WATER_SWANS } from "./swans/swanGeometry";

const AnimatedGroup = Animated.createAnimatedComponent(G);

function FloatingSwan({ swan, progress, viewport, active }: WaterProps & { swan: SwanPlacement }) {
  // Explicit shared-value dependencies also work in Reanimated's web mapper.
  const projection = useDerivedValue(() => projectSwan(swan, progress.value, viewport));
  const floating = useDerivedValue(() => (active?.value ?? true) && projection.value.visible && progress.value > 0.18 && progress.value < 1);
  const phase = useAmbientPhase(floating, swan.period);
  const anchor = useAnimatedProps(() => {
    const { x, y, scale, visible } = projection.value;
    return { transform: `translate(${x} ${y}) scale(${scale})`, opacity: visible ? 1 : 0 };
  });
  const bob = useAnimatedProps(() => {
    const { width, scale } = projection.value;
    const pixels = Math.sin(phase.value + swan.offset) * Math.min(swan.amplitude, width * 0.025);
    return { transform: `translate(0 ${pixels / scale}) scale(${swan.facing} 1)` };
  });
  return <AnimatedGroup testID={`swan-${swan.id}`} animatedProps={anchor} aria-hidden={true}>
    <Ellipse testID={`swan-contact-shadow-${swan.id}`} cx="-4" cy="4" rx="71" ry="9" fill={colors.waterShadow} opacity="0.17" />
    <G testID={`swan-ripple-${swan.id}`} fill="none" stroke={colors.goldSoft} strokeWidth="1.1">
      <Ellipse cx="-2" cy="5" rx="112" ry="17" opacity="0.22" />
      <Ellipse cx="-2" cy="5" rx="127" ry="23" opacity="0.12" />
    </G>
    <AnimatedGroup testID={`swan-bob-${swan.id}`} animatedProps={bob}><PaperSwan id={swan.id} /></AnimatedGroup>
  </AnimatedGroup>;
}

export function WaterSwans(props: WaterProps) {
  return <G testID="swan-pair-container" aria-hidden={true}>
    {/* Farther swan first: stable painter order, never a screen-fixed overlay. */}
    <FloatingSwan {...props} swan={WATER_SWANS[1]} />
    <FloatingSwan {...props} swan={WATER_SWANS[0]} />
  </G>;
}