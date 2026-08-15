import { PermissionsAndroid, Platform } from 'react-native';
import { PERMISSIONS, RESULTS, request } from 'react-native-permissions';

export type PermissionState = {
  /** True when the user granted access to the device location. */
  location: boolean;
  /** True when the user granted access to nearby (Bluetooth) devices. */
  nearbyDevices: boolean;
};

async function requestAndroidLoginPermissions(): Promise<PermissionState> {
  // Before Android 12 (API 31) the location permission is what unlocks
  // Bluetooth LE scanning, so a single request covers both.
  const androidVersion =
    typeof Platform.Version === 'number'
      ? Platform.Version
      : parseInt(Platform.Version, 10);

  if (androidVersion < 31) {
    const granted =
      (await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      )) === PermissionsAndroid.RESULTS.GRANTED;

    return { location: granted, nearbyDevices: granted };
  }

  const result = await PermissionsAndroid.requestMultiple([
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
    PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
  ]);

  return {
    location:
      result[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] ===
      PermissionsAndroid.RESULTS.GRANTED,
    nearbyDevices:
      result[PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN] ===
        PermissionsAndroid.RESULTS.GRANTED &&
      result[PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT] ===
        PermissionsAndroid.RESULTS.GRANTED,
  };
}

async function requestIosLoginPermissions(): Promise<PermissionState> {
  const [location, nearbyDevices] = await Promise.all([
    request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE),
    request(PERMISSIONS.IOS.BLUETOOTH),
  ]);

  return {
    location: location === RESULTS.GRANTED,
    nearbyDevices: nearbyDevices === RESULTS.GRANTED,
  };
}

/**
 * Requests the permissions needed when a user logs in:
 * location access and access to nearby (Bluetooth) devices.
 *
 * Resolves once the system permission dialogs have been answered.
 */
export async function requestLoginPermissions(): Promise<PermissionState> {
  if (Platform.OS === 'android') {
    return requestAndroidLoginPermissions();
  }

  if (Platform.OS === 'ios') {
    return requestIosLoginPermissions();
  }

  // Other platforms do not require these permissions.
  return { location: true, nearbyDevices: true };
}

/**
 * Legacy helper: requests only the nearby (Bluetooth) devices permission.
 */
export async function requestBluetoothPermissions(): Promise<boolean> {
  const state = await requestLoginPermissions();
  return state.nearbyDevices;
}
