import type { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { radius, spacing, useStyles, type ThemeColors } from '@/shared/theme';

type DialogProps = {
  visible: boolean;
  title: string;
  onClose: () => void; // also called by the Android back button
  children: ReactNode;
};

export function Dialog({ visible, title, onClose, children }: DialogProps) {
  const styles = useStyles(makeStyles);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.backdrop}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View accessibilityViewIsModal style={styles.dialog}>
          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Text accessibilityRole="header" maxFontSizeMultiplier={1.3} style={styles.title}>
              {title}
            </Text>
            {children}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
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
      maxWidth: 440,
      maxHeight: '90%',
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.surface,
    },
    content: { gap: spacing.md, padding: spacing.lg },
    title: { fontSize: 18, fontWeight: '700', color: c.text },
  });
