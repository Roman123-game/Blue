import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import styles from './LoginScreen.styles';
import { requestLoginPermissions } from '../bluetooth/Permissions';

interface Props {
  onEnter?: () => void;
}

export default function LoginScreen({ onEnter }: Props) {
  const [requesting, setRequesting] = useState(false);

  const handleLogin = async () => {
    if (requesting) {
      return;
    }

    setRequesting(true);
    try {
      const { location, nearbyDevices } = await requestLoginPermissions();
      if (!location || !nearbyDevices) {
        console.log('PERMISSIONS NOT GRANTED', { location, nearbyDevices });
        Alert.alert(
          'Permissions needed',
          'Location and nearby devices access are used to find and monitor your child\u2019s device. You can enable them later in Settings.',
        );
      }
    } catch (error) {
      console.log('PERMISSION REQUEST ERROR', error);
    } finally {
      setRequesting(false);
      onEnter?.();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logo}>
        <Text style={styles.logoEmoji} accessibilityRole="image">👶</Text>
        <Text style={styles.logoSubText}>Child Safety</Text>
      </View>

      <TouchableOpacity
        accessible
        accessibilityLabel="Enter"
        style={[styles.button, requesting && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={requesting}
      >
        <Text style={styles.buttonText}>
          {requesting ? 'Requesting permissions…' : 'Enter'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

