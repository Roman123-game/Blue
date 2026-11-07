import { StyleSheet } from 'react-native';
import { ThemeColors } from '../theme';

export default (c: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      marginTop: 0,
      justifyContent: 'space-between',
    },

    labelRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    label: {
      fontSize: 12,
      fontWeight: '700',
      color: c.textSecondary,
    },

    value: {
      fontSize: 18,
      fontWeight: '700',
      color: c.textPrimary,
    },

    readingRow: {
      flexDirection: 'row',
      alignItems: 'baseline',
    },

    measurement: {
      fontSize: 18,
      fontWeight: '700',
      color: c.accent,
    },

    unit: {
      fontSize: 18,
      fontWeight: '700',
      color: c.textPrimary,
    },
  });
