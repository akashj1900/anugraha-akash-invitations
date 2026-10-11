// Anugraha & Akash: the paper journey and approved two-city celebration details.

import { Ionicons } from "@react-native-vector-icons/ionicons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  COUNTDOWN,
  COUPLE,
  RSVP,
} from "@/src/wedding/data";
import { VenueJourney } from "@/src/wedding/HeroFrames";
import { HeroCaption } from "./HeroCaption";
import { useInvitationLayout } from "./useInvitationLayout";
import { Seal } from "@/src/wedding/Seal";
import { pad2, useCountdown } from "@/src/wedding/useCountdown";
import { colors, fonts } from "@/src/theme";
import { CoupleMark } from "./CoupleMark";
import { EntryLoader } from "./EntryLoader";
import { ScenePreparationContext, useScenePreparation } from "./ScenePreparation";
import { CelebrationsSection } from "./CelebrationsSection";
import { ClosingSection } from "./ClosingSection";
import { MusicControl } from "./MusicControl";
import { RoyalLetterOpening } from "./RoyalLetterOpening";
import { FilmSection } from "./FilmSection";
import { CoupleRevealCard } from "./CoupleRevealCard";
import { MusicProvider } from "./music/MusicProvider";
import { api } from "@/src/api";

const DECOR = {
  toran: require("../../assets/journey/natural-v3/toran.webp"),
};

// -----------------------------------------------------------------------------
// Selected A ∞ A signature above the hero.
// -----------------------------------------------------------------------------
function TopBar() {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[styles.topBar, { top: insets.top + 8, left: insets.left, right: insets.right }]}
      testID="top-bar"
    >
      <View style={styles.monogramPill}>
        <CoupleMark testID="top-couple-mark" width={76} height={30} color={colors.wine} />
      </View>
      <MusicControl />
    </View>
  );
}

// -----------------------------------------------------------------------------
// Small building blocks
// -----------------------------------------------------------------------------
function Section({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: any;
}) {
  return <View style={[styles.section, style]}>{children}</View>;
}

// -----------------------------------------------------------------------------
// Bride / Groom intro cards
// -----------------------------------------------------------------------------
function BrideGroomIntro() {
  const { stackIntros } = useInvitationLayout();
  const Card = ({
    label,
    name,
    tagline,
  }: {
    label: string;
    name: string;
    tagline: string;
  }) => (
    <View testID={`intro-card-${label === "The Bride" ? "bride" : "groom"}`} style={[styles.bgCard, stackIntros && styles.stackedIntroCard]}>
      <Text testID={`intro-label-${label === "The Bride" ? "bride" : "groom"}`} style={styles.bgLabel}>{label}</Text>
      <View style={styles.bgOrnamentDot} />
      <Text testID={`intro-name-${label === "The Bride" ? "bride" : "groom"}`} style={styles.bgName}>{name}</Text>
      <Text testID={`intro-tagline-${label === "The Bride" ? "bride" : "groom"}`} style={styles.bgTagline}>{tagline}</Text>
    </View>
  );

  return (
    <Section style={styles.introSection}>
      <View testID="couple-intro-row" style={[styles.bgRow, stackIntros && styles.stackedIntros]}>
        <Card {...COUPLE.bride} />
        <View style={styles.bgSeal}>
          <Seal size={72} />
        </View>
        <Card {...COUPLE.groom} />
      </View>
    </Section>
  );
}

// -----------------------------------------------------------------------------
// Countdown
// -----------------------------------------------------------------------------
function CountdownSection() {
  const { safeWidth, fontScale } = useInvitationLayout();
  const small = safeWidth < 380;
  const grid = safeWidth / fontScale < 310;
  const { days, hours, mins, secs } = useCountdown();
  const Cell = ({ value, label }: { value: number; label: string }) => (
    <View testID={`countdown-${label.toLowerCase()}-cell`} style={[styles.cdCell, grid && styles.cdGridCell]}>
      <Text testID={`countdown-${label.toLowerCase()}-value`} style={[styles.cdValue, small && styles.cdValueSmall]}>{pad2(value)}</Text>
      <Text testID={`countdown-${label.toLowerCase()}-label`} style={[styles.cdLabel, small && styles.cdLabelSmall]}>{label}</Text>
    </View>
  );
  return (
    <Section>
      <View style={[styles.cardPanel, small && styles.cardPanelSmall]}>
        <Text testID="countdown-eyebrow" style={styles.eyebrow}>{COUNTDOWN.eyebrow}</Text>
        <Text testID="countdown-title" style={styles.sectionTitle}>{COUNTDOWN.title}</Text>
        <Text testID="countdown-date" style={styles.cdDate}>{COUNTDOWN.dateLabel}</Text>
        <View style={[styles.cdRow, grid && styles.cdGrid]} testID="countdown-row">
          <Cell value={days} label="Days" />
          {!grid && <Text style={styles.cdSep}>:</Text>}
          <Cell value={hours} label="Hours" />
          {!grid && <Text style={styles.cdSep}>:</Text>}
          <Cell value={mins} label="Mins" />
          {!grid && <Text style={styles.cdSep}>:</Text>}
          <Cell value={secs} label="Secs" />
        </View>
        <Text testID="countdown-muhurtham" style={styles.cdMuhurat}>{COUNTDOWN.muhurtham}</Text>
        <Text testID="countdown-venue" style={styles.cdVenue}>{COUNTDOWN.venueLabel}</Text>
      </View>
    </Section>
  );
}

// -----------------------------------------------------------------------------
// RSVP invitation (directions are attached to their respective celebration cards).
// -----------------------------------------------------------------------------
function InvitationRSVPSection({ onRSVP }: { onRSVP: () => void }) {
  const { safeWidth } = useInvitationLayout();
  const titleSize = Math.min(44, Math.max(28, (Math.min(safeWidth, 760) - 32) * 0.1));
  return (
    <Section>
      <Text testID="rsvp-section-eyebrow" style={styles.eyebrow}>{RSVP.eyebrow}</Text>
      <Text testID="rsvp-section-title" style={[styles.rsvpTitle, { fontSize: titleSize, lineHeight: Math.ceil(titleSize * 1.2) }]}>{RSVP.title}</Text>
      <View style={styles.venueDecorRow}>
        <Image source={DECOR.toran} style={styles.venueToran} contentFit="contain" />
      </View>
      <Text testID="rsvp-locations" style={styles.rsvpLocations}>{RSVP.locations}</Text>
      <Text testID="rsvp-invitation-note" style={styles.rsvpNote}>{RSVP.note}</Text>
      <Pressable accessibilityRole="button" style={styles.rsvpBtn} onPress={onRSVP} testID="open-rsvp">
        <Text testID="open-rsvp-label" style={styles.rsvpBtnText}>RSVP · Confirm Your Presence</Text>
      </Pressable>
    </Section>
  );
}

// -----------------------------------------------------------------------------
// RSVP modal
// -----------------------------------------------------------------------------
function RSVPModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const { insets } = useInvitationLayout();
  const [name, setName] = useState("");
  const [guests, setGuests] = useState("1");
  const [attending, setAttending] = useState<"yes" | "no" | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const savingRef = useRef(false);
  const validCount = /^\d+$/.test(guests) && Number(guests) >= 1 && Number(guests) <= 1000;
  const canSubmit = name.trim().length > 0 && attending !== null && validCount && !saving;

  const reset = () => {
    setSubmitted(false);
    setName("");
    setGuests("1");
    setAttending(null);
    setNote("");
    setError("");
  };
  const close = () => {
    if (savingRef.current) return;
    onClose();
    if (submitted) reset();
  };
  const submit = async () => {
    if (!canSubmit || savingRef.current) return;
    savingRef.current = true;
    setSaving(true);
    setError("");
    try {
      await api('/rsvp', { method: 'POST', body: JSON.stringify({ name: name.trim(), attendance: attending, guest_count: Number(guests), note: note.trim() }) });
      setSubmitted(true);
      if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    } catch (failure) {
      setError(`${failure instanceof Error ? failure.message : 'Could not save your response.'} Your details are still here; you can retry. If the connection was interrupted, an earlier attempt may have reached us.`);
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={close}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : Platform.OS === "android" ? "height" : undefined}
        style={[styles.modalRoot, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 12, paddingLeft: insets.left + 12, paddingRight: insets.right + 12 }]}
      >
        <Pressable testID="rsvp-backdrop" accessibilityLabel="Close RSVP" disabled={saving} style={styles.modalBackdrop} onPress={close} />
        <View style={styles.modalCard} testID="rsvp-modal">
          <Pressable accessibilityRole="button" accessibilityLabel="Close RSVP" accessibilityState={{ disabled: saving }} disabled={saving} style={styles.modalClose} onPress={close} testID="close-rsvp">
            <Ionicons name="close" size={20} color={colors.wine} />
          </Pressable>
          <ScrollView testID="rsvp-form-scroll" style={styles.modalScroll} contentContainerStyle={styles.modalContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator>
          {submitted ? (
            <View style={{ alignItems: "center", paddingVertical: 12 }}>
              <View style={styles.modalSeal}>
                <Seal size={80} />
              </View>
              <Text testID="rsvp-confirmation-title" accessibilityLiveRegion="polite" style={styles.modalTitle}>Response saved</Text>
              <Text testID="rsvp-confirmation-message" style={styles.modalBody}>
                Thank you, {name}. {attending === "yes" ? "We look forward to celebrating with you." : "We’ll miss you, and appreciate you letting us know."}
              </Text>
              <Pressable accessibilityRole="button" testID="rsvp-confirmation-close" style={styles.rsvpBtn} onPress={close}>
                <Text testID="rsvp-confirmation-close-label" style={styles.rsvpBtnText}>Close</Text>
              </Pressable>
              <Pressable testID="rsvp-submit-another" accessibilityRole="button" onPress={reset} style={styles.anotherButton}>
                <Text testID="rsvp-submit-another-label" style={styles.modalBody}>Send another response</Text>
              </Pressable>
            </View>
          ) : (
            <>
              <Text testID="rsvp-modal-eyebrow" style={styles.modalEyebrow}>WEDDING INVITATION</Text>
              <Text testID="rsvp-form-title" style={styles.modalTitle}>Confirm Your Presence</Text>
              <Text testID="rsvp-form-description" style={styles.modalBody}>
                We cannot wait to celebrate with you in Chennai and Dombivli East.
              </Text>
              <Text testID="rsvp-name-label" style={styles.fieldLabel}>Your Name</Text>
              <TextInput
                testID="rsvp-name"
                accessibilityLabel="Your name"
                style={styles.input}
                value={name}
                maxLength={120}
                editable={!saving}
                onChangeText={setName}
                placeholder="Full name"
                placeholderTextColor={colors.muted}
              />
              <Text testID="rsvp-guests-label" style={styles.fieldLabel}>Number of Guests</Text>
              <TextInput
                testID="rsvp-guests"
                accessibilityLabel="Number of guests"
                style={styles.input}
                value={guests}
                maxLength={4}
                editable={!saving}
                onChangeText={setGuests}
                keyboardType="number-pad"
                placeholder="1"
                placeholderTextColor={colors.muted}
              />
              <Text testID="rsvp-count-hint" style={styles.countHint}>Include yourself in the guest count (1–1,000).</Text>
              {!validCount && <Text testID="rsvp-count-error" style={styles.errorText}>Enter a whole number from 1 to 1,000.</Text>}
              <Text testID="rsvp-attendance-label" style={styles.fieldLabel}>Will you attend?</Text>
              <View style={styles.choiceRow}>
                {(["yes", "no"] as const).map((opt) => (
                  <Pressable
                    key={opt}
                    testID={`rsvp-attend-${opt}`}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: attending === opt, disabled: saving }}
                    disabled={saving}
                    style={[
                      styles.choice,
                      attending === opt && styles.choiceActive,
                    ]}
                    onPress={() => setAttending(opt)}
                  >
                    <Text
                      testID={`rsvp-attend-${opt}-label`}
                      style={[
                        styles.choiceText,
                        attending === opt && styles.choiceTextActive,
                      ]}
                    >
                      {opt === "yes" ? "Joyfully accept" : "Regretfully decline"}
                    </Text>
                  </Pressable>
                ))}
              </View>
              <Text testID="rsvp-note-label" style={styles.fieldLabel}>Note (optional)</Text>
              <TextInput testID="rsvp-note" accessibilityLabel="Optional note" value={note} onChangeText={setNote}
                editable={!saving} multiline maxLength={2000} placeholder="A little message for the couple"
                placeholderTextColor={colors.muted} style={[styles.input, { minHeight: 88, textAlignVertical: 'top' }]} />
              {!!error && <Text testID="rsvp-save-error" accessibilityRole="alert" accessibilityLiveRegion="polite" style={styles.errorText}>{error}</Text>}
              <Pressable
                style={[
                  styles.rsvpBtn,
                  !canSubmit && { opacity: 0.5 },
                ]}
                onPress={submit}
                disabled={!canSubmit}
                accessibilityRole="button"
                accessibilityLabel="Send RSVP with love"
                accessibilityState={{ disabled: !canSubmit, busy: saving }}
                testID="submit-rsvp"
              >
                {saving && <ActivityIndicator testID="rsvp-saving" color={colors.cream} size="small" />}
                <Text testID="submit-rsvp-label" style={styles.rsvpBtnText}>{saving ? "Saving…" : error ? "Retry saving" : "Send with Love"}</Text>
              </Pressable>
            </>
          )}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// -----------------------------------------------------------------------------
// Root
// -----------------------------------------------------------------------------
export default function WeddingInvitation() {
  return <MusicProvider><InvitationContent /></MusicProvider>;
}

function InvitationContent() {
  const [stage, setStage] = useState<"loader" | "seal" | "invite">("loader");
  const [rsvpOpen, setRsvpOpen] = useState(false);
  const preparation = useScenePreparation();
  const { height, insets, contentWidth } = useInvitationLayout();
  const scrollRef = useRef<ScrollView>(null);

  // A single camera drives every paper layer on the UI thread. The theatre
  // is OUTSIDE the scroller so native clipping cannot unmount a pinned scene.
  const HERO_VH = height;
  const HERO_SCROLL_LEN = Math.round(HERO_VH * 5.5);

  const scrollY = useSharedValue(0);
  const viewportHeight = useSharedValue(height);
  const detailsY = useSharedValue(-1);
  const contentY = useSharedValue(-1);
  const contentOrigin = useDerivedValue(() => detailsY.value < 0 || contentY.value < 0 ? -1 : detailsY.value + contentY.value);
  const previousHeight = useRef(HERO_VH);

  // Rotation/window resizing should keep the same chapter rather than jumping
  // forward/backward because the 5.5-screen runway has changed length.
  useLayoutEffect(() => {
    const oldHeight = previousHeight.current;
    previousHeight.current = HERO_VH;
    if (oldHeight === HERO_VH || stage !== "invite") return;
    const oldTravel = Math.round(oldHeight * 5.5);
    const oldRunway = oldTravel + oldHeight;
    const current = scrollY.value;
    const next = current <= oldTravel
      ? current / oldTravel * HERO_SCROLL_LEN
      : current < oldRunway
        ? HERO_SCROLL_LEN + (current - oldTravel) / oldHeight * HERO_VH
        : HERO_SCROLL_LEN + HERO_VH + current - oldRunway;
    scrollY.value = next;
    const frame = requestAnimationFrame(() => scrollRef.current?.scrollTo({ y: next, animated: false }));
    return () => cancelAnimationFrame(frame);
  }, [HERO_VH, HERO_SCROLL_LEN, scrollY, stage]);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollY.value = e.contentOffset.y;
    },
  });

  const journeyProgress = useDerivedValue(() => {
    return Math.max(0, Math.min(1, scrollY.value / HERO_SCROLL_LEN));
  }, [HERO_SCROLL_LEN]);
  const motionActive = useDerivedValue(() => stage === "invite" && scrollY.value < HERO_SCROLL_LEN + HERO_VH, [stage, HERO_SCROLL_LEN, HERO_VH]);

  // After reaching the couple, slide the whole theatre away with the page.
  // Do not fade to an empty viewport before the invitation arrives.
  const heroPinnedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: -Math.max(0, scrollY.value - HERO_SCROLL_LEN) }],
    };
  });

  // Every actual scene renderer must be ready before showing the opening seal.
  useEffect(() => {
    if (stage === "loader" && preparation.ready) setStage("seal");
  }, [stage, preparation.ready]);

  return (
    <View testID="invitation-root" style={styles.root} accessibilityState={{ busy: !preparation.ready }}>
      <ScenePreparationContext.Provider value={preparation.registry}>
          <Animated.View
            key={preparation.cycle}
            testID="journey-pinned-stage"
            style={[styles.heroPinned, { height: HERO_VH }, heroPinnedStyle]}
          >
            <VenueJourney progress={journeyProgress} active={motionActive} />
            <HeroCaption progress={journeyProgress} />
          </Animated.View>
      </ScenePreparationContext.Provider>
      {stage === "invite" && (
        <>
          <Animated.ScrollView
            ref={scrollRef}
            style={styles.inviteScroll}
            contentContainerStyle={styles.inviteScrollContent}
            contentInsetAdjustmentBehavior="never"
            showsVerticalScrollIndicator={false}
            onScroll={onScroll}
            onLayout={(event) => { viewportHeight.value = event.nativeEvent.layout.height; }}
            scrollEventThrottle={16}
            removeClippedSubviews={false}
            testID="invite-scroll"
          >
            {/* Transparent runway over a fixed paper theatre; never swaps frames. */}
            <View
              style={{ height: HERO_SCROLL_LEN + HERO_VH }}
              testID="hero-scroll-runway"
            />

            {/* Rest of the invitation */}
            <View testID="invitation-details" onLayout={(event) => { detailsY.value = event.nativeEvent.layout.y; }} style={[styles.invitationDetails, { paddingLeft: insets.left, paddingRight: insets.right }]}>
              <View testID="invitation-content" onLayout={(event) => { contentY.value = event.nativeEvent.layout.y; }} style={{ width: "100%", maxWidth: contentWidth }}>
                <BrideGroomIntro />
                <CountdownSection />
                <CelebrationsSection />
                <FilmSection {...{ scrollY, contentOrigin, viewportHeight }} occluded={rsvpOpen} />
                <CoupleRevealCard />
                <InvitationRSVPSection onRSVP={() => setRsvpOpen(true)} />
              </View>
            </View>
            <ClosingSection />
          </Animated.ScrollView>

          <TopBar />
        </>
      )}

      {stage === "seal" && <RoyalLetterOpening onOpen={() => setStage("invite")} />}
      {stage === "loader" && <EntryLoader progress={preparation.progress} failed={preparation.failed} onRetry={preparation.retry} />}

      <RSVPModal visible={rsvpOpen} onClose={() => setRsvpOpen(false)} />
    </View>
  );
}

// -----------------------------------------------------------------------------
// Styles
// -----------------------------------------------------------------------------
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bgIvory, overflow: "hidden" },
  inviteScroll: { flex: 1 },
  inviteScrollContent: { flexGrow: 1 },

  // Top bar
  topBar: {
    pointerEvents: "box-none",
    position: "absolute",
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    zIndex: 10,
  },
  monogramPill: {
    borderWidth: 1,
    borderColor: colors.gold,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 5,
    backgroundColor: colors.glassFill,
  },
  monogramText: {
    color: colors.wine,
    fontFamily: fonts.cinzel,
    fontSize: 13,
    letterSpacing: 6,
  },

  // Hero pinned image + card
  heroPinned: {
    pointerEvents: "none",
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: colors.bgIvory,
  },
  heroCardHolder: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
  },
  heroCard: {
    width: "100%",
    backgroundColor: colors.glassFill,
    borderColor: colors.glassStroke,
    borderWidth: 1,
    borderRadius: 18,
    padding: 18,
    alignItems: "center",
    boxShadow: `0px 8px 18px ${colors.wine}26`,
  },
  heroDateLocation: {
    color: colors.goldDeep,
    fontFamily: fonts.cinzel,
    fontSize: 10,
    letterSpacing: 1.3,
    marginBottom: 8,
    textAlign: "center",
  },
  heroNameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  heroName: {
    color: colors.wineDeep,
    fontFamily: fonts.cinzel,
    fontSize: 30,
    letterSpacing: 1,
  },
  heroHeart: {
    color: colors.gold,
    fontSize: 22,
  },
  heroSub: {
    marginTop: 8,
    color: colors.ink,
    fontFamily: fonts.serifItalic,
    fontStyle: "italic",
    fontSize: 15,
    textAlign: "center",
  },
  heroScrollHint: {
    marginTop: 16,
    color: colors.goldDeep,
    fontFamily: fonts.cinzel,
    fontSize: 10,
    letterSpacing: 1.7,
  },
  heroChevron: { alignSelf: "center", marginTop: 5 },
  invitationDetails: { alignItems: "center", backgroundColor: colors.bgIvory },
  noninteractive: { pointerEvents: "none" },

  // Section base
  section: {
    width: "100%",
    maxWidth: 760,
    alignSelf: "center",
    paddingHorizontal: 16,
    paddingVertical: 32,
    alignItems: "center",
  },
  cardPanel: {
    width: "100%",
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 18,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardPanelSmall: { padding: 14 },

  // Divider
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
    width: "70%",
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.goldDeep, opacity: 0.5 },
  dividerDiamond: {
    width: 8,
    height: 8,
    backgroundColor: colors.gold,
    transform: [{ rotate: "45deg" }],
    marginHorizontal: 10,
  },

  // Bride/Groom intro
  bgRow: {
    flexDirection: "row",
    alignItems: "stretch",
    justifyContent: "center",
    gap: 8,
    width: "100%",
  },
  bgCard: {
    flex: 1,
    minWidth: 0,
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 16,
  },
  bgLabel: {
    color: colors.goldDeep,
    fontFamily: fonts.cinzel,
    fontSize: 10,
    letterSpacing: 3,
  },
  bgOrnamentDot: {
    width: 4,
    height: 4,
    backgroundColor: colors.gold,
    transform: [{ rotate: "45deg" }],
    marginVertical: 10,
  },
  bgName: {
    color: colors.wineDeep,
    fontFamily: fonts.serifItalic,
    fontSize: 22,
    marginBottom: 4,
    textAlign: "center",
  },
  bgTagline: {
    color: colors.muted,
    fontFamily: fonts.serifItalic,
    fontSize: 12,
    textAlign: "center",
    fontStyle: "italic",
  },
  bgSeal: { paddingHorizontal: 4, alignSelf: "center" },
  introSection: { paddingTop: 32, maxWidth: 900 },
  stackedIntros: { flexDirection: "column", gap: 16 },
  stackedIntroCard: { flex: 0, width: "100%" },

  // Section titles
  eyebrow: {
    color: colors.gold,
    fontFamily: fonts.cinzel,
    fontSize: 11,
    letterSpacing: 4,
    marginBottom: 8,
    textTransform: "uppercase",
    textAlign: "center",
  },
  sectionTitle: {
    color: colors.wineDeep,
    fontFamily: fonts.cinzel,
    fontSize: 28,
    lineHeight: 34,
    textAlign: "center",
    marginBottom: 12,
  },

  // Countdown
  cdDate: {
    color: colors.muted,
    fontFamily: fonts.cinzel,
    fontSize: 12,
    letterSpacing: 3,
    marginBottom: 22,
    textAlign: "center",
  },
  cdRow: {
    width: "100%",
    maxWidth: 480,
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    marginBottom: 20,
  },
  cdCell: {
    flex: 1,
    minWidth: 0,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 12,
    paddingHorizontal: 2,
    backgroundColor: colors.surface,
    borderRadius: 10,
  },
  cdValue: {
    color: colors.wineDeep,
    fontFamily: fonts.cinzel,
    fontSize: 26,
    lineHeight: 30,
  },
  cdLabel: {
    color: colors.goldDeep,
    fontFamily: fonts.cinzel,
    fontSize: 9,
    letterSpacing: 1,
    marginTop: 4,
  },
  cdSep: { color: colors.gold, fontFamily: fonts.cinzel, fontSize: 24 },
  cdValueSmall: { fontSize: 22 },
  cdLabelSmall: { fontSize: 9, letterSpacing: 0.2 },
  cdGrid: { flexWrap: "wrap", gap: 10 },
  cdGridCell: { flexBasis: "40%" },
  cdMuhurat: {
    color: colors.wine,
    fontFamily: fonts.serifItalic,
    fontStyle: "italic",
    fontSize: 14,
    letterSpacing: 1,
    textAlign: "center",
  },
  cdVenue: { color: colors.goldDeep, fontFamily: fonts.serif, fontSize: 15, textAlign: "center", marginTop: 8 },
  rsvpLocations: { color: colors.wine, fontFamily: fonts.serif, fontSize: 18, lineHeight: 25, textAlign: "center", marginTop: 14 },
  rsvpTitle: {
    color: colors.wineDeep,
    fontFamily: fonts.serifItalic,
    textAlign: "center",
    width: "100%",
    paddingHorizontal: 4,
    marginBottom: 12,
  },
  rsvpNote: { color: colors.muted, fontFamily: fonts.serifItalic, fontSize: 16, lineHeight: 23, textAlign: "center", marginTop: 10, marginBottom: 12 },

  // Events
  eventList: { width: "100%", gap: 14 },
  eventCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 4,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 14,
  },
  eventIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  eventTitle: {
    fontFamily: fonts.cinzel,
    fontSize: 20,
    marginBottom: 2,
  },
  eventTagline: {
    color: colors.muted,
    fontFamily: fonts.serifItalic,
    fontStyle: "italic",
    fontSize: 12,
    marginBottom: 6,
  },
  eventWhen: {
    color: colors.ink,
    fontFamily: fonts.serifBold,
    fontSize: 13,
    fontWeight: "600",
  },
  eventTime: {
    color: colors.muted,
    fontFamily: fonts.serif,
    fontSize: 12,
    marginTop: 2,
  },
  eventVenue: {
    color: colors.wine,
    fontFamily: fonts.cinzel,
    fontSize: 10,
    letterSpacing: 2,
    marginTop: 4,
  },

  // Secret
  secretHint: {
    color: colors.muted,
    fontFamily: fonts.serifItalic,
    fontStyle: "italic",
    fontSize: 13,
    marginBottom: 14,
  },
  secretCard: {
    width: "100%",
    minHeight: 180,
    borderWidth: 1,
    borderColor: colors.gold,
    padding: 22,
    justifyContent: "center",
    overflow: "hidden",
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 14,
  },
  secretBody: {
    color: colors.wineDeep,
    fontFamily: fonts.serifItalic,
    fontStyle: "italic",
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
  },
  secretVeil: {
    pointerEvents: "none",
    ...StyleSheet.absoluteFill,
    alignItems: "center",
    justifyContent: "center",
  },
  secretVeilInner: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: colors.wineDeep,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(42,15,69,0.08)",
  },
  secretVeilM: {
    color: colors.wineDeep,
    fontFamily: fonts.cinzel,
    fontSize: 20,
    letterSpacing: 4,
  },

  // Venue
  venueDecorRow: { alignItems: "center", marginBottom: 6, width: "100%" },
  venueToran: { width: "100%", maxWidth: 240, height: 60 },
  venueName: {
    color: colors.wineDeep,
    fontFamily: fonts.cinzel,
    fontSize: 22,
    textAlign: "center",
  },
  venueAddress: {
    color: colors.muted,
    fontFamily: fonts.serif,
    fontSize: 13,
    marginTop: 4,
    marginBottom: 16,
    textAlign: "center",
  },
  mapFrame: {
    width: "100%",
    aspectRatio: 16 / 10,
    overflow: "hidden",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  mapImage: { ...StyleSheet.absoluteFill, width: "100%", height: "100%" },
  mapPin: {
    position: "absolute",
    top: "42%",
    left: "48%",
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.wine,
    alignItems: "center",
    justifyContent: "center",
  },
  mapCta: {
    position: "absolute",
    bottom: 12,
    left: 12,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 10,
    backgroundColor: "rgba(42,15,69,0.9)",
    borderWidth: 1,
    borderColor: colors.gold,
    borderRadius: 10,
  },
  mapCtaText: {
    color: colors.gold,
    fontFamily: fonts.cinzel,
    fontSize: 11,
    letterSpacing: 3,
  },
  rsvpDeadline: {
    color: colors.muted,
    fontFamily: fonts.serifItalic,
    fontStyle: "italic",
    fontSize: 12,
    marginTop: 18,
    textAlign: "center",
  },
  rsvpBtn: {
    maxWidth: "100%",
    minHeight: 48,
    marginTop: 12,
    paddingHorizontal: 22,
    paddingVertical: 14,
    backgroundColor: colors.wine,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
  },
  rsvpBtnText: {
    color: colors.cream,
    fontFamily: fonts.cinzel,
    fontSize: 12,
    letterSpacing: 3,
    textAlign: "center",
  },

  // Modal
  modalRoot: { flex: 1, justifyContent: "center" },
  modalBackdrop: { ...StyleSheet.absoluteFill, backgroundColor: colors.scrim },
  modalCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.gold,
    paddingTop: 48,
    maxHeight: "100%",
    maxWidth: 460,
    width: "100%",
    alignSelf: "center",
    borderRadius: 18,
    overflow: "hidden",
  },
  modalScroll: { flexGrow: 0, flexShrink: 1, width: "100%" },
  modalContent: { paddingHorizontal: 20, paddingBottom: 24 },
  modalClose: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  modalEyebrow: {
    color: colors.wine,
    fontFamily: fonts.cinzel,
    fontSize: 10,
    letterSpacing: 2,
    textAlign: "center",
    marginBottom: 4,
  },
  modalTitle: {
    color: colors.wineDeep,
    fontFamily: fonts.serifItalic,
    fontStyle: "italic",
    fontSize: 24,
    textAlign: "center",
    marginBottom: 6,
  },
  modalBody: {
    color: colors.muted,
    fontFamily: fonts.serif,
    fontSize: 13,
    textAlign: "center",
    marginBottom: 18,
  },
  modalSeal: { marginBottom: 8 },
  fieldLabel: {
    color: colors.goldDeep,
    fontFamily: fonts.cinzel,
    fontSize: 10,
    letterSpacing: 3,
    marginBottom: 6,
    marginTop: 8,
  },
  input: {
    minHeight: 48,
    width: "100%",
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.ink,
    fontFamily: fonts.serif,
    fontSize: 15,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 10,
  },
  choiceRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 4, marginBottom: 6 },
  choice: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 150,
    minHeight: 48,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 10,
  },
  choiceActive: {
    backgroundColor: colors.wine,
    borderColor: colors.gold,
  },
  choiceText: {
    color: colors.muted,
    fontFamily: fonts.cinzel,
    fontSize: 10,
    letterSpacing: 2,
    textAlign: "center",
  },
  choiceTextActive: { color: colors.cream },
  countHint: { color: colors.muted, fontSize: 13, marginTop: 6 },
  errorText: { color: colors.wineDeep, fontSize: 14, lineHeight: 21, marginVertical: 12 },
  anotherButton: { minHeight: 44, justifyContent: "center", marginTop: 12 },
});
