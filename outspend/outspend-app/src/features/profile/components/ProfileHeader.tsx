import { StyleSheet, Text, View } from 'react-native';

import type { User } from '@/features/auth/types';
import { Card } from '@/shared/components';
import { monthLabel } from '@/shared/lib/dates';
import { spacing, useStyles, type ThemeColors } from '@/shared/theme';

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return '?';
  }
  const first = parts[0][0];
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return `${first}${last}`.toUpperCase();
}

export function ProfileHeader({ user }: { user: User | null }) {
  const styles = useStyles(makeStyles);

  if (!user) {
    return null;
  }

  const role = user.role === 'ROLE_ADMIN' ? 'Admin' : 'Member';
  const since = user.createdAt ? ` · since ${monthLabel(user.createdAt.slice(0, 7))}` : '';

  return (
    <Card tinted>
      <View style={styles.row}>
        <View style={styles.avatar}>
          <Text maxFontSizeMultiplier={1.2} style={styles.initials}>
            {initials(user.name)}
          </Text>
        </View>
        <View style={styles.body}>
          <Text numberOfLines={1} maxFontSizeMultiplier={1.3} style={styles.name}>
            {user.name}
          </Text>
          <Text numberOfLines={1} maxFontSizeMultiplier={1.3} style={styles.meta}>
            {user.email}
          </Text>
          <Text maxFontSizeMultiplier={1.3} style={styles.meta}>
            {`${role}${since}`}
          </Text>
        </View>
      </View>
    </Card>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
    avatar: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: c.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    initials: { fontSize: 20, fontWeight: '700', color: c.onPrimary },
    body: { flex: 1, gap: 2 },
    name: { fontSize: 18, fontWeight: '700', color: c.onTint },
    meta: { fontSize: 13, color: c.onTint },
  });
