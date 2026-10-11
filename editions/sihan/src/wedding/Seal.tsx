// The selected A ∞ A signature: delicate gold rings, no heavy medallion motif.
import { useId } from "react";
import Svg, { Circle, Defs, G, RadialGradient, Stop } from "react-native-svg";
import { colors } from "@/src/theme";
import { MonogramArtwork } from "./CoupleMark";
import { INVITATION_NAME, MONOGRAM } from "./data";

export function Seal({ size = 240, testID }: { size?: number; testID?: string }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  return <Svg testID={testID} width={size} height={size} viewBox="0 0 240 240" accessibilityLabel={`${INVITATION_NAME} — ${MONOGRAM}`}>
    <Defs><RadialGradient id={`seal-disc-${id}`} cx="50%" cy="45%" r="60%">
      <Stop offset="0" stopColor={colors.bgMid} /><Stop offset="1" stopColor={colors.bgDeep} />
    </RadialGradient></Defs>
    <Circle cx="120" cy="120" r="108" fill="none" stroke={colors.gold} strokeWidth="0.65" opacity="0.35" />
    <Circle cx="120" cy="120" r="99" fill={`url(#seal-disc-${id})`} stroke={colors.goldSoft} strokeWidth="0.85" />
    <Circle cx="120" cy="120" r="91" fill="none" stroke={colors.gold} strokeWidth="0.55" opacity="0.65" />
    <G transform="translate(43 88) scale(1.1)"><MonogramArtwork color={colors.goldSoft} /></G>
    <Circle cx="120" cy="62" r="1.5" fill={colors.goldSoft} />
    <Circle cx="120" cy="178" r="1.5" fill={colors.goldSoft} />
  </Svg>;
}