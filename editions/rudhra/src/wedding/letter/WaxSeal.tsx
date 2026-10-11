import { useId } from "react";
import Animated, { SharedValue, useAnimatedProps } from "react-native-reanimated";
import Svg, { Circle, Defs, G, LinearGradient, Mask, Path, RadialGradient, Rect, Stop } from "react-native-svg";
import { colors } from "@/src/theme";
import { MonogramArtwork } from "../CoupleMark";

const AnimatedRect = Animated.createAnimatedComponent(Rect);
const WAX_EDGE = "M120 13C132 11 142 16 153 19C164 19 171 29 181 34C193 38 198 48 204 58C214 65 215 78 220 88C226 99 222 110 226 121C229 134 223 143 220 154C220 166 208 172 204 183C198 194 186 196 177 204C170 215 156 213 146 220C135 225 126 221 114 225C101 227 92 220 81 219C69 219 63 209 52 204C40 199 38 188 30 178C20 170 23 158 17 147C12 136 16 125 13 113C11 100 18 92 19 80C20 68 31 63 36 52C41 42 54 40 63 31C72 23 84 24 95 18C105 13 112 16 120 13Z";

export function WaxSeal({ size, highlight }: { size: number; highlight: SharedValue<number> }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const shine = useAnimatedProps(() => {
    const cycle = (highlight.value / (Math.PI * 2)) % 1;
    const sweep = Math.max(0, Math.min(1, (cycle - 0.72) / 0.26));
    return { x: -60 + sweep * 360, opacity: Math.sin(sweep * Math.PI) * 0.32 };
  });
  return <Svg testID="opening-couple-mark" width={size} height={size} viewBox="0 0 240 240" aria-hidden={true}>
    <Defs>
      <RadialGradient id={`wax-${id}`} cx="42%" cy="35%" r="68%">
        <Stop offset="0" stopColor={colors.bgMid} /><Stop offset="0.74" stopColor={colors.wine} /><Stop offset="1" stopColor={colors.bgDeep} />
      </RadialGradient>
      <LinearGradient id={`shine-${id}`} x1="0" y1="0" x2="1" y2="0">
        <Stop offset="0" stopColor={colors.goldSoft} stopOpacity="0" /><Stop offset="0.5" stopColor={colors.goldSoft} /><Stop offset="1" stopColor={colors.goldSoft} stopOpacity="0" />
      </LinearGradient>
      <Mask id={`engraving-${id}`} x="0" y="0" width="240" height="240" maskUnits="userSpaceOnUse">
        <Circle cx="120" cy="120" r="76" fill="none" stroke={colors.onError} strokeWidth="1.3" />
        <Circle cx="120" cy="120" r="70" fill="none" stroke={colors.onError} strokeWidth="0.9" />
        <G transform="translate(48.6 91) scale(1.02)"><MonogramArtwork color={colors.onError} /></G>
      </Mask>
    </Defs>
    <Path d={WAX_EDGE} transform="translate(1 6)" fill={colors.bgDeep} opacity="0.2" />
    <Path d={WAX_EDGE} fill={`url(#wax-${id})`} stroke={colors.bgDeep} strokeWidth="1.8" />
    <Path d={WAX_EDGE} transform="translate(8.4 8.4) scale(.93)" fill="none" stroke={colors.muted} strokeWidth="1.2" opacity="0.28" />
    <Circle cx="120" cy="121" r="87" fill={colors.bgDeep} opacity="0.2" />
    <Circle cx="119" cy="118" r="86" fill={`url(#wax-${id})`} />
    <Path d="M45 91C57 49 102 30 144 40" fill="none" stroke={colors.muted} strokeWidth="1.5" opacity="0.38" strokeLinecap="round" />
    <Path d="M194 148C181 189 138 209 99 200" fill="none" stroke={colors.bgDeep} strokeWidth="2.2" opacity="0.6" strokeLinecap="round" />
    <G transform="translate(0 .9)" opacity="0.8">
      <Circle cx="120" cy="120" r="76" fill="none" stroke={colors.goldDeep} strokeWidth="1.5" />
      <Circle cx="120" cy="120" r="70" fill="none" stroke={colors.bgDeep} strokeWidth="1.2" />
    </G>
    <Circle testID="wax-engraved-outer-ring" cx="120" cy="120" r="76" fill="none" stroke={colors.gold} strokeWidth="0.85" />
    <Circle testID="wax-engraved-inner-ring" cx="120" cy="120" r="70" fill="none" stroke={colors.gold} strokeWidth="0.55" opacity="0.78" />
    <G transform="translate(49.2 92.2) scale(1.02)" opacity="0.9"><MonogramArtwork color={colors.goldDeep} /></G>
    <G transform="translate(48.2 90.5) scale(1.02)" opacity="0.35"><MonogramArtwork color={colors.goldSoft} /></G>
    <G testID="wax-raised-monogram" transform="translate(48.6 91) scale(1.02)"><MonogramArtwork color={colors.gold} /></G>
    <G mask={`url(#engraving-${id})`}>
      <AnimatedRect testID="wax-engraving-highlight" animatedProps={shine} y="0" width="58" height="240" fill={`url(#shine-${id})`} />
    </G>
  </Svg>;
}