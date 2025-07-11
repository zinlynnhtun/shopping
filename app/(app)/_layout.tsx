import "@/global.css";
import { useSession } from '@/provider/ctx';
import { useFonts } from 'expo-font';
import { Redirect, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Text } from "react-native";
import 'react-native-reanimated';

export default function RootLayout() {
  //const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('@/assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { session, isLoading } = useSession();

  // You can keep the splash screen open, or render a loading screen like we do here.
  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  // Only require authentication within the (app) group's layout as users
  // need to be able to access the (auth) group and sign in again.
  if (!session) {
    // On web, static rendering will stop here as the user is not authenticated
    // in the headless Node process that the pages are rendered in.
    return <Redirect href='/login' />;
  }
  return (
    <>
      <Stack screenOptions={
        {
          headerShown: true,
          contentStyle: { backgroundColor: 'transparent' },
          animation: 'fade_from_bottom',
        }
      }>

        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />

      </Stack>

      <StatusBar style="auto" />

    </>
  );
}
