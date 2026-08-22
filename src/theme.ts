import { useColorScheme } from 'react-native';

export interface ThemeColors {
  background: string;
  surface: string;
  surfaceBorder: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  buttonBg: string;
  buttonText: string;
  gaugeCard: string;
}

export const lightColors: ThemeColors = {
  background: '#ffffff',
  surface: '#ffffff',
  surfaceBorder: '#e1e4ee',
  textPrimary: '#1f2b4d',
  textSecondary: '#4b5b8a',
  textMuted: '#8188a3',
  buttonBg: '#e1e4ee',
  buttonText: '#1f2b4d',
  gaugeCard: '#f2f4ff',
};

export const darkColors: ThemeColors = {
  background: '#121a2b',
  surface: '#1b2437',
  surfaceBorder: '#2b3650',
  textPrimary: '#e8ecf7',
  textSecondary: '#aab4cf',
  textMuted: '#7885a6',
  buttonBg: '#2b3650',
  buttonText: '#e8ecf7',
  gaugeCard: '#1b2437',
};

export function useThemeColors(): ThemeColors {
  const scheme = useColorScheme();
  return scheme === 'dark' ? darkColors : lightColors;
}