import { StyleSheet } from 'react-native';
import { ThemeColors } from '../theme';

export default (c: ThemeColors) =>
  StyleSheet.create({
    card: {
      padding: 15,
      marginVertical: 8,
      borderWidth: 1,
      borderRadius: 12,
      borderColor: c.surfaceBorder,
      backgroundColor: c.surface,
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
      color: c.textPrimary,
    },
    info: {
      color: c.textSecondary,
    },
    label: {
      marginTop: 10,
      fontWeight: 'bold',
      color: c.textSecondary,
    },
    value: {
      fontSize: 16,
      fontWeight: 'bold',
      color: c.textPrimary,
    },
    connectButton: {
      minHeight: 48,
      marginTop: 16,
      paddingHorizontal: 16,
      borderRadius: 12,
      backgroundColor: c.accent,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    connectButtonDisabled: {
      backgroundColor: c.buttonBg,
    },
    connectButtonText: {
      fontSize: 15,
      fontWeight: '800',
      color: '#ffffff',
    },
    connectButtonTextDisabled: {
      color: c.textMuted,
    },
  });
