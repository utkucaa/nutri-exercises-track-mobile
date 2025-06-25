import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="admin-panel" options={{ title: 'Admin Panel', headerShown: false }} />
        <Stack.Screen name="member-management" options={{ title: 'Üye Yönetimi' }} />
        <Stack.Screen name="add-member" options={{ title: 'Yeni Üye Ekle' }} />
        <Stack.Screen name="member-detail" options={{ title: 'Üye Detayı' }} />
        <Stack.Screen name="exercise-management" options={{ title: 'Spor Yönetimi' }} />
        <Stack.Screen name="add-exercise" options={{ title: 'Egzersiz Ekle' }} />
        <Stack.Screen name="member-dashboard" options={{ title: 'Benim Programım', headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
