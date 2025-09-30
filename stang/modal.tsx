// nos traemos el componente 'link' de expo-router para poder navegar
import { Link } from 'expo-router'
// importamos el stylesheet para darle facha
import { StyleSheet } from 'react-native'

// estos son componentes personalizados, seguramente para manejar temas (modo claro/oscuro)
import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'

// este es el componente que renderiza la pantalla del modal
export default function ModalScreen() {
  return (
    // themedview es como un <view> pero que se adapta al tema de la app
    <ThemedView style={styles.container}>
      <ThemedText type="title">this is a modal</ThemedText>
      
      // el componente link nos sirve para ir a otra pantalla
      // la propiedad 'dismissto' es especial para los modales en lugar de apilar
      // una nueva pantalla, lo que hace es cerrar el modal y mandarte a la ruta que le digas
      // en este caso, cierra el modal y te devuelve a la pantalla de inicio ("/")
      <Link href="/" dismissTo style={styles.link}>
        <ThemedText type="link">go to home screen</ThemedText>
      </Link>
    </ThemedView>
  )
}

// los estilos para esta pantalla
const styles = StyleSheet.create({
  container: {
    flex: 1, // que ocupe toda la pantalla
    alignItems: 'center', // centrado horizontalmente
    justifyContent: 'center', // centrado verticalmente
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
})