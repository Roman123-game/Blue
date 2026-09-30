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
  background: '#f4f7fc',
  backgroundAccent: '#e5efff',
  surface: '#ffffff',
  surfaceBorder: '#d8e3f2',
  surfaceElevated: '#fbfdff',
  textPrimary: '#12253d',
  textSecondary: '#4b617d',
  textMuted: '#8191a8',
  buttonBg: '#dce8fa',
  buttonText: '#173b6b',
  accent: '#3478f6',
  accentSoft: '#bfd4ff',
  danger: '#c94b4b',
  gaugeCard: '#e8f1ff',
};

export const darkColors: ThemeColors = {
  background: '#0c1726',
  backgroundAccent: '#10243b',
  surface: '#142338',
  surfaceBorder: '#29415d',
  surfaceElevated: '#192c44',
  textPrimary: '#eef5ff',
  textSecondary: '#a9bed8',
  textMuted: '#7188a5',
  buttonBg: '#23436a',
  buttonText: '#e5efff',
  accent: '#3478f6',
  accentSoft: '#2c4f85',
  danger: '#ee7770',
  gaugeCard: '#18314e',
};

export function useThemeColors(): ThemeColors {
  const scheme = useColorScheme();
  return scheme === 'dark' ? darkColors : lightColors;
}