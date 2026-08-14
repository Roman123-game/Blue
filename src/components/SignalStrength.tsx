import React from 'react';

import { View, Text } from 'react-native';
import styles from './SignalStrength.styles';

interface Props {
  rssi: number | null;
  inline?: boolean;
}

export default function SignalStrength({ rssi, inline = false }: Props) {
  let bars = 0;

  let label = 'Unknown';

  if (rssi !== null) {
    if (rssi >= -50) {
      bars = 4;
      label = 'Excellent';
    } else if (rssi >= -65) {
      bars = 3;
      label = 'Good';
    } else if (rssi >= -80) {
      bars = 2;
      label = 'Weak';
    } else {
      bars = 1;
      label = 'Poor';
    }
  }

  if (inline) {
    return (
      <View style={styles.inlineContainer}>
        <Text style={styles.inlineTitle}>Strength</Text>
        <View style={styles.inlineInfoRow}>
          <Text style={styles.inlineValue}>{rssi === null ? 'N/A' : `${rssi} dBm`}</Text>
          <Text style={styles.inlineLabel}>{label}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Strength Indicator</Text>

      <View style={styles.signalBox}>
        {[1, 2, 3, 4].map(level => (
          <View
            key={level}
            style={[
              styles.bar,
              {
                height: level * 8,
                opacity: level <= bars ? 1 : 0.25,
              },
            ]}
          />
        ))}
      </View>

      <Text style={styles.value}>{rssi === null ? 'N/A' : `${rssi} dBm`}</Text>

      <Text>{label}</Text>
    </View>
  );
}
 
