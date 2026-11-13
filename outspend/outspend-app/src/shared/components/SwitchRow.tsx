import { StyleSheet, Switch, Text, View } from 'react-native';

import { useStyles, useTheme, type ThemeColors } from '@/shared/theme';

type SwitchRowProps = {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
};

export function SwitchRow({ label, value, onValueChange }: SwitchRowProps) {
  const { colors } = useTheme();
  const styles = useStyles(makeStyles);

  return (
    <View style={styles.row}>
      <Text maxFontSizeMultiplier={1.3} style={styles.label}>
        {label}
      </Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        accessibilityLabel={label}
        trackColor={{ false: colors.border, true: colors.primary }}
        thumbColor="#FFFFFF"
      />
    </View>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    row: {
      minHeight: 48,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    label: { flex: 1, fontSize: 15, color: c.text },
  });
