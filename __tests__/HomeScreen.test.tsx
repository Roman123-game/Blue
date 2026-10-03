import React from 'react';
import renderer from 'react-test-renderer';
import { Text } from 'react-native';
import HomeScreen from '../src/screens/HomeScreen';
import CarTopView from '../src/components/CarTopView';
import useBluetooth from '../src/hooks/useBluetooth';
import { lightColors } from '../src/theme';

jest.mock('../src/hooks/useBluetooth', () => jest.fn());
jest.mock('../src/components/CarTopView', () => () => null);
jest.mock('../src/theme', () => {
  const actual = jest.requireActual('../src/theme');
  return {
    ...actual,
    useThemeColors: () => actual.lightColors,
  };
});

const mockedUseBluetooth = useBluetooth as jest.MockedFunction<typeof useBluetooth>;

const createBluetoothState = (rssi = -60) => ({
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
  rssi,
  battery: 50,
  connectionStatus: true,
});

const renderHomeScreen = () => {
  let screen: renderer.ReactTestRenderer;
  renderer.act(() => {
    screen = renderer.create(<HomeScreen />);
  });
  return screen!;
};

describe('HomeScreen', () => {
  beforeEach(() => {
    mockedUseBluetooth.mockReturnValue(createBluetoothState() as any);
  });

  it('renders distance with signal strength and battery details at the bottom', () => {
    const tree = renderHomeScreen().toJSON();

    const treeString = JSON.stringify(tree);
    const strengthIndex = treeString.indexOf('Strength');
    const batteryIndex = treeString.indexOf('Battery:');
    const distanceIndex = treeString.indexOf('Distance');

    expect(strengthIndex).toBeGreaterThan(-1);
    expect(batteryIndex).toBeGreaterThan(strengthIndex);
    expect(distanceIndex).toBeGreaterThan(batteryIndex);
    expect(treeString).toContain('m');
  });

  it('uses consistent typography for sensor labels and readings', () => {
    const screen = renderHomeScreen();
    const texts = screen.root.findAllByType(Text);
    const findText = (content: string) =>
      texts.find(text => text.props.children === content);
    const labels = ['Strength', 'Battery:', 'Distance'].map(content =>
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
    const tree = renderHomeScreen().toJSON();
    const treeString = JSON.stringify(tree);

    expect(treeString).not.toContain('Bluetooth Monitor');
    expect(treeString).not.toContain('Scan Devices');
  });

  it('does not render the exit button', () => {
    const screen = renderHomeScreen();

    expect(screen.root.findAllByProps({ accessibilityLabel: 'Exit app' })).toHaveLength(0);
  });

  it('shows a green status light when a device is connected', () => {
    const tree = renderHomeScreen().toJSON();

    expect(JSON.stringify(tree)).toContain(lightColors.success);
  });

  it('does not show the radar monitor when distance is less than 3 meters', () => {
    const screen = renderHomeScreen();

    expect(screen.root.findAllByType(CarTopView)).toHaveLength(0);
  });

  it('shows the radar monitor when distance is at least 3 meters', () => {
    mockedUseBluetooth.mockReturnValue(createBluetoothState(-80) as any);

    const screen = renderHomeScreen();

    expect(screen.root.findAllByType(CarTopView)).toHaveLength(1);
  });
});
