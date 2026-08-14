import { Device } from 'react-native-ble-plx';
export function identifyDevice(device: Device) {
  const name = device.name || device.localName;
  if (name) {
    return name;
  }
  const manufacturer = device.manufacturerData;
  if (manufacturer) {
    const data = manufacturer.toLowerCase();
    if (data.includes('4c00')) {
      return 'Apple Device';
    }
    if (data.includes('7500')) {
      return 'Samsung Device';
    }
    if (data.includes('004c')) {
      return 'Apple BLE Device';
    }
  }
  const services = device.serviceUUIDs || [];
  if (services.includes('180D')) {
    return 'Heart Rate Monitor';
  }
  if (services.includes('180F')) {
    return 'Battery BLE Device';
  }
  if (services.includes('1812')) {
    return 'HID Device';
  }
  return 'Unknown BLE Device';
}
