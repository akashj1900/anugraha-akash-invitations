import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import Animated from "react-native-reanimated";
import { colors, fonts } from "@/src/theme";
import { useInvitationLayout } from "./useInvitationLayout";
import { COUPLE_PORTRAIT, PORTRAIT_LABEL, PORTRAIT_RATIO } from "./reveal/portrait";
import { ScratchCover } from "./reveal/ScratchCover";
import { useCoupleReveal } from "./reveal/useCoupleReveal";
import { usePortraitLoad } from "./reveal/usePortraitLoad";
import { RevealFeedback } from "./reveal/RevealFeedback";

const INSET = 8;

export function CoupleRevealCard() {
  const { safeWidth, safeHeight } = useInvitationLayout();
  const [focused, setFocused] = useState(false);
  const image = usePortraitLoad();
  const reveal = useCoupleReveal(image.status);
  const imageAccessible = reveal.revealed && image.status === "ready";
  const imageWidth = Math.max(1, Math.min(340 - INSET * 2, safeWidth - 32 - INSET * 2, Math.max(160, safeHeight * 0.78 - INSET * 2) * PORTRAIT_RATIO));
  const width = imageWidth + INSET * 2;
  const imageHeight = imageWidth / PORTRAIT_RATIO;
  const height = imageHeight + INSET * 2;
  const layout = useMemo(() => StyleSheet.create({
    card: { width, height },
    image: { position: "absolute", left: INSET, top: INSET, width: imageWidth, height: imageHeight },
  }), [width, height, imageWidth, imageHeight]);

  return <View testID="couple-reveal-section" style={styles.section}>
    <View testID="couple-reveal-card-container" style={[styles.card, layout.card]}>
      <Animated.View testID="couple-reveal-image-frame" style={[layout.image, reveal.imageStyle]}
        aria-hidden={!imageAccessible} accessibilityElementsHidden={!imageAccessible}
        importantForAccessibility={imageAccessible ? "auto" : "no-hide-descendants"}>
        <Image key={image.attempt} testID="couple-reveal-image" source={COUPLE_PORTRAIT} style={styles.photo}
          contentFit="contain" transition={0} cachePolicy="memory-disk" accessible={imageAccessible}
          accessibilityLabel={PORTRAIT_LABEL} onLoad={image.onLoad} onError={image.onError} />
      </Animated.View>
      {!reveal.revealed && <Animated.View testID="couple-reveal-cover" style={[styles.cover, reveal.coverStyle]}>
        <ScratchCover {...{ width, height }} />
        {!reveal.requested ? <Pressable testID="couple-reveal-cover-button" accessibilityRole="button" accessibilityLabel="Tap to reveal"
          accessibilityHint="Reveal the complete couple portrait with one tap"
          onPress={() => { setFocused(false); image.waitForLoad(); reveal.request(); }} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={({ pressed }) => [styles.activation, pressed && styles.pressed]}>
          {focused && <View testID="couple-reveal-focus-ring" style={styles.focusRing} />}
          <Text testID="couple-reveal-instruction-text" style={styles.instruction}>Tap to reveal</Text>
        </Pressable> : <RevealFeedback status={image.status} retry={image.retry} />}
      </Animated.View>}
      {reveal.revealed && image.status !== "ready" && <RevealFeedback status={image.status} retry={image.retry} />}
    </View>
  </View>;
}

const styles = StyleSheet.create({
  section: { width: "100%", maxWidth: 760, alignSelf: "center", paddingHorizontal: 16, paddingVertical: 24, alignItems: "center" },
  card: { position: "relative", borderRadius: 16, overflow: "hidden", backgroundColor: colors.surfaceSecondary, borderWidth: 1, borderColor: colors.gold },
  photo: { width: "100%", height: "100%" },
  cover: { ...StyleSheet.absoluteFill, backgroundColor: colors.bgIvory },
  activation: { ...StyleSheet.absoluteFill, minWidth: 44, minHeight: 44, alignItems: "center", justifyContent: "center", padding: 20 },
  instruction: { color: colors.wine, fontFamily: fonts.cinzel, fontSize: 13, lineHeight: 23, letterSpacing: 4, textAlign: "center" },
  pressed: { opacity: 0.9 },
  focusRing: { ...StyleSheet.absoluteFill, borderWidth: 2, borderColor: colors.wine, borderRadius: 14, pointerEvents: "none" },
});