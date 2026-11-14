import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Card } from '@/shared/components';
import { formatDateTime } from '@/shared/lib/dates';
import { openUrl } from '@/shared/lib/linking';
import { spacing, useStyles, useTheme, type ThemeColors } from '@/shared/theme';

import type { ContactMessage } from '../types';

const LONG_MESSAGE = 160;

export function MessageCard({ message }: { message: ContactMessage }) {
  const { colors } = useTheme();
  const styles = useStyles(makeStyles);
  const [expanded, setExpanded] = useState(false);
  const isLong = message.message.length > LONG_MESSAGE;

  const replyLink = `mailto:${message.email}?subject=${encodeURIComponent('Re: your message to OutSpend')}`;

  return (
    <Card>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text maxFontSizeMultiplier={1.2} style={styles.initial}>
            {message.name.trim().charAt(0).toUpperCase() || '?'}
          </Text>
        </View>
        <View style={styles.sender}>
          <Text numberOfLines={1} maxFontSizeMultiplier={1.3} style={styles.name}>
            {message.name}
          </Text>
          <Text numberOfLines={1} maxFontSizeMultiplier={1.3} style={styles.meta}>
            {formatDateTime(message.createdAt)}
          </Text>
        </View>
      </View>

      <Text
        selectable
        numberOfLines={expanded ? undefined : 4}
        maxFontSizeMultiplier={1.3}
        style={styles.body}
      >
        {message.message}
      </Text>

      {isLong ? (
        <Pressable
          onPress={() => setExpanded((value) => !value)}
          accessibilityRole="button"
          accessibilityLabel={expanded ? 'Show less' : 'Show more'}
          style={styles.toggle}
        >
          <Text maxFontSizeMultiplier={1.3} style={styles.toggleText}>
            {expanded ? 'Show less' : 'Show more'}
          </Text>
        </Pressable>
      ) : null}

      <Pressable
        onPress={() => openUrl(replyLink)}
        accessibilityRole="link"
        accessibilityLabel={`Reply to ${message.email}`}
        style={styles.reply}
      >
        <Ionicons name="mail-outline" size={18} color={colors.primary} />
        <Text numberOfLines={1} maxFontSizeMultiplier={1.3} style={styles.replyText}>
          {message.email}
        </Text>
      </Pressable>
    </Card>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: c.surfaceTint,
      alignItems: 'center',
      justifyContent: 'center',
    },
    initial: { fontSize: 16, fontWeight: '700', color: c.onTint },
    sender: { flex: 1, gap: 2 },
    name: { fontSize: 16, fontWeight: '600', color: c.text },
    meta: { fontSize: 13, color: c.textMuted },
    body: { fontSize: 15, color: c.text, marginTop: spacing.xs },
    toggle: { minHeight: 36, justifyContent: 'center' },
    toggleText: { fontSize: 14, fontWeight: '600', color: c.primary },
    reply: { minHeight: 40, flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
    replyText: { flex: 1, fontSize: 14, fontWeight: '600', color: c.primary },
  });
