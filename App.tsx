import React, { useState } from 'react';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';

export default function App() {
  const [entered, setEntered] = useState(false);

    if (entered) {return <HomeScreen />;}

    return <LoginScreen onEnter={() => setEntered(true)} />;
  
}