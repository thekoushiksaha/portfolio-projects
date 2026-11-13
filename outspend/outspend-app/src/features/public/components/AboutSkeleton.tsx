import { View } from 'react-native';

import { Card, Skeleton } from '@/shared/components';
import { spacing } from '@/shared/theme';

export function AboutSkeleton() {
  return (
    <View accessible accessibilityLabel="Loading app information">
      <Card tinted>
        <Skeleton height={14} />
        <Skeleton width="80%" height={14} style={{ marginTop: spacing.sm }} />
        <Skeleton width="35%" height={12} style={{ marginTop: spacing.sm }} />
      </Card>
    </View>
  );
}
