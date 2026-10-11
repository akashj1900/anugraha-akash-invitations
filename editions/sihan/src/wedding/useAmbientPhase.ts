import { useEffect } from "react";
import { AccessibilityInfo, AppState } from "react-native";
import { cancelAnimation, Easing, SharedValue, useAnimatedReaction, useReducedMotion, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";

export function useAmbientPhase(active: SharedValue<boolean>, duration: number) {
  const initialPreference = useReducedMotion();
  const reduced = useSharedValue(initialPreference);
  const foreground = useSharedValue(AppState.currentState !== "background");
  const phase = useSharedValue(0);
  useEffect(() => {
    let mounted = true;
    let changed = false;
    const app = AppState.addEventListener("change", (state) => { foreground.value = state === "active"; });
    const preference = AccessibilityInfo.addEventListener("reduceMotionChanged", (value) => {
      changed = true; reduced.value = value;
    });
    AccessibilityInfo.isReduceMotionEnabled().then((value) => { if (mounted && !changed) reduced.value = value; }).catch(() => undefined);
    return () => { mounted = false; app.remove(); preference.remove(); cancelAnimation(phase); };
  }, [foreground, phase, reduced]);
  useAnimatedReaction(() => active.value && foreground.value && !reduced.value, (animate) => {
    cancelAnimation(phase);
    if (animate) phase.value = withRepeat(withTiming(phase.value + Math.PI * 2, { duration, easing: Easing.linear }), -1, false);
  }, [duration]);
  return phase;
}