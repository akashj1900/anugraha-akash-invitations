import { useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/** One set of live viewport rules for native rotation and browser resizing. */
export function useInvitationLayout() {
  const { width, height, fontScale } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const safeWidth = Math.max(1, width - insets.left - insets.right);
  const safeHeight = Math.max(1, height - insets.top - insets.bottom);
  const gutter = safeWidth < 380 ? 12 : safeWidth < 768 ? 20 : 32;
  const compact = safeHeight < 700;
  const sideCaption = safeWidth >= 560 && safeWidth / safeHeight > 1.45;
  const captionWidth = sideCaption
    ? Math.min(420, safeWidth * 0.4)
    : Math.min(640, safeWidth - gutter * 2);
  return {
    width, height, fontScale, insets, safeWidth, safeHeight, gutter, compact,
    sideCaption, captionWidth,
    contentWidth: Math.min(safeWidth, 1120),
    twoColumns: safeWidth >= 760 && safeWidth / fontScale >= 680,
    stackIntros: safeWidth / fontScale < 360,
    sealSize: Math.max(88, Math.min(280, safeWidth - 64, safeHeight * 0.48)),
    sceneCenterX: sideCaption
      ? insets.left + (safeWidth - captionWidth - gutter * 2) / 2
      : insets.left + safeWidth / 2,
  };
}