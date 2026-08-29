import React, { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';

export default function App() {
  const [entered, setEntered] = useState(false);

    if (entered) {return (
      <SafeAreaProvider>
        <HomeScreen onBack={() => setEntered(false)} />
      </SafeAreaProvider>
    );}

    return (
      <SafeAreaProvider>
        <LoginScreen onEnter={() => setEntered(true)} />
      </SafeAreaProvider>
    );
  
}