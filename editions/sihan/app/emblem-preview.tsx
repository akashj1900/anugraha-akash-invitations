import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, fonts } from "@/src/theme";
import { Seal } from "@/src/wedding/Seal";
import { INVITATION_NAME, MONOGRAM } from "@/src/wedding/data";

export default function EmblemPreview() {
  return <SafeAreaView style={styles.screen}><View style={styles.content}>
    <Text testID="emblem-preview-title" style={styles.eyebrow}>YOUR SIGNATURE</Text>
    <Seal size={230} testID="selected-infinity-seal" />
    <Text testID="selected-emblem-label" style={styles.label}>{MONOGRAM}</Text>
    <Text testID="selected-emblem-names" style={styles.names}>{INVITATION_NAME}</Text>
    <Pressable testID="emblem-preview-back" accessibilityRole="button" onPress={() => router.replace("/")} style={styles.back}>
      <Text style={styles.backText}>Open the invitation</Text>
    </Pressable>
  </View></SafeAreaView>;
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bgDeep },
  content: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  eyebrow: { fontFamily: fonts.cinzel, fontSize: 11, letterSpacing: 3, color: colors.goldSoft, marginBottom: 24 },
  label: { color: colors.goldSoft, fontSize: 20, marginTop: 16 },
  names: { color: colors.cream, fontFamily: fonts.serif, fontSize: 34, marginTop: 16 },
  back: { minHeight: 44, justifyContent: "center", paddingHorizontal: 24, marginTop: 32, borderWidth: 1, borderColor: colors.gold, borderRadius: 24 },
  backText: { color: colors.goldSoft, fontFamily: fonts.cinzel, fontSize: 12 },
});