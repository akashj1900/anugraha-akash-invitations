import { useCallback, useState } from 'react';
import type { LayoutChangeEvent } from 'react-native';
import { SharedValue, useAnimatedReaction, useSharedValue } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { intersectsViewport } from './visibility';

export type FilmScrollGeometry = {
  scrollY: SharedValue<number>;
  contentOrigin: SharedValue<number>;
  viewportHeight: SharedValue<number>;
};

export function useFilmVisibility({ scrollY, contentOrigin, viewportHeight }: FilmScrollGeometry, canPrepare: boolean) {
  const sectionY = useSharedValue(-1);
  const sectionHeight = useSharedValue(0);
  const areaY = useSharedValue(-1);
  const areaHeight = useSharedValue(0);
  const [visibility, setVisibility] = useState({ arrived: false, visible: false });
  const commit = useCallback((mask: number) => {
    setVisibility((previous) => ({ arrived: previous.arrived || Boolean(mask & 1), visible: Boolean(mask & 2) }));
  }, []);
  useAnimatedReaction(() => {
    const origin = contentOrigin.get();
    const section = sectionY.get();
    if (origin < 0 || section < 0) return 0;
    const top = origin + section;
    const sectionVisible = intersectsViewport(top, sectionHeight.get(), scrollY.get(), viewportHeight.get());
    const frameVisible = areaY.get() >= 0 && intersectsViewport(top + areaY.get(), areaHeight.get(), scrollY.get(), viewportHeight.get());
    return (sectionVisible && canPrepare ? 1 : 0) | (frameVisible ? 2 : 0);
  }, (next, previous) => {
    // React is notified at boundaries, not for every scrolling pixel. Arrival
    // latches for this visit, retaining the player and its position on return.
    if (next !== previous) scheduleOnRN(commit, next);
  });
  const onSectionLayout = (event: LayoutChangeEvent) => {
    sectionY.set(event.nativeEvent.layout.y);
    sectionHeight.set(event.nativeEvent.layout.height);
  };
  const onAreaLayout = (event: LayoutChangeEvent) => {
    areaY.set(event.nativeEvent.layout.y);
    areaHeight.set(event.nativeEvent.layout.height);
  };
  const prepare = () => {
    if (canPrepare && visibility.visible) setVisibility((previous) => ({ ...previous, arrived: true }));
  };
  return { ...visibility, prepare, onSectionLayout, onAreaLayout, sectionRef: undefined, areaRef: undefined };
}