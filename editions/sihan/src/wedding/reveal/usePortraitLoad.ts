import { useEffect, useRef, useState } from "react";

export type PortraitStatus = "loading" | "ready" | "error";

export function usePortraitLoad() {
  const [attempt, setAttempt] = useState(0);
  const [status, setStatus] = useState<PortraitStatus>("loading");
  const [waiting, setWaiting] = useState(false);
  const generation = useRef(0);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);
  useEffect(() => {
    // Web images may be lazy-loaded far below the viewport. Only time out
    // a request the guest is actually waiting for, not time spent in the hero.
    if (!waiting || status !== "loading") return;
    const timer = setTimeout(() => {
      if (mounted.current && generation.current === attempt) setStatus("error");
    }, 20000);
    return () => clearTimeout(timer);
  }, [attempt, status, waiting]);
  const update = (next: PortraitStatus) => {
    if (mounted.current && generation.current === attempt) setStatus(next);
  };
  const retry = () => {
    generation.current++;
    setWaiting(true);
    setStatus("loading");
    setAttempt(generation.current);
  };
  return { attempt, status, retry, waitForLoad: () => setWaiting(true), onLoad: () => update("ready"), onError: () => update("error") };
}