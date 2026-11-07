import React, { useMemo } from 'react';
import { View, Text, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useBluetooth from "../hooks/useBluetooth";
import ScanButton from '../components/ScanButton';
import DeviceCard from '../components/DeviceCard';
import SignalStrength from '../components/SignalStrength';
import BatteryIndicator from '../components/BatteryIndicator';
import DisconnectButton from '../components/DisconnectButton';
import ConnectionStatus from '../components/ConnectionStatus';
import CarTopView from '../components/CarTopView';
import ExitButton from '../components/ExitButton';
import { rssiToDistance, rssiToDistanceFeet } from '../utils/rssiToDistance';
import isAndroidEmulator from '../utils/isAndroidEmulator';
import createStyles from './HomeScreen.styles';
import { useThemeColors } from '../theme';
import GaugeIcon from '../components/GaugeIcon';

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
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const showSimulatorPreview = isAndroidEmulator() && !connectedDevice;
  const activeRssi = showSimulatorPreview ? -60 : rssi;
  const activeBattery = showSimulatorPreview ? 50 : battery;
  const distanceMeters = useMemo(() => {
    if (activeRssi === null || activeRssi === undefined) {
      return null;
    }
    return rssiToDistance(activeRssi);
  }, [activeRssi]);

  const distanceFeet = useMemo(() => {
    if (activeRssi === null || activeRssi === undefined) {
      return null;
    }
    return rssiToDistanceFeet(activeRssi);
  }, [activeRssi]);

  return (
    <View style={styles.container}>
      {!connectedDevice && !showSimulatorPreview && <ExitButton />}

      {userName ? (
        <Text style={styles.welcome}>Welcome, {userName}!</Text>
      ) : null}

      {!connectedDevice && !showSimulatorPreview && devices.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.eyebrow}>VEHICLE MONITOR</Text>
          <Text style={styles.title}>Connect your device</Text>
          <Text style={styles.emptyMessage}>
            Pair a Bluetooth device to start monitoring its proximity.
          </Text>
          <ScanButton scanning={scanning} onPress={scanDevices} />
        </View>
      )}
      {connectedDevice || showSimulatorPreview ? (
        <View style={styles.connectedContainer}>
          <View style={styles.headerRow}>
            <View style={styles.headerContent}>
              <View style={styles.statusHeaderRow}>
                <Text style={styles.eyebrow}>
                  {showSimulatorPreview ? 'SIMULATOR PREVIEW · SAMPLE DATA' : 'Live sensor status'}
                </Text>
                <ConnectionStatus connected={showSimulatorPreview || connectionStatus} />
              </View>
              <Text style={styles.name}>
                {showSimulatorPreview
                  ? 'Demo sensor'
                  : connectedDevice?.name || connectedDevice?.localName || 'Unknown Device'}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View testID="gauge-card-signal" style={styles.gaugeTile}>
              <SignalStrength rssi={activeRssi} inline />
            </View>

            <View testID="gauge-card-battery" style={styles.gaugeTile}>
              <BatteryIndicator battery={activeBattery} />
            </View>

            <View testID="gauge-card-distance" style={styles.gaugeTile}>
              <View style={styles.gaugeLabelRow}>
                <GaugeIcon
                  name="distance"
                  color={colors.textSecondary}
                  backgroundColor={colors.gaugeCard}
                />
                <Text style={styles.gaugeLabel}>Distance:</Text>
              </View>
              <View style={styles.gaugeValueRow}>
                <Text
                  style={
                    distanceMeters === null
                      ? styles.gaugeValue
                      : styles.gaugeMeasurement
                  }
                >
                  {distanceMeters === null ? 'Calculating...' : distanceMeters.toFixed(2)}
                </Text>
                <Text style={styles.gaugeUnit}>m</Text>
              </View>
              {distanceFeet === null ? (
                <Text style={styles.gaugeSubValue}>Waiting for signal</Text>
              ) : (
                <Text style={styles.gaugeSubValue}>
                  <Text style={styles.gaugeSubMeasurement}>{distanceFeet.toFixed(2)}</Text>
                  {' ft away'}
                </Text>
              )}
            </View>
          </View>

          {distanceMeters !== null && (
            <View style={styles.carWrap}>
              <CarTopView rssi={activeRssi} />
            </View>
          )}

          {connectedDevice && (
            <View style={styles.bottomRow}>
              <DisconnectButton onPress={disconnect} />
            </View>
          )}
        </View>
      ) : (
        <>
          {devices.length > 0 && (
            <>
              <Text style={styles.eyebrow}>NEARBY DEVICES</Text>
              <Text style={styles.subtitle}>Select a device</Text>
              <FlatList
                data={devices}
                keyExtractor={item => item.id}
                contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
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