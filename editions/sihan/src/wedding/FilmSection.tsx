import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import { Ionicons } from "@react-native-vector-icons/ionicons";
import { StyleSheet, Text, View } from "react-native";
import { colors, fonts } from "@/src/theme";
import { FILM } from "./data";
import { useInvitationLayout } from "./useInvitationLayout";
import { FilmPlayer } from "./film/FilmPlayer";
import { FilmControls } from "./film/FilmControls";
import { useFilmActivity } from "./film/useFilmActivity";
import { FilmScrollGeometry, useFilmVisibility } from "./film/useFilmVisibility";

export function FilmSection({ occluded, ...geometry }: FilmScrollGeometry & { occluded: boolean }) {
  const { safeWidth, safeHeight } = useInvitationLayout();
  const active = useFilmActivity();
  const [focused, setFocused] = useState(true);
  useFocusEffect(useCallback(() => { setFocused(true); return () => setFocused(false); }, []));
  const allowed = active && focused && !occluded;
  const { arrived, visible, prepare, onSectionLayout, onAreaLayout, sectionRef, areaRef } = useFilmVisibility(geometry, allowed);
  const eligible = visible && allowed;
  const width = Math.min(Math.max(1, Math.min(760, safeWidth) - 72), Math.max(120, safeHeight * 0.68) * FILM.aspectRatio);
  return <View ref={sectionRef} testID="wedding-film-section" style={styles.section} onLayout={onSectionLayout}>
    <View testID="wedding-film-heading" style={styles.heading}>
      <Ionicons name="film-outline" size={26} color={colors.goldDeep} />
      <Text testID="wedding-film-title" style={styles.title}>{FILM.eyebrow}</Text>
    </View>
    <View ref={areaRef} testID="wedding-film-area" onLayout={onAreaLayout} style={[styles.area, { width, aspectRatio: FILM.aspectRatio }]}>
      {arrived ? <FilmPlayer eligible={eligible} /> : <FilmControls state="idle" onPress={prepare} />}
    </View>
  </View>;
}

const styles = StyleSheet.create({
  section: { width: "100%", maxWidth: 760, alignSelf: "center", paddingHorizontal: 16, paddingVertical: 32, alignItems: "center" },
  heading: { alignItems: "center", paddingHorizontal: 20 },
  title: { color: colors.wineDeep, fontFamily: fonts.cinzel, fontSize: 19, textAlign: "center", marginTop: 14 },
  area: { marginTop: 20, backgroundColor: colors.bgDeep, borderColor: colors.gold, borderWidth: 1, borderRadius: 16, overflow: "hidden" },
});