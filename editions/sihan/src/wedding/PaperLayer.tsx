import { memo, ReactNode } from "react";
import { StyleSheet } from "react-native";
import Animated, { SharedValue, useAnimatedStyle } from "react-native-reanimated";
import { cameraAt, JourneyViewport, projectionWidth, smoothRange } from "./journeyCamera";
export { smoothRange } from "./journeyCamera";

type Props = {
  children: ReactNode;
  progress: SharedValue<number>;
  viewport: JourneyViewport;
  id: string;
  depth: number;
  width: number;
  aspect: number;
  x?: number;
  y?: number;
  anchorY?: number;
  fold?: number;
  foldStart?: number;
};

/** One fixed paper object whose base is projected onto the same ground as tiles.
 * x is its world X/depth. y is reserved for elevated (hanging) decorations.
 * Foot position, perspective size, shadows, plinth and artwork travel together.
 */
export const PaperLayer = memo(function PaperLayer({ children, progress, viewport,
  id, depth, width, aspect, x = 0, y = 0, anchorY = 1, fold = 0, foldStart = 0.3 }: Props) {
  const focal = projectionWidth(viewport);
  const w = focal * width;
  const h = w / aspect;
  const projected = useAnimatedStyle(() => {
    const camera = cameraAt(progress.value, viewport);
    const distance = Math.max(0.2, depth - camera.z);
    const scale = Math.min(18, depth / distance);
    const foot = camera.horizon + camera.heightProjection / distance;
    return {
      opacity: camera.z < depth ? 1 : 0,
      transform: [
        { translateX: camera.centerX - viewport.width / 2 + x * focal * scale },
        { translateY: foot + ((0.5 - anchorY) * h + y * viewport.height) * scale - h / 2 },
        { scale },
      ],
    };
  });
  const folded = useAnimatedStyle(() => ({ transform: [
    { perspective: 900 },
    { rotateY: `${fold * smoothRange(progress.value, foldStart, foldStart + 0.25)}deg` },
  ] }));
  return <Animated.View testID={`paper-layer-${id}`} style={[
    styles.plane, { width: w, height: h, left: (viewport.width - w) / 2 }, projected,
  ]}>
    <Animated.View style={[styles.art, folded]}>{children}</Animated.View>
  </Animated.View>;
});

const styles = StyleSheet.create({
  plane: { position: "absolute", top: 0, pointerEvents: "none" },
  art: { width: "100%", height: "100%", transformOrigin: "center bottom" },
});