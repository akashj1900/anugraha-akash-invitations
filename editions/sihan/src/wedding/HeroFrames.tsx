// A wide, grounded Kerala paper venue. All architecture, shadows, flowers and
// floor tiles share one camera; scroll never swaps images or duplicates couples.
import { memo } from "react";
import { StyleSheet, View } from "react-native";
import { SharedValue } from "react-native-reanimated";
import { colors } from "@/src/theme";
import { JOURNEY_ART } from "./journeyAssets";
import { PaperLayer } from "./PaperLayer";
import { PaperGate, PaperLamp, Pookkalam, LotusPool } from "./PaperDetails";
import { GroundedArt } from "./GroundedArt";
import { VenueFloor } from "./VenueFloor";
import { MANDAP_ASPECT, MANDAP_DEPTH, MANDAP_WIDTH } from "./journeyCamera";
import { Agni } from "./Agni";
import { useInvitationLayout } from "./useInvitationLayout";
export { preloadHeroScenes } from "./journeyAssets";

const SIDES = [-1, 1] as const;

export const VenueJourney = memo(function VenueJourney({ progress, active }: { progress: SharedValue<number>; active?: SharedValue<boolean> }) {
  const { width, height, sceneCenterX } = useInvitationLayout();
  const viewport = { width, height, centerX: sceneCenterX };
  const shared = { progress, viewport, active };
  return <View style={styles.scene} testID="venue-journey" accessibilityLabel="A Kerala wedding venue with a lotus-filled water pathway, grand gates, Ganpati on a dry stone platform, and a raised wedding mandap">
    <View testID="venue-theatre" style={[styles.theatre, { width: viewport.width }]}>
      <VenueFloor {...shared} />
      <PaperLayer {...shared} id="palace-rear" depth={12.7} width={1.16} aspect={975 / 763}>
        <GroundedArt source={JOURNEY_ART.palaceRear} />
      </PaperLayer>
      {SIDES.map((side) => <PaperLayer {...shared} key={`rear-${side}`} id={`rear-courtyard-${side}`} depth={10.4} width={0.59} aspect={620 / 638} x={side * 0.37}>
        <GroundedArt source={side === -1 ? JOURNEY_ART.courtyardLeft : JOURNEY_ART.courtyardRight} foundation />
      </PaperLayer>)}
      <PaperLayer {...shared} id="mandap" depth={MANDAP_DEPTH} width={MANDAP_WIDTH} aspect={MANDAP_ASPECT}>
        <GroundedArt source={JOURNEY_ART.mandap} foundation><Agni active={active} /></GroundedArt>
      </PaperLayer>
      {SIDES.map((side) => <PaperLayer {...shared} key={`sacred-lotus-${side}`} id={`sacred-lotus-${side}`} depth={8.3} width={0.095} aspect={800 / 928} x={side * 0.19}>
        <GroundedArt source={JOURNEY_ART.lotus} flip={side === 1} />
      </PaperLayer>)}
      <PaperLayer {...shared} id="ceremony-pookkalam" depth={7.45} width={0.18} aspect={3.2} anchorY={0.5} x={0.26}>
        <Pookkalam />
      </PaperLayer>
      {SIDES.map((side) => <PaperLayer {...shared} key={`inner-banana-${side}`} id={`mandap-banana-${side}`} depth={7.4} width={0.16} aspect={0.63} x={side * 0.22}>
        <GroundedArt source={JOURNEY_ART.bananaKalash} flip={side === 1} />
      </PaperLayer>)}
      <PaperLayer {...shared} id="ganpati-shrine" depth={6.4} width={0.30} aspect={0.69} x={-0.30}>
        <GroundedArt source={JOURNEY_ART.ganpati} foundation />
      </PaperLayer>
      {SIDES.map((side) => <PaperLayer {...shared} key={`wing-${side}`} id={`courtyard-${side === -1 ? "left" : "right"}`} depth={6.3} width={0.55} aspect={620 / 638} x={side * 0.53}>
        <GroundedArt source={side === -1 ? JOURNEY_ART.courtyardLeft : JOURNEY_ART.courtyardRight} foundation />
      </PaperLayer>)}
      <PaperLayer {...shared} id="courtyard-banana" depth={5.8} width={0.25} aspect={0.63} x={0.30}>
        <GroundedArt source={JOURNEY_ART.bananaKalash} />
      </PaperLayer>
      {[7.1, 5.4, 3.9].flatMap((depth, i) => SIDES.map((side) =>
        <PaperLayer {...shared} key={`lamp-${i}-${side}`} id={`lamp-${i}-${side}`} depth={depth} width={0.035 + i * 0.012} aspect={70 / 172} x={side * (1.12 / depth)}>
          <PaperLamp />
        </PaperLayer>,
      ))}
      {SIDES.map((side) => <PaperLayer {...shared} key={`elephant-${side}`} id={`elephant-${side}`} depth={3.75} width={0.24} aspect={1} x={side * 0.59}>
        <GroundedArt source={JOURNEY_ART.elephant} flip={side === 1} />
      </PaperLayer>)}
      <PaperLayer {...shared} id="palace-gate" depth={3.15} width={1.38} aspect={975 / 763}>
        <PaperGate progress={progress} />
      </PaperLayer>
      {SIDES.map((side) => <PaperLayer {...shared} key={`gate-banana-${side}`} id={`gate-banana-${side}`} depth={3.05} width={0.38} aspect={0.63} x={side * 0.65}>
        <GroundedArt source={JOURNEY_ART.bananaKalash} flip={side === 1} />
      </PaperLayer>)}
      <PaperLayer {...shared} id="entrance-pookkalam" depth={2.45} width={0.72} aspect={3.2} anchorY={0.5}>
        <Pookkalam />
      </PaperLayer>
      {[4.7, 2.6, 1.1].flatMap((depth, i) => SIDES.map((side) => <PaperLayer {...shared} key={`pond-${i}-${side}`} id={`pond-lotus-${i}-${side}`} depth={depth} width={0.25 + i * 0.28} aspect={1.05} x={side * ((2.65 - i * 0.2) / depth)}>
        <LotusPool flip={side === 1} />
      </PaperLayer>))}
    </View>
  </View>;
});

const styles = StyleSheet.create({
  scene: { width: "100%", height: "100%", overflow: "hidden", backgroundColor: colors.bgIvory, pointerEvents: "none" },
  theatre: { height: "100%", alignSelf: "center", position: "absolute" },
});