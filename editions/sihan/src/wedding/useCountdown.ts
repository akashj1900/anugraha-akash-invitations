import { useEffect, useState } from "react";

import { WEDDING_DATE_ISO } from "./data";

export type TimeLeft = {
  days: number;
  hours: number;
  mins: number;
  secs: number;
  done: boolean;
};

function compute(target: number): TimeLeft {
  const now = Date.now();
  const diff = Math.max(0, target - now);
  const secs = Math.floor(diff / 1000);
  return {
    days: Math.floor(secs / 86400),
    hours: Math.floor((secs % 86400) / 3600),
    mins: Math.floor((secs % 3600) / 60),
    secs: secs % 60,
    done: diff === 0,
  };
}

export function useCountdown(): TimeLeft {
  const target = new Date(WEDDING_DATE_ISO).getTime();
  const [left, setLeft] = useState<TimeLeft>(() => compute(target));

  useEffect(() => {
    setLeft(compute(target));
    const id = setInterval(() => setLeft(compute(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  return left;
}

export const pad2 = (n: number) => String(n).padStart(2, "0");
