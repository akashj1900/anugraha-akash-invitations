import { useEffect, useRef, useState } from "react";
import { Image, ImageProps } from "expo-image";
import { usePreparedAsset } from "./ScenePreparation";

/** Stays mounted behind the entry cover, then reuses its decoded bitmap. */
export function JourneyImage(props: ImageProps) {
  const { complete, fail } = usePreparedAsset();
  const [attempt, setAttempt] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  return <Image {...props} key={attempt} cachePolicy="memory-disk" transition={0} priority="high"
    onDisplay={() => { complete(); props.onDisplay?.(); }}
    onError={(error) => {
      if (attempt < 2) timer.current = setTimeout(() => setAttempt((value) => value + 1), 300 * (attempt + 1));
      else fail();
      props.onError?.(error);
    }}
  />;
}