import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Card, ProgressBar } from '@/shared/components';
import { categoryInfo } from '@/shared/domain/categories';
import { formatMoney, formatPercent } from '@/shared/lib/format';
import { radius, spacing, useStyles, useTheme, type ThemeColors } from '@/shared/theme';

import type { Limit } from '../types';

type LimitCardProps = {
  limit: Limit;
  onEdit: () => void;
  onRemove: () => void;
};

const STATUS_LABEL = {
  OK: 'On track',
  WARNING: 'Close to limit',
  EXCEEDED: 'Over limit',
} as const;

export function LimitCard({ limit, onEdit, onRemove }: LimitCardProps) {
  const { colors } = useTheme();
  const styles = useStyles(makeStyles);
  const info = categoryInfo(limit.category);

  const statusColor =
    limit.status === 'EXCEEDED'
      ? colors.danger
      : limit.status === 'WARNING'
        ? colors.warning
        : colors.primary;

  const message =
    limit.status === 'EXCEEDED'
      ? `${formatMoney(limit.spent - limit.monthlyLimit)} over the limit`
      : limit.status === 'WARNING'
        ? `Only ${formatMoney(limit.remaining)} left`
        : `${formatMoney(limit.remaining)} left this month`;

  return (
    <Card fill>
      <View style={styles.header}>
        <View style={styles.icon}>
          <Ionicons name={info.icon} size={20} color={colors.primary} />
        </View>
        <Text numberOfLines={1} maxFontSizeMultiplier={1.3} style={styles.name}>
          {info.label}
        </Text>
        <View style={[styles.badge, { borderColor: statusColor }]}>
          <Text maxFontSizeMultiplier={1.2} style={[styles.badgeText, { color: statusColor }]}>
            {STATUS_LABEL[limit.status]}
          </Text>
        </View>
      </View>

      <Text maxFontSizeMultiplier={1.3} style={styles.amounts}>
        {formatMoney(limit.spent)}
        <Text style={styles.of}> of {formatMoney(limit.monthlyLimit)}</Text>
      </Text>

      <ProgressBar
        value={limit.percentUsed}
        color={statusColor}
        label={`${info.label} limit, ${formatPercent(limit.percentUsed)} used`}
      />

      <Text
        maxFontSizeMultiplier={1.3}
        style={[styles.message, limit.status !== 'OK' && { color: statusColor }]}
      >
        {message}
      </Text>

      <View style={styles.actions}>
        <Pressable
          onPress={onEdit}
          accessibilityRole="button"
          accessibilityLabel={`Edit ${info.label} limit`}
          style={styles.action}
        >
          <Ionicons name="create-outline" size={18} color={colors.primary} />
          <Text maxFontSizeMultiplier={1.3} style={styles.actionText}>
            Edit
          </Text>
        </Pressable>
        <Pressable
          onPress={onRemove}
          accessibilityRole="button"
          accessibilityLabel={`Remove ${info.label} limit`}
          style={styles.action}
        >
          <Ionicons name="trash-outline" size={18} color={colors.textMuted} />
          <Text
            maxFontSizeMultiplier={1.3}
            style={[styles.actionText, { color: colors.textMuted }]}
          >
            Remove
          </Text>
        </Pressable>
      </View>
    </Card>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
    icon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: c.surfaceTint,
      alignItems: 'center',
      justifyContent: 'center',
    },
    name: { flex: 1, fontSize: 16, fontWeight: '600', color: c.text },
    badge: {
      borderWidth: 1,
      borderRadius: radius.pill,
      paddingHorizontal: 10,
      paddingVertical: 4,
    },
    badgeText: { fontSize: 12, fontWeight: '600' },
    amounts: { fontSize: 22, fontWeight: '700', color: c.text, marginTop: spacing.xs },
    of: { fontSize: 14, fontWeight: '400', color: c.textMuted },
    message: { fontSize: 14, color: c.textMuted },
    actions: { flexDirection: 'row', gap: spacing.lg, marginTop: spacing.xs },
    action: {
      minHeight: 40,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    actionText: { fontSize: 14, fontWeight: '600', color: c.primary },
  });
