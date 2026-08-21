import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';

import styles from './LoginScreen.styles';
import { requestLoginPermissions } from '../bluetooth/Permissions';

interface Props {
  onEnter?: () => void;
}

export default function LoginScreen({ onEnter }: Props) {
  const [requesting, setRequesting] = useState(false);
  const [message, setMessage] = useState('');

  const handleLogin = async () => {
    if (requesting) {
      return;
    }
    setRequesting(true);
    try {setMessage('We need a few permissions to set up Child Safety.');

      const {
        location,
        nearbyDevices,
      } = await requestLoginPermissions();

      console.log('PERMISSIONS:', {
        location,
        nearbyDevices,
      });

      // ------------------------------------------
      // Permissions denied
      // ------------------------------------------

      if (!location || !nearbyDevices) {
        setMessage('Location and Nearby Devices permissions are required to continue.');

        Alert.alert(
          'Permissions needed',
          'Please allow Location and Nearby Devices permissions to use Child Safety.',
        );
        return;
      }

      // ------------------------------------------
      // Permissions granted
      // ------------------------------------------

      setMessage('Permissions granted!\n\nPlease make sure Bluetooth is turned on.');

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
      console.log('PERMISSION REQUEST ERROR:',error);
      setMessage('Unable to request permissions. Please try again.');

      Alert.alert(
        'Permission error',
        'Unable to request the required permissions.',
      );
    } finally {
      setRequesting(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logo}>
        <Text
          style={styles.logoEmoji}
          accessibilityRole="image"
        >
          👶
        </Text>

        <Text style={styles.logoSubText}>
          Child Safety
        </Text>
      </View>

      {message.length > 0 && (
        <View style={styles.permissionMessage}>
          <Text style={styles.permissionMessageText}>
            {message}
          </Text>
        </View>
      )}

      <TouchableOpacity
        accessible
        accessibilityLabel="Enter"
        style={[
          styles.button,
          requesting && styles.buttonDisabled,
        ]}
        onPress={handleLogin}
        disabled={requesting}
      >
        <Text style={styles.buttonText}>
          {requesting
            ? 'Requesting permissions…'
            : 'Enter'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}