// app/(tabs)/_layout.tsx
// este archivo es el que le da forma a tu barra de pestañas el cerebro de la operación, digamos

import React from 'react'
// nos traemos el componente 'tabs' de expo-router, que es el que hace la magia
import { Tabs } from 'expo-router'
// y también importamos los íconos de ionicons, que vienen en el paquete de @expo/vector-icons
// hay un montón de packs de íconos, pero estos son un clásico
import { Ionicons } from '@expo/vector-icons'

export default function TabLayout() {
  return (
    // el componente <tabs> es el contenedor principal para toda la barra de navegación
    <Tabs
      // 'screenoptions' nos deja definir estilos y comportamientos para todas las pestañas de una
      // así no tenemos que repetir el código en cada una
      screenOptions={{
        tabBarActiveTintColor: 'tomato', // el color que va a tener el ícono y texto de la pestaña que está seleccionada
        tabBarInactiveTintColor: 'gray', // y este es el color para las que no están activas
        headerShown: false, // con esto le decimos que no muestre la cabecera por defecto que trae el navegador de pestañas
                              // lo hacemos porque seguramente cada pantalla ya maneja su propio título
      }}>
      // ahora definimos cada pestaña, una por una, con <tabs.screen>
      
      // === primera pestaña: inicio ===
      <Tabs.Screen
        // el 'name' tiene que ser igual al nombre del archivo que querés que se muestre en esta pestaña
        // en este caso, 'index' se corresponde con el archivo 'index.tsx'
        name="index" 
        options={{
          // 'options' nos deja personalizar esta pestaña en particular
          title: 'inicio', // el texto que se va a ver debajo del ícono
          // 'tabbaricon' es una función que define qué ícono mostrar
          // recibe propiedades como 'color' y 'size' para que el ícono se adapte solo
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />
      
      // === segunda pestaña: componentes ===
      <Tabs.Screen
        // esta pestaña va a cargar el contenido del archivo 'styles.tsx'
        name="styles"
        options={{
          title: 'componentes', // el texto que se va a ver debajo del ícono
          tabBarIcon: ({ color, size }) => (
            // usamos otro ícono de la misma familia 'color-palette' queda pintado
            <Ionicons name="color-palette" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  )
}