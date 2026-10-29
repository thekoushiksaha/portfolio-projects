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
  warning: string;
  success: string;
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
  warning: '#9A5B00',
  success: '#2E7D32',
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
  warning: '#FFB74D',
  success: '#81C784',
};
