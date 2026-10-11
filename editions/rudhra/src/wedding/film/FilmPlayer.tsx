import { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";
import { FILM } from "../data";
import { createFilmDriver } from "./driver";
import { FilmControls } from "./FilmControls";
import { createFilmSession } from "./session";
import type { FilmState } from "./types";

/** Mounted at section entry to prepare; frame eligibility alone requests play. */
export function FilmPlayer({ eligible }: { eligible: boolean }) {
  const surface = useRef<View>(null);
  const session = useRef<ReturnType<typeof createFilmSession> | null>(null);
  const currentEligibility = useRef(eligible);
  currentEligibility.current = eligible;
  const [state, setState] = useState<FilmState>("paused");
  const [retry, setRetry] = useState(0);
  const player = useVideoPlayer(FILM.uri, (p) => {
    p.muted = true;
    p.volume = 0;
    p.loop = true;
    p.playbackRate = 1;
    p.audioMixingMode = "mixWithOthers";
    p.staysActiveInBackground = false;
    p.showNowPlayingNotification = false;
    p.allowsExternalPlayback = false;
    p.keepScreenOnWhilePlaying = false;
  });
  useEffect(() => {
    try {
      const current = createFilmSession((receive) => createFilmDriver(player, surface.current, receive), setState);
      session.current = current;
      current.setEligible(currentEligibility.current);
      return () => { current.dispose(); session.current = null; };
    } catch { setState("error"); }
  }, [player, retry]);
  useEffect(() => { session.current?.setEligible(eligible); }, [eligible]);
  return <>
    <View ref={surface} testID="wedding-film-media" accessibilityLabel="Wedding film, muted" style={styles.surface}>
      <VideoView player={player} style={styles.fill} contentFit="contain" nativeControls={false} playsInline
        allowsPictureInPicture={false} startsPictureInPictureAutomatically={false} fullscreenOptions={{ enable: false }}
        allowsVideoFrameAnalysis={false} showsTimecodes={false} surfaceType="textureView" />
    </View>
    <FilmControls state={state} onPress={() => session.current ? session.current.press() : setRetry((value) => value + 1)} />
  </>;
}

const styles = StyleSheet.create({
  surface: { ...StyleSheet.absoluteFill, pointerEvents: "none" },
  fill: { width: "100%", height: "100%" },
});