import { StyleSheet, View } from 'react-native';

import { Logo, Muted, Title } from '@/shared/components';
import { spacing } from '@/shared/theme';

export function AuthHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <View style={styles.header}>
      <Logo />
      <Title>{title}</Title>
      <Muted>{subtitle}</Muted>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { gap: spacing.sm, marginTop: spacing.lg, marginBottom: spacing.sm },
});
