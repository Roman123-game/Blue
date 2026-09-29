import React, { useMemo } from "react";
import { Text, TouchableOpacity } from "react-native";
import { useThemeColors } from '../theme';


interface Props{
  scanning:boolean;
  onPress:()=>void;
}


export default function ScanButton({
  scanning,
  onPress
}:Props){
  const colors = useThemeColors();
  const styles = useMemo(() => ({
    button: {
      minWidth: 170,
      paddingVertical: 14,
      paddingHorizontal: 22,
      borderRadius: 14,
      alignItems: 'center' as const,
      backgroundColor: scanning ? colors.buttonBg : colors.accent,
    },
    text: {
      fontSize: 15,
      fontWeight: '800' as const,
      color: scanning ? colors.textMuted : '#ffffff',
    },
  }), [colors, scanning]);

  return (
    <TouchableOpacity
      accessible
      accessibilityRole="button"
      accessibilityState={{ disabled: scanning }}
      style={styles.button}
      disabled={scanning}
      onPress={onPress}
    >
      <Text style={styles.text}>{scanning ? 'Scanning...' : 'Scan devices'}</Text>
    </TouchableOpacity>
  );

}