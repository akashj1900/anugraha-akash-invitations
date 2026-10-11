import { useId } from "react";
import { StyleSheet } from "react-native";
import Svg, { Defs, LinearGradient, Path, Pattern, Rect, Stop } from "react-native-svg";
import { colors } from "@/src/theme";

/** Quiet foil-and-paper texture only; there is no scratch gesture or percentage. */
export function ScratchCover({ width, height }: { width: number; height: number }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  return <Svg testID="couple-reveal-cover-texture" width={width} height={height} style={styles.art} aria-hidden={true}>
    <Defs>
      <LinearGradient id={`foil-${id}`} x1="0" y1="0" x2="1" y2="1">
        <Stop offset="0" stopColor={colors.goldSoft} stopOpacity="0.12" />
        <Stop offset="0.48" stopColor={colors.surfaceSecondary} stopOpacity="0.5" />
        <Stop offset="1" stopColor={colors.gold} stopOpacity="0.12" />
      </LinearGradient>
      <Pattern id={`grain-${id}`} width="39" height="33" patternUnits="userSpaceOnUse">
        <Path d="M2 5l7-1M21 3l11-.5M8 17l12-1M27 24l7-1M3 29l10-.7" stroke={colors.goldDeep} strokeWidth="0.45" opacity="0.12" />
        <Path d="M6 9l.5 8M25 8l.3 5M17 25l.4 6M36 13l.5 7" stroke={colors.goldSoft} strokeWidth="0.5" opacity="0.3" />
      </Pattern>
    </Defs>
    <Rect width={width} height={height} fill={colors.bgIvory} />
    <Rect width={width} height={height} fill={`url(#foil-${id})`} />
    <Rect width={width} height={height} fill={`url(#grain-${id})`} />
    <Rect x="12" y="12" width={Math.max(1, width - 24)} height={Math.max(1, height - 24)} rx="7" fill="none" stroke={colors.gold} strokeWidth="1" opacity="0.7" />
  </Svg>;
}

const styles = StyleSheet.create({ art: { ...StyleSheet.absoluteFill, pointerEvents: "none" } });