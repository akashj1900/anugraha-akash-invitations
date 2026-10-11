import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { interpolate, useAnimatedStyle } from "react-native-reanimated";
import { colors, fonts } from "@/src/theme";
import { INVITATION_NAME } from "./data";
import { useInvitationLayout } from "./useInvitationLayout";
import { EnvelopeArtwork } from "./letter/EnvelopeArtwork";
import { WaxSeal } from "./letter/WaxSeal";
import { useLetterOpening } from "./letter/useLetterOpening";
import { useMusic } from "./music/MusicProvider";

export function RoyalLetterOpening({ onOpen }: { onOpen: () => void }) {
  const { safeWidth, safeHeight, insets, fontScale, compact } = useInvitationLayout();
  const { start } = useMusic();
  const { progress, reduced, highlight, busy, open } = useLetterOpening(onOpen, start);
  const width = Math.min(520, Math.max(1, safeWidth - 48), Math.max(184, (safeHeight - 170 * fontScale) * 4 / 3));
  const height = width * 3 / 4;
  const sealSize = Math.max(80, width * 0.35);
  const nameSize = Math.max(26, Math.min(34, safeWidth * 0.085));
  const coverStyle = useAnimatedStyle(() => ({
    opacity: reduced.value ? 1 - progress.value : interpolate(progress.value, [0, 0.64, 1], [1, 1, 0]),
  }));
  const sealStyle = useAnimatedStyle(() => ({
    opacity: reduced.value ? 1 : interpolate(progress.value, [0, 0.37, 0.7, 1], [1, 1, 0, 0]),
    transform: [
      { translateY: reduced.value ? 0 : -Math.min(24, sealSize * 0.18) * Math.min(1, progress.value / 0.36) },
      { scale: reduced.value ? 1 : 1 + 0.06 * Math.min(1, progress.value / 0.36) },
    ],
  }));

  return <Animated.View testID="seal-cover" style={[styles.portal, coverStyle]}>
    <ScrollView testID="seal-cover-scroll" style={styles.scroll} showsVerticalScrollIndicator={false}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24, paddingLeft: insets.left + 24, paddingRight: insets.right + 24 }]}>
      <View testID="royal-letter-composition" style={{ width, height }}>
        <EnvelopeArtwork {...{ width, height, progress, reduced }} />
        <Animated.View testID="royal-seal-lift" style={[styles.sealHolder, { width: sealSize, height: sealSize, left: (width - sealSize) / 2, top: height * 0.55 - sealSize / 2 }, sealStyle]}>
          <Pressable testID="open-invite-seal" accessibilityRole="button"
            accessibilityLabel={busy ? "Opening invitation" : `Open ${INVITATION_NAME}'s invitation`}
            accessibilityHint="Lift the wax seal to open your invitation"
            accessibilityState={{ disabled: busy, busy }} disabled={busy}
            onPress={open} style={({ pressed }) => [styles.sealButton, pressed && !busy && styles.pressed]}>
            <WaxSeal size={sealSize} highlight={highlight} />
          </Pressable>
        </Animated.View>
      </View>
      <Text testID="opening-couple-names" style={[styles.names, { fontSize: nameSize, lineHeight: Math.ceil(nameSize * 1.25), marginTop: compact ? 24 : 36 }]}>{INVITATION_NAME}</Text>
      <Text testID="open-seal-hint" style={[styles.hint, { letterSpacing: safeWidth < 360 ? 2 : 3.5 }]}>TAP THE SEAL TO OPEN</Text>
    </ScrollView>
  </Animated.View>;
}

const styles = StyleSheet.create({
  portal: { ...StyleSheet.absoluteFill, backgroundColor: colors.bgDeep, zIndex: 30 },
  scroll: { width: "100%" },
  content: { flexGrow: 1, alignItems: "center", justifyContent: "center" },
  sealHolder: { position: "absolute" },
  sealButton: { minWidth: 44, minHeight: 44, alignItems: "center", justifyContent: "center" },
  pressed: { opacity: 0.92 },
  names: { color: colors.cream, fontFamily: fonts.serif, textAlign: "center", flexShrink: 0 },
  hint: { marginTop: 16, color: colors.goldSoft, fontFamily: fonts.cinzel, fontSize: 11, lineHeight: 18, textAlign: "center", flexShrink: 0 },
});