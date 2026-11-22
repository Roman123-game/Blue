import React, { useMemo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useThemeColors } from '../theme';
import { DistanceUnit } from '../types/distance';
import createStyles from './MenuScreen.styles';

interface Props {
  userName?: string;
  distanceUnit: DistanceUnit;
  onDistanceUnitChange: (unit: DistanceUnit) => void;
}

const distanceUnits: { value: DistanceUnit; label: string }[] = [
  { value: 'meters', label: 'Meters' },
  { value: 'feet', label: 'Feet' },
];

export default function MenuScreen({
  userName,
  distanceUnit,
  onDistanceUnitChange,
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
      </View>

    </View>
  );
}
