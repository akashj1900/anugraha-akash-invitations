import { Ionicons } from "@react-native-vector-icons/ionicons";
import { StyleSheet, Text, View } from "react-native";
import { SharedValue } from "react-native-reanimated";
import { colors, fonts } from "@/src/theme";
import { HERO } from "./data";
import { JourneyCaption } from "./JourneyCaption";
import { useInvitationLayout } from "./useInvitationLayout";

export function HeroCaption({ progress }: { progress: SharedValue<number> }) {
  const { captionWidth, compact, sideCaption, insets, gutter } = useInvitationLayout();
  const nameSize = Math.max(22, Math.min(36, (captionWidth - 32) / 10.4));
  return <View testID="hero-caption-holder" style={[
    styles.holder,
    { bottom: insets.bottom + (compact ? 12 : 28) },
    sideCaption ? { right: insets.right + gutter, width: captionWidth } : styles.centered,
  ]}>
    <View testID="hero-caption" style={[styles.card, { width: captionWidth }, compact && styles.compactCard]}>
      <JourneyCaption progress={progress} compact={compact} />
      <Text testID="hero-date-location" style={styles.date}>{HERO.dateLocation}</Text>
      <View style={styles.names}>
        <Text testID="hero-bride-name" style={[styles.name, { fontSize: nameSize }]}>{HERO.brideName}</Text>
        <Text testID="hero-name-joiner" style={styles.joiner}> {HERO.joiner} </Text>
        <Text testID="hero-groom-name" style={[styles.name, { fontSize: nameSize }]}>{HERO.groomName}</Text>
      </View>
      <Text testID="hero-subtitle" style={styles.subtitle}>{HERO.subtitle}</Text>
      <Text testID="hero-scroll-hint" style={[styles.hint, compact && styles.compactHint]}>{HERO.scrollHint.toUpperCase()}</Text>
      <Ionicons name="chevron-down" size={18} color={colors.gold} style={styles.chevron} />
    </View>
  </View>;
}

const styles = StyleSheet.create({
  holder: { position: "absolute", alignItems: "center" },
  centered: { left: 0, right: 0 },
  card: { backgroundColor: colors.glassFill, borderColor: colors.glassStroke, borderWidth: 1, borderRadius: 18, padding: 18, alignItems: "center", boxShadow: `0px 8px 18px ${colors.wine}26` },
  compactCard: { padding: 12 },
  date: { color: colors.goldDeep, fontFamily: fonts.cinzel, fontSize: 10, letterSpacing: 1.3, marginBottom: 8, textAlign: "center" },
  names: { flexDirection: "row", alignItems: "center", justifyContent: "center", flexWrap: "wrap", width: "100%" },
  name: { color: colors.wineDeep, fontFamily: fonts.cinzel, letterSpacing: 0.6, textAlign: "center", flexShrink: 1 },
  joiner: { color: colors.gold, fontSize: 22 },
  subtitle: { marginTop: 8, color: colors.ink, fontFamily: fonts.serifItalic, fontStyle: "italic", fontSize: 15, textAlign: "center" },
  hint: { marginTop: 16, color: colors.goldDeep, fontFamily: fonts.cinzel, fontSize: 10, letterSpacing: 1.4, textAlign: "center" },
  compactHint: { marginTop: 8 },
  chevron: { alignSelf: "center", marginTop: 5 },
});