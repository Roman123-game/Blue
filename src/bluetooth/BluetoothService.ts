import { BleManager, Device, State } from 'react-native-ble-plx';
import { SCAN_TIME } from './constants';
class BluetoothService {
  private manager = new BleManager();
  async waitUntilPoweredOn() {
    const state = await this.manager.state();
    if (state === State.PoweredOn) {
      return;
    }
    return new Promise<void>(resolve => {
      const sub = this.manager.onStateChange(current => {
        if (current === State.PoweredOn) {
          sub.remove();
          resolve();
        }
      }, true);
    });
  }
  startScan(callback: (device: Device) => void) {
    this.stopScan();
    this.manager.startDeviceScan(
      null,
      {
        allowDuplicates: true,
      },
      (error, device) => {
        if (error) {
          console.log('SCAN ERROR', error);
          return;
        }
        if (device) {
          console.log('======================');
          console.log('BLE DEVICE FOUND');
          console.log(
            JSON.stringify(
              {
                name: device.name || null,
                localName: device.localName || null,
                id: device.id,
                rssi: device.rssi,
                manufacturerData: device.manufacturerData || null,
                serviceUUIDs: device.serviceUUIDs || [],
              },
              null,
              2,
            ),
          );
          callback(device);
        }
      },
    );
    setTimeout(() => {
      this.stopScan();
    }, SCAN_TIME);
  }
  stopScan() {
    this.manager.stopDeviceScan();
  }
  async connect(id: string) {
    const device = await this.manager.connectToDevice(id);
    await device.discoverAllServicesAndCharacteristics();
    console.log('CONNECTED:', device.id);
    const services = await device.services();
    console.log(
      'SERVICES:',
      JSON.stringify(
        services.map(s => s.uuid),
        null,
        2,
      ),
    );
    return device;
  }
  async disconnect(id: string) {
    await this.manager.cancelDeviceConnection(id);
  }
}
export default new BluetoothService();
