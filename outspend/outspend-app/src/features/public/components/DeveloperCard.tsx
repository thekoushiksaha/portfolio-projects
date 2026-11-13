import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text } from 'react-native';

import { Body, Card, Muted, SectionTitle } from '@/shared/components';
import { openUrl } from '@/shared/lib/linking';
import { spacing, useStyles, useTheme, type ThemeColors } from '@/shared/theme';

import { developer } from '../developer';

export function DeveloperCard() {
  const { colors } = useTheme();
  const styles = useStyles(makeStyles);

  return (
    <Card fill>
      <SectionTitle>Developer</SectionTitle>
      <Text accessibilityRole="header" maxFontSizeMultiplier={1.3} style={styles.name}>
        {developer.name}
      </Text>
      <Muted>{developer.title}</Muted>
      <Body>{developer.bio}</Body>

      {developer.links.map((link) => (
        <Pressable
          key={link.label}
          onPress={() => openUrl(link.url)}
          accessibilityRole="link"
          accessibilityLabel={`Open ${link.label}`}
          style={styles.link}
        >
          <Ionicons name={link.icon} size={20} color={colors.primary} />
          <Text maxFontSizeMultiplier={1.3} style={styles.linkText}>
            {link.label}
          </Text>
          <Ionicons name="open-outline" size={16} color={colors.textMuted} />
        </Pressable>
      ))}
    </Card>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    name: { fontSize: 20, fontWeight: '700', color: c.text },
    link: {
      minHeight: 44,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    linkText: { flex: 1, fontSize: 15, fontWeight: '600', color: c.primary },
  });
