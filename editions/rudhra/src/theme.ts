// Royal wedding invitation — cool aubergine, antique gold, and ivory paper.

import { useMemo } from "react";
import { Appearance, StyleSheet, useColorScheme } from "react-native";

export type ColorScheme = "light" | "dark";

// Premium royal-aubergine purple palette — regal, refined, gallery-elegant.
// Gold + cream accents preserved from the original invitation aesthetic.
const dark = {
  // Surfaces — ivory paper canvas with royal purple accent surfaces.
  surface: "#F4EBDB", // ivory main body
  onSurface: "#2A0F45",
  surfaceSecondary: "#FBF6EA",
  onSurfaceSecondary: "#2A0F45",
  surfaceTertiary: "#EFE3CE",
  onSurfaceTertiary: "#2A0F45",
  surfaceInverse: "#2A0F45", // deepest royal purple for portals + closing
  onSurfaceInverse: "#F4EBDB",
  muted: "#6B5A80",

  // Brand — antique gold + regal aubergine.
  brand: "#C9A24B",
  onBrand: "#2A0F45",
  brandPrimary: "#C9A24B",
  onBrandPrimary: "#2A0F45",
  brandSecondary: "#4A1E6E",
  onBrandSecondary: "#F4EBDB",
  brandTertiary: "#EFE3CE",
  onBrandTertiary: "#2A0F45",

  // Status
  success: "#8FB37A",
  onSuccess: "#1A2410",
  warning: "#D9A24A",
  onWarning: "#2A1A00",
  error: "#C05050",
  onError: "#FFFFFF",
  info: "#8AA9C9",
  onInfo: "#0A1A2A",

  // Lines
  border: "rgba(74,30,110,0.20)",
  borderStrong: "#C9A24B",
  divider: "rgba(42,15,69,0.15)",

  // Extras used throughout the invitation.
  bgDeep: "#2A0F45", // aubergine near-black for loader / seal / closing
  bgMid: "#4A1E6E", // premium royal purple
  bgIvory: "#F4EBDB",
  gold: "#C9A24B",
  goldSoft: "#E5C878",
  goldDeep: "#8A6A25",
  cream: "#F4EBDB",
  ink: "#2A0F45",
  wine: "#4A1E6E", // primary purple accent (replaces old maroon "wine")
  wineDeep: "#2A0F45",
  scrim: "rgba(42,15,69,0.65)",
  glassFill: "rgba(255,247,225,0.9)",
  glassStroke: "rgba(255,255,255,0.9)",
  paperStone: "#E2D5BD",
  paperStoneShade: "#BAA788",
  paperShadow: "#372544",
  pondWater: "#809A8B",
  pondDeep: "#506D62",
  lotusLeaf: "#7C8B58",
  waterShadow: "#385B55",
  waterLight: "#E2EADA",
  lotusPink: "#EFC3CD",
  fireOrange: "#DE782D",
  fireGold: "#F5B94B",
  fireCore: "#FFF1BB",
  // Marigold paper flowers, marriage aubergine and reception champagne gold.
  marigold: "#D99A2B",
  accentWedding: "#4A1E6E",
  accentReception: "#B08A3E",
} as const;

export type ThemeColors = typeof dark;

export const defaultScheme = "dark" satisfies ColorScheme;

export const themes: { light?: ThemeColors; dark: ThemeColors } = { dark };

export function setColorScheme(scheme: ColorScheme | null) {
  Appearance.setColorScheme?.(scheme ?? "unspecified");
}

setColorScheme?.(defaultScheme);

export function useTheme(): { scheme: ColorScheme; colors: ThemeColors } {
  const system = useColorScheme();
  const scheme: ColorScheme = (system === "light" || system === "dark") && themes[system] ? system : defaultScheme;
  return { scheme, colors: themes[scheme] ?? themes.dark };
}

export function makeStyles<T extends StyleSheet.NamedStyles<T> | StyleSheet.NamedStyles<any>>(
  factory: (colors: ThemeColors) => T & StyleSheet.NamedStyles<any>,
): () => T {
  return function useStyles(): T {
    const { colors } = useTheme();
    return useMemo(() => StyleSheet.create(factory(colors)), [colors]);
  };
}

// Font family names loaded via expo-font in _layout.tsx.
export const fonts = {
  cinzel: "Cinzel",
  serif: "CormorantGaramond",
  serifItalic: "CormorantGaramondItalic",
  serifBold: "CormorantGaramondBold",
  dateNumeral: "SerifDateNumeral",
} as const;

// Colors object for module-level styles (kept in sync with `dark`).
export const colors = dark;
