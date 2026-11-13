import { Modal, StyleSheet, Text, View } from 'react-native';

import { radius, spacing, useStyles, type ThemeColors } from '@/shared/theme';

import { Button } from './Button';

type ConfirmDialogProps = {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel = 'Delete',
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const styles = useStyles(makeStyles);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.backdrop}>
        <View accessibilityViewIsModal style={styles.dialog}>
          <Text accessibilityRole="header" maxFontSizeMultiplier={1.3} style={styles.title}>
            {title}
          </Text>
          <Text maxFontSizeMultiplier={1.3} style={styles.message}>
            {message}
          </Text>

          <View style={styles.actions}>
            <View style={styles.action}>
              <Button title="Cancel" variant="secondary" onPress={onCancel} disabled={loading} />
            </View>
            <View style={styles.action}>
              <Button title={confirmLabel} variant="danger" onPress={onConfirm} loading={loading} />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    backdrop: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing.lg,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    dialog: {
      width: '100%',
      maxWidth: 420,
      gap: spacing.md,
      padding: spacing.lg,
      borderRadius: radius.lg,
      backgroundColor: c.surface,
      borderWidth: 1,
      borderColor: c.border,
    },
    title: { fontSize: 18, fontWeight: '700', color: c.text },
    message: { fontSize: 15, color: c.textMuted },
    actions: { flexDirection: 'row', gap: spacing.sm },
    action: { flex: 1 },
  });
