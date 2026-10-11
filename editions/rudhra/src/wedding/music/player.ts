import { createAudioPlayer, setAudioModeAsync } from "expo-audio";
import { AppState } from "react-native";
import { MusicPlayer, PlayerEvent, SOUNDTRACK } from "./types";

/** Native-only implementation; Metro selects player.web.ts in the browser. */
export function createMusicPlayer(onEvent: (event: PlayerEvent) => void): MusicPlayer {
  const player = createAudioPlayer(SOUNDTRACK, { updateInterval: 500 });
  let generation = 0;
  let restorePosition = 0;
  player.loop = true;
  const configure = () => setAudioModeAsync({
    playsInSilentMode: true,
    shouldPlayInBackground: false,
    allowsRecording: false,
    allowsBackgroundRecording: false,
    interruptionMode: "mixWithOthers",
  });
  const prepared = configure().then(() => true, () => false);
  const subscription = player.addListener("playbackStatusUpdate", (status) => {
    if (status.error) return onEvent("error");
    if (status.isLoaded && restorePosition > 0) {
      const position = restorePosition;
      restorePosition = 0;
      void player.seekTo(position).catch(() => onEvent("error"));
    }
    if (status.isBuffering) onEvent("loading");
    else if (status.playing && status.isLoaded) onEvent("playing");
    else if (status.isLoaded && !status.playing) onEvent("paused");
  });
  return {
    play: async () => {
      const request = ++generation;
      if (!await prepared) await configure();
      if (request === generation) player.play();
    },
    pause: () => { generation++; player.pause(); },
    setMuted: (muted) => { player.muted = muted; },
    position: () => player.currentTime,
    retry: (position) => {
      restorePosition = position;
      const muted = player.muted;
      player.replace(SOUNDTRACK);
      player.loop = true;
      player.muted = muted;
    },
    dispose: () => { generation++; subscription.remove(); player.remove(); },
  };
}

export function subscribeMusicActivity(onChange: (active: boolean) => void) {
  const subscription = AppState.addEventListener("change", (state) => onChange(state === "active"));
  onChange(AppState.currentState === "active" || AppState.currentState === null);
  return () => subscription.remove();
}