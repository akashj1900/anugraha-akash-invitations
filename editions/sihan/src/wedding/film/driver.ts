import type { VideoPlayer } from "expo-video";
import type { View } from "react-native";
import { FILM } from "../data";
import type { FilmDriver, FilmEvent } from "./types";

export function createFilmDriver(player: VideoPlayer, _container: View | null, receive: (event: FilmEvent) => void): FilmDriver {
  let disposed = false;
  const status = player.addListener("statusChange", ({ status }) => {
    if (status === "error") receive("error");
    else if (status === "loading") receive("loading");
    else if (status === "readyToPlay" && player.playing) receive("playing");
  });
  const playback = player.addListener("playingChange", ({ isPlaying }) => {
    receive(isPlaying ? player.status === "readyToPlay" ? "playing" : "loading" : "paused");
  });
  return {
    play: () => player.play(),
    pause: () => player.pause(),
    isPlaying: () => player.playing,
    reload: async () => {
      const position = player.currentTime;
      await player.replaceAsync({ uri: FILM.uri, contentType: "progressive" });
      if (disposed) return;
      player.muted = true;
      player.volume = 0;
      player.loop = true;
      player.currentTime = Math.min(position, Math.max(0, player.duration - 0.01));
    },
    dispose: () => {
      disposed = true;
      // useVideoPlayer owns release; a parent unmount can already have released it.
      try { status.remove(); playback.remove(); player.pause(); } catch { /* already released */ }
    },
  };
}