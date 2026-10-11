import { createMusicPlayer } from "./player";
import { MusicPlayer, MusicSnapshot, MusicState, PlayerEvent } from "./types";

/** One session per open invitation. No progress updates re-render the artwork. */
export function createMusicSession(notify: (snapshot: MusicSnapshot) => void) {
  let player: MusicPlayer;
  let state: MusicState = "paused";
  let muted = false;
  let active = false;
  let disposed = false;
  let pending = false;
  let resumeWanted = false;
  let started = false;
  let attempt = 0;
  let savedPosition = 0;
  let timeout: ReturnType<typeof setTimeout> | undefined;

  const publish = (next: MusicState) => {
    state = next;
    if (!disposed) notify({ state, muted });
  };
  const clearTimeoutGuard = () => { clearTimeout(timeout); timeout = undefined; };
  const fail = (blocked = false) => {
    if (disposed) return;
    attempt++;
    pending = false;
    resumeWanted = false;
    savedPosition = player?.position() || savedPosition;
    clearTimeoutGuard();
    publish(blocked ? "blocked" : "error");
    player?.pause();
  };
  const loading = () => {
    pending = true;
    publish("loading");
    // A stalled download must not leave a permanently disabled/spinning control.
    if (!timeout) timeout = setTimeout(() => fail(), 20000);
  };
  const play = () => {
    if (!active || !started || disposed) return;
    const request = ++attempt;
    loading();
    try {
      // Call synchronously so an explicit button tap retains browser activation.
      Promise.resolve(player.play()).catch((error: unknown) => {
        if (disposed || !active || request !== attempt) return;
        const name = error instanceof Error ? error.name : "";
        fail(name === "NotAllowedError" || name === "AbortError");
      });
    } catch {
      fail();
    }
  };
  const receive = (event: PlayerEvent) => {
    if (disposed) return;
    if (event === "error") return fail();
    if (event === "playing") {
      if (!active || !started || (state === "error" && !pending)) return player.pause();
      pending = false;
      clearTimeoutGuard();
      publish(muted ? "muted" : "playing");
    } else if (event === "loading" && active && started && state !== "error" && state !== "blocked") {
      loading();
    } else if (event === "paused" && active && started && !pending && state !== "error" && state !== "blocked") {
      publish("blocked");
    }
  };
  player = createMusicPlayer(receive);

  return {
    start() {
      if (started || disposed) return;
      started = true;
      if (!active) { resumeWanted = true; return; }
      if (state === "error") {
        try { player.retry(savedPosition); } catch { fail(); return; }
      }
      play();
    },
    setActive(next: boolean) {
      if (disposed || next === active) return;
      active = next;
      if (!next) {
        // Preserve muted playback too; duplicate background events do not erase this.
        resumeWanted = state === "playing" || state === "muted" || pending;
        attempt++;
        pending = false;
        clearTimeoutGuard();
        player.pause();
        if (state !== "blocked" && state !== "error") publish("paused");
      } else if (resumeWanted) {
        resumeWanted = false;
        play();
      }
    },
    press() {
      if (disposed || !active) return;
      if (state === "error") {
        try { player.retry(savedPosition); play(); } catch { fail(); }
      } else if (state === "blocked" || state === "paused") {
        play();
      } else {
        muted = !muted;
        player.setMuted(muted);
        publish(state === "loading" ? "loading" : muted ? "muted" : "playing");
      }
    },
    dispose() {
      disposed = true;
      active = false;
      attempt++;
      clearTimeoutGuard();
      player.dispose();
    },
  };
}