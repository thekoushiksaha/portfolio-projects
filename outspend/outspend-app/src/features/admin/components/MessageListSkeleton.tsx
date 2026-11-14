import { View } from 'react-native';

import { Card, Skeleton } from '@/shared/components';
import { spacing } from '@/shared/theme';

export function MessageListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <View accessible accessibilityLabel="Loading messages" style={{ gap: spacing.sm }}>
      {Array.from({ length: count }, (_, index) => (
        <Card key={index}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
            <Skeleton width={40} height={40} radius={20} />
            <View style={{ flex: 1, gap: 8 }}>
              <Skeleton width="45%" height={14} />
              <Skeleton width="30%" height={12} />
            </View>
          </View>
          <Skeleton height={14} style={{ marginTop: spacing.sm }} />
          <Skeleton width="85%" height={14} style={{ marginTop: spacing.xs }} />
          <Skeleton width="40%" height={14} style={{ marginTop: spacing.sm }} />
        </Card>
      ))}
    </View>
  );
}
