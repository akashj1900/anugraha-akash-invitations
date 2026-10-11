import { memo } from "react";
import { StyleSheet, View } from "react-native";
import { JourneyImage } from "./JourneyImage";
import Svg, { Circle, Ellipse, G, Path } from "react-native-svg";
import Animated, { SharedValue, useAnimatedStyle } from "react-native-reanimated";
import { colors } from "@/src/theme";
import { JOURNEY_ART } from "./journeyAssets";
import { smoothRange } from "./journeyCamera";
import { GroundedArt } from "./GroundedArt";

function Door({ side, progress }: { side: -1 | 1; progress: SharedValue<number> }) {
  const style = useAnimatedStyle(() => ({ transform: [
    { perspective: 900 },
    { rotateY: `${-side * 93 * smoothRange(progress.value, 0.13, 0.42)}deg` },
  ] }));
  return <Animated.View testID={`paper-door-${side === -1 ? "left" : "right"}`} style={[
    styles.door,
    { left: side === -1 ? "33.53846%" : "49.94872%", transformOrigin: side === -1 ? "left center" : "right center" },
    style,
  ]}>
    <JourneyImage source={side === -1 ? JOURNEY_ART.doorLeft : JOURNEY_ART.doorRight} contentFit="fill" style={styles.fill} />
  </Animated.View>;
}

export function PaperGate({ progress }: { progress: SharedValue<number> }) {
  return <View style={styles.fill}>
    <Door side={-1} progress={progress} /><Door side={1} progress={progress} />
    <GroundedArt source={JOURNEY_ART.grandGateway} />
  </View>;
}

export const PaperLamp = memo(function PaperLamp() {
  return <Svg width="100%" height="100%" viewBox="0 0 70 172">
    <Ellipse cx="35" cy="167" rx="31" ry="5" fill={colors.paperShadow} opacity="0.2" />
    <Path d="M35 5 Q8 40 35 48 Q54 36 35 5Z" fill={colors.fireGold} />
    <Path d="M35 20 L28 43 L38 43Z" fill={colors.fireCore} />
    <Path d="M5 49 L65 49 L53 63 L42 67 L39 145 L56 155 L60 168 L10 168 L14 155 L31 145 L28 67 L17 63Z" fill={colors.gold} />
    <Path d="M35 67 L39 145 L56 155 L35 160Z M35 49 L65 49 L53 63 L35 67Z" fill={colors.goldDeep} />
    <Path d="M5 49 L35 53 L65 49 M14 155 L35 160 L56 155 M10 168 L60 168" stroke={colors.goldSoft} strokeWidth="2" />
    <Circle cx="35" cy="112" r="7" fill={colors.gold} />
    <Path d="M35 105 L40 112 L35 119 L30 112Z" fill={colors.goldSoft} />
  </Svg>;
});

export const Pookkalam = memo(function Pookkalam() {
  return <Svg width="100%" height="100%" viewBox="-110 -110 220 220" preserveAspectRatio="none">
    <Circle r="106" fill={colors.paperShadow} opacity="0.15" />
    <Circle r="100" fill={colors.gold} /><Circle r="87" fill={colors.lotusPink} />
    {Array.from({ length: 16 }, (_, i) => <G key={i} transform={`rotate(${i * 22.5})`}>
      <Path d="M0 -88 C22 -65 16 -38 0 -25 C-16 -38 -22 -65 0 -88Z" fill={i % 2 ? colors.cream : colors.marigold} />
      <Path d="M0 -88 L0 -25 C-16 -38 -22 -65 0 -88Z" fill={colors.goldDeep} opacity="0.2" />
    </G>)}
    <Circle r="28" fill={colors.goldSoft} />
    {Array.from({ length: 8 }, (_, i) => <Path key={i} transform={`rotate(${i * 45})`} d="M0 -23 Q18 -8 0 0 Q-18 -8 0 -23Z" fill={colors.lotusPink} />)}
    <Circle r="6" fill={colors.cream} />
  </Svg>;
});

export const LotusPool = memo(function LotusPool({ flip = false }: { flip?: boolean }) {
  return <View style={[styles.fill, flip && styles.flip]}>
    <View style={styles.lilyPad}><Svg width="100%" height="100%" viewBox="0 0 160 45">
      <Ellipse cx="80" cy="25" rx="72" ry="18" fill={colors.pondDeep} opacity="0.2" />
      <Path d="M80 23 L49 7 C1 7 0 35 58 39 C151 56 165 7 88 6 L80 23Z" fill={colors.lotusLeaf} stroke={colors.goldDeep} strokeWidth="0.5" />
      <Path d="M80 23 L20 23 M80 23 L119 12 M80 23 L120 34" stroke={colors.goldSoft} opacity="0.35" />
    </Svg></View>
    <JourneyImage source={JOURNEY_ART.lotus} style={styles.lotus} contentFit="contain" />
  </View>;
});

const styles = StyleSheet.create({
  fill: { ...StyleSheet.absoluteFill, pointerEvents: "none" },
  door: { position: "absolute", top: "46.92005%", width: "16.41026%", height: "37.61468%", backfaceVisibility: "visible" },
  lilyPad: { position: "absolute", bottom: "-3%", left: "-20%", width: "140%", height: "27%" },
  lotus: { width: "100%", height: "100%" },
  flip: { transform: [{ scaleX: -1 }] },
});