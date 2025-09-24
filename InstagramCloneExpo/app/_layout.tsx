import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // Importamos la librería de íconos

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: 'white', // Color del ícono activo
        tabBarStyle: {
          backgroundColor: '#000', // Fondo de la barra de pestañas
          borderTopColor: '#363636',
        },
      }}
    >
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: 'Home',
          headerShown: false, // Ocultamos el título de la cabecera aquí
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={24} color={color} />
          ),
        }} 
      />
      <Tabs.Screen 
        name="explore" 
        options={{ 
          title: 'Explore',
          tabBarIcon: ({ color }) => (
            <Ionicons name="search" size={24} color={color} />
          ),
        }} 
      />
    </Tabs>
  );
}