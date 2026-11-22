import React from 'react';
import renderer from 'react-test-renderer';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import HomeScreen from '../src/screens/HomeScreen';
import CarTopView from '../src/components/CarTopView';
import useBluetooth from '../src/hooks/useBluetooth';
import isAndroidEmulator from '../src/utils/isAndroidEmulator';
import { lightColors } from '../src/theme';
import { DistanceUnit } from '../src/types/distance';

jest.mock('../src/hooks/useBluetooth', () => jest.fn());
jest.mock('../src/utils/isAndroidEmulator', () => jest.fn());
jest.mock('../src/components/CarTopView', () => () => null);
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
}));
jest.mock('../src/theme', () => {
  const actual = jest.requireActual('../src/theme');
  return {
    ...actual,
    useThemeColors: () => actual.lightColors,
  };
});

const mockedUseBluetooth = useBluetooth as jest.MockedFunction<typeof useBluetooth>;
const mockedIsAndroidEmulator = isAndroidEmulator as jest.MockedFunction<
  typeof isAndroidEmulator
>;

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

const renderHomeScreen = (distanceUnit: DistanceUnit = 'meters') => {
  let screen: renderer.ReactTestRenderer;
  renderer.act(() => {
    screen = renderer.create(<HomeScreen distanceUnit={distanceUnit} />);
  });
  return screen!;
};

describe('HomeScreen', () => {
  beforeEach(() => {
    mockedIsAndroidEmulator.mockReturnValue(false);
    mockedUseBluetooth.mockReturnValue(createBluetoothState() as any);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('does not render a sun or moon mascot', () => {
    mockedUseBluetooth.mockReturnValue({
      ...createBluetoothState(),
      connectedDevice: null,
    } as any);

    const screen = renderHomeScreen();

    expect(screen.root.findAllByProps({ testID: 'theme-mascot' })).toHaveLength(0);
  });

  it('shows the monitoring screen with sample data on an Android emulator', () => {
    mockedIsAndroidEmulator.mockReturnValue(true);
    mockedUseBluetooth.mockReturnValue({
      ...createBluetoothState(),
      connectedDevice: null,
      rssi: null,
      battery: null,
      connectionStatus: false,
    } as any);

    const tree = renderHomeScreen().toJSON();
    const treeString = JSON.stringify(tree);

    expect(treeString).toContain('SIMULATOR PREVIEW · SAMPLE DATA');
    expect(treeString).toContain('Demo sensor');
    expect(treeString).toContain('50');
    expect(treeString).not.toContain('Connect your device');
    expect(treeString).not.toContain('Scan Devices');
  });

  it('renders distance with signal strength and battery details at the bottom', () => {
    const screen = renderHomeScreen();
    const tree = screen.toJSON();

    const treeString = JSON.stringify(tree);
    const strengthIndex = treeString.indexOf('Strength');
    const batteryIndex = treeString.indexOf('Battery:');
    const distanceIndex = treeString.indexOf('Distance');
    const distanceUnits = screen.root
      .findAllByType(Text)
      .map(text => String(text.props.children))
      .filter(text => text === 'm' || text === 'ft');

    expect(strengthIndex).toBeGreaterThan(-1);
    expect(batteryIndex).toBeGreaterThan(strengthIndex);
    expect(distanceIndex).toBeGreaterThan(batteryIndex);
    expect(distanceUnits).toEqual(['m']);
  });

  it('displays feet as the primary distance when feet are selected', () => {
    const screen = renderHomeScreen('feet');
    const tree = screen.toJSON();
    const treeString = JSON.stringify(tree);
    const distanceUnits = screen.root
      .findAllByType(Text)
      .map(text => String(text.props.children))
      .filter(text => text === 'm' || text === 'ft');

    expect(treeString).toContain('3.61');
    expect(distanceUnits).toEqual(['ft']);
  });

  it('shows an icon for each sensor gauge', () => {
    const screen = renderHomeScreen();

    ['signal', 'battery', 'distance'].forEach(name => {
      const icon = screen.root.findByProps({ testID: `gauge-icon-${name}` });
      const usesTextColor = icon.findAllByType(View).some(({ props }) => {
        const style = StyleSheet.flatten(props.style);
        return (
          style?.backgroundColor === lightColors.textSecondary ||
          style?.borderColor === lightColors.textSecondary
        );
      });

      expect(usesTextColor).toBe(true);
    });
  });

  it('renders each sensor gauge in its own compact tile', () => {
    const screen = renderHomeScreen();

    ['signal', 'battery', 'distance'].forEach(name => {
      const card = screen.root.findByProps({ testID: `gauge-card-${name}` });

      expect(StyleSheet.flatten(card.props.style)).toMatchObject({
        aspectRatio: 1.42045,
        borderWidth: 1,
        backgroundColor: lightColors.gaugeCard,
      });
    });
  });

  it('uses consistent typography for sensor labels and readings', () => {
    const screen = renderHomeScreen();
    const texts = screen.root.findAllByType(Text);
    const findText = (content: string) =>
      texts.find(text => String(text.props.children) === content);
    const labels = ['Strength:', 'Battery:', 'Distance:'].map(content =>
      findText(content),
    );

    expect(labels.every(Boolean)).toBe(true);
    labels.forEach(label => {
      expect(label?.props.style).toMatchObject({
        fontSize: 12,
        fontWeight: '700',
      });
    });

    expect(findText('-60')?.props.style).toMatchObject({
      fontSize: 18,
      fontWeight: '700',
      color: lightColors.accent,
    });
    expect(findText(' dBm')?.props.style).toMatchObject({
      color: lightColors.textPrimary,
    });
    expect(findText('50')?.props.style).toMatchObject({
      fontSize: 18,
      fontWeight: '700',
      color: lightColors.accent,
    });
    expect(findText('%')?.props.style).toMatchObject({
      color: lightColors.textPrimary,
    });
    expect(findText('m')?.props.style).toMatchObject({
      color: lightColors.textPrimary,
    });

    const blueMeasurements = texts.filter(text => {
      const value = String(text.props.children);
      const color = StyleSheet.flatten(text.props.style)?.color;
      return color === lightColors.accent && /^-?\d+(\.\d+)?$/.test(value);
    });
    expect(blueMeasurements).toHaveLength(3);
  });

  it('hides the monitor title and scan button when a device is connected', () => {
    const tree = renderHomeScreen().toJSON();
    const treeString = JSON.stringify(tree);

    expect(treeString).not.toContain('Bluetooth Monitor');
    expect(treeString).not.toContain('Scan Devices');
  });

  it('does not render the exit button when a device is connected', () => {
    const screen = renderHomeScreen();

    expect(screen.root.findAllByProps({ accessibilityLabel: 'Exit app' })).toHaveLength(0);
  });

  it('renders the exit button while selecting a device', () => {
    mockedUseBluetooth.mockReturnValue({
      ...createBluetoothState(),
      connectedDevice: null,
    } as any);

    const screen = renderHomeScreen();

    expect(screen.root.findByProps({ accessibilityLabel: 'Exit app' })).toBeDefined();
  });

  it('adds bottom safe-area space after the device list', () => {
    mockedUseBluetooth.mockReturnValue({
      ...createBluetoothState(),
      devices: [
        {
          id: 'device-2',
          name: 'Nearby Device',
          localName: 'Nearby Device',
          manufacturerData: null,
          rssi: -55,
        },
      ],
      connectedDevice: null,
    } as any);

    const screen = renderHomeScreen();
    const list = screen.root.findByType(FlatList);

    expect(list.props.contentContainerStyle).toEqual({ paddingBottom: 20 });
  });

  it('shows a green status light when a device is connected', () => {
    const tree = renderHomeScreen().toJSON();

    expect(JSON.stringify(tree)).toContain(lightColors.success);
  });

  it('shows the radar monitor and car when distance is less than 3 meters', () => {
    const screen = renderHomeScreen();

    expect(screen.root.findAllByType(CarTopView)).toHaveLength(1);
  });

  it('shows the radar monitor when distance is at least 3 meters', () => {
    mockedUseBluetooth.mockReturnValue(createBluetoothState(-80) as any);

    const screen = renderHomeScreen();

    expect(screen.root.findAllByType(CarTopView)).toHaveLength(1);
  });
});
