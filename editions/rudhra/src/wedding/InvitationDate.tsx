import { StyleSheet, Text } from 'react-native';
import type { StyleProp, TextStyle } from 'react-native';
import { fonts } from '@/src/theme';

/** A flagged serif 1 at a matching optical size; every other glyph is unchanged. */
export function InvitationDate({ value, testID, style, numeralSize }: {
  value: string; testID: string; style: StyleProp<TextStyle>; numeralSize: number;
}) {
  const index = value.indexOf('1 November 2026');
  return <Text testID={testID} style={style}>
    {index < 0 ? value : <>{value.slice(0, index)}<Text testID={`${testID}-day`}
      style={[styles.numeral, { fontSize: numeralSize }]}>1</Text>{value.slice(index + 1)}</>}
  </Text>;
}

const styles = StyleSheet.create({ numeral: { fontFamily: fonts.dateNumeral, fontWeight: '400' } });