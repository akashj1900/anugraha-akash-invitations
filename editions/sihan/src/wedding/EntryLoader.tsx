import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { colors, fonts } from "@/src/theme";
import { Seal } from "./Seal";
import { INVITATION_NAME } from "./data";
import { useInvitationLayout } from "./useInvitationLayout";

export function EntryLoader({ progress, failed, onRetry }: { progress: number; failed: boolean; onRetry: () => void }) {
  const { insets, safeHeight } = useInvitationLayout();
  const [slow, setSlow] = useState(false);
  useEffect(() => { const timer = setTimeout(() => setSlow(true), 12000); return () => clearTimeout(timer); }, []);
  return <View testID="invite-loader" style={styles.portal} accessibilityState={{ busy: true }}>
    <ScrollView testID="invite-loader-scroll" style={styles.scroll} contentContainerStyle={[styles.content, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 }]} showsVerticalScrollIndicator={false}>
    <Seal size={Math.min(140, Math.max(72, safeHeight * 0.23))} testID="loading-couple-mark" />
    <Text testID="loading-couple-names" style={styles.names}>{INVITATION_NAME}</Text>
    <Text testID="loader-title" style={styles.title}>{failed ? "A detail could not load" : "Preparing your invitation…"}</Text>
    <View style={styles.track}><View style={[styles.fill, { width: `${progress}%` }]} /></View>
    <Text testID="loader-progress" style={styles.percent}>{progress}%</Text>
    {(failed || slow) && <>
      <Text testID="loader-help" style={styles.help}>We’re keeping your first view complete.</Text>
      <Pressable testID="retry-scene-loading" accessibilityRole="button" onPress={onRetry} style={styles.retry}>
        <Text testID="retry-scene-loading-label" style={styles.retryText}>Retry loading</Text>
      </Pressable>
    </>}
    </ScrollView>
  </View>;
}

const styles = StyleSheet.create({
  portal: { ...StyleSheet.absoluteFill, zIndex: 30, backgroundColor: colors.bgDeep },
  scroll: { width: "100%" },
  content: { flexGrow: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 24 },
  names: { color: colors.cream, fontFamily: fonts.serif, fontSize: 27, marginTop: 16, textAlign: "center" },
  title: { color: colors.goldSoft, fontFamily: fonts.serifItalic, fontSize: 17, marginTop: 20, marginBottom: 22, textAlign: "center" },
  track: { width: "100%", maxWidth: 220, height: 2, backgroundColor: colors.goldDeep, overflow: "hidden" },
  fill: { height: "100%", backgroundColor: colors.goldSoft },
  percent: { color: colors.goldSoft, fontFamily: fonts.cinzel, fontSize: 12, marginTop: 12, letterSpacing: 2 },
  help: { color: colors.cream, fontFamily: fonts.serif, fontSize: 15, marginTop: 24, textAlign: "center" },
  retry: { minHeight: 44, justifyContent: "center", paddingHorizontal: 22, borderRadius: 22, borderWidth: 1, borderColor: colors.gold, marginTop: 12 },
  retryText: { color: colors.goldSoft, fontFamily: fonts.cinzel, fontSize: 12 },
});