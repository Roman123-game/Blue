import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import LoginScreen from '../src/screens/LoginScreen';
import { requestLoginPermissions } from '../src/bluetooth/Permissions';

jest.mock('@react-native-google-signin/google-signin', () => ({
  GoogleSignin: {
    configure: jest.fn(),
    hasPlayServices: jest.fn(),
    signIn: jest.fn(),
  },
}));
jest.mock('../src/bluetooth/Permissions', () => ({
  requestLoginPermissions: jest.fn(),
}));
jest.mock('../src/components/ExitButton', () => () => null);

test('renders Google sign-in and the previous Enter action', async () => {
  let screen: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(() => {
    screen = ReactTestRenderer.create(<LoginScreen />);
  });
  const renderedScreen = JSON.stringify(screen!.toJSON());
  expect(renderedScreen).toContain('Continue with Google');
  expect(renderedScreen).toContain('Enter');
});

test('Enter starts the existing permission flow without Google sign-in', async () => {
  const requestPermissions = jest.mocked(requestLoginPermissions);
  requestPermissions.mockResolvedValue({ location: false, nearbyDevices: false });

  let screen: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(() => {
    screen = ReactTestRenderer.create(<LoginScreen />);
  });

  await ReactTestRenderer.act(async () => {
    await screen!.root
      .findByProps({ accessibilityLabel: 'Enter' })
      .props.onPress();
  });

  expect(requestPermissions).toHaveBeenCalledTimes(1);
});