import { StyleSheet, Text, View } from "react-native";
import { colors, fonts } from "@/src/theme";
import { CLOSING, EVENTS, INVITATION_NAME, PAIR_FIRST, PAIR_SECOND } from "./data";
import { Seal } from "./Seal";
import { useInvitationLayout } from "./useInvitationLayout";
import { ClosingCompliments } from "./ClosingCompliments";
import { InvitationDate } from "./InvitationDate";

export function ClosingSection() {
  const { insets, safeWidth } = useInvitationLayout();
  const nameSize = Math.max(26, Math.min(42, (safeWidth - 48) / 8));
  return <View testID="closing-section" style={[styles.closing, { paddingBottom: insets.bottom + 56, paddingLeft: insets.left + 24, paddingRight: insets.right + 24 }]}>
    <Text testID="closing-with-love" style={styles.eyebrow}>{CLOSING.eyebrow}</Text>
    <View testID="closing-couple-names" accessibilityLabel={INVITATION_NAME} style={styles.signature}>
      <Text testID="closing-bride-name" style={[styles.name, { fontSize: nameSize, lineHeight: nameSize * 1.4 }]}>{PAIR_FIRST}</Text>
      <Text testID="closing-ampersand" style={styles.ampersand}>&amp;</Text>
      <Text testID="closing-groom-name" style={[styles.name, { fontSize: nameSize, lineHeight: nameSize * 1.4 }]}>{PAIR_SECOND}</Text>
    </View>
    <View style={styles.divider} />
    {EVENTS.map((event) => <View key={event.id} testID={`closing-${event.id}-summary`} style={styles.event}>
      <Text testID={`closing-${event.id}-label`} style={styles.eventLabel}>{event.title}</Text>
      <InvitationDate testID={`closing-${event.id}-date`} style={styles.date} value={`${event.shortDate} · ${event.city}`} numeralSize={12.8} />
    </View>)}
    <View style={styles.seal}><Seal size={84} testID="closing-couple-mark" /></View>
    <Text testID="closing-farewell" style={styles.farewell}>{CLOSING.farewell}</Text>
    <ClosingCompliments />
  </View>;
}

const styles = StyleSheet.create({
  closing: { backgroundColor: colors.wineDeep, paddingHorizontal: 24, paddingVertical: 56, alignItems: "center" },
  eyebrow: { color: colors.goldSoft, fontFamily: fonts.cinzel, fontSize: 11, letterSpacing: 4, marginBottom: 24 },
  signature: { width: "100%", maxWidth: 480, alignItems: "center", gap: 2 },
  name: { color: colors.cream, fontFamily: fonts.cinzel, fontSize: 34, lineHeight: 46, textAlign: "center", letterSpacing: 1 },
  ampersand: { color: colors.goldSoft, fontFamily: fonts.serifItalic, fontSize: 27, lineHeight: 34 },
  divider: { width: 52, height: 1, backgroundColor: colors.gold, marginTop: 30, marginBottom: 25, opacity: 0.7 },
  event: { width: "100%", maxWidth: 440, alignItems: "center", marginBottom: 18 },
  eventLabel: { color: colors.goldSoft, fontFamily: fonts.cinzel, fontSize: 10, letterSpacing: 2, marginBottom: 5 },
  date: { color: colors.cream, fontFamily: fonts.serif, fontSize: 16, lineHeight: 24, textAlign: "center" },
  seal: { marginTop: 4, marginBottom: 14 },
  farewell: { color: colors.cream, fontFamily: fonts.serifItalic, fontSize: 15, lineHeight: 22, textAlign: "center" },
});