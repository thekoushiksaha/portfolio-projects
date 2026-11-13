import type { ViewStyle } from 'react-native';

import { spacing } from '@/shared/theme/tokens';

import { contentWidths, useLayout, type ContentWidth } from './useLayout';

export function useContentStyle(width: ContentWidth = 'content'): ViewStyle {
  const { horizontalPadding } = useLayout();

  return {
    width: '100%',
    maxWidth: contentWidths[width],
    alignSelf: 'center',
    paddingHorizontal: horizontalPadding,
    paddingVertical: spacing.lg,
    gap: spacing.md,
  };
}
