import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { radius, useStyles, useTheme, type ThemeColors } from '@/shared/theme';

export function Logo() {
  const { colors } = useTheme();
  const styles = useStyles(makeStyles);

  return (
    <View style={styles.logo}>
      <Ionicons name="wallet" size={28} color={colors.onPrimary} />
    </View>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    logo: {
      width: 56,
      height: 56,
      borderRadius: radius.lg,
      backgroundColor: c.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
