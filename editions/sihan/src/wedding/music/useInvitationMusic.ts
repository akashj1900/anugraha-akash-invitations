import { useCallback, useEffect, useRef, useState } from "react";
import { useFocusEffect } from "expo-router";
import { subscribeMusicActivity } from "./player";
import { createMusicSession } from "./session";
import { MusicSnapshot } from "./types";

export function useInvitationMusic() {
  const [snapshot, setSnapshot] = useState<MusicSnapshot>({ state: "paused", muted: false });
  const [retry, setRetry] = useState(0);
  const session = useRef<ReturnType<typeof createMusicSession> | null>(null);
  const requested = useRef(false);
  const focused = useRef(true);
  const active = useRef(true);
  useFocusEffect(useCallback(() => {
    focused.current = true;
    session.current?.setActive(active.current);
    return () => { focused.current = false; session.current?.setActive(false); };
  }, []));
  useEffect(() => {
    try {
      const current = createMusicSession(setSnapshot);
      session.current = current;
      const unsubscribe = subscribeMusicActivity((next) => {
        active.current = next;
        current.setActive(next && focused.current);
      });
      if (requested.current) current.start();
      return () => {
        unsubscribe();
        current.dispose();
        session.current = null;
      };
    } catch {
      session.current?.dispose();
      session.current = null;
      setSnapshot({ state: "error", muted: false });
    }
  }, [retry]);
  const onPress = () => session.current ? session.current.press() : setRetry((value) => value + 1);
  const start = useCallback(() => {
    requested.current = true;
    session.current?.start();
  }, []);
  return { ...snapshot, onPress, start };
}