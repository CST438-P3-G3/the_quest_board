import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TasksScreen() {
  const [tasks, setTasks] = useState<string[]>([]);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTask, setNewTask] = useState('');

  function addTask() {
    const task = newTask.trim();
    if (!task) return;

    setTasks((currentTasks) => [...currentTasks, task]);
    setNewTask('');
    setIsAddingTask(false);
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.content}>
        <Text style={styles.title}>Tasks</Text>

        <Pressable
          accessibilityRole="button"
          onPress={() => setIsAddingTask(true)}
          style={({ pressed }) => [styles.addButton, pressed && styles.buttonPressed]}>
          <Text style={styles.addButtonText}>+ Add task</Text>
        </Pressable>

        {isAddingTask && (
          <View style={styles.form}>
            <TextInput
              accessibilityLabel="Task name"
              autoFocus
              onChangeText={setNewTask}
              onSubmitEditing={addTask}
              placeholder="What needs to be done?"
              placeholderTextColor="#64748b"
              returnKeyType="done"
              style={styles.input}
              value={newTask}
            />
            <View style={styles.formActions}>
              <Pressable
                accessibilityRole="button"
                onPress={() => {
                  setIsAddingTask(false);
                  setNewTask('');
                }}
                style={[styles.actionButton, styles.cancelButton]}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                disabled={!newTask.trim()}
                onPress={addTask}
                style={({ pressed }) => [
                  styles.actionButton,
                  styles.saveButton,
                  !newTask.trim() && styles.disabledButton,
                  pressed && newTask.trim() && styles.buttonPressed,
                ]}>
                <Text style={styles.saveButtonText}>Add</Text>
              </Pressable>
            </View>
          </View>
        )}

        {tasks.length > 0 && (
          <View style={styles.taskList}>
            {tasks.map((task, index) => (
              <View key={`${task}-${index}`} style={styles.taskRow}>
                <Text style={styles.taskText}>{task}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    width: '100%',
    maxWidth: 640,
    alignSelf: 'center',
    padding: 24,
    gap: 20,
  },
  title: {
    color: '#0f172a',
    fontSize: 32,
    fontWeight: '700',
  },
  addButton: {
    alignSelf: 'flex-start',
    borderRadius: 10,
    backgroundColor: '#2563eb',
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonPressed: {
    opacity: 0.8,
  },
  form: {
    gap: 12,
  },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    backgroundColor: '#ffffff',
    color: '#0f172a',
    fontSize: 16,
    paddingHorizontal: 14,
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  actionButton: {
    minHeight: 42,
    justifyContent: 'center',
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  cancelButton: {
    backgroundColor: '#e2e8f0',
  },
  cancelButtonText: {
    color: '#334155',
    fontSize: 15,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#2563eb',
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.45,
  },
  taskList: {
    gap: 10,
  },
  taskRow: {
    borderRadius: 10,
    backgroundColor: '#ffffff',
    padding: 16,
  },
  taskText: {
    color: '#0f172a',
    fontSize: 16,
  },
});
