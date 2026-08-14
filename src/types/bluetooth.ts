import { Device } from "react-native-ble-plx";

export interface BluetoothDevice {
  id: string;
  name: string;
  rssi: number | null;
  isConnectable?: boolean | null;
  device: Device;
}

export interface BluetoothState {
  scanning: boolean;
  connected: boolean;
  battery: number | null;
  rssi: number | null;
  device?: Device;
}