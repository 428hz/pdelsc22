import React, { useState } from 'react';
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
} from 'react-native';

interface ComponentCardProps {
  title: string;
  description: string;
  children?: React.ReactNode;
}

const ComponentCard: React.FC<ComponentCardProps> = ({ title, description, children }) => (
  <View style={styles.componentCard}>
    <Text style={styles.header}>{title}</Text>
    <Text style={styles.description}>{description}</Text>
    {children && <View style={styles.childrenContainer}>{children}</View>}
  </View>
);

export default function ComponentsScreen() {
  const [isSwitchEnabled, setIsSwitchEnabled] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      Alert.alert('¡Página actualizada!');
    }, 2000);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Text style={styles.mainTitle}>Galería Completa de Componentes</Text>
        <Text style={styles.mainSubtitle}>Tira hacia abajo para ver el "RefreshControl" en acción.</Text>

        <Text style={styles.categoryTitle}>1. Componentes Básicos</Text>
        <ComponentCard title="View" description="El contenedor universal para agrupar y estilizar." />
        <ComponentCard title="Text" description="Para mostrar cualquier tipo de texto." />
        <ComponentCard title="Image" description="Muestra imágenes locales o remotas.">
          <Image source={{ uri: 'https://reactnative.dev/img/logo-og.png' }} style={styles.image} resizeMode="contain" />
        </ComponentCard>

        <Text style={styles.categoryTitle}>2. Entrada y Acciones de Usuario</Text>
        <ComponentCard title="TextInput" description="Un campo para que el usuario introduzca texto.">
            <TextInput style={styles.input} placeholder="Escribe algo aquí..." />
        </ComponentCard>
        <ComponentCard title="Button" description="Un botón simple y estándar del sistema operativo.">
            <Button title="Botón Estándar" onPress={() => Alert.alert('Presionaste el botón estándar')} />
        </ComponentCard>
        <ComponentCard title="Switch" description="Un interruptor para valores verdadero/falso.">
          <View style={styles.centerContent}>
            <Switch onValueChange={() => setIsSwitchEnabled(p => !p)} value={isSwitchEnabled} />
            <Text style={{marginLeft: 10}}>{isSwitchEnabled ? 'Encendido' : 'Apagado'}</Text>
          </View>
        </ComponentCard>
        <ComponentCard title="Pressable (Recomendado)" description="El componente más moderno y flexible para detectar todo tipo de interacciones (pulsación corta, larga, etc).">
            <Pressable onPress={() => Alert.alert('Pressable presionado')} style={({pressed}) => [styles.button, {backgroundColor: pressed ? '#0056b3' : '#007AFF'}]}>
                <Text style={styles.buttonText}>Pressable</Text>
            </Pressable>
        </ComponentCard>
        <ComponentCard title="TouchableOpacity" description="Un 'botón' que reduce su opacidad al ser presionado. Muy usado para botones personalizados.">
             <TouchableOpacity style={styles.button} onPress={() => Alert.alert('TouchableOpacity presionado')}>
                <Text style={styles.buttonText}>TouchableOpacity</Text>
            </TouchableOpacity>
        </ComponentCard>
         <ComponentCard title="TouchableHighlight" description="Un 'botón' que oscurece el fondo al ser presionado. Controlas el color con 'underlayColor'.">
             <TouchableHighlight underlayColor="#DDDDDD" style={styles.button} onPress={() => Alert.alert('TouchableHighlight presionado')}>
                <Text style={styles.buttonText}>TouchableHighlight</Text>
            </TouchableHighlight>
        </ComponentCard>
        <ComponentCard title="TouchableWithoutFeedback" description="Detecta una pulsación sin dar ninguna respuesta visual. Útil para elementos que no parecen botones.">
             <TouchableWithoutFeedback onPress={() => Alert.alert('TouchableWithoutFeedback presionado')}>
                <View style={styles.touchableWithoutFeedbackView}>
                    <Text>Tócame, no hay feedback visual</Text>
                </View>
            </TouchableWithoutFeedback>
        </ComponentCard>

        <Text style={styles.categoryTitle}>3. Vistas de Lista</Text>
        <ComponentCard title="FlatList" description="Muestra listas largas de datos de forma muy eficiente, renderizando solo los elementos visibles.">
          <FlatList
            data={[{key: 'a', text: 'Primer item'}, {key: 'b', text: 'Segundo item'}]}
            renderItem={({item}) => <Text style={styles.listItem}>- {item.text}</Text>}
            scrollEnabled={false}
          />
        </ComponentCard>
        <ComponentCard title="SectionList" description="Similar a FlatList, pero para listas divididas en secciones con cabeceras.">
           <SectionList
            sections={[
              {title: 'Frutas', data: ['Manzana', 'Banana']},
              {title: 'Verduras', data: ['Brócoli', 'Zanahoria']},
            ]}
            renderItem={({item}) => <Text style={styles.listItem}>- {item}</Text>}
            renderSectionHeader={({section}) => <Text style={styles.sectionHeader}>{section.title}</Text>}
            keyExtractor={(item, index) => item + index}
            scrollEnabled={false}
          />
        </ComponentCard>

        <Text style={styles.categoryTitle}>4. UI y Feedback Adicional</Text>
         <ComponentCard title="Modal" description="Una ventana que se muestra por encima del contenido principal de la app.">
           <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => setModalVisible(false)}
            >
              <View style={styles.modalContainer}>
                <View style={styles.modalView}>
                  <Text style={styles.modalText}>¡Esto es un modal!</Text>
                  <Button title="Cerrar Modal" onPress={() => setModalVisible(false)} />
                </View>
              </View>
            </Modal>
            <Button title="Mostrar Modal" onPress={() => setModalVisible(true)} />
        </ComponentCard>
        <ComponentCard title="ActivityIndicator" description="Muestra un indicador de carga circular. Útil para procesos en segundo plano.">
            <ActivityIndicator size="large" color="#0000ff" />
        </ComponentCard>

        <Text style={styles.categoryTitle}>5. APIs de Módulo Nativo</Text>
        <ComponentCard title="Alert" description="Una API para mostrar alertas nativas del sistema. Ya la hemos usado con los botones.">
          <Button title="Mostrar Alerta" onPress={() => Alert.alert('Título de la Alerta', 'Este es el mensaje de la alerta.', [{text: 'OK'}])} />
        </ComponentCard>
         <ComponentCard title="Platform" description="Una API que te permite detectar en qué plataforma (iOS o Android) se está ejecutando la app para aplicar estilos o lógica diferente.">
            <Text style={styles.platformText}>Estás en: {Platform.OS}</Text>
            <Text style={[styles.platformText, Platform.select({ios: styles.iosText, android: styles.androidText})]}>
                Este texto cambia de color según la plataforma.
            </Text>
        </ComponentCard>
      </ScrollView>
    </SafeAreaView>
  );
}

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
});
