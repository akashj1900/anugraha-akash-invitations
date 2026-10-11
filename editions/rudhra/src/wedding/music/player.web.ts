import { Asset } from "expo-asset";
import { MusicPlayer, PlayerEvent, SOUNDTRACK } from "./types";

/** Browser adapter: Expo 57's web play() drops the autoplay rejection promise. */
export function createMusicPlayer(onEvent: (event: PlayerEvent) => void): MusicPlayer {
  const audio = new Audio();
  let restorePosition = 0;
  audio.preload = "auto";
  audio.loop = true;
  audio.onplaying = () => onEvent("playing");
  audio.onwaiting = () => onEvent("loading");
  audio.onpause = () => onEvent("paused");
  audio.onerror = () => onEvent("error");
  audio.onloadedmetadata = () => {
    if (restorePosition > 0) {
      audio.currentTime = Math.min(restorePosition, Math.max(0, audio.duration - 0.1));
      restorePosition = 0;
    }
  };
  // Prepare silently during scene loading. Only the seal's user gesture plays it.
  audio.src = Asset.fromModule(SOUNDTRACK).uri;
  return {
    play: () => audio.play(),
    pause: () => audio.pause(),
    setMuted: (muted) => { audio.muted = muted; },
    position: () => audio.currentTime,
    retry: (position) => { restorePosition = position; audio.load(); },
    dispose: () => {
      audio.onplaying = audio.onwaiting = audio.onpause = audio.onerror = audio.onloadedmetadata = null;
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
    },
  };
}

export function subscribeMusicActivity(onChange: (active: boolean) => void) {
  const visibility = () => onChange(document.visibilityState === "visible");
  const hide = () => onChange(false);
  document.addEventListener("visibilitychange", visibility);
  window.addEventListener("pagehide", hide);
  window.addEventListener("pageshow", visibility);
  visibility();
  return () => {
    document.removeEventListener("visibilitychange", visibility);
    window.removeEventListener("pagehide", hide);
    window.removeEventListener("pageshow", visibility);
  };
}