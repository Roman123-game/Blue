import React, { useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
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
}

export default function HomeScreen({ onBack }: Props) {
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
      {!connectedDevice && devices.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.title}>Connect Device</Text>
          <ScanButton scanning={scanning} onPress={scanDevices} />
        </View>
      )}
      {connectedDevice ? (
        <View style={styles.connectedContainer}>
          <View style={styles.headerRow}>
            <View style={styles.nameRow}>
              <ConnectionStatus connected={connectionStatus} />
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
              <BatteryIndicator battery={battery} style={{ marginTop: 0 }} />
            </View>
          </View>

          <View style={styles.carWrap}>
            <View style={styles.gaugeCard}>
              <Text style={styles.gaugeLabel}>Distance Gauge</Text>
              <Text style={styles.gaugeValue}>
                {distanceMeters === null ? 'Calculating…' : `${distanceMeters.toFixed(2)} m`}
              </Text>
              <Text style={styles.gaugeSubValue}>
                {distanceFeet === null ? '' : `${distanceFeet.toFixed(2)} ft`}
              </Text>
              <Text style={styles.distanceLabel}>
                Estimated distance
              </Text>
            </View>
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
              <Text style={styles.subtitle}>Devices</Text>
              <FlatList
                data={devices}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                  <DeviceCard
                    device={item}
                    connected={connectedDevice?.id === item.id}
                    onConnect={connect}
                  />
                )}
              />
              {onBack && (
                <TouchableOpacity style={styles.button} onPress={onBack}>
                  <Text style={styles.buttonText}>Back</Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </>
      )}

    </View>
  );
}