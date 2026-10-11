import { useEffect, useRef, useState } from 'react';
import type { View } from 'react-native';
import type { FilmScrollGeometry } from './useFilmVisibility';
export type { FilmScrollGeometry } from './useFilmVisibility';

/** DOM intersection avoids RN Web's integer-rounded onLayout coordinates. */
export function useFilmVisibility(_geometry: FilmScrollGeometry, canPrepare: boolean) {
  const sectionRef = useRef<View>(null);
  const areaRef = useRef<View>(null);
  const [visibility, setVisibility] = useState({ arrived: false, visible: false });
  useEffect(() => {
    const section = sectionRef.current as unknown as HTMLElement | null;
    const frame = areaRef.current as unknown as HTMLElement | null;
    if (!section || !frame) return;
    let live = true;
    let sectionVisible = false;
    let frameVisible = false;
    const publish = () => {
      if (!live) return;
      setVisibility((old) => {
        const arrived = old.arrived || (sectionVisible && canPrepare);
        return arrived === old.arrived && frameVisible === old.visible ? old : { arrived, visible: frameVisible };
      });
    };
    if (typeof IntersectionObserver !== 'undefined') {
      const observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          const positive = entry.intersectionRect.width > 0 && entry.intersectionRect.height > 0;
          if (entry.target === section) sectionVisible = positive;
          if (entry.target === frame) frameVisible = positive;
        }
        publish();
      }, {
        // Threshold 0 alone can regard edge-touching as intersecting and miss
        // the next zero-to-positive transition. EPSILON catches any real area.
        threshold: [0, Number.EPSILON],
      });
      observer.observe(section);
      observer.observe(frame);
      return () => { live = false; observer.disconnect(); };
    }
    // Older webviews: exact screen rectangles, still no minimum-pixel margin.
    const intersects = (element: HTMLElement) => {
      const rect = element.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0 && rect.top < window.innerHeight && rect.bottom > 0
        && rect.left < window.innerWidth && rect.right > 0;
    };
    const measure = () => { sectionVisible = intersects(section); frameVisible = intersects(frame); publish(); };
    const initial = requestAnimationFrame(measure);
    window.addEventListener('scroll', measure, true);
    window.addEventListener('resize', measure);
    return () => {
      live = false; cancelAnimationFrame(initial);
      window.removeEventListener('scroll', measure, true);
      window.removeEventListener('resize', measure);
    };
  }, [canPrepare]);
  const prepare = () => {
    if (canPrepare && visibility.visible) setVisibility((old) => ({ ...old, arrived: true }));
  };
  return { ...visibility, prepare, sectionRef, areaRef, onSectionLayout: undefined, onAreaLayout: undefined };
}