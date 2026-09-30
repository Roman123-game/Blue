import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, Image, Platform } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

import styles from './LoginScreen.styles';
import { requestLoginPermissions } from '../bluetooth/Permissions';
import ExitButton from '../components/ExitButton';

const GOOGLE_WEB_CLIENT_ID = '156247509469-b033e4d2s55de7lir9bcvl3sk0oi46qp.apps.googleusercontent.com';
const GOOGLE_IOS_CLIENT_ID = '';

interface Props {
  onEnter?: () => void;
}

export default function LoginScreen({ onEnter }: Props) {
  const [requesting, setRequesting] = useState(false);
  const [message, setMessage] = useState('');

  const requestPermissionsAndContinue = async () => {
    try {
      setMessage('We need a few permissions to set up Child Safety.');

      const { location, nearbyDevices } = await requestLoginPermissions();

      if (!location || !nearbyDevices) {
        setMessage(
          'Location and Nearby Devices permissions are required to continue.',
        );
        Alert.alert(
          'Permissions needed',
          'Please allow Location and Nearby Devices permissions to use Child Safety.',
        );
        return;
      }

      setMessage(
        'Permissions granted!\n\nPlease make sure Bluetooth is turned on.',
      );
      Alert.alert(
        'Turn on Bluetooth',
        'Please turn on Bluetooth on your phone before continuing.',
        [
          {
            text: 'OK',
            onPress: () => {
              setMessage('');
              onEnter?.();
            },
          },
        ],
      );
    } catch (error) {
      console.log('PERMISSION REQUEST ERROR:', error);
      setMessage('Unable to request permissions. Please try again.');
      Alert.alert(
        'Permission error',
        'Unable to request the required permissions.',
      );
    }
  };

  const handleEnter = async () => {
    if (requesting) {
      return;
    }
    setRequesting(true);
    try {
      await requestPermissionsAndContinue();
    } finally {
      setRequesting(false);
    }
  };

  const handleLogin = async () => {
    if (requesting) {
      return;
    }

    if (
      !GOOGLE_WEB_CLIENT_ID ||
      (Platform.OS === 'ios' && !GOOGLE_IOS_CLIENT_ID)
    ) {
      Alert.alert(
        'Google Sign-In not configured',
        'Add your Google OAuth client IDs in LoginScreen.tsx before signing in.',
      );
      return;
    }

    setRequesting(true);
    try {
      if (GOOGLE_IOS_CLIENT_ID) {
        GoogleSignin.configure({
          webClientId: GOOGLE_WEB_CLIENT_ID,
          iosClientId: GOOGLE_IOS_CLIENT_ID,
        });
      } else {
        GoogleSignin.configure({ webClientId: GOOGLE_WEB_CLIENT_ID });
      }
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      const signInResponse = await GoogleSignin.signIn();
      if (signInResponse.type !== 'success') {
        return;
      }

      await requestPermissionsAndContinue();
    } catch (error) {
      console.log('GOOGLE SIGN-IN ERROR:', error);
      setMessage('Unable to sign in with Google. Please try again.');

      Alert.alert(
        'Google sign-in failed',
        'Unable to sign in with Google. Please try again.',
      );
    } finally {
      setRequesting(false);
    }
  };

  return (
    <View style={styles.container}>
      <ExitButton />

      <View style={styles.logo}>
        {/* <Text style={styles.logoEmoji} accessibilityRole="image"> */}
          <Image
            source={require('../images/ic_launcher.png')}
            style={styles.logoImage}
          />
        {/* </Text> */}

        <Text style={styles.logoSubText}>Child Safety</Text>
      </View>

      {message.length > 0 && (
        <View style={styles.permissionMessage}>
          <Text style={styles.permissionMessageText}>{message}</Text>
        </View>
      )}

      <TouchableOpacity
        accessible
        accessibilityLabel="Continue with Google"
        style={[styles.googleButton, requesting && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={requesting}
      >
        <Text style={styles.googleIcon}>G</Text>
        <Text style={styles.googleButtonText}>
          {requesting ? 'Connecting to Google...' : 'Continue with Google'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        accessible
        accessibilityLabel="Enter"
        style={[styles.enterButton, requesting && styles.buttonDisabled]}
        onPress={handleEnter}
        disabled={requesting}
      >
        <Text style={styles.enterButtonText}>
          {requesting ? 'Requesting permissions...' : 'Enter'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
