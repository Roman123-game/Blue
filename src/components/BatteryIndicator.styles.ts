import { StyleSheet } from 'react-native';
import { ThemeColors } from '../theme';

export default (c: ThemeColors) =>
  StyleSheet.create({
    container: {
      marginTop: 10,
    },

    label: {
      color: c.textSecondary,
    },

    value: {
      fontSize: 18,
      fontWeight: 'bold',
      color: c.textPrimary,
    },
  });
