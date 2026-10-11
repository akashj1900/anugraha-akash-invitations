import type { VideoPlayer } from "expo-video";
import type { View } from "react-native";
import type { FilmDriver, FilmEvent } from "./types";

/** Standard DOM media bridge for the Expo VideoView inside our own RN wrapper.
 * Expo57 web play() drops its promise and replace() forces an unsolicited play.
 * No private Expo properties, dependency patches or global error suppression.
 */
export function createFilmDriver(_player: VideoPlayer, container: View | null, receive: (event: FilmEvent) => void): FilmDriver {
  const video = (container as unknown as HTMLElement | null)?.querySelector("video");
  if (!video) throw new Error("Film view is not ready");
  video.muted = video.defaultMuted = true;
  video.volume = 0;
  video.loop = true;
  video.playsInline = true;
  video.controls = false;
  video.disablePictureInPicture = true;
  // This view exists only after the section's first visible edge. Prepare data
  // now, without playing until the frame itself intersects the viewport.
  video.preload = "auto";
  let restorePosition = 0;
  const listeners = {
    playing: () => receive("playing"),
    waiting: () => receive("loading"),
    pause: () => receive("paused"),
    error: () => receive("error"),
    loadedmetadata: () => {
      if (restorePosition > 0) {
        video.currentTime = Math.min(restorePosition, Math.max(0, video.duration - 0.01));
        restorePosition = 0;
      }
    },
    volumechange: () => {
      if (!video.muted) video.muted = true;
      if (video.volume !== 0) video.volume = 0;
    },
  };
  for (const [event, listener] of Object.entries(listeners)) video.addEventListener(event, listener);
  return {
    play: () => video.play(),
    pause: () => video.pause(),
    isPlaying: () => !video.paused && !video.ended,
    reload: () => { restorePosition = video.currentTime || restorePosition; video.load(); },
    dispose: () => {
      for (const [event, listener] of Object.entries(listeners)) video.removeEventListener(event, listener);
      video.pause();
      video.removeAttribute("src");
      video.load();
    },
  };
}