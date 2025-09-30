// app/(tabs)/index.tsx
// ¡Nuestra nueva pantalla de Lista de Tareas!

import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Keyboard,
} from 'react-native';

// Definimos cómo se verá un objeto de tarea.
// 'id' es un identificador único, 'text' es la tarea en sí.
interface Task {
  id: string;
  text: string;
}

export default function ToDoScreen() {
  // --- ESTADOS ---
  // 1. 'tareas' es un array que guardará nuestra lista de tareas. Empieza vacío.
  const [tareas, setTareas] = useState<Task[]>([]);
  // 2. 'nuevaTarea' guardará el texto que el usuario está escribiendo en el TextInput.
  const [nuevaTarea, setNuevaTarea] = useState('');

  // --- FUNCIONES ---
  // Esta función se ejecuta cuando el usuario presiona el botón "Añadir".
  const handleAddTask = () => {
    // Evitamos añadir tareas vacías. El '.trim()' quita espacios en blanco.
    if (nuevaTarea.trim() === '') {
      return;
    }

    // Creamos un nuevo objeto de tarea con un ID único (usando la fecha actual)
    const taskToAdd: Task = {
      id: Date.now().toString(),
      text: nuevaTarea,
    };

    // Actualizamos el estado 'tareas', añadiendo la nueva tarea al final de la lista.
    // Usamos el "spread operator" (...) para crear una nueva copia del array.
    setTareas([...tareas, taskToAdd]);

    // Limpiamos el campo de texto y cerramos el teclado.
    setNuevaTarea('');
    Keyboard.dismiss();
  };

  // Esta función se ejecuta cuando el usuario presiona sobre una tarea para borrarla.
  const handleDeleteTask = (id: string) => {
    // Creamos un nuevo array que filtra (excluye) la tarea con el ID que queremos borrar.
    const tareasActualizadas = tareas.filter((tarea) => tarea.id !== id);
    // Actualizamos el estado con la nueva lista sin la tarea eliminada.
    setTareas(tareasActualizadas);
  };


  // --- RENDERIZADO (Lo que se ve en la pantalla) ---
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Mi Lista de Tareas</Text>

        {/* Sección para añadir nuevas tareas */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Añadir una nueva tarea..."
            value={nuevaTarea}
            onChangeText={setNuevaTarea} // Actualiza el estado 'nuevaTarea' mientras escribes
          />
          <Button title="Añadir" onPress={handleAddTask} />
        </View>

        {/* Sección para mostrar la lista de tareas */}
        {/* FlatList es la forma más eficiente de mostrar listas en React Native. */}
        <FlatList
          data={tareas}
          // keyExtractor le dice a FlatList cómo identificar cada elemento de forma única.
          keyExtractor={(item) => item.id}
          // renderItem define cómo se debe ver cada elemento de la lista.
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleDeleteTask(item.id)}>
              <View style={styles.taskItem}>
                <Text style={styles.taskText}>{item.text}</Text>
              </View>
            </TouchableOpacity>
          )}
          // Muestra un mensaje si la lista está vacía
          ListEmptyComponent={<Text style={styles.emptyText}>No hay tareas pendientes.</Text>}
        />
      </View>
    </SafeAreaView>
  );
}

// --- ESTILOS ---
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
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  taskText: {
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 30,
    color: 'gray',
  },
});