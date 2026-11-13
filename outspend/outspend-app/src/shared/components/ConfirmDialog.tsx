import { StyleSheet, Text, View } from 'react-native';

import { spacing, useStyles, type ThemeColors } from '@/shared/theme';

import { Button } from './Button';
import { Dialog } from './Dialog';

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
    <Dialog visible={visible} title={title} onClose={onCancel}>
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
    </Dialog>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    message: { fontSize: 15, color: c.textMuted },
    actions: { flexDirection: 'row', gap: spacing.sm },
    action: { flex: 1 },
  });
