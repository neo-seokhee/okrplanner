import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './src/navigation/RootNavigator';
import { lightTheme } from './src/utils/theme';
import { useAppStore } from './src/store/appStore';

export default function App() {
  const initializeApp = useAppStore((state) => state.initializeApp);

  useEffect(() => {
    initializeApp();
  }, [initializeApp]);

  return (
    <SafeAreaProvider>
      <PaperProvider theme={lightTheme}>
        <RootNavigator />
        <StatusBar style="auto" />
      </PaperProvider>
    </SafeAreaProvider>
  );
}
