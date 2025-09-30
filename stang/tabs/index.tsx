// app/(tabs)/index.tsx
// nuestra flamante pantalla de lista de tareas

import React, { useState } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Keyboard, // lo importamos para poder manejar el teclado
} from 'react-native'

// acá definimos la pinta que va a tener cada objeto de tarea
// 'id' para que cada una sea única, y 'text' para la descripción
interface Task {
  id: string
  text: string
}

export default function ToDoScreen() {
  // === estados ===
  // los estados son la "memoria" de nuestro componente

  // 1 'tareas' un array que va a guardar toda la lista de tareas arranca vacío
  const [tareas, setTareas] = useState<Task[]>([])
  // 2 'nuevatarea' guarda lo que el usuario va escribiendo en el campo de texto
  const [nuevaTarea, setNuevaTarea] = useState('')

  // === funciones ===
  // esta función se llama cuando el vago aprieta el botón "añadir"
  const handleAddTask = () => {
    // primero, una validación para no agregar tareas vacías
    // el 'trim()' saca los espacios de adelante y de atrás si queda vacío, no hacemos nada
    if (nuevaTarea.trim() === '') {
      return // cortamos la ejecución acá nomás
    }

    // si la tarea tiene texto, creamos el objeto nuevo
    // para el id usamos la fecha y hora actual, es una forma fácil de que sea único
    const taskToAdd: Task = {
      id: Date.now().toString(),
      text: nuevaTarea,
    }

    // actualizamos el estado 'tareas' ojo no modificamos el array viejo
    // creamos uno nuevo, copiando todas las tareas que ya estaban (tareas) y agregando la nueva al final
    setTareas([...tareas, taskToAdd])

    // reseteamos el campo de texto para que quede limpio
    setNuevaTarea('')
    // y de paso, hacemos que el teclado se guarde queda más prolijo
    Keyboard.dismiss()
  }

  // esta función se ejecuta cuando tocamos una tarea para borrarla
  const handleDeleteTask = (id: string) => {
    // creamos un nuevo array filtrando la lista de tareas
    // dejamos pasar a todas las tareas menos la que tiene el 'id' que nos pasaron
    const tareasActualizadas = tareas.filter((tarea) => tarea.id !== id)
    // actualizamos el estado con esta nueva lista, ya sin la tarea borrada
    setTareas(tareasActualizadas)
  }


  // === renderizado (lo que efectivamente se dibuja en la pantalla) ===
  return (
    // usamos safeareaview para que el contenido no se pise con la info de arriba del celu
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>mi lista de tareas</Text>

        // contenedor para el campo de texto y el botón de añadir
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="añadir una nueva tarea"
            value={nuevaTarea} // el valor del input está conectado a nuestro estado
            onChangeText={setNuevaTarea} // cada vez que escribís, se actualiza el estado 'nuevatarea'
          />
          <Button title="añadir" onPress={handleAddTask} />
        </View>

        // la posta para mostrar listas en react native es la flatlist es súper eficiente
        <FlatList
          data={tareas} // le pasamos nuestro array de tareas
          // 'keyextractor' le dice a la flatlist cómo identificar cada item de forma única fundamental
          keyExtractor={(item) => item.id}
          // 'renderitem' es una función que dice cómo se tiene que ver cada una de las tareas en la lista
          renderItem={({ item }) => (
            // hacemos que cada tarea sea "tocable" para poder borrarla
            <TouchableOpacity onPress={() => handleDeleteTask(item.id)}>
              <View style={styles.taskItem}>
                <Text style={styles.taskText}>{item.text}</Text>
              </View>
            </TouchableOpacity>
          )}
          // esto muestra un mensaje copado si todavía no hay ninguna tarea
          ListEmptyComponent={<Text style={styles.emptyText}>todavía no cargaste ninguna tarea</Text>}
        />
      </View>
    </SafeAreaView>
  )
}

// === estilos ===
// acá va toda la facha de la pantalla
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row', // para que el input y el botón estén uno al lado del otro
    marginBottom: 20,
  },
  input: {
    flex: 1, // para que ocupe todo el espacio disponible
    height: 40,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
  taskItem: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    // una sombrita para que quede más fachero
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2, // esto es para la sombra en android
  },
  taskText: {
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 30,
    color: 'gray',
  },
})