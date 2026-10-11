import { Asset } from "expo-asset";
import { Image } from "expo-image";
import { WATER_TEXTURE } from "./waterAssets";

// Fixed sources, bundled for offline use; originals archived in managed storage.
// No image source is ever changed by scrolling.
export const JOURNEY_ART = {
  courtyardLeft: require("../../assets/journey/natural-v3/courtyard-left.webp"),
  courtyardRight: require("../../assets/journey/natural-v3/courtyard-right.webp"),
  mandap: require("../../assets/journey/natural-v3/mandap-grounded.webp"),
  grandGateway: require("../../assets/journey/natural-v3/grand-gateway.webp"),
  doorLeft: require("../../assets/journey/natural-v3/door-left.webp"),
  doorRight: require("../../assets/journey/natural-v3/door-right.webp"),
  palaceRear: require("../../assets/journey/natural-v3/palace-rear.webp"),
  ganpati: require("../../assets/journey/natural-v3/ganpati.webp"),
  bananaKalash: require("../../assets/journey/natural-v3/banana-kalash.webp"),
  lotus: require("../../assets/journey/natural-v3/lotus.webp"),
  waterLotus: require("../../assets/journey/natural-v3/water-lotus.webp"),
  elephant: require("../../assets/journey/natural-v3/elephant.webp"),
};

let preload: Promise<void> | undefined;
export function preloadHeroScenes(): Promise<void> {
  // Bounded concurrency avoids flooding the preview/CDN on a cold open.
  preload ??= (async () => {
    const queue = [...Object.values(JOURNEY_ART), WATER_TEXTURE];
    const worker = async () => {
      while (queue.length) {
        const source = queue.shift();
        const uri = Asset.fromModule(source).uri;
        if (!uri) continue;
        const ok = await Image.prefetch(uri, { cachePolicy: "memory-disk" }).catch(() => false);
        if (!ok) {
          await new Promise((resolve) => setTimeout(resolve, 350));
          await Image.prefetch(uri, { cachePolicy: "memory-disk" }).catch(() => false);
        }
      }
    };
    await Promise.all([worker(), worker(), worker()]);
  })();
  return preload;
}