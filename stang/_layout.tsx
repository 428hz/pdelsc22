// app/_layout.tsx
// Este es el layout raíz. Define la estructura de navegación principal.

import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    // El Stack es el tipo de navegador. Ocultamos su cabecera
    // para que no interfiera con la de las pestañas.
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}