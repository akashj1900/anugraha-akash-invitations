import { useState } from "react";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@react-native-vector-icons/ionicons";
import { colors, fonts } from "@/src/theme";
import { EVENTS } from "./data";
import { useInvitationLayout } from "./useInvitationLayout";
import { InvitationDate } from "./InvitationDate";

type Celebration = typeof EVENTS[number];

function CelebrationCard({ event, twoColumns }: { event: Celebration; twoColumns: boolean }) {
  const [mapError, setMapError] = useState(false);
  const marriage = event.id === "marriage";
  const accent = marriage ? colors.wine : colors.goldDeep;
  const openMap = async () => {
    setMapError(false);
    try { await Linking.openURL(event.mapsUrl); } catch { setMapError(true); }
  };
  return <View testID={`event-${event.id}`} style={[styles.card, twoColumns && styles.columnCard, { borderTopColor: accent }]}>
    <View style={styles.heading}>
      <View style={styles.icon}><Ionicons name={marriage ? "flower-outline" : "sparkles-outline"} size={23} color={accent} /></View>
      <View style={styles.headingCopy}>
        <Text testID={`event-${event.id}-title`} style={[styles.title, { color: accent }]}>{event.title}</Text>
        <Text testID={`event-${event.id}-tagline`} style={styles.tagline}>{event.tagline}</Text>
      </View>
    </View>
    <InvitationDate testID={`event-${event.id}-date`} style={styles.date} value={event.when} numeralSize={16} />
    <Text testID={`event-${event.id}-time`} style={styles.time}>{event.time}</Text>
    <View style={styles.divider} />
    <Text testID={`event-${event.id}-venue`} style={styles.venue}>{event.venue}</Text>
    <Text testID={`event-${event.id}-address`} style={styles.address}>{event.address}</Text>
    <View style={styles.spacer} />
    <Pressable testID={`open-map-${event.id}`} accessibilityRole="link" accessibilityLabel={`Open ${event.venue} in Google Maps`} onPress={openMap} style={({ pressed }) => [styles.mapButton, pressed && styles.pressed]}>
      <Ionicons name="location-outline" size={18} color={colors.wine} />
      <Text testID={`open-map-${event.id}-label`} style={styles.mapText}>Open in Google Maps</Text>
      <Ionicons name="open-outline" size={16} color={colors.wine} />
    </Pressable>
    {mapError && <Text testID={`map-error-${event.id}`} accessibilityRole="alert" style={styles.error}>Maps could not open. Please try again or search the address above.</Text>}
  </View>;
}

export function CelebrationsSection() {
  const { twoColumns } = useInvitationLayout();
  return <View testID="celebrations-section" style={styles.section}>
    <Text testID="celebrations-eyebrow" style={styles.eyebrow}>Two beautiful celebrations</Text>
    <Text testID="celebrations-title" style={styles.sectionTitle}>The Celebrations</Text>
    <View testID="celebration-cards" style={[styles.list, twoColumns && styles.columns]}>{EVENTS.map((event) => <CelebrationCard key={event.id} event={event} twoColumns={twoColumns} />)}</View>
  </View>;
}

const styles = StyleSheet.create({
  section: { paddingHorizontal: 16, paddingVertical: 32, alignItems: "center" },
  eyebrow: { fontFamily: fonts.cinzel, color: colors.goldDeep, fontSize: 10, letterSpacing: 2, textAlign: "center", marginBottom: 9 },
  sectionTitle: { fontFamily: fonts.cinzel, fontSize: 28, lineHeight: 36, color: colors.wineDeep, textAlign: "center", marginBottom: 24 },
  list: { width: "100%", gap: 24 },
  columns: { flexDirection: "row", alignItems: "stretch" },
  columnCard: { flex: 1, width: undefined, minWidth: 0 },
  card: { width: "100%", padding: 18, borderWidth: 1, borderTopWidth: 3, borderColor: colors.border, borderRadius: 16, backgroundColor: colors.surfaceSecondary },
  spacer: { flexGrow: 1 },
  heading: { flexDirection: "row", alignItems: "center", gap: 13, marginBottom: 21 },
  headingCopy: { flex: 1, minWidth: 0 },
  icon: { width: 46, height: 46, alignItems: "center", justifyContent: "center", borderRadius: 23, borderWidth: 1, borderColor: colors.border },
  title: { fontFamily: fonts.cinzel, fontSize: 22, lineHeight: 29 },
  tagline: { fontFamily: fonts.serifItalic, fontSize: 14, lineHeight: 19, color: colors.muted, marginTop: 3 },
  date: { fontFamily: fonts.serifBold, fontSize: 20, lineHeight: 27, color: colors.ink },
  time: { fontFamily: fonts.serif, fontSize: 17, lineHeight: 25, color: colors.wine, marginTop: 3 },
  divider: { height: 1, backgroundColor: colors.divider, marginVertical: 18 },
  venue: { fontFamily: fonts.cinzel, fontSize: 17, lineHeight: 25, color: colors.wineDeep },
  address: { fontFamily: fonts.serif, fontSize: 17, lineHeight: 24, color: colors.muted, marginTop: 6 },
  mapButton: { minHeight: 48, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 9, marginTop: 20, paddingHorizontal: 10, paddingVertical: 12, borderWidth: 1, borderColor: colors.gold, borderRadius: 24 },
  mapText: { fontFamily: fonts.cinzel, fontSize: 10, letterSpacing: 0.5, color: colors.wine, textAlign: "center", flexShrink: 1 },
  pressed: { opacity: 0.65 },
  error: { fontFamily: fonts.serif, fontSize: 14, lineHeight: 20, color: colors.error, marginTop: 10 },
});