import { StyleSheet } from 'react-native';
import { ThemeColors } from '../theme';

export default (c: ThemeColors) =>
  StyleSheet.create({
    container: {
      marginTop: 15,
    },

    title: {
      fontSize: 16,
      color: c.textPrimary,
    },

    signalBox: {
      height: 40,
      flexDirection: 'row',
      alignItems: 'flex-end',
      gap: 4,
      marginVertical: 8,
    },

    inlineContainer: {
      flexDirection: 'column',
      alignItems: 'flex-start',
    },

    inlineInfoRow: {
      flexDirection: 'column',
      alignItems: 'flex-start',
      marginTop: 2,
    },

    inlineTitle: {
      fontSize: 13,
      fontWeight: '600',
      color: c.textSecondary,
    },

    inlineValue: {
      fontSize: 14,
      fontWeight: '600',
      color: c.textPrimary,
    },

    inlineLabel: {
      fontSize: 12,
      color: c.textMuted,
    },

    bar: {
      width: 10,
      backgroundColor: '#222',
      borderRadius: 3,
    },

    value: {
      fontSize: 20,
      fontWeight: 'bold',
      color: c.textPrimary,
    },

    label: {
      color: c.textSecondary,
    },
  });
