import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from './LoginScreen.styles';

interface Props {
  onEnter?: () => void;
}

export default function LoginScreen({ onEnter }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.logo}>
        <Text style={styles.logoEmoji} accessibilityRole="image">👶</Text>
        <Text style={styles.logoSubText}>Child Safety</Text>
      </View>

      <TouchableOpacity
        accessible
        accessibilityLabel="Enter"
        style={styles.button}
        onPress={onEnter}
      >
        <Text style={styles.buttonText}>Enter</Text>
      </TouchableOpacity>
    </View>
  );
}
