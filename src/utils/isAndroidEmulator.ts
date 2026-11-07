import { Platform } from 'react-native';

export default function isAndroidEmulator(): boolean {
  if (Platform.OS !== 'android') {
    return false;
  }

  const { Brand, Manufacturer, Model, Fingerprint } = Platform.constants;
  const deviceInfo = `${Brand} ${Manufacturer} ${Model} ${Fingerprint}`;

  return /generic|emulator|sdk_gphone|google_sdk|genymotion|virtual/i.test(
    deviceInfo,
  );
}
