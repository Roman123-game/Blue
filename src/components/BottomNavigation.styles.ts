import { StyleSheet } from 'react-native';
import { ThemeColors } from '../theme';

export default (c: ThemeColors) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      paddingTop: 8,
      paddingHorizontal: 20,
      borderTopWidth: 1,
      borderTopColor: c.surfaceBorder,
      backgroundColor: c.surface,
    },
    tab: {
      flex: 1,
      minHeight: 48,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 12,
    },
    icon: {
      fontSize: 20,
      lineHeight: 23,
      color: c.textMuted,
    },
    label: {
      marginTop: 2,
      fontSize: 12,
      fontWeight: '700',
      color: c.textMuted,
    },
    selectedText: {
      color: c.accent,
    },
  });
