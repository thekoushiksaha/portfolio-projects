import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

import { useReduceMotion } from '@/shared/hooks/useReduceMotion';
import { useStyles, type ThemeColors } from '@/shared/theme';

type ProgressBarProps = {
  value: number; // 0 to 100 (values above 100 are drawn as full)
  color: string;
  label: string; // spoken by screen readers
};

export function ProgressBar({ value, color, label }: ProgressBarProps) {
  const styles = useStyles(makeStyles);
  const reduceMotion = useReduceMotion();
  const clamped = Math.max(0, Math.min(value, 100));
  const animated = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (reduceMotion) {
      animated.setValue(clamped);
      return;
    }
    Animated.timing(animated, {
      toValue: clamped,
      duration: 600,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false, // animating width cannot use the native driver
    }).start();
  }, [clamped, reduceMotion, animated]);

  const width = animated.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] });

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      accessibilityValue={{ min: 0, max: 100, now: Math.round(clamped) }}
      style={styles.track}
    >
      <Animated.View style={[styles.fill, { width, backgroundColor: color }]} />
    </View>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    track: { height: 8, borderRadius: 4, backgroundColor: c.surfaceTint, overflow: 'hidden' },
    fill: { height: 8, borderRadius: 4 },
  });
