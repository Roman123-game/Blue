import React, { useMemo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '../theme';
import createStyles from './BottomNavigation.styles';

export type AppScreen = 'home' | 'menu';

interface Props {
  currentScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
}

const tabs: { screen: AppScreen; label: string; icon: string }[] = [
  { screen: 'home', label: 'Home', icon: '⌂' },
  { screen: 'menu', label: 'Menu', icon: '☰' },
];

export default function BottomNavigation({
  currentScreen,
  onNavigate,
}: Props) {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 8 }]}>
      {tabs.map(({ screen, label, icon }) => {
        const selected = currentScreen === screen;

        return (
          <TouchableOpacity
            key={screen}
            accessible
            accessibilityRole="tab"
            accessibilityLabel={label}
            accessibilityState={{ selected }}
            onPress={() => onNavigate(screen)}
            style={styles.tab}
          >
            <Text style={[styles.icon, selected && styles.selectedText]}>
              {icon}
            </Text>
            <Text style={[styles.label, selected && styles.selectedText]}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
