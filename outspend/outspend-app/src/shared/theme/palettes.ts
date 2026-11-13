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

// export const lightColors: ThemeColors = {
//   background: '#FFFFFF',
//   surface: '#FBF8F6',
//   surfaceTint: '#FAECE7',
//   onTint: '#712B13',
//   text: '#1F1B18',
//   textMuted: '#6F6660',
//   border: '#E7DDD7',
//   primary: '#D85A30',
//   onPrimary: '#FFFFFF',
//   danger: '#B3261E',
//   onDanger: '#FFFFFF',
//   warning: '#9A5B00',
//   success: '#2E7D32',
//   skeleton: '#EFE7E2',
//   skeletonHighlight: 'rgba(255, 255, 255, 0.7)',
// };

// export const darkColors: ThemeColors = {
//   background: '#14110F',
//   surface: '#1F1B18',
//   surfaceTint: '#3B2219',
//   onTint: '#FFC9B5',
//   text: '#F4EEEA',
//   textMuted: '#B0A59E',
//   border: '#3A332E',
//   primary: '#D85A30',
//   onPrimary: '#FFFFFF',
//   danger: '#FF8A80',
//   onDanger: '#2B0A07',
//   warning: '#FFB74D',
//   success: '#81C784',
//   skeleton: '#2B2521',
//   skeletonHighlight: 'rgba(255, 255, 255, 0.07)',
// };

export const lightColors: ThemeColors = {
  background: '#F7F9FC',
  surface: '#FFFFFF',
  surfaceTint: '#EAF1FF',
  onTint: '#1E3A8A',

  text: '#172033',
  textMuted: '#667085',

  border: '#E4E9F0',

  primary: '#2563EB',
  onPrimary: '#FFFFFF',

  danger: '#B42318',
  onDanger: '#FFFFFF',

  warning: '#f97f38',
  success: '#16803C',

  skeleton: '#E9EEF5',
  skeletonHighlight: 'rgba(255, 255, 255, 0.75)',
};

export const darkColors: ThemeColors = {
  background: '#0B1220',
  surface: '#111C2E',
  surfaceTint: '#1B2B46',
  onTint: '#C7DAFF',

  text: '#E8EEF8',
  textMuted: '#A3B0C2',

  border: '#26354A',

  primary: '#7AA7FF',
  onPrimary: '#0B1B36',

  danger: '#FF8A8A',
  onDanger: '#3A1114',

  warning: '#F5BD64',
  success: '#6BD49A',

  skeleton: '#202D40',
  skeletonHighlight: 'rgba(255, 255, 255, 0.06)',
};
