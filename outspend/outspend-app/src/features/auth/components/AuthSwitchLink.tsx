import { Link, type Href } from 'expo-router';
import { StyleSheet, Text } from 'react-native';

import { spacing, useStyles, type ThemeColors } from '@/shared/theme';

type AuthSwitchLinkProps = {
  prompt: string;
  linkLabel: string;
  href: Href;
};

export function AuthSwitchLink({ prompt, linkLabel, href }: AuthSwitchLinkProps) {
  const styles = useStyles(makeStyles);

  return (
    <Text maxFontSizeMultiplier={1.3} style={styles.prompt}>
      {prompt}{' '}
      <Link href={href} style={styles.link}>
        {linkLabel}
      </Link>
    </Text>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    prompt: { textAlign: 'center', fontSize: 14, color: c.textMuted, marginTop: spacing.sm },
    link: { color: c.primary, fontWeight: '600' },
  });
