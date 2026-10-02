import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { Alert, Platform } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
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

test('passes the Google user name to the authenticated screen after permissions', async () => {
  const originalPlatform = Platform.OS;
  Object.defineProperty(Platform, 'OS', { configurable: true, value: 'android' });
  jest.mocked(requestLoginPermissions).mockResolvedValue({
    location: true,
    nearbyDevices: true,
  });
  jest.mocked(GoogleSignin.hasPlayServices).mockResolvedValue(true);
  jest.mocked(GoogleSignin.signIn).mockResolvedValue({
    type: 'success',
    data: { user: { givenName: 'Maya', name: 'Maya Rivera' } },
  } as any);

  const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation((_title, _message, buttons) => {
    buttons?.[0]?.onPress?.();
  });
  const onEnter = jest.fn();
  let screen: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(() => {
    screen = ReactTestRenderer.create(<LoginScreen onEnter={onEnter} />);
  });

  await ReactTestRenderer.act(async () => {
    await screen!.root
      .findByProps({ accessibilityLabel: 'Continue with Google' })
      .props.onPress();
  });

  expect(GoogleSignin.signIn).toHaveBeenCalled();
  expect(requestLoginPermissions).toHaveBeenCalled();
  expect(alertSpy).toHaveBeenCalled();
  expect(onEnter).toHaveBeenCalledWith('Maya');
  alertSpy.mockRestore();
  Object.defineProperty(Platform, 'OS', {
    configurable: true,
    value: originalPlatform,
  });
});