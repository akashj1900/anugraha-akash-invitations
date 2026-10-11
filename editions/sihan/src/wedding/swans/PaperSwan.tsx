import { Circle, G, Path } from "react-native-svg";
import { colors } from "@/src/theme";

/** A cut-paper silhouette, with the waterline at y=0. No image or new media fetch. */
export function PaperSwan({ id }: { id: string }) {
  return <G testID={`swan-art-${id}`}>
    <Path testID={`swan-silhouette-${id}`} d="M-95-12C-76-20-74-52-43-58C-18-64 6-54 28-41C48-31 60-28 64-44C68-62 43-73 39-91C34-108 44-125 61-129C78-134 91-122 90-111C89-103 85-99 80-99L77-108C80-113 75-120 66-118C56-116 53-107 57-96C63-84 82-70 84-52C88-27 70-8 43-3C9 7-48 5-71-4Z"
      fill={colors.surfaceSecondary} stroke={colors.paperStoneShade} strokeWidth="0.9" strokeLinejoin="round" />
    <Path d="M-87-12C-51 4 14 4 45-7C68-15 76-31 72-49C79-31 71-14 51-5C16 9-52 7-87-12Z" fill={colors.surfaceTertiary} />
    <Path d="M42-22C21-23-3-34-22-57C-35-72-41-75-45-75C-39-61-55-41-68-20C-42-3 10 1 42-22Z" fill={colors.paperStoneShade} opacity="0.3" transform="translate(1 2)" />
    <Path testID={`swan-layered-wing-${id}`} d="M42-24C19-25-4-36-22-60C-34-75-41-79-46-79C-39-61-57-41-70-23C-43-6 8-2 42-24Z" fill={colors.bgIvory} />
    <Path d="M-62-25C-42-24-15-34-18-55C-7-45 6-36 25-29C1-12-34-12-62-25Z" fill={colors.surfaceSecondary} />
    <Path d="M-45-69C-43-45-21-27 18-24M-52-46C-43-30-20-20 3-20" fill="none" stroke={colors.gold} strokeWidth="1" opacity="0.55" strokeLinecap="round" />
    <Path d="M-32-59C-23-42-4-31 15-27" fill="none" stroke={colors.surfaceTertiary} strokeWidth="1.7" strokeLinecap="round" />
    <Path d="M62-126C48-121 43-108 47-95C53-80 67-70 71-56" fill="none" stroke={colors.surfaceTertiary} strokeWidth="1.4" strokeLinecap="round" />
    <Path testID={`swan-gold-beak-${id}`} d="M88-113L105-103Q98-100 86-105Z" fill={colors.gold} />
    <Path d="M89-108L102-103 87-105Z" fill={colors.goldDeep} opacity="0.55" />
    <Circle cx="80" cy="-115" r="1.45" fill={colors.goldDeep} />
  </G>;
}