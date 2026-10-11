import { Ionicons } from "@react-native-vector-icons/ionicons";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { colors, fonts } from "@/src/theme";
import { useMusic } from "./music/MusicProvider";

/** Controls the same player that was prepared before the letter opened. */
export function MusicControl() {
  const { state, muted, onPress } = useMusic();
  const needsPlay = state === "blocked" || state === "paused";
  const label = state === "error" ? "Retry music" : needsPlay ? "Play music" : muted ? "Unmute music" : "Mute music";
  const hint = state === "blocked" ? "Tap to play music" : state === "error" ? "Music unavailable · tap to retry" : state === "loading" ? "Loading music…" : null;
  const icon = muted ? "volume-mute" : needsPlay || state === "error" ? "volume-low" : "volume-high";

  return <View testID="music-control" style={styles.container}>
    <Pressable testID="music-toggle" accessibilityRole="button" accessibilityLabel={label}
      accessibilityHint={hint ?? (muted ? "Restore sound at the current position" : "Mute sound while the song continues")}
      accessibilityState={{ busy: state === "loading" }}
      accessibilityValue={{ text: `Music ${state}` }} onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
      {state === "loading"
        ? <ActivityIndicator testID="music-state-loading" size="small" color={colors.gold} />
        : <Ionicons testID={`music-state-${state}`} name={icon} size={20} color={colors.gold} />}
      {(needsPlay || state === "error") && <View testID="music-action-badge" style={styles.badge}>
        <Ionicons name={state === "error" ? "refresh" : "play"} size={10} color={colors.wineDeep} />
      </View>}
    </Pressable>
    {hint && <Text testID="music-status-hint" accessibilityLiveRegion="polite" style={styles.hint}>{hint}</Text>}
  </View>;
}

const styles = StyleSheet.create({
  container: { width: 44, height: 44, alignItems: "center" },
  button: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: colors.wineDeep,
    alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: colors.gold,
  },
  pressed: { opacity: 0.7, transform: [{ scale: 0.95 }] },
  badge: {
    position: "absolute", bottom: 1, right: 0, width: 16, height: 16, borderRadius: 8,
    backgroundColor: colors.gold, alignItems: "center", justifyContent: "center",
  },
  hint: {
    position: "absolute", top: 50, right: 0, width: 162, paddingHorizontal: 10,
    paddingVertical: 7, borderRadius: 10, backgroundColor: colors.glassFill,
    borderWidth: 1, borderColor: colors.border, color: colors.wineDeep,
    fontFamily: fonts.serif, fontSize: 13, lineHeight: 17, textAlign: "center",
    pointerEvents: "none",
  },
});