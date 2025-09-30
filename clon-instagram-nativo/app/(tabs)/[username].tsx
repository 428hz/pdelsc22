import { Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function ProfilePage() {
  const { username } = useLocalSearchParams();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ color: 'white' }}>Perfil de: {username}</Text>
    </View>
  );
}