import { StyleSheet } from 'react-native';
import { ThemeColors } from '../theme';

export default (c: ThemeColors) =>
  StyleSheet.create({
    container: {
      marginTop: 10,
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
  });
