export interface ThemeColors {
  background: string;
  surface: string;
  surfaceTint: string;
  onTint: string;
  text: string;
  textMuted: string;
  border: string;
  primary: string;
  onPrimary: string;
  danger: string;
  onDanger: string;
  warning: string;
  success: string;
  skeleton: string;
  skeletonHighlight: string;
}

export const lightColors: ThemeColors = {
  background: '#FFFFFF',
  surface: '#FBF8F6',
  surfaceTint: '#FAECE7',
  onTint: '#712B13',
  text: '#1F1B18',
  textMuted: '#6F6660',
  border: '#E7DDD7',
  primary: '#D85A30',
  onPrimary: '#FFFFFF',
  danger: '#B3261E',
  onDanger: '#FFFFFF',
  warning: '#9A5B00',
  success: '#2E7D32',
  skeleton: '#EFE7E2',
  skeletonHighlight: 'rgba(255, 255, 255, 0.7)',
};

export const darkColors: ThemeColors = {
  background: '#14110F',
  surface: '#1F1B18',
  surfaceTint: '#3B2219',
  onTint: '#FFC9B5',
  text: '#F4EEEA',
  textMuted: '#B0A59E',
  border: '#3A332E',
  primary: '#D85A30',
  onPrimary: '#FFFFFF',
  danger: '#FF8A80',
  onDanger: '#2B0A07',
  warning: '#FFB74D',
  success: '#81C784',
  skeleton: '#2B2521',
  skeletonHighlight: 'rgba(255, 255, 255, 0.07)',
};
