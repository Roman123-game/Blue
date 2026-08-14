import React from 'react';
import renderer from 'react-test-renderer';
import HomeScreen from '../src/screens/HomeScreen';
import useBluetooth from '../src/hooks/useBluetooth';

jest.mock('../src/hooks/useBluetooth');

const mockedUseBluetooth = useBluetooth as jest.MockedFunction<typeof useBluetooth>;

describe('HomeScreen', () => {
  beforeEach(() => {
    mockedUseBluetooth.mockReturnValue({
      devices: [],
      scanning: false,
      scanDevices: jest.fn(),
      connect: jest.fn(),
      disconnect: jest.fn(),
      connectedDevice: {
        id: 'device-1',
        name: 'Test Device',
        localName: 'Test Device',
      },
      rssi: -60,
      battery: 50,
      connectionStatus: true,
    } as any);
  });

  it('renders the distance gauge near the top of the home screen', () => {
    const tree = renderer.create(<HomeScreen />).toJSON();

    const treeString = JSON.stringify(tree);
    expect(treeString).toContain('Distance Gauge');
    expect(treeString).toContain('m');
    expect(treeString).not.toContain('%');
  });

  it('hides the monitor title and scan button when a device is connected', () => {
    const tree = renderer.create(<HomeScreen />).toJSON();
    const treeString = JSON.stringify(tree);

    expect(treeString).not.toContain('Bluetooth Monitor');
    expect(treeString).not.toContain('Scan Devices');
  });
});
