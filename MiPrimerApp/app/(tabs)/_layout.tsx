// app/(tabs)/_layout.tsx
// Este es el configurador principal para tu barra de pestañas.

import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    // El componente <Tabs> envuelve la configuración de las pestañas.
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: 'tomato', // Color para la pestaña activa
        tabBarInactiveTintColor: 'gray', // Color para la pestaña inactiva
        headerShown: false, // Ocultamos la cabecera
      }}>
      {/* Cada <Tabs.Screen> es una pestaña. El 'name' debe coincidir con el nombre del archivo. */}
      <Tabs.Screen
        name="index" // Esto corresponde al archivo index.tsx
        options={{
          title: 'Inicio', // El texto que se mostrará en la pestaña
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="styles" // Esto corresponde al archivo styles.tsx (que renombraste)
        options={{
          title: 'Estilos',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="color-palette" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}