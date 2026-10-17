import React from 'react';
import { StyleSheet, View } from 'react-native';

type GaugeIconName = 'signal' | 'battery' | 'distance';

interface Props {
  name: GaugeIconName;
  color: string;
  backgroundColor: string;
}

export default function GaugeIcon({ name, color, backgroundColor }: Props) {
  if (name === 'signal') {
    return (
      <View testID="gauge-icon-signal" style={styles.signal}>
        {[5, 8, 11].map(height => (
          <View
            key={height}
            style={[styles.signalBar, { height, backgroundColor: color }]}
          />
        ))}
      </View>
    );
  }

  if (name === 'battery') {
    return (
      <View testID="gauge-icon-battery" style={styles.battery}>
        <View style={[styles.batteryBody, { borderColor: color }]}>
          <View style={[styles.batteryFill, { backgroundColor: color }]} />
        </View>
        <View style={[styles.batteryTerminal, { backgroundColor: color }]} />
      </View>
    );
  }

  return (
    <View testID="gauge-icon-distance" style={styles.distance}>
      <View style={[styles.pinTip, { backgroundColor: color }]} />
      <View style={[styles.pinOuter, { borderColor: color }]}>
        <View style={[styles.pinInner, { backgroundColor }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  signal: {
    width: 14,
    height: 14,
    marginRight: 5,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  signalBar: {
    width: 3,
    borderRadius: 1,
  },
  battery: {
    width: 14,
    height: 14,
    marginRight: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  batteryBody: {
    width: 11,
    height: 8,
    borderWidth: 1.5,
    borderRadius: 2,
    justifyContent: 'center',
    padding: 1,
  },
  batteryFill: {
    width: 4,
    height: 4,
    borderRadius: 1,
  },
  batteryTerminal: {
    width: 2,
    height: 4,
    borderTopRightRadius: 1,
    borderBottomRightRadius: 1,
  },
  distance: {
    width: 14,
    height: 15,
    marginRight: 5,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  pinTip: {
    position: 'absolute',
    width: 6,
    height: 6,
    bottom: 2,
    transform: [{ rotate: '45deg' }],
    borderRadius: 1,
  },
  pinOuter: {
    width: 11,
    height: 11,
    borderWidth: 2,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  pinInner: {
    width: 3,
    height: 3,
    borderRadius: 2,
  },
});
