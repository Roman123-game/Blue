import React, { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';

export default function App() {
  const [entered, setEntered] = useState(false);
  const [userName, setUserName] = useState<string>();

    if (entered) {return (
      <SafeAreaProvider>
        <HomeScreen onBack={() => setEntered(false)} userName={userName} />
      </SafeAreaProvider>
    );}

    return (
      <SafeAreaProvider>
        <LoginScreen onEnter={name => {
          setUserName(name);
          setEntered(true);
        }} />
      </SafeAreaProvider>
    );
  
}