import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { SharedValue, useAnimatedStyle } from "react-native-reanimated";
import { colors, fonts } from "@/src/theme";
import { smoothRange } from "./PaperLayer";

const CHAPTERS = [
  { label: "OUR WEDDING CELEBRATION", from: 0, to: 0.22 },
  { label: "A GRAND WELCOME", from: 0.22, to: 0.43 },
  { label: "GANPATI'S BLESSINGS", from: 0.43, to: 0.72 },
  { label: "SEVEN VOWS, ONE FOREVER", from: 0.72, to: 1.1 },
];

function Chapter({ chapter, index, progress, onHeight }: { chapter: typeof CHAPTERS[number]; index: number; progress: SharedValue<number>; onHeight: (height: number) => void }) {
  const animated = useAnimatedStyle(() => ({
    opacity: (index === 0 ? 1 : smoothRange(progress.value, chapter.from, chapter.from + 0.025)) *
      (1 - smoothRange(progress.value, chapter.to - 0.025, chapter.to)),
  }));
  return <Animated.View style={[styles.chapter, animated]}>
    <Text testID={`journey-chapter-${index + 1}`} onLayout={(event) => onHeight(event.nativeEvent.layout.height)} style={styles.label}>{chapter.label}</Text>
  </Animated.View>;
}

export function JourneyCaption({ progress, compact = false }: { progress: SharedValue<number>; compact?: boolean }) {
  const [heights, setHeights] = useState<number[]>([17, 17, 17, 17]);
  const fill = useAnimatedStyle(() => ({ transform: [{ scaleX: Math.max(0.005, progress.value) }] }));
  return <View testID="journey-chapters" style={styles.container}>
    <View style={[styles.track, compact && styles.compactTrack]}><Animated.View testID="journey-progress" style={[styles.fill, fill]} /></View>
    <View style={[styles.labels, { height: Math.max(17, ...heights) }]}>{CHAPTERS.map((chapter, index) => <Chapter key={chapter.label} {...{ chapter, index, progress }} onHeight={(height) => setHeights((previous) => previous[index] === height ? previous : previous.map((value, i) => i === index ? height : value))} />)}</View>
  </View>;
}

const styles = StyleSheet.create({
  container: { width: "100%", alignItems: "center", marginBottom: 8 },
  track: { width: 112, height: 1, backgroundColor: colors.border, overflow: "hidden", marginBottom: 13 },
  fill: { width: "100%", height: "100%", backgroundColor: colors.goldDeep, transformOrigin: "left center" },
  compactTrack: { marginBottom: 7 },
  labels: { width: "100%" },
  chapter: { position: "absolute", top: 0, left: 0, right: 0, alignItems: "center" },
  label: { fontFamily: fonts.cinzel, color: colors.goldDeep, fontSize: 10, lineHeight: 15, letterSpacing: 1.2, textAlign: "center", width: "100%" },
});