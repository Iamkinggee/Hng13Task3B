// App.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Switch,
  StyleSheet,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DraggableFlatList, { type RenderItemParams } from 'react-native-draggable-flatlist';
import { StatusBar } from 'expo-status-bar';
import { ScreenContent } from 'components/ScreenContent';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const STORAGE_KEY = '@todos';
const THEME_KEY = '@theme';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

type Filter = 'all' | 'active' | 'completed';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  // Load data
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        const savedTheme = await AsyncStorage.getItem(THEME_KEY);
        if (saved) setTodos(JSON.parse(saved));
        if (savedTheme === 'dark') setIsDark(true);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  // Save todos
  const saveTodos = async (newTodos: Todo[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newTodos));
      setTodos(newTodos);
    } catch (e) {
      console.error(e);
    }
  };

  // Toggle theme
  const handleThemeToggle = async () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    await AsyncStorage.setItem(THEME_KEY, newTheme ? 'dark' : 'light');
  };

  // CRUD
  const addTodo = () => {
    if (!input.trim()) return;
    const newTodo: Todo = {
      id: Date.now().toString(),
      text: input.trim(),
      completed: false,
    };
    saveTodos([...todos, newTodo]);
    setInput('');
  };

  const toggleComplete = (id: string) => {
    saveTodos(todos.map(t => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const deleteTodo = (id: string) => {
    saveTodos(todos.filter(t => t.id !== id));
  };

  const clearCompleted = () => {
    Alert.alert('Clear Completed', 'Remove all completed tasks?', [
      { text: 'Cancel' },
      { text: 'Clear', style: 'destructive', onPress: () => saveTodos(todos.filter(t => !t.completed)) },
    ]);
  };

  const filteredTodos = todos.filter(t => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const activeCount = todos.filter(t => !t.completed).length;

  const renderItem = ({ item, drag, isActive }: RenderItemParams<Todo>) => (
    <TouchableOpacity
      onLongPress={drag}
      style={[
        styles.todoItem,
        isDark ? styles.todoItemDark : styles.todoItemLight,
        isActive && styles.todoItemActive,
      ]}
    >
      <TouchableOpacity
        onPress={() => toggleComplete(item.id)}
        style={[
          styles.checkbox,
          item.completed
            ? (isDark ? styles.checkboxCheckedDark : styles.checkboxCheckedLight)
            : (isDark ? styles.checkboxEmptyDark : styles.checkboxEmptyLight),
        ]}
      >
        {item.completed && <Text style={styles.checkText}>Check</Text>}
      </TouchableOpacity>

      <Text
        style={[
          styles.todoText,
          { color: isDark ? '#e5e7eb' : '#1f2937' },
          item.completed && styles.todoTextCompleted,
        ]}
      >
        {item.text}
      </Text>

      <TouchableOpacity onPress={() => deleteTodo(item.id)}>
        <Text style={[styles.deleteText, { color: isDark ? '#9ca3af' : '#6b7280' }]}>X</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <GestureHandlerRootView style={[styles.container, { backgroundColor: isDark ? '#111827' : '#f9fafb' }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />

      <ScreenContent title="TODO" path="App.tsx">
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: isDark ? '#c4b5fd' : '#7c3aed' }]}>TODO</Text>
          <Switch
            value={isDark}
            onValueChange={handleThemeToggle}
            thumbColor={isDark ? '#fff' : '#f4f3f4'}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
          />
        </View>

        {/* Input */}
        <View style={styles.inputRow}>
          <TextInput
            placeholder="Create a new todo..."
            placeholderTextColor={isDark ? '#666' : '#999'}
            value={input}
            onChangeText={setInput}
            onSubmitEditing={addTodo}
            style={[
              styles.input,
              {
                backgroundColor: isDark ? '#1f2937' : '#ffffff',
                color: isDark ? '#f3f4f6' : '#111827',
                borderColor: isDark ? '#374151' : '#d1d5db',
              },
            ]}
          />
          <TouchableOpacity onPress={addTodo} style={styles.addButton}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        {/* List */}
        <DraggableFlatList
          data={filteredTodos}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          onDragEnd={({ data }) => saveTodos(data)}
          activationDistance={10}
          ListEmptyComponent={
            <Text style={[styles.emptyText, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
              No todos yet. Add one above!
            </Text>
          }
          ListFooterComponent={
            todos.length > 0 ? (
              <View style={styles.footer}>
                <Text style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
                  {activeCount} {activeCount === 1 ? 'item' : 'items'} left
                </Text>
                {todos.some(t => t.completed) && (
                  <TouchableOpacity onPress={clearCompleted}>
                    <Text style={{ color: '#ef4444' }}>Clear Completed</Text>
                  </TouchableOpacity>
                )}
              </View>
            ) : null
          }
        />

        {/* Filter Tabs */}
        {todos.length > 0 && (
          <View style={[styles.filterRow, { borderTopColor: isDark ? '#374151' : '#d1d5db' }]}>
            {(['all', 'active', 'completed'] as const).map(f => (
              <TouchableOpacity key={f} onPress={() => setFilter(f)}>
                <Text
                  style={{
                    color: filter === f
                      ? (isDark ? '#c4b5fd' : '#7c3aed')
                      : (isDark ? '#9ca3af' : '#6b7280'),
                    fontWeight: '600',
                    textTransform: 'capitalize',
                  }}
                >
                  {f}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Drag Hint */}
        <Text style={[styles.hint, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
          Drag and drop to reorder list
        </Text>
      </ScreenContent>
    </GestureHandlerRootView>
  );
}

// ——————————————————————— STYLES ———————————————————————
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 16,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    fontSize: 16,
    marginRight: 8,
    borderWidth: 1,
  },
  addButton: {
    backgroundColor: '#7c3aed',
    padding: 12,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 48,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  todoItemLight: {
    backgroundColor: '#ffffff',
  },
  todoItemDark: {
    backgroundColor: '#1f2937',
  },
  todoItemActive: {
    opacity: 0.8,
    elevation: 6,
    shadowOpacity: 0.2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxEmptyLight: {
    borderColor: '#9ca3af',
  },
  checkboxEmptyDark: {
    borderColor: '#6b7280',
  },
  checkboxCheckedLight: {
    backgroundColor: '#7c3aed',
    borderColor: '#7c3aed',
  },
  checkboxCheckedDark: {
    backgroundColor: '#a78bfa',
    borderColor: '#a78bfa',
  },
  checkText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  todoText: {
    flex: 1,
    fontSize: 16,
  },
  todoTextCompleted: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  deleteText: {
    fontSize: 20,
    fontWeight: '500',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 48,
    fontSize: 18,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  hint: {
    textAlign: 'center',
    fontSize: 12,
    marginTop: 16,
    marginBottom: 32,
    opacity: 0.7,
  },
});