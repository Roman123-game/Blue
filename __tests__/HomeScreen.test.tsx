import React from 'react';
import renderer from 'react-test-renderer';
import { Text } from 'react-native';
import HomeScreen from '../src/screens/HomeScreen';
import useBluetooth from '../src/hooks/useBluetooth';
import { lightColors } from '../src/theme';

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

  it('renders distance with signal strength and battery details at the bottom', () => {
    const tree = renderer.create(<HomeScreen />).toJSON();

    const treeString = JSON.stringify(tree);
    const strengthIndex = treeString.indexOf('Strength');
    const batteryIndex = treeString.indexOf('Battery:');
    const distanceIndex = treeString.indexOf('ESTIMATED DISTANCE');

    expect(strengthIndex).toBeGreaterThan(-1);
    expect(batteryIndex).toBeGreaterThan(strengthIndex);
    expect(distanceIndex).toBeGreaterThan(batteryIndex);
    expect(treeString).toContain('m');
  });

  it('uses consistent typography for sensor labels and readings', () => {
    const screen = renderer.create(<HomeScreen />);
    const texts = screen.root.findAllByType(Text);
    const findText = (content: string) =>
      texts.find(text => text.props.children === content);
    const labels = ['Strength', 'Battery:', 'ESTIMATED DISTANCE'].map(content =>
      findText(content),
    );

    expect(labels.every(Boolean)).toBe(true);
    labels.forEach(label => {
      expect(label?.props.style).toMatchObject({
        fontSize: 12,
        fontWeight: '700',
      });
    });

    expect(findText('-60 dBm')?.props.style).toMatchObject({
      fontSize: 18,
      fontWeight: '700',
    });
    expect(findText('50%')?.props.style).toMatchObject({
      fontSize: 18,
      fontWeight: '700',
    });
  });

  it('hides the monitor title and scan button when a device is connected', () => {
    const tree = renderer.create(<HomeScreen />).toJSON();
    const treeString = JSON.stringify(tree);

    expect(treeString).not.toContain('Bluetooth Monitor');
    expect(treeString).not.toContain('Scan Devices');
  });

  it('shows a green status light when a device is connected', () => {
    const tree = renderer.create(<HomeScreen />).toJSON();

    expect(JSON.stringify(tree)).toContain(lightColors.success);
  });
});
