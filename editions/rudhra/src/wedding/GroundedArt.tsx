import { memo, ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { ImageSource } from "expo-image";
import { JourneyImage } from "./JourneyImage";
import Svg, { Ellipse, Path } from "react-native-svg";
import { colors } from "@/src/theme";

/** Contact shadow and stone support share the artwork's transform and foot. */
export const GroundedArt = memo(function GroundedArt({ source, foundation = false, flip = false, children }: {
  source: ImageSource; foundation?: boolean; flip?: boolean; children?: ReactNode;
}) {
  return <View style={styles.fill}>
    <View style={styles.shadow}>
      <Svg width="100%" height="100%" viewBox="0 0 100 20" preserveAspectRatio="none">
        <Ellipse cx="50" cy="10" rx="49" ry="9" fill={colors.paperShadow} opacity="0.07" />
        <Ellipse cx="50" cy="10" rx="44" ry="6" fill={colors.paperShadow} opacity="0.13" />
        <Ellipse cx="50" cy="9" rx="37" ry="3" fill={colors.paperShadow} opacity="0.22" />
      </Svg>
    </View>
    {foundation && <View style={styles.foundation}>
      <Svg width="100%" height="100%" viewBox="0 0 100 22" preserveAspectRatio="none">
        <Path d="M7 0 H93 L97 8 H3Z" fill={colors.surfaceSecondary} />
        <Path d="M3 8 H97 V12 H3Z" fill={colors.paperStoneShade} />
        <Path d="M3 12 H97 L100 17 H0Z" fill={colors.paperStone} />
        <Path d="M0 17 H100 V21 H0Z" fill={colors.paperStoneShade} />
        <Path d="M3 8 H97 M0 17 H100" stroke={colors.goldSoft} strokeWidth="0.5" />
      </Svg>
    </View>}
    <JourneyImage source={source} style={[styles.image, foundation && styles.raised, flip && styles.flip]} contentFit="fill" />
    {children}
  </View>;
});

const styles = StyleSheet.create({
  fill: { ...StyleSheet.absoluteFill, pointerEvents: "none" },
  image: { ...StyleSheet.absoluteFill, width: "100%", height: "100%" },
  raised: { height: "93%" },
  foundation: { position: "absolute", height: "11%", bottom: 0, left: "-2%", width: "104%" },
  shadow: { position: "absolute", bottom: "-3%", left: "-5%", width: "110%", height: "7%" },
  flip: { transform: [{ scaleX: -1 }] },
});