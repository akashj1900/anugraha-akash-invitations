export type FilmState = "idle" | "loading" | "playing" | "paused" | "blocked" | "error";
export type FilmEvent = "playing" | "paused" | "loading" | "error";
export type FilmDriver = {
  play: () => void | Promise<void>;
  pause: () => void;
  reload: () => void | Promise<void>;
  isPlaying: () => boolean;
  dispose: () => void;
};