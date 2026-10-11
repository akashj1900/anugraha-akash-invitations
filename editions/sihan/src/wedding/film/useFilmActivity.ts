import { useEffect, useState } from "react";
import { AppState, Platform } from "react-native";

export function useFilmActivity() {
  const [active, setActive] = useState(AppState.currentState === "active" || AppState.currentState === null);
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (state) => setActive(state === "active"));
    if (Platform.OS !== "web") return () => subscription.remove();
    const visibility = () => setActive(document.visibilityState === "visible");
    const hide = () => setActive(false);
    document.addEventListener("visibilitychange", visibility);
    window.addEventListener("pagehide", hide);
    window.addEventListener("pageshow", visibility);
    visibility();
    return () => {
      subscription.remove();
      document.removeEventListener("visibilitychange", visibility);
      window.removeEventListener("pagehide", hide);
      window.removeEventListener("pageshow", visibility);
    };
  }, []);
  return active;
}