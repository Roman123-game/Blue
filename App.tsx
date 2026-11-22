import React, { useState } from 'react';
import { StyleSheet, useColorScheme, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import MenuScreen from './src/screens/MenuScreen';
import BottomNavigation, {
  AppScreen,
} from './src/components/BottomNavigation';
import { DistanceUnit } from './src/types/distance';
import { ThemeProvider, type ThemeMode } from './src/theme';

const styles = StyleSheet.create({
  app: {
    flex: 1,
  },
  screen: {
    flex: 1,
  },
});

export default function App() {
  const systemColorScheme = useColorScheme();
  const [entered, setEntered] = useState(false);
  const [userName, setUserName] = useState<string>();
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('home');
  const [distanceUnit, setDistanceUnit] = useState<DistanceUnit>('meters');
  const [selectedThemeMode, setSelectedThemeMode] = useState<ThemeMode>();
  const themeMode =
    selectedThemeMode ?? (systemColorScheme === 'dark' ? 'dark' : 'light');

  if (entered) {
    return (
      <SafeAreaProvider>
        <ThemeProvider mode={themeMode}>
          <View style={styles.app}>
            <View style={styles.screen}>
              {currentScreen === 'home' ? (
                <HomeScreen
                  onBack={() => setEntered(false)}
                  userName={userName}
                  distanceUnit={distanceUnit}
                />
              ) : (
                <MenuScreen
                  userName={userName}
                  distanceUnit={distanceUnit}
                  onDistanceUnitChange={setDistanceUnit}
                  themeMode={themeMode}
                  onThemeModeChange={setSelectedThemeMode}
                />
              )}
            </View>
            <BottomNavigation
              currentScreen={currentScreen}
              onNavigate={setCurrentScreen}
            />
          </View>
        </ThemeProvider>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider mode={themeMode}>
        <LoginScreen
          onEnter={name => {
            setUserName(name);
            setCurrentScreen('home');
            setEntered(true);
          }}
        />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}