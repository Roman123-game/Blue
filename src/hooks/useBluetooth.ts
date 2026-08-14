import { useState, useEffect, useRef } from 'react';
import { Device } from 'react-native-ble-plx';
import { Buffer } from 'buffer';
import BluetoothService from '../bluetooth/BluetoothService';
import { SCAN_TIME } from '../bluetooth/constants';
const RSSI_SMOOTHING_WINDOW = 8;
const RSSI_REFRESH_INTERVAL = 1000;

export default function useBluetooth() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [scanning, setScanning] = useState(false);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const [connectionStatus, setConnectionStatus] = useState(false);
  const [rssi, setRssi] = useState<number | null>(null);
  const [battery, setBattery] = useState<number | null>(null);
  const rssiHistory = useRef<number[]>([]);
  const rssiInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const batteryInterval = useRef<ReturnType<typeof setInterval> | null>(null);

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

  const BATTERY_SERVICE_UUIDS = ['180F', '0000180f-0000-1000-8000-00805f9b34fb'];
  const BATTERY_CHAR_UUIDS = ['2A19', '00002a19-0000-1000-8000-00805f9b34fb'];

  async function readBatteryFromDevice(dev: Device): Promise<number | null> {
    for (const s of BATTERY_SERVICE_UUIDS) {
      for (const c of BATTERY_CHAR_UUIDS) {
        try {
          const char = await dev.readCharacteristicForService(s, c);
          if (char && char.value) {
            const bytes = Buffer.from(char.value, 'base64');
            const level = bytes[0];
            if (typeof level === 'number' && !Number.isNaN(level)) {
              return level;
            }
          }
        } catch (e) {
          // ignore and try next
        }
      }
    }
    return null;
  }

  const addRssiSample = (nextRssi: number | null) => {
    if (nextRssi === null) {
      rssiHistory.current = [];
      setRssi(null);
      return;
    }

    rssiHistory.current.push(nextRssi);
    if (rssiHistory.current.length > RSSI_SMOOTHING_WINDOW) {
      rssiHistory.current.shift();
    }

    const sum = rssiHistory.current.reduce((total, value) => total + value, 0);
    const average = Math.round(sum / rssiHistory.current.length);
    setRssi(average);
  };
  const scanDevices = async () => {
    setDevices([]);
    setScanning(true);
    await BluetoothService.waitUntilPoweredOn();
    BluetoothService.startScan(device => {
      setDevices(old => {
        const exists = old.find(d => d.id === device.id);
        if (exists) {
          return old.map(d => (d.id === device.id ? device : d));
        }
        return [...old, device];
      });
    });
    setTimeout(() => {
      setScanning(false);
    }, SCAN_TIME);
  };
  const connect = async (device: Device) => {
    try {
      const connected = await BluetoothService.connect(device.id);
      setConnectedDevice(connected);
      setConnectionStatus(true);
      addRssiSample(connected.rssi ?? device.rssi ?? null);
      // try reading battery once immediately
      try {
        const level = await readBatteryFromDevice(connected);
        setBattery(level);
      } catch (err) {
        console.log('BATTERY READ ERROR', err);
      }
    } catch (error) {
      console.log('CONNECT ERROR', error);
    }
  };
  const disconnect = async () => {
    if (!connectedDevice) {
      return;
    }
    await BluetoothService.disconnect(connectedDevice.id);
    setConnectedDevice(null);
    setConnectionStatus(false);
    addRssiSample(null);
    setBattery(null);
    clearRssiInterval();
    clearBatteryInterval();
  };

  useEffect(() => {
    if (!connectedDevice) {
      clearRssiInterval();
      clearBatteryInterval();
      return;
    }

    clearRssiInterval();
    clearBatteryInterval();

    // initial battery read
    (async () => {
      try {
        const level = await readBatteryFromDevice(connectedDevice);
        setBattery(level);
      } catch (err) {
        console.log('BATTERY READ ERROR', err);
      }
    })();

    rssiInterval.current = setInterval(async () => {
      try {
        const updatedDevice = await connectedDevice.readRSSI();
        addRssiSample(updatedDevice.rssi ?? null);
        setConnectedDevice(updatedDevice);
      } catch (error) {
        console.log('RSSI refresh error', error);
      }
    }, RSSI_REFRESH_INTERVAL);

    // poll battery every 30s
    batteryInterval.current = setInterval(async () => {
      try {
        const level = await readBatteryFromDevice(connectedDevice);
        setBattery(level);
      } catch (err) {
        console.log('BATTERY POLL ERROR', err);
      }
    }, 30000);

    return () => {
      clearRssiInterval();
      clearBatteryInterval();
    };
  }, [connectedDevice]);

  useEffect(() => {
    return () => {
      BluetoothService.stopScan();
    };
  }, []);
  return {
    devices,
    scanning,
    scanDevices,
    connect,
    disconnect,
    connectedDevice,
    rssi,
    battery,
    connectionStatus,
  };
}
