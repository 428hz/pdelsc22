// primero que nada, traemos todo lo que vamos a necesitar de react y react native
// fijate que importamos un montón de componentes, desde los más básicos como view y text,
// hasta cosas más complejas como flatlist o modal
import React, { useState } from 'react'
import {
  Alert,
  Platform,
  StatusBar,
  ActivityIndicator,
  Button,
  FlatList,
  Image,
  Modal,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  SectionList,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native'

// acá definimos qué datos va a recibir nuestra "tarjeta" para mostrar componentes
// va a tener un título, una descripción y opcionalmente, puede tener "hijos" (children),
// que serían otros componentes para mostrar adentro, como un botón o una imagen de ejemplo
interface ComponentCardProps {
  title: string
  description: string
  children?: React.ReactNode
}

// este es el componente de la "tarjeta" en sí es una función de react (fc = function component)
// recibe las propiedades (props) que definimos antes y las usa para armar la vista
const ComponentCard: React.FC<ComponentCardProps> = ({ title, description, children }) => (
  <View style={styles.componentCard}>
    <Text style={styles.header}>{title}</Text>
    <Text style={styles.description}>{description}</Text>
    // esta línea es clave si la tarjeta tiene componentes "hijos", los muestra acá adentro
    {children && <View style={styles.childrenContainer}>{children}</View>}
  </View>
)

// la pantalla principal
// acá arranca el componente que arma toda la pantalla que vamos a ver
export default function ComponentsScreen() {
  // === estados ===
  // los 'usestate' son como la memoria del componente guardan valores que pueden cambiar

  // para saber si el switch (el interruptor) está prendido o apagado
  const [isSwitchEnabled, setIsSwitchEnabled] = useState(false)
  // para controlar si el modal (la ventana emergente) se ve o no
  const [modalVisible, setModalVisible] = useState(false)
  // para manejar la animación de "cargando" cuando tirás para abajo para refrescar
  const [refreshing, setRefreshing] = useState(false)
  
  // === funciones ===
  // esta función se dispara cuando el usuario tira de la pantalla hacia abajo
  const onRefresh = React.useCallback(() => {
    setRefreshing(true) // ponemos 'refreshing' en true para que aparezca el circulito de carga
    // simulamos que estamos buscando datos nuevos con un temporizador
    setTimeout(() => {
      setRefreshing(false) // después de 2 segundos, lo sacamos
      Alert.alert('¡página actualizada!') // y avisamos con una alerta
    }, 2000)
  }, [])

  // === renderizado (lo que se ve en la pantalla) ===
  return (
    // safeareaview es un contenedor que se asegura de que nada quede tapado por el notch del celu
    <SafeAreaView style={styles.container}>
      // la statusbar es la barrita de arriba del todo (batería, hora, etc) la ponemos en modo oscuro
      <StatusBar barStyle="dark-content" />
      // scrollview permite que el contenido sea más largo que la pantalla y puedas scrollear
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        // acá le metemos la funcionalidad de refrescar al tirar para abajo
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Text style={styles.mainTitle}>galería completa de componentes</Text>
        <Text style={styles.mainSubtitle}>tira hacia abajo para ver el "refreshcontrol" en acción</Text>

        // acá empezamos a mostrar las tarjetas con cada componente

        <Text style={styles.categoryTitle}>1 componentes básicos</Text>
        <ComponentCard title="view" description="el contenedor universal para agrupar y estilizar" />
        <ComponentCard title="text" description="para mostrar cualquier tipo de texto" />
        <ComponentCard title="image" description="muestra imágenes locales o remotas">
          <Image source={{ uri: 'https://reactnative.dev/img/logo-og.png' }} style={styles.image} resizeMode="contain" />
        </ComponentCard>

        <Text style={styles.categoryTitle}>2 entrada y acciones de usuario</Text>
        <ComponentCard title="textinput" description="un campo para que el usuario introduzca texto">
            <TextInput style={styles.input} placeholder="escribe algo aquí" />
        </ComponentCard>
        <ComponentCard title="button" description="un botón simple y estándar del sistema operativo">
            <Button title="botón estándar" onPress={() => Alert.alert('presionaste el botón estándar')} />
        </ComponentCard>
        <ComponentCard title="switch" description="un interruptor para valores verdadero/falso">
          <View style={styles.centerContent}>
            <Switch onValueChange={() => setIsSwitchEnabled(p => !p)} value={isSwitchEnabled} />
            <Text style={{marginLeft: 10}}>{isSwitchEnabled ? 'encendido' : 'apagado'}</Text>
          </View>
        </ComponentCard>
        <ComponentCard title="pressable (recomendado)" description="el componente más moderno y flexible para detectar todo tipo de interacciones (pulsación corta, larga, etc)">
            <Pressable onPress={() => Alert.alert('pressable presionado')} style={({pressed}) => [styles.button, {backgroundColor: pressed ? '#0056b3' : '#007AFF'}]}>
                <Text style={styles.buttonText}>pressable</Text>
            </Pressable>
        </ComponentCard>
        <ComponentCard title="touchableopacity" description="un 'botón' que reduce su opacidad al ser presionado muy usado para botones personalizados">
             <TouchableOpacity style={styles.button} onPress={() => Alert.alert('touchableopacity presionado')}>
                <Text style={styles.buttonText}>touchableopacity</Text>
            </TouchableOpacity>
        </ComponentCard>
         <ComponentCard title="touchablehighlight" description="un 'botón' que oscurece el fondo al ser presionado controlas el color con 'underlaycolor'">
             <TouchableHighlight underlayColor="#DDDDDD" style={styles.button} onPress={() => Alert.alert('touchablehighlight presionado')}>
                <Text style={styles.buttonText}>touchablehighlight</Text>
            </TouchableHighlight>
        </ComponentCard>
        <ComponentCard title="touchablewithoutfeedback" description="detecta una pulsación sin dar ninguna respuesta visual útil para elementos que no parecen botones">
             <TouchableWithoutFeedback onPress={() => Alert.alert('touchablewithoutfeedback presionado')}>
                <View style={styles.touchableWithoutFeedbackView}>
                    <Text>tócame, no hay feedback visual</Text>
                </View>
            </TouchableWithoutFeedback>
        </ComponentCard>

        <Text style={styles.categoryTitle}>3 vistas de lista</Text>
        <ComponentCard title="flatlist" description="muestra listas largas de datos de forma muy eficiente, renderizando solo los elementos visibles">
          <FlatList
            data={[{key: 'a', text: 'primer item'}, {key: 'b', text: 'segundo item'}]}
            renderItem={({item}) => <Text style={styles.listItem}>- {item.text}</Text>}
            scrollEnabled={false} // le sacamos el scroll propio para que no joda con el de la pantalla
          />
        </ComponentCard>
        <ComponentCard title="sectionlist" description="similar a flatlist, pero para listas divididas en secciones con cabeceras">
           <SectionList
            sections={[
              {title: 'frutas', data: ['manzana', 'banana']},
              {title: 'verduras', data: ['brócoli', 'zanahoria']},
            ]}
            renderItem={({item}) => <Text style={styles.listItem}>- {item}</Text>}
            renderSectionHeader={({section}) => <Text style={styles.sectionHeader}>{section.title}</Text>}
            keyExtractor={(item, index) => item + index}
            scrollEnabled={false}
          />
        </ComponentCard>

        <Text style={styles.categoryTitle}>4 ui y feedback adicional</Text>
         <ComponentCard title="modal" description="una ventana que se muestra por encima del contenido principal de la app">
           <Modal
              animationType="slide" // la animación con la que aparece
              transparent={true} // para que se vea lo de atrás medio oscuro
              visible={modalVisible} // el estado controla si se ve o no
              onRequestClose={() => setModalVisible(false)} // para que el botón "atrás" de android lo cierre
            >
              // este es el contenido del modal en sí
              <View style={styles.modalContainer}>
                <View style={styles.modalView}>
                  <Text style={styles.modalText}>¡esto es un modal!</Text>
                  <Button title="cerrar modal" onPress={() => setModalVisible(false)} />
                </View>
              </View>
            </Modal>
            // el botón que abre el modal, cambiando el estado 'modalvisible'
            <Button title="mostrar modal" onPress={() => setModalVisible(true)} />
        </ComponentCard>
        <ComponentCard title="activityindicator" description="muestra un indicador de carga circular útil para procesos en segundo plano">
            <ActivityIndicator size="large" color="#0000ff" />
        </ComponentCard>

        <Text style={styles.categoryTitle}>5 apis de módulo nativo</Text>
        <ComponentCard title="alert" description="una api para mostrar alertas nativas del sistema ya la hemos usado con los botones">
          <Button title="mostrar alerta" onPress={() => Alert.alert('título de la alerta', 'este es el mensaje de la alerta', [{text: 'ok'}])} />
        </ComponentCard>
         <ComponentCard title="platform" description="una api que te permite detectar en qué plataforma (ios o android) se está ejecutando la app para aplicar estilos o lógica diferente">
            <Text style={styles.platformText}>estás en: {Platform.OS}</Text>
            // acá usamos platform.select para aplicar un estilo u otro dependiendo del sistema operativo
            <Text style={[styles.platformText, Platform.select({ios: styles.iosText, android: styles.androidText})]}>
                este texto cambia de color según la plataforma
            </Text>
        </ComponentCard>
      </ScrollView>
    </SafeAreaView>
  )
}

// === estilos ===
// acá abajo definimos todos los estilos que usamos arriba es como el css de la web
// usar stylesheet.create hace que la app sea más performante
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F2F5' },
  scrollContent: { padding: 20 },
  mainTitle: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 5, color: '#333' },
  mainSubtitle: { textAlign: 'center', color: 'gray', marginBottom: 20 },
  categoryTitle: { fontSize: 22, fontWeight: 'bold', marginTop: 20, marginBottom: 10, borderBottomWidth: 1, borderBottomColor: '#ddd', paddingBottom: 5 },
  componentCard: { backgroundColor: 'white', borderRadius: 12, padding: 15, marginBottom: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  header: { fontSize: 20, fontWeight: '600', marginBottom: 8, color: '#1a1a1a' },
  description: { fontSize: 15, lineHeight: 22, color: '#555' },
  childrenContainer: { marginTop: 15, borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 15 },
  image: { width: '100%', height: 50 },
  input: { height: 40, borderColor: 'gray', borderWidth: 1, borderRadius: 5, padding: 10, width: '100%' },
  centerContent: { flexDirection: 'row', alignItems: 'center' },
  button: { backgroundColor: '#007AFF', paddingVertical: 10, paddingHorizontal: 15, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: 'white', fontSize: 16 },
  touchableWithoutFeedbackView: { padding: 10, backgroundColor: '#f0f0f0', borderRadius: 5, alignItems: 'center' },
  listItem: { paddingVertical: 4, fontSize: 15 },
  sectionHeader: { fontWeight: 'bold', fontSize: 16, marginTop: 10, backgroundColor: '#f0f0f0', padding: 5 },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalView: { margin: 20, backgroundColor: 'white', borderRadius: 20, padding: 35, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5 },
  modalText: { marginBottom: 15, textAlign: 'center', fontSize: 18 },
  platformText: { textAlign: 'center', marginVertical: 4, fontSize: 16 },
  iosText: { color: 'blue' },
  androidText: { color: 'green' },
})