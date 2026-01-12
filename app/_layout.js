// app/_layout.js
import { Stack } from 'expo-router';
import { DropsProvider } from '../context/DropsContext';

export default function RootLayout() {
  return (
    <DropsProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </DropsProvider>
  );
}
