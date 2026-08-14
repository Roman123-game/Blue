import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import RNBluetoothClassic from 'react-native-bluetooth-classic';
import styles from './BluetoothManager.styles';
type Device = {
  name: string;
  address: string;
};
export default function BluetoothManager() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    loadBluetoothDevices();
  }, []);
  async function requestPermissions() {
    if (Platform.OS !== 'android') {
      return true;
    }
    if (Platform.Version >= 31) {
      const result = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ]);
      return (
        result[PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        result[PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT] ===
          PermissionsAndroid.RESULTS.GRANTED
      );
    }
    const location = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    return location === PermissionsAndroid.RESULTS.GRANTED;
  }
  async function loadBluetoothDevices() {
    try {
      setLoading(true);
      setError('');
      console.log('Bluetooth module:', RNBluetoothClassic);
      if (!RNBluetoothClassic) {
        throw new Error('Bluetooth native module not loaded. Rebuild the app.');
      }
      const allowed = await requestPermissions();
      if (!allowed) {
        throw new Error('Bluetooth permission denied');
      }
      const enabled = await RNBluetoothClassic.isBluetoothEnabled();
      console.log('Bluetooth enabled:', enabled);
      if (!enabled) {
        await RNBluetoothClassic.requestBluetoothEnabled();
      }
      const bonded = await RNBluetoothClassic.getBondedDevices();
      console.log('Bonded devices:', bonded);
      setDevices(
        bonded.map((device: any) => ({
          name: device.name || 'Unknown',
          address: device.address,
        })),
      );
    } catch (e: any) {
      console.log('Bluetooth error:', e);
      setError(e.message || 'Bluetooth failed');
    } finally {
      setLoading(false);
    }
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bluetooth Devices</Text>
      <TouchableOpacity style={styles.button} onPress={loadBluetoothDevices}>
        <Text style={styles.buttonText}>Refresh</Text>
      </TouchableOpacity>
      {loading && <ActivityIndicator size="large" />}
      {error !== '' && <Text style={styles.error}>{error}</Text>}a
      <FlatList
        data={devices}
        keyExtractor={item => item.address}
        renderItem={({ item }) => (
          <View style={styles.device}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.address}>{item.address}</Text>
          </View>
        )}
        ListEmptyComponent={<Text>No paired Bluetooth devices</Text>}
      />
    </View>
  );
}
