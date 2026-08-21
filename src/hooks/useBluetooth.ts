import { useState, useEffect, useRef } from 'react';
import { Device } from 'react-native-ble-plx';
import { Buffer } from 'buffer';
import BluetoothService from '../bluetooth/BluetoothService';
import { SCAN_TIME } from '../bluetooth/constants';

const RSSI_SMOOTHING_WINDOW = 8;
const RSSI_REFRESH_INTERVAL = 1000;
const BATTERY_REFRESH_INTERVAL = 30000;
const BATTERY_SERVICE_UUID ='0000180f-0000-1000-8000-00805f9b34fb';
const BATTERY_LEVEL_UUID ='00002a19-0000-1000-8000-00805f9b34fb';

export default function useBluetooth() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [scanning, setScanning] = useState(false);
  const [connectedDevice, setConnectedDevice] =useState<Device | null>(null);
  const [connectionStatus, setConnectionStatus] = useState(false);
  const [rssi, setRssi] =useState<number | null>(null);
  const [battery, setBattery] = useState<number | null>(null);
  const rssiHistory = useRef<number[]>([]);
  const rssiInterval =useRef<ReturnType<typeof setInterval> | null>(null);
  const batteryInterval =useRef<ReturnType<typeof setInterval> | null>(null);
  // --------------------------------------------------
  // INTERVAL CLEANUP
  // --------------------------------------------------
  const clearRssiInterval = () => {
    if (rssiInterval.current) {
      clearInterval(rssiInterval.current);
      rssiInterval.current = null;
    }
  };
  const clearBatteryInterval = () => {
    if (batteryInterval.current) {
      clearInterval(batteryInterval.current);
      batteryInterval.current = null;
    }
  };
  // --------------------------------------------------
  // RSSI SMOOTHING
  // --------------------------------------------------
  const addRssiSample = (
    nextRssi: number | null,
  ) => {
    if (nextRssi === null) {
      rssiHistory.current = [];
      setRssi(null);
      return;
    }
    rssiHistory.current.push(nextRssi);
    if (
      rssiHistory.current.length >
      RSSI_SMOOTHING_WINDOW
    ) {
      rssiHistory.current.shift();
    }
    const sum =
      rssiHistory.current.reduce(
        (total, value) => total + value,
        0,
      );
    const average = Math.round(
      sum / rssiHistory.current.length,
    );
    setRssi(average);
  };
  // --------------------------------------------------
  // BATTERY
  // --------------------------------------------------
  const readBatteryFromDevice = async (
    device: Device,
  ): Promise<number | null> => {
    try {
      console.log('Reading battery from:',device.id);
      const characteristic =
        await device.readCharacteristicForService(
          BATTERY_SERVICE_UUID,
          BATTERY_LEVEL_UUID,
        );
      if (!characteristic.value) {
        console.log('Battery characteristic has no value');
        return null;
      }
      console.log(
        'Battery raw Base64:',
        characteristic.value,
      );
      const bytes = Buffer.from(
        characteristic.value,
        'base64',
      );
      if (bytes.length === 0) {
        return null;
      }
      const level = bytes[0];
      console.log(
        'Battery level:',
        level,
      );
      if (
        level < 0 ||
        level > 100
      ) {
        return null;
      }
      return level;
    } catch (error) {
      console.log('Battery service not available:', error);
      return null;
    }
  };
  // --------------------------------------------------
  // SCANNING
  // --------------------------------------------------
  const scanDevices = async () => {
    try {
      setDevices([]);
      setScanning(true);
      await BluetoothService.waitUntilPoweredOn();
      BluetoothService.startScan(
        device => {
          setDevices(old => {
            const exists = old.find(
              d => d.id === device.id,
            );
            if (exists) {
              return old.map(d =>
                d.id === device.id
                  ? device
                  : d,
              );
            }
            return [...old, device];
          });
        },
      );
      setTimeout(() => {setScanning(false);
      }, SCAN_TIME);
    } catch (error) {
      console.log('SCAN ERROR:',error);
      setScanning(false);
    }
  };
  // --------------------------------------------------
  // CONNECT
  // --------------------------------------------------
  const connect = async (device: Device) => {
    try {
      console.log('Connecting to:',device.id);
      const connected =
        await BluetoothService.connect(
          device.id,
        );
      console.log(
        'Connected:',
        connected.id,
      );
      // ------------------------------------------------
      // VERY IMPORTANT
      // Discover GATT services + characteristics
      // ------------------------------------------------
      const discovered =
        await connected.discoverAllServicesAndCharacteristics();
      console.log(
        'GATT services discovered:',
        discovered.id,
      );
      setConnectedDevice(discovered);
      setConnectionStatus(true);
      addRssiSample(
        discovered.rssi ??
        device.rssi ??
        null,
      );
      // ------------------------------------------------
      // Read battery immediately
      // ------------------------------------------------
      const level =
        await readBatteryFromDevice(
          discovered,
        );
      console.log(
        'INITIAL BATTERY:',
        level,
      );
      setBattery(level);
    } catch (error) {
      console.log(
        'CONNECT ERROR:',
        error,
      );
      setConnectedDevice(null);
      setConnectionStatus(false);
      setBattery(null);
    }
  };
  // --------------------------------------------------
  // DISCONNECT
  // --------------------------------------------------
  const disconnect = async () => {
    if (!connectedDevice) {
      return;
    }
    try {
      await BluetoothService.disconnect(
        connectedDevice.id,
      );
    } catch (error) {
      console.log(
        'DISCONNECT ERROR:',
        error,
      );
    }
    setConnectedDevice(null);
    setConnectionStatus(false);
    addRssiSample(null);
    setBattery(null);
    clearRssiInterval();
    clearBatteryInterval();
  };
  // --------------------------------------------------
  // CONNECTED DEVICE MONITORING
  // --------------------------------------------------
  useEffect(() => {
    if (!connectedDevice) {
      clearRssiInterval();
      clearBatteryInterval();
      return;
    }
    clearRssiInterval();
    clearBatteryInterval();
    // ------------------------------------------------
    // Initial battery read
    // ------------------------------------------------
    const readInitialBattery = async () => {
      try {
        const level =
          await readBatteryFromDevice(
            connectedDevice,
          );
        console.log(
          'INITIAL BATTERY READ:',
          level,
        );
        setBattery(level);
      } catch (error) {
        console.log(
          'INITIAL BATTERY ERROR:',
          error,
        );
      }
    };
    readInitialBattery();
    // ------------------------------------------------
    // RSSI
    // ------------------------------------------------
    rssiInterval.current =
      setInterval(async () => {
        try {
          const updatedDevice =
            await connectedDevice.readRSSI();
          addRssiSample(
            updatedDevice.rssi ?? null,
          );
          setConnectedDevice(
            updatedDevice,
          );
        } catch (error) {
          console.log(
            'RSSI REFRESH ERROR:',
            error,
          );
        }
      }, RSSI_REFRESH_INTERVAL);
    // ------------------------------------------------
    // BATTERY
    // ------------------------------------------------
    batteryInterval.current =
      setInterval(async () => {
        try {const level =await readBatteryFromDevice(connectedDevice,
);
          console.log(
            'BATTERY POLL:',
            level,
          );
          setBattery(level);
        } catch (error) {
          console.log(
            'BATTERY POLL ERROR:',
            error,
          );
        }
      }, BATTERY_REFRESH_INTERVAL);
    return () => {
      clearRssiInterval();
      clearBatteryInterval();
    };
  }, [connectedDevice]);
  // --------------------------------------------------
  // UNMOUNT
  // --------------------------------------------------
  useEffect(() => {
    return () => {
      clearRssiInterval();
      clearBatteryInterval();
      BluetoothService.stopScan();
    };
  }, []);
  // --------------------------------------------------
  // RETURN
  // --------------------------------------------------
  return {
    devices,
    scanning,
    scanDevices,
    connect,
    disconnect,
    connectedDevice,
    connectionStatus,
    rssi,
    battery,
  };
}
