// app/_layout.tsx
// este es el layout raíz sería como el jefe de la estructura de navegación
// todo lo que pongamos acá afecta a toda la aplicación

// nos traemos el componente 'stack' de expo-router
// 'stack' es un tipo de navegación donde las pantallas se apilan una encima de la otra
import { Stack } from 'expo-router'

export default function RootLayout() {
  return (
    // usamos el stack como el navegador principal de nuestra app
    <Stack>
      // acá le decimos al stack que maneje una pantalla específica, que en este caso
      // es un grupo de rutas llamado "(tabs)" este es el layout que maneja la barra de pestañas
      // le ponemos 'headershown: false' para que este stack principal no muestre su propia
      // barra de título, porque si no, se duplicaría con la que ya tienen las pestañas
      // básicamente, le cedemos el control de la cabecera al navegador de las pestañas
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  )
}