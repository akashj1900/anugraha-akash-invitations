import { useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { colors, fonts } from "@/src/theme";
import type { PortraitStatus } from "./usePortraitLoad";

export function RevealFeedback({ status, retry }: { status: PortraitStatus; retry: () => void }) {
  const [focused, setFocused] = useState(false);
  if (status === "ready") return null;
  return <View testID={status === "error" ? "couple-reveal-error" : "couple-reveal-loading"} style={styles.feedback} accessibilityState={{ busy: status === "loading" }}>
    {status === "error" ? <>
      <Text testID="couple-reveal-error-text" accessibilityLiveRegion="polite" style={styles.message}>Image unavailable</Text>
      <Pressable testID="couple-reveal-retry-button" accessibilityRole="button" accessibilityLabel="Retry image"
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} onPress={() => { setFocused(false); retry(); }}
        style={({ pressed }) => [styles.retry, pressed && styles.pressed]}>
        {focused && <View testID="couple-reveal-retry-focus-ring" style={styles.focusRing} />}
        <Text testID="couple-reveal-retry-label" style={styles.retryLabel}>Retry image</Text>
      </Pressable>
    </> : <>
      <ActivityIndicator testID="couple-reveal-loading-indicator" color={colors.goldDeep} size="small" />
      <Text testID="couple-reveal-loading-text" accessibilityLiveRegion="polite" style={styles.message}>Loading image…</Text>
    </>}
  </View>;
}

const styles = StyleSheet.create({
  feedback: { ...StyleSheet.absoluteFill, alignItems: "center", justifyContent: "center", padding: 20, gap: 14, backgroundColor: colors.bgIvory },
  message: { color: colors.wine, fontFamily: fonts.serif, fontSize: 17, lineHeight: 22, textAlign: "center" },
  retry: { minHeight: 44, paddingVertical: 10, paddingHorizontal: 18, borderRadius: 24, borderWidth: 1, borderColor: colors.gold, backgroundColor: colors.wineDeep, justifyContent: "center" },
  pressed: { opacity: 0.9 },
  retryLabel: { color: colors.cream, fontFamily: fonts.serif, fontSize: 16, textAlign: "center" },
  focusRing: { position: "absolute", top: -4, bottom: -4, left: -4, right: -4, borderWidth: 2, borderColor: colors.goldDeep, borderRadius: 27, pointerEvents: "none" },
});