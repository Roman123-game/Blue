import { StyleSheet } from 'react-native';
import { ThemeColors } from '../theme';

export default (c: ThemeColors) =>
  StyleSheet.create({
    container: {
      marginTop: 15,
    },

    title: {
      fontSize: 12,
      fontWeight: '700',
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
      fontSize: 12,
      fontWeight: '700',
      color: c.textSecondary,
    },

    inlineValue: {
      fontSize: 18,
      fontWeight: '700',
      color: c.textPrimary,
    },

    inlineLabel: {
      fontSize: 12,
      fontWeight: '600',
      color: c.textMuted,
    },

    bar: {
      width: 10,
      backgroundColor: c.accent,
      borderRadius: 3,
    },

    value: {
      fontSize: 18,
      fontWeight: '700',
      color: c.textPrimary,
    },

    label: {
      fontSize: 12,
      fontWeight: '600',
      color: c.textSecondary,
    },
  });
