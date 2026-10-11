import { useId } from "react";
import { StyleSheet, View } from "react-native";
import Svg, { Circle, Defs, Ellipse, RadialGradient, Stop } from "react-native-svg";
import Animated, { SharedValue, useAnimatedProps, useSharedValue } from "react-native-reanimated";
import { colors } from "@/src/theme";
import { useAmbientPhase } from "./useAmbientPhase";

const AnimatedEllipse = Animated.createAnimatedComponent(Ellipse);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

/** The ORIGINAL paper flame stays untouched in the artwork. Only light moves. */
export function Agni({ active }: { active?: SharedValue<boolean> }) {
  const fallback = useSharedValue(true);
  const phase = useAmbientPhase(active ?? fallback, 3600);
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const glow = useAnimatedProps(() => ({ opacity: 0.10 + Math.sin(phase.value * 2) * 0.025 }));
  const warmPoint = useAnimatedProps(() => ({ opacity: 0.16 + Math.sin(phase.value * 3 + 0.8) * 0.10 }));
  const secondPoint = useAnimatedProps(() => ({ opacity: 0.10 + Math.cos(phase.value * 2) * 0.07 }));
  return <View testID="mandap-agni" style={styles.light} accessibilityLabel="Original paper wedding flame, softly illuminated">
    <Svg width="100%" height="100%" viewBox="0 0 120 140">
      <Defs><RadialGradient id={`agni-light-${id}`}>
        <Stop offset="0" stopColor={colors.fireGold} stopOpacity="0.7" />
        <Stop offset="1" stopColor={colors.fireOrange} stopOpacity="0" />
      </RadialGradient></Defs>
      <AnimatedEllipse testID="agni-moving-glow" animatedProps={glow} cx="60" cy="101" rx="42" ry="26" fill={`url(#agni-light-${id})`} />
      <AnimatedCircle testID="agni-light-point-1" animatedProps={warmPoint} cx="57" cy="97" r="1.2" fill={colors.fireCore} />
      <AnimatedCircle testID="agni-light-point-2" animatedProps={secondPoint} cx="65" cy="84" r="0.8" fill={colors.fireGold} />
    </Svg>
  </View>;
}

const styles = StyleSheet.create({ light: { position: "absolute", left: "43.8%", top: "67%", width: "13%", height: "14%", pointerEvents: "none" } });