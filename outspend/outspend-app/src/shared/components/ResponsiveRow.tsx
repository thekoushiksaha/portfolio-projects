import { Children, type ReactNode } from 'react';
import { View } from 'react-native';

import { useLayout } from '@/shared/layout/useLayout';
import { spacing } from '@/shared/theme';

export function ResponsiveRow({ children }: { children: ReactNode }) {
  const { isCompact } = useLayout();
  const items = Children.toArray(children); // ignores null and false children

  return (
    <View
      style={{
        flexDirection: isCompact ? 'column' : 'row',
        gap: spacing.md,
        alignItems: 'stretch',
      }}
    >
      {items.map((child, index) => (
        <View key={index} style={isCompact ? undefined : { flex: 1 }}>
          {child}
        </View>
      ))}
    </View>
  );
}
