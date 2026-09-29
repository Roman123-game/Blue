import { useColorScheme } from 'react-native';

export interface ThemeColors {
  background: string;
  backgroundAccent: string;
  surface: string;
  surfaceBorder: string;
  surfaceElevated: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  buttonBg: string;
  buttonText: string;
  accent: string;
  accentSoft: string;
  danger: string;
  gaugeCard: string;
}

export const lightColors: ThemeColors = {
  background: '#f4f7f5',
  backgroundAccent: '#e5f0eb',
  surface: '#ffffff',
  surfaceBorder: '#d8e4de',
  surfaceElevated: '#fbfdfc',
  textPrimary: '#12251d',
  textSecondary: '#4b655b',
  textMuted: '#81948b',
  buttonBg: '#dcebe4',
  buttonText: '#173b2b',
  accent: '#0e8f62',
  accentSoft: '#bfe9d5',
  danger: '#c94b4b',
  gaugeCard: '#e8f5ee',
};

export const darkColors: ThemeColors = {
  background: '#0c1713',
  backgroundAccent: '#10271e',
  surface: '#14231d',
  surfaceBorder: '#294237',
  surfaceElevated: '#192d25',
  textPrimary: '#eef8f2',
  textSecondary: '#a9c2b5',
  textMuted: '#718d7e',
  buttonBg: '#234436',
  buttonText: '#e5f6eb',
  accent: '#5de0a4',
  accentSoft: '#2c7355',
  danger: '#ee7770',
  gaugeCard: '#18372a',
};

export function useThemeColors(): ThemeColors {
  const scheme = useColorScheme();
  return scheme === 'dark' ? darkColors : lightColors;
}