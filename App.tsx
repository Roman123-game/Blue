import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import MenuScreen from './src/screens/MenuScreen';
import BottomNavigation, {
  AppScreen,
} from './src/components/BottomNavigation';
import { DistanceUnit } from './src/types/distance';

const styles = StyleSheet.create({
  app: {
    flex: 1,
  },
  screen: {
    flex: 1,
  },
});

export default function App() {
  const [entered, setEntered] = useState(false);
  const [userName, setUserName] = useState<string>();
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('home');
  const [distanceUnit, setDistanceUnit] = useState<DistanceUnit>('meters');

  if (entered) {
    return (
      <SafeAreaProvider>
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
              />
            )}
          </View>
          <BottomNavigation
            currentScreen={currentScreen}
            onNavigate={setCurrentScreen}
          />
        </View>
      </SafeAreaProvider>
    );
  }


  return (
    <SafeAreaProvider>
      <LoginScreen
        onEnter={name => {
          setUserName(name);
          setCurrentScreen('home');
          setEntered(true);
        }}
      />
    </SafeAreaProvider>
  );
}