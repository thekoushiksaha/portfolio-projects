import { useWindowDimensions } from 'react-native';

import { spacing } from '@/shared/theme/tokens';

export type Breakpoint = 'compact' | 'medium' | 'expanded';

const MEDIUM_MIN_WIDTH = 600; // large phones in landscape, small tablets
const EXPANDED_MIN_WIDTH = 840; // tablets, browser windows

// Maximum width of the content column, so wide screens never stretch it edge to edge.
export const contentWidths = { form: 480, content: 720, wide: 1040 } as const;
export type ContentWidth = keyof typeof contentWidths;

export function useLayout() {
  const { width, height } = useWindowDimensions();

  const breakpoint: Breakpoint =
    width >= EXPANDED_MIN_WIDTH ? 'expanded' : width >= MEDIUM_MIN_WIDTH ? 'medium' : 'compact';

  const horizontalPadding =
    breakpoint === 'expanded' ? spacing.xl : breakpoint === 'medium' ? spacing.lg : spacing.md;

  return {
    width,
    height,
    breakpoint,
    isCompact: breakpoint === 'compact',
    isLandscape: width > height,
    horizontalPadding,
  };
}
