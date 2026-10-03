import React, { useMemo } from 'react';
import { View, Text, FlatList } from 'react-native';
import useBluetooth from "../hooks/useBluetooth";
import ScanButton from '../components/ScanButton';
import DeviceCard from '../components/DeviceCard';
import SignalStrength from '../components/SignalStrength';
import BatteryIndicator from '../components/BatteryIndicator';
import DisconnectButton from '../components/DisconnectButton';
import ConnectionStatus from '../components/ConnectionStatus';
import CarTopView from '../components/CarTopView';
import { rssiToDistance, rssiToDistanceFeet } from '../utils/rssiToDistance';
import createStyles from './HomeScreen.styles';
import { useThemeColors } from '../theme';

interface Props {
  onBack?: () => void;
  userName?: string;
}

export default function HomeScreen({ onBack: _onBack, userName }: Props) {
  const {
    devices,
    scanning,
    scanDevices,
    connect,
    disconnect,
    connectedDevice,
    rssi,
    battery,
    connectionStatus,
  } = useBluetooth();
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const distanceMeters = useMemo(() => {
    if (rssi === null || rssi === undefined) {
      return null;
    }
    return rssiToDistance(rssi);
  }, [rssi]);

  const distanceFeet = useMemo(() => {
    if (rssi === null || rssi === undefined) {
      return null;
    }
    return rssiToDistanceFeet(rssi);
  }, [rssi]);

  return (
    <View style={styles.container}>
      {userName ? (
        <Text style={styles.welcome}>Welcome, {userName}!</Text>
      ) : null}

      {!connectedDevice && devices.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.eyebrow}>VEHICLE MONITOR</Text>
          <Text style={styles.title}>Connect your device</Text>
          <Text style={styles.emptyMessage}>
            Pair a Bluetooth device to start monitoring its proximity.
          </Text>
          <ScanButton scanning={scanning} onPress={scanDevices} />
        </View>
      )}
      {connectedDevice ? (
        <View style={styles.connectedContainer}>
          <View style={styles.headerRow}>
            <View style={styles.headerContent}>
              <View style={styles.statusHeaderRow}>
                <Text style={styles.eyebrow}>Live sensor status</Text>
                <ConnectionStatus connected={connectionStatus} />
              </View>
              <Text style={styles.name}>
                {connectedDevice.name || connectedDevice.localName || 'Unknown Device'}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.strengthWrap}>
              <SignalStrength rssi={rssi} inline />
            </View>

            <View style={styles.separator} />

            <View style={styles.batteryWrap}>
              <BatteryIndicator battery={battery} style={styles.metricColumn} />
            </View>

            <View style={styles.separator} />

            <View style={styles.distanceWrap}>
              <Text style={styles.gaugeLabel}>Distance:</Text>
              <View style={styles.gaugeValueRow}>
                <Text style={styles.gaugeValue}>
                  {distanceMeters === null ? 'Calculating...' : distanceMeters.toFixed(2)}
                </Text>
                <Text style={styles.gaugeUnit}>m</Text>
              </View>
              <Text style={styles.gaugeSubValue}>
                {distanceFeet === null ? 'Waiting for signal' : `${distanceFeet.toFixed(2)} ft away`}
              </Text>
            </View>
          </View>

          <View style={styles.carWrap}>
            <CarTopView rssi={rssi} />
          </View>

          <View style={styles.bottomRow}>
            <DisconnectButton onPress={disconnect} />
          </View>
        </View>
      ) : (
        <>
          {devices.length > 0 && (
            <>
              <Text style={styles.eyebrow}>NEARBY DEVICES</Text>
              <Text style={styles.subtitle}>Devices</Text>
              <FlatList
                data={devices}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                  <DeviceCard
                    device={item}
                    connected={false}
                    onConnect={connect}
                  />
                )}
              />
              {/* {onBack && (
                <TouchableOpacity style={styles.button} onPress={onBack}>
                  <Text style={styles.buttonText}>Back</Text>
                </TouchableOpacity>
              )} */}
            </>
          )}
        </>
      )}

    </View>
  );
}