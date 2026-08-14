/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';
import useBluetooth from '../src/hooks/useBluetooth';

jest.mock('../src/hooks/useBluetooth');

const mockedUseBluetooth = useBluetooth as jest.MockedFunction<typeof useBluetooth>;

test('renders correctly', async () => {
  mockedUseBluetooth.mockReturnValue({
    devices: [],
    scanning: false,
    scanDevices: jest.fn(),
    connect: jest.fn(),
    disconnect: jest.fn(),
    connectedDevice: null,
    rssi: null,
    battery: null,
    connectionStatus: false,
  } as any);

  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<App />);
  });
});
