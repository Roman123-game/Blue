import React, { useMemo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useThemeColors, type ThemeMode } from '../theme';
import { DistanceUnit } from '../types/distance';
import createStyles from './MenuScreen.styles';

interface Props {
  userName?: string;
  distanceUnit: DistanceUnit;
  onDistanceUnitChange: (unit: DistanceUnit) => void;
  themeMode: ThemeMode;
  onThemeModeChange: (mode: ThemeMode) => void;
}

const distanceUnits: { value: DistanceUnit; label: string }[] = [
  { value: 'meters', label: 'Meters' },
  { value: 'feet', label: 'Feet' },
];

const themeModes: { value: ThemeMode; label: string }[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

export default function MenuScreen({
  userName,
  distanceUnit,
  onDistanceUnitChange,
  themeMode,
  onThemeModeChange,
}: Props) {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>CHILD SAFETY</Text>
      <Text style={styles.title}>Menu</Text>
      <Text style={styles.subtitle}>
        {userName ? `Hello, ${userName}.` : 'Stay connected to the people you care about.'}
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardEyebrow}>PREFERENCES</Text>
        <Text style={styles.cardTitle}>Distance units</Text>
        <Text style={styles.cardDescription}>
          Choose how distance is displayed on Home.
        </Text>
        <View style={styles.unitSelector}>
          {distanceUnits.map(({ value, label }) => {
            const selected = distanceUnit === value;

            return (
              <TouchableOpacity
                key={value}
                accessible
                accessibilityRole="button"
                accessibilityLabel={`Distance unit ${label}`}
                accessibilityState={{ selected }}
                onPress={() => onDistanceUnitChange(value)}
                style={[
                  styles.unitOption,
                  selected && styles.selectedUnitOption,
                ]}
              >
                <Text
                  style={[
                    styles.unitOptionText,
                    selected && styles.selectedUnitOptionText,
                  ]}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <Text style={styles.sectionTitle}>Appearance</Text>
        <Text style={styles.cardDescription}>
          Choose your preferred color theme.
        </Text>
        <View style={styles.unitSelector}>
          {themeModes.map(({ value, label }) => {
            const selected = themeMode === value;

            return (
              <TouchableOpacity
                key={value}
                accessible
                accessibilityRole="button"
                accessibilityLabel={`Theme ${label}`}
                accessibilityState={{ selected }}
                onPress={() => onThemeModeChange(value)}
                style={[
                  styles.unitOption,
                  selected && styles.selectedUnitOption,
                ]}
              >
                <Text
                  style={[
                    styles.unitOptionText,
                    selected && styles.selectedUnitOptionText,
                  ]}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

    </View>
  );
}
