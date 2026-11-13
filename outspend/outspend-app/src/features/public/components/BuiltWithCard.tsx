import { StyleSheet, Text, View } from 'react-native';

import { Card, SectionTitle } from '@/shared/components';
import { radius, spacing, useStyles, type ThemeColors } from '@/shared/theme';

import { developer } from '../developer';

export function BuiltWithCard() {
  const styles = useStyles(makeStyles);

  return (
    <Card fill>
      <SectionTitle>Built with</SectionTitle>
      <View style={styles.wrap}>
        {developer.stack.map((item) => (
          <View key={item} style={styles.chip}>
            <Text maxFontSizeMultiplier={1.2} style={styles.chipText}>
              {item}
            </Text>
          </View>
        ))}
      </View>
    </Card>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.xs },
    chip: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: radius.pill,
      backgroundColor: c.surfaceTint,
    },
    chipText: { fontSize: 13, fontWeight: '600', color: c.onTint },
  });
