import { DarkTheme, DefaultTheme, Stack, ThemeProvider, } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      {/* Let Expo Router load the route groups and screens under src/app */}
      <Stack screenOptions={{ headerShown: false }} />
    </ThemeProvider>
  );
}
