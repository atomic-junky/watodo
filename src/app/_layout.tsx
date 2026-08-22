import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "Fredoka-Light": require("@/assets/fonts/Fredoka-Light.ttf"),
    "Fredoka-Regular": require("@/assets/fonts/Fredoka-Regular.ttf"),
    "Fredoka-Medium": require("@/assets/fonts/Fredoka-Medium.ttf"),
    "Fredoka-SemiBold": require("@/assets/fonts/Fredoka-SemiBold.ttf"),
    "Fredoka-Bold": require("@/assets/fonts/Fredoka-Bold.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ title: 'Tasks' }} />
        <Stack.Screen name="login" options={{ title: 'Login' }} />
    </Stack>
  );
}
