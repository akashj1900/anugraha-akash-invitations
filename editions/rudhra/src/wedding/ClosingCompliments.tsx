import { Ionicons } from '@react-native-vector-icons/ionicons';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '@/src/theme';
import { CLOSING } from './data';
import { useInvitationLayout } from './useInvitationLayout';

/** Two single-line text rows and one decorative, still heart row. */
export function ClosingCompliments() {
  const { safeWidth, fontScale } = useInvitationLayout();
  const available = Math.max(1, Math.min(480, safeWidth - 48) - 8);
  const scale = Math.max(1, fontScale);
  // Reserve room for italic overhang; system text scaling is included in the fit.
  const introSize = Math.min(30, available / (10 * scale));
  const namesSize = Math.min(36, available / (7.8 * scale));
  // Web fits by responsive typography, not an ellipsis/clipping line clamp.
  const nativeSingleLine = Platform.OS === 'web' ? undefined : 1;
  return <View testID="closing-compliments" style={styles.group}>
    <Text testID="closing-compliments-intro" numberOfLines={nativeSingleLine} adjustsFontSizeToFit minimumFontScale={0.5}
      style={[styles.text, { fontSize: introSize, lineHeight: introSize * 1.5 }]}>{CLOSING.compliments.intro}</Text>
    <Text testID="closing-compliments-names" numberOfLines={nativeSingleLine} adjustsFontSizeToFit minimumFontScale={0.5}
      style={[styles.text, { fontSize: namesSize, lineHeight: namesSize * 1.5 }]}>{CLOSING.compliments.names}</Text>
    <View testID="closing-compliments-hearts" style={styles.hearts} accessible={false} aria-hidden
      accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      {[1, 2, 3].map((heart) => <Ionicons key={heart} testID={`closing-heart-${heart}`} name="heart-outline"
        size={23} color={colors.gold} accessible={false} allowFontScaling={false} />)}
    </View>
  </View>;
}

const styles = StyleSheet.create({
  group: { width: '100%', maxWidth: 480, alignItems: 'center', gap: 6, marginTop: 40, marginBottom: 28 },
  text: { width: '100%', paddingHorizontal: 4, color: colors.goldSoft, fontFamily: fonts.serifItalic, textAlign: 'center' },
  hearts: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 16, marginTop: 10 },
});