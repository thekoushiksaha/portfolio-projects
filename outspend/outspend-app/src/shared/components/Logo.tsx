import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';

import { useTheme } from '@/shared/theme';

export function Logo({ size = 56 }: { size?: number }) {
  const { colors } = useTheme();

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.285,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Ionicons name="wallet" size={size * 0.5} color={colors.onPrimary} />
    </View>
  );
}
