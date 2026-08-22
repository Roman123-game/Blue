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
  });
