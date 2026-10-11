import { useId } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { interpolate, SharedValue, useAnimatedStyle, useDerivedValue } from "react-native-reanimated";
import Svg, { Defs, LinearGradient, Path, Pattern, Rect, Stop } from "react-native-svg";
import { colors } from "@/src/theme";

type EnvelopeProps = { width: number; height: number; progress: SharedValue<number>; reduced: SharedValue<boolean> };

export function EnvelopeArtwork({ width, height, progress, reduced }: EnvelopeProps) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const fold = useDerivedValue(() => reduced.value ? 0 : interpolate(progress.value, [0, 0.2, 0.76, 1], [0, 0, 1, 1]));
  const topStyle = useAnimatedStyle(() => ({ transform: [{ translateY: -height * 0.22 * fold.value }, { scaleY: 1 - 0.73 * fold.value }] }));
  const leftStyle = useAnimatedStyle(() => ({ transform: [{ translateX: -width * 0.065 * fold.value }] }));
  const rightStyle = useAnimatedStyle(() => ({ transform: [{ translateX: width * 0.065 * fold.value }] }));
  const bottomStyle = useAnimatedStyle(() => ({ transform: [{ translateY: height * 0.08 * fold.value }] }));
  const surface = { width, height };
  return <View testID="royal-envelope-body" style={[styles.body, surface]} accessible={false}>
    <Svg width={width} height={height} viewBox="0 0 600 450">
      <Defs>
        <LinearGradient id={`paper-${id}`} x1="0" y1="0" x2="0.85" y2="1">
          <Stop offset="0" stopColor={colors.surfaceSecondary} /><Stop offset="1" stopColor={colors.surfaceTertiary} />
        </LinearGradient>
      </Defs>
      <Rect x="1" y="1" width="598" height="448" rx="5" fill={`url(#paper-${id})`} />
      <Rect x="15" y="15" width="570" height="420" rx="2" fill="none" stroke={colors.gold} strokeWidth="1" opacity="0.65" />
      <Path d="M8 12L300 244 592 12V436H8Z" fill={colors.surfaceTertiary} />
    </Svg>
    <Animated.View testID="royal-envelope-left-fold" style={[styles.layer, surface, leftStyle]}>
      <Svg width={width} height={height} viewBox="0 0 600 450">
        <Path d="M2 6L306 241 2 445Z" fill={colors.bgIvory} />
        <Path d="M2 7L300 239 2 443" fill="none" stroke={colors.goldDeep} strokeWidth="1" opacity="0.17" />
      </Svg>
    </Animated.View>
    <Animated.View testID="royal-envelope-right-fold" style={[styles.layer, surface, rightStyle]}>
      <Svg width={width} height={height} viewBox="0 0 600 450">
        <Path d="M598 6L294 241 598 445Z" fill={colors.surfaceTertiary} />
        <Path d="M598 7L300 239 598 443" fill="none" stroke={colors.goldDeep} strokeWidth="1" opacity="0.19" />
      </Svg>
    </Animated.View>
    <Animated.View testID="royal-envelope-bottom-fold" style={[styles.layer, surface, bottomStyle]}>
      <Svg width={width} height={height} viewBox="0 0 600 450">
        <Path d="M3 444L281 220Q300 206 319 220L597 444Q598 449 592 449H8Q2 449 3 444Z" fill={colors.bgIvory} />
        <Path d="M3 444L281 220Q300 206 319 220L597 444" fill="none" stroke={colors.goldDeep} strokeWidth="1.1" opacity="0.19" />
        <Path d="M16 424V434H584V424" fill="none" stroke={colors.gold} strokeWidth="1" opacity="0.6" />
      </Svg>
    </Animated.View>
    <Animated.View testID="royal-envelope-top-flap" style={[styles.layer, styles.flap, surface, topStyle]}>
      <Svg width={width} height={height} viewBox="0 0 600 450">
        <Path d="M2 6H598L317 258Q300 273 283 258Z" fill={colors.goldDeep} opacity="0.1" />
        <Path d="M2 2H598L317 249Q300 264 283 249Z" fill={colors.surfaceSecondary} />
        <Path d="M16 16H584L313 235Q300 247 287 235Z" fill="none" stroke={colors.gold} strokeWidth="1" opacity="0.65" />
        <Path d="M3 3H597" stroke={colors.cream} strokeWidth="2" />
      </Svg>
    </Animated.View>
    <Svg testID="royal-envelope-paper-grain" style={styles.layer} width={width} height={height} viewBox="0 0 600 450">
      <Defs><Pattern id={`grain-${id}`} width="37" height="31" patternUnits="userSpaceOnUse">
        <Path d="M3 5h.8M17 2h.5M29 9h1M8 18h.5M24 24h.8M35 17h.5M13 28h1M20 14h.5" stroke={colors.ink} strokeWidth="0.6" opacity="0.06" />
        <Path d="M2 22l2-.5M12 10l1-.3M30 29l2-.5" stroke={colors.cream} strokeWidth="0.8" opacity="0.7" />
      </Pattern></Defs>
      <Rect x="2" y="2" width="596" height="446" fill={`url(#grain-${id})`} />
      <Rect x="15" y="15" width="570" height="420" rx="2" fill="none" stroke={colors.gold} strokeWidth="1" opacity="0.48" />
    </Svg>
  </View>;
}

const styles = StyleSheet.create({
  body: { pointerEvents: "none", borderRadius: 4, backgroundColor: colors.bgIvory, boxShadow: `0px 16px 34px ${colors.scrim}` },
  layer: { position: "absolute", top: 0, left: 0 },
  flap: { transformOrigin: "center top" },
});