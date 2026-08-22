import React, { useMemo } from 'react';
import { View, Text, Button } from 'react-native';
import createStyles from './DeviceCard.styles';
import { useThemeColors } from '../theme';
import { Device } from 'react-native-ble-plx';
import { Buffer } from 'buffer';
import { manufacturers } from '../types/manufactures';
interface Props {
  device: Device;
  onConnect: (device: Device) => void;
  connected: boolean;
}
function decodeManufacturerData(data?: string | null) {
  if (!data) {
    return {
      companyId: '',
      name: 'Unknown',
      raw: 'None',
    };
  }
  try {
    const bytes = Buffer.from(data, 'base64');
    const hex = Array.from(bytes).map(b =>
      b.toString(16).padStart(2, '0').toUpperCase(),
    );
    const id1 = hex[1] + hex[0];
    const id2 = hex[0] + hex[1];
    let companyId = '';
    let name = 'Unknown';
    if (manufacturers[id1]) {
      companyId = id1;
      name = manufacturers[id1];
    } else if (manufacturers[id2]) {
      companyId = id2;
      name = manufacturers[id2];
    } else {
      companyId = id1;
      name = `Unknown (${companyId})`;
    }
    console.log('RAW:', hex.join(':'));
    console.log('COMPANY:', companyId, name);
    return {
      companyId,
      name,
      raw: hex.join(':'),
    };
  } catch (error) {
    console.log('DECODE ERROR:', error);
    return {
      companyId: '',
      name: 'Invalid',
      raw: String(data),
    };
  }
}
export default function DeviceCard({ device, onConnect, connected }: Props) {
  const manufacturer = decodeManufacturerData(device.manufacturerData);
  const name = device.name || device.localName || 'BLE Device';
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{name}</Text>
      <Text style={styles.info}>Bluetooth ID:</Text>
      <Text selectable style={styles.info}>{device.id}</Text>
      <Text style={styles.info}>
        RSSI:
        {device.rssi}
      </Text>
      <Text style={styles.label}>Manufacturer:</Text>
      <Text style={styles.value}>{manufacturer.name}</Text>
      <Text style={styles.info}>
        Company ID:
        {manufacturer.companyId}
      </Text>
      <Text selectable style={styles.info}>
        Raw:
        {manufacturer.raw}
      </Text>
      <Text style={styles.info}>
        Services:
        {(device.serviceUUIDs || []).join(',') || 'None'}
      </Text>
      <Button
        title={connected ? 'Connected' : 'Connect'}
        disabled={connected}
        onPress={() => onConnect(device)}
      />
    </View>
  );
}
 
