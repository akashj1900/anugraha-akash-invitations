import Svg, { G, Path, Text as SvgText } from "react-native-svg";
import { colors, fonts } from "@/src/theme";
import { INVITATION_NAME, MONOGRAM } from "./data";

export function MonogramArtwork({ color = colors.gold }: { color?: string }) {
  return <G>
    <SvgText x="24" y="41" fontFamily={fonts.cinzel} fontSize="38" fill={color} textAnchor="middle">A</SvgText>
    <Path d="M70 29 C60 13 43 13 43 28 C43 43 61 42 70 29 C79 16 97 14 97 28 C97 43 80 44 70 29Z" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    <SvgText x="116" y="41" fontFamily={fonts.cinzel} fontSize="38" fill={color} textAnchor="middle">A</SvgText>
  </G>;
}

export function CoupleMark({ width = 84, height = 34, color = colors.gold, testID }: {
  width?: number; height?: number; color?: string; testID?: string;
}) {
  return <Svg testID={testID} accessibilityLabel={`${INVITATION_NAME} — ${MONOGRAM}`} width={width} height={height} viewBox="0 0 140 56">
    <MonogramArtwork color={color} />
  </Svg>;
}