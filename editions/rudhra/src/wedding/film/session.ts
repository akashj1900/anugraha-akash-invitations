import type { FilmDriver, FilmEvent, FilmState } from "./types";

/** One film session for this visit; nothing here reads or changes the song. */
export function createFilmSession(createDriver: (receive: (event: FilmEvent) => void) => FilmDriver, notify: (state: FilmState) => void) {
  let driver: FilmDriver;
  let state: FilmState = "idle";
  let eligible = false;
  let manuallyPaused = false;
  let pending = false;
  let disposed = false;
  let generation = 0;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const clearGuard = () => { clearTimeout(timer); timer = undefined; };
  const publish = (next: FilmState) => { state = next; if (!disposed) notify(next); };
  const fail = (blocked = false) => {
    if (disposed) return;
    generation++;
    pending = false;
    clearGuard();
    publish(blocked ? "blocked" : "error");
    driver?.pause();
  };
  const loading = () => {
    pending = true;
    publish("loading");
    if (!timer) timer = setTimeout(() => fail(), 20000);
  };
  const play = () => {
    if (!eligible || manuallyPaused || disposed) return;
    const request = ++generation;
    loading();
    try {
      // Synchronous invocation retains user activation for the browser fallback.
      Promise.resolve(driver.play()).catch((error: unknown) => {
        if (disposed || !eligible || manuallyPaused || request !== generation) return;
        const name = error instanceof Error ? error.name : "";
        fail(name === "NotAllowedError" || name === "AbortError");
      });
    } catch { fail(); }
  };
  const receive = (event: FilmEvent) => {
    if (disposed) return;
    if (event === "error") return fail();
    if (event === "playing") {
      if (!eligible || manuallyPaused || state === "error" || state === "blocked") return driver.pause();
      pending = false;
      clearGuard();
      publish("playing");
    } else if (event === "loading" && eligible && !manuallyPaused && state !== "error" && state !== "blocked") {
      loading();
    } else if (event === "paused" && eligible && !manuallyPaused && !pending && state === "playing" && !driver.isPlaying()) {
      publish("blocked");
    }
  };
  driver = createDriver(receive);
  const pause = () => {
    generation++;
    pending = false;
    clearGuard();
    if (state !== "error" && state !== "blocked") publish("paused");
    driver.pause();
  };
  const retry = () => {
    const request = ++generation;
    loading();
    try {
      Promise.resolve(driver.reload()).then(() => {
        if (!disposed && request === generation && eligible && !manuallyPaused) play();
      }).catch(() => { if (!disposed && request === generation) fail(); });
    } catch { fail(); }
  };
  return {
    setEligible(value: boolean) {
      if (disposed || eligible === value) return;
      eligible = value;
      if (!value) pause();
      else if (!manuallyPaused && state !== "error" && state !== "blocked") play();
    },
    press() {
      if (disposed) return;
      if (state === "playing" || (state === "loading" && pending)) {
        manuallyPaused = true;
        pause();
      } else {
        manuallyPaused = false;
        if (!eligible) return;
        if (state === "error") retry();
        else play();
      }
    },
    dispose() {
      disposed = true;
      generation++;
      clearGuard();
      driver.dispose();
    },
  };
}