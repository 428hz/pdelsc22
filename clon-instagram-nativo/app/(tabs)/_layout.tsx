import { Tabs } from 'expo-router';
import { SafeAreaView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../src/components/Header/Header';

export default function TabsLayout() {
  return (
    // SafeAreaView asegura que el contenido no se solape con elementos del sistema (notch, etc.)
    <SafeAreaView style={styles.container}>
      {/* Este Header se mostrará en la parte de arriba de todas las pestañas */}
      <Header />

      {/* Aquí se configura la barra de navegación de pestañas de abajo */}
      <Tabs
        screenOptions={{
          headerShown: false, // Ocultamos el encabezado que viene por defecto en las pestañas
          tabBarShowLabel: false, // No mostramos texto, solo los íconos
          tabBarStyle: { 
            backgroundColor: '#000',
            borderTopColor: '#363636' // Línea divisoria superior
          },
          tabBarActiveTintColor: 'white', // Color del ícono activo
          tabBarInactiveTintColor: 'gray', // Color del ícono inactivo
        }}
      >
        <Tabs.Screen
          name="index" // Esto enlaza con el archivo app/(tabs)/index.tsx
          options={{
            tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="create" // Esto enlaza con el archivo app/(tabs)/create.tsx
          options={{
            tabBarIcon: ({ color }) => <Ionicons name="add-circle" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="[username]" // Esto enlaza con la página de perfil
          options={{
            tabBarIcon: ({ color }) => <Ionicons name="person-circle" size={24} color={color} />,
            // Ocultamos esta pestaña de la barra, ya que no queremos un botón de "perfil" genérico.
            // Navegaremos al perfil del usuario desde otras partes de la app.
            href: null,
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
   
  },
});