import { StyleSheet } from 'react-native';
import { ThemeColors } from '../theme';

export default (c: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 76,
      paddingBottom: 20,
      backgroundColor: c.background,
    },
    eyebrow: {
      marginBottom: 8,
      fontSize: 11,
      fontWeight: '800',
      letterSpacing: 1.5,
      color: c.accent,
    },
    title: {
      fontSize: 32,
      lineHeight: 38,
      fontWeight: '800',
      color: c.textPrimary,
    },
    subtitle: {
      marginTop: 8,
      fontSize: 15,
      lineHeight: 22,
      color: c.textSecondary,
    },
    card: {
      marginTop: 28,
      padding: 18,
      borderWidth: 1,
      borderRadius: 16,
      borderColor: c.surfaceBorder,
      backgroundColor: c.surface,
    },
    cardEyebrow: {
      marginBottom: 8,
      fontSize: 11,
      fontWeight: '800',
      letterSpacing: 1.2,
      color: c.accent,
    },
    cardTitle: {
      fontSize: 19,
      fontWeight: '800',
      color: c.textPrimary,
    },
    cardDescription: {
      marginTop: 8,
      fontSize: 14,
      lineHeight: 21,
      color: c.textSecondary,
    },
    unitSelector: {
      flexDirection: 'row',
      marginTop: 16,
      padding: 4,
      borderRadius: 12,
      backgroundColor: c.backgroundAccent,
    },
    unitOption: {
      flex: 1,
      minHeight: 42,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 9,
    },
    selectedUnitOption: {
      backgroundColor: c.surface,
      borderWidth: 1,
      borderColor: c.surfaceBorder,
    },
    unitOptionText: {
      fontSize: 14,
      fontWeight: '700',
      color: c.textSecondary,
    },
    selectedUnitOptionText: {
      color: c.accent,
    },
  });
