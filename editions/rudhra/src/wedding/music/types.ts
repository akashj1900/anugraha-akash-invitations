export type MusicState = "loading" | "playing" | "muted" | "blocked" | "paused" | "error";
export type MusicSnapshot = { state: MusicState; muted: boolean };
export type PlayerEvent = "loading" | "playing" | "paused" | "error";
export type MusicPlayer = {
  play: () => void | Promise<void>;
  pause: () => void;
  setMuted: (muted: boolean) => void;
  position: () => number;
  retry: (position: number) => void;
  dispose: () => void;
};

// The original supplied bytes, with no trimming, transcoding or speed changes.
export const SOUNDTRACK = require("../../../assets/audio/Mangalyam-Tantunanena.mp3");