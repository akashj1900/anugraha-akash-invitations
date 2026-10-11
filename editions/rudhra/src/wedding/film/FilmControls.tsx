import { Ionicons } from "@react-native-vector-icons/ionicons";
import { useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { colors, fonts } from "@/src/theme";
import type { FilmState } from "./types";

export function FilmControls({ state, onPress }: { state: FilmState; onPress: () => void }) {
  const [focused, setFocused] = useState(false);
  const canPause = state === "playing" || state === "loading";
  const label = state === "error" ? "Retry film" : canPause ? "Pause film" : "Play film";
  const message = state === "error" ? "Film unavailable. Tap to retry." : state === "blocked" ? "Tap to play the film" : state === "loading" ? "Loading film…" : null;
  return <>
    {message && <View testID="wedding-film-feedback" style={styles.feedback}>
      {state === "loading" && <ActivityIndicator testID="wedding-film-loading" size="small" color={colors.goldSoft} />}
      <Text testID="wedding-film-status" accessibilityLiveRegion="polite" style={styles.message}>{message}</Text>
    </View>}
    <View testID={`film-state-${state}`} style={styles.controls}>
      <Pressable testID="wedding-film-toggle" accessibilityRole="button" accessibilityLabel={label}
        accessibilityHint="The film is muted. Invitation music is controlled separately."
        accessibilityState={{ busy: state === "loading" }} onPress={onPress}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
        {focused && <View testID="wedding-film-focus-ring" style={styles.focusRing}>
          <View testID="wedding-film-focus-keyline" style={styles.focusKeyline} />
        </View>}
        <View testID="wedding-film-symbol" style={styles.symbol}>
          <Ionicons name={state === "error" ? "refresh" : canPause ? "pause" : "play"} size={15} color={colors.goldSoft} />
        </View>
      </Pressable>
    </View>
  </>;
}

const styles = StyleSheet.create({
  controls: { position: "absolute", top: 12, right: 12, width: 44, height: 44, alignItems: "center", pointerEvents: "box-none" },
  button: { width: 44, height: 44, alignItems: "center", justifyContent: "center", borderRadius: 24 },
  symbol: { width: 32, height: 32, alignItems: "center", justifyContent: "center", borderRadius: 16, backgroundColor: colors.scrim, borderWidth: 1, borderColor: colors.gold },
  pressed: { backgroundColor: colors.scrim, transform: [{ scale: 0.97 }] },
  focusRing: { position: "absolute", top: -4, bottom: -4, left: -4, right: -4, borderRadius: 27, borderWidth: 2, borderColor: colors.goldSoft, pointerEvents: "none" },
  focusKeyline: { position: "absolute", top: -3, bottom: -3, left: -3, right: -3, borderRadius: 28, borderWidth: 1, borderColor: colors.wineDeep, pointerEvents: "none" },
  feedback: { ...StyleSheet.absoluteFill, justifyContent: "center", alignItems: "center", gap: 6, paddingVertical: 12, paddingLeft: 16, paddingRight: 72, backgroundColor: colors.scrim, pointerEvents: "none" },
  message: { color: colors.cream, fontFamily: fonts.serif, fontSize: 16, lineHeight: 21, textAlign: "center" },
});