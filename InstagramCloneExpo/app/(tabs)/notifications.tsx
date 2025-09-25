import { View, Text } from 'react-native';

export default function NotificationsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Pantalla de Notificaciones</Text>
    </View> // <-- AQUÍ ESTABA EL ERROR
  );
}