import { useCallback, useEffect, useRef, useState } from 'react';
import { AccessibilityInfo } from 'react-native';
import { cancelAnimation, Easing, ReduceMotion, useAnimatedStyle, useReducedMotion, useSharedValue, withTiming } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import type { PortraitStatus } from './usePortraitLoad';

export function useCoupleReveal(status: PortraitStatus) {
  const [requested, setRequested] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const initialReduced = useReducedMotion();
  const reduced = useSharedValue(initialReduced);
  const progress = useSharedValue(0);
  const tapped = useRef(false);
  const started = useRef(false);
  const mounted = useRef(true);
  const finish = useCallback(() => { if (mounted.current) setRevealed(true); }, []);
  useEffect(() => {
    mounted.current = true;
    let changed = false;
    const update = (value: boolean) => {
      reduced.set(value);
      if (value && started.current && progress.get() < 1) {
        progress.set(withTiming(1, { duration: 150, reduceMotion: ReduceMotion.Never }, (done) => { if (done) scheduleOnRN(finish); }));
      }
    };
    const listener = AccessibilityInfo.addEventListener('reduceMotionChanged', (value) => { changed = true; update(value); });
    AccessibilityInfo.isReduceMotionEnabled().then((value) => { if (mounted.current && !changed) update(value); }).catch(() => undefined);
    return () => { mounted.current = false; listener.remove(); cancelAnimation(progress); };
  }, [finish, progress, reduced]);

  const begin = useCallback(() => {
    if (started.current || status !== 'ready') return;
    started.current = true;
    progress.set(withTiming(1, {
      duration: reduced.get() ? 180 : 1000, easing: Easing.linear, reduceMotion: ReduceMotion.Never,
    }, (done) => { if (done) scheduleOnRN(finish); }));
  }, [finish, progress, reduced, status]);
  useEffect(() => { if (requested && status === 'ready') begin(); }, [begin, requested, status]);
  const request = () => {
    if (tapped.current) return;
    tapped.current = true;
    setRequested(true);
    // The one-second fade starts only when the original portrait is ready.
    // Pending images keep their cover until the readiness effect starts it.
    begin();
  };
  const coverStyle = useAnimatedStyle(() => ({
    opacity: 1 - progress.get(),
  }));
  const imageStyle = useAnimatedStyle(() => ({
    opacity: progress.get(),
  }));
  return { requested, revealed, coverStyle, imageStyle, request };
}