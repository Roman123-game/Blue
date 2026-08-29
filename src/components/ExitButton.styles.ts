import { StyleSheet } from 'react-native';
import { ThemeColors } from '../theme';

export default (c: ThemeColors) =>
  StyleSheet.create({
    xButton: {
      position: 'absolute',
      right: 12,
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: c.surface,
      borderWidth: 1,
      borderColor: c.surfaceBorder,
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
    },
    xText: {
      fontSize: 28,
      fontWeight: '400',
      color: c.textSecondary,
      lineHeight: 32,
    },
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 32,
    },
    dialog: {
      width: '100%',
      maxWidth: 340,
      borderRadius: 16,
      backgroundColor: c.surface,
      borderWidth: 1,
      borderColor: c.surfaceBorder,
      paddingHorizontal: 20,
      paddingVertical: 24,
      alignItems: 'stretch',
    },
    dialogTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: c.textPrimary,
      textAlign: 'center',
      marginBottom: 6,
    },
    dialogMessage: {
      fontSize: 14,
      color: c.textSecondary,
      textAlign: 'center',
      marginBottom: 20,
    },
    dialogButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 12,
    },
    stayButton: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 12,
      backgroundColor: c.buttonBg,
      alignItems: 'center',
      justifyContent: 'center',
    },
    leaveButton: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 12,
      backgroundColor: '#d64545',
      alignItems: 'center',
      justifyContent: 'center',
    },
    stayButtonText: {
      fontSize: 15,
      fontWeight: '600',
      color: c.buttonText,
    },
    leaveButtonText: {
      fontSize: 15,
      fontWeight: '600',
      color: '#ffffff',
    },
  });