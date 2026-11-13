import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, {
  DateTimePickerAndroid,
  type DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import {
  formatDate,
  isoDaysAgo,
  isValidIsoDate,
  parseIsoDate,
  toIsoDate,
} from '@/shared/lib/dates';
import { radius, spacing, useStyles, useTheme, type ThemeColors } from '@/shared/theme';

import { TextField } from './TextField';

type DateFieldProps = {
  label: string;
  value: string; // yyyy-MM-dd
  onChange: (value: string) => void;
  error?: string;
};

export function DateField({ label, value, onChange, error }: DateFieldProps) {
  const { colors, scheme } = useTheme();
  const styles = useStyles(makeStyles);

  const valid = isValidIsoDate(value);
  const date = valid ? parseIsoDate(value) : new Date();

  function openAndroidPicker() {
    DateTimePickerAndroid.open({
      value: date,
      mode: 'date',
      maximumDate: new Date(),
      onChange: (event: DateTimePickerEvent, selected?: Date) => {
        if (event.type === 'set' && selected) {
          onChange(toIsoDate(selected));
        }
      },
    });
  }

  const quickChips = (
    <View style={styles.quickRow}>
      {[
        { label: 'Today', iso: isoDaysAgo(0) },
        { label: 'Yesterday', iso: isoDaysAgo(1) },
      ].map((chip) => {
        const selected = value === chip.iso;
        return (
          <Pressable
            key={chip.label}
            onPress={() => onChange(chip.iso)}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            style={[styles.quickChip, selected && styles.quickChipSelected]}
          >
            <Text style={[styles.quickText, selected && styles.quickTextSelected]}>
              {chip.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );

  // Browser preview: no native picker, so use a typed field.
  if (Platform.OS === 'web') {
    return (
      <View style={styles.field}>
        <TextField
          label={label}
          value={value}
          onChangeText={onChange}
          placeholder="yyyy-mm-dd"
          autoCapitalize="none"
          autoCorrect={false}
          error={error}
        />
        {quickChips}
      </View>
    );
  }

  return (
    <View style={styles.field}>
      <Text maxFontSizeMultiplier={1.3} style={styles.label}>
        {label}
      </Text>

      {Platform.OS === 'ios' ? (
        <View style={styles.iosPicker}>
          <DateTimePicker
            value={date}
            mode="date"
            display="compact"
            maximumDate={new Date()}
            themeVariant={scheme}
            accentColor={colors.primary}
            onChange={(_event, selected) => {
              if (selected) {
                onChange(toIsoDate(selected));
              }
            }}
          />
        </View>
      ) : (
        <Pressable
          onPress={openAndroidPicker}
          accessibilityRole="button"
          accessibilityLabel={`${label}: ${valid ? formatDate(value) : 'not set'}. Tap to change`}
          style={[styles.androidField, error ? styles.androidFieldError : null]}
        >
          <Text maxFontSizeMultiplier={1.3} style={styles.androidText}>
            {valid ? formatDate(value) : 'Choose a date'}
          </Text>
          <Ionicons name="calendar-outline" size={20} color={colors.textMuted} />
        </Pressable>
      )}

      {error ? <Text style={styles.error}>{error}</Text> : null}
      {quickChips}
    </View>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    field: { gap: spacing.xs },
    label: { fontSize: 14, fontWeight: '600', color: c.text },
    iosPicker: { alignItems: 'flex-start', minHeight: 48, justifyContent: 'center' },
    androidField: {
      minHeight: 48,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.md,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: radius.md,
      backgroundColor: c.surface,
    },
    androidFieldError: { borderColor: c.danger },
    androidText: { fontSize: 16, color: c.text },
    error: { fontSize: 12, color: c.danger },
    quickRow: { flexDirection: 'row', gap: spacing.sm },
    quickChip: {
      minHeight: 32,
      justifyContent: 'center',
      paddingHorizontal: 12,
      borderRadius: radius.pill,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.surface,
    },
    quickChipSelected: { backgroundColor: c.surfaceTint, borderColor: c.primary },
    quickText: { fontSize: 13, color: c.textMuted },
    quickTextSelected: { color: c.onTint, fontWeight: '600' },
  });
