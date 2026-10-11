import { useCallback, useEffect, useRef, useState } from "react";
import { AccessibilityInfo, Platform } from "react-native";
import * as Haptics from "expo-haptics";
import { cancelAnimation, Easing, ReduceMotion, useDerivedValue, useReducedMotion, useSharedValue, withTiming } from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { useAmbientPhase } from "../useAmbientPhase";

export function useLetterOpening(onOpen: () => void, onSealTap: () => void) {
  const initialReducedMotion = useReducedMotion();
  const reduced = useSharedValue(initialReducedMotion);
  const progress = useSharedValue(0);
  const opening = useSharedValue(false);
  const idleActive = useDerivedValue(() => !opening.value);
  const highlight = useAmbientPhase(idleActive, 8400);
  const [busy, setBusy] = useState(false);
  const tapped = useRef(false);
  const mounted = useRef(true);
  const complete = useRef(onOpen);
  complete.current = onOpen;

  useEffect(() => {
    mounted.current = true;
    let changed = false;
    const listener = AccessibilityInfo.addEventListener("reduceMotionChanged", (value) => {
      changed = true;
      reduced.value = value;
    });
    AccessibilityInfo.isReduceMotionEnabled().then((value) => {
      if (mounted.current && !changed) reduced.value = value;
    }).catch(() => undefined);
    return () => { mounted.current = false; listener.remove(); cancelAnimation(progress); };
  }, [progress, reduced]);

  const finish = useCallback(() => { if (mounted.current) complete.current(); }, []);
  const open = () => {
    if (tapped.current) return;
    tapped.current = true;
    onSealTap();
    setBusy(true);
    opening.value = true;
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => undefined);
    progress.value = withTiming(1, {
      duration: reduced.value ? 280 : 980,
      easing: Easing.linear,
      // Reduced motion is explicitly handled as a short opacity-only transition.
      reduceMotion: ReduceMotion.Never,
    }, (finished) => { if (finished) scheduleOnRN(finish); });
  };
  return { progress, reduced, highlight, busy, open };
}