import {
  Platform,
  PermissionsAndroid,
} from 'react-native';

export interface LoginPermissionsResult {
  location: boolean;
  nearbyDevices: boolean;
}

export async function requestLoginPermissions(): Promise<LoginPermissionsResult> {
  if (Platform.OS !== 'android') {
    return {
      location: true,
      nearbyDevices: true,
    };
  }

  // ------------------------------------------
  // LOCATION
  // ------------------------------------------

  const locationResult = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    {
      title: 'Location Permission',
      message:
        'Child Safety needs location permission to find nearby devices.',
      buttonPositive: 'Allow',
      buttonNegative: 'Deny',
    },
  );

  const location =
    locationResult === PermissionsAndroid.RESULTS.GRANTED;

  console.log('LOCATION:', locationResult);

  if (!location) {
    return {
      location: false,
      nearbyDevices: false,
    };
  }

  // ------------------------------------------
  // NEARBY DEVICES
  // Android 12+
  // ------------------------------------------

  let nearbyDevices = true;

  if (Platform.Version >= 31) {
    const bluetoothResult =
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ]);

    const scanGranted =
      bluetoothResult[
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN
      ] === PermissionsAndroid.RESULTS.GRANTED;

    const connectGranted =
      bluetoothResult[
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT
      ] === PermissionsAndroid.RESULTS.GRANTED;

    nearbyDevices =
      scanGranted && connectGranted;

    console.log(
      'BLUETOOTH_SCAN:',
      bluetoothResult[
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN
      ],
    );

    console.log(
      'BLUETOOTH_CONNECT:',
      bluetoothResult[
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT
      ],
    );
  }

  if (Platform.Version >= 33) {
    await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      {
        title: 'Notification Permission',
        message: 'Notifications are used to warn you when the device is too far away.',
        buttonPositive: 'Allow',
        buttonNegative: 'Deny',
      },
    );
  }

  return {
    location,
    nearbyDevices,
  };
}