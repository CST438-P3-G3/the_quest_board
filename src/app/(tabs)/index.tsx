import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  GitHubSignInButton,
  type GitHubAuthorization,
} from '@/components/github-sign-in-button';

// Describes the successful response returned by POST /auth/github
type SignInApiResponse = {
  // The Quest Board API's JWT for this signed in user
  accessToken: string;

  // The authorization scheme the app uses when calling protected API routes
  tokenType: string;

  // How long the JWT is valid in seconds
  expiresIn: number;

  // The public account details returned by the API
  user: {
    id: string;
    displayName: string;
    email: string | null;
  };
};

// Describes the problem response returned when signin fails
type ProblemResponse = {
  // A short summary of the error
  title?: string;

  // A more specific explanation such as why GitHub sign in was rejected
  detail?: string;
};

export default function TasksScreen() {
  const [tasks, setTasks] = useState<string[]>([]);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTask, setNewTask] = useState('');
  const [signInMessage, setSignInMessage] = useState('');
  const [signInResult, setSignInResult] = useState<SignInApiResponse | null>(null);

  // Sends GitHub's authorization details to the API to finish signing in
  async function handleGitHubAuthorization(
    authorization: GitHubAuthorization
  ) {
    // Clear any previous sign in result before starting another attempt
    setSignInResult(null);

    // The API needs all three values to exchange the GitHub code securely
    if (
      !authorization.code ||
      !authorization.codeVerifier ||
      !authorization.redirectUri
    ) {
      setSignInMessage('GitHub did not return all the sign in information.');
      return;
    }

    // Read the API address from the root .env file
    const apiUrl = process.env.EXPO_PUBLIC_API_URL;

    // Stop here with a helpful message if the address wasn't configured
    if (!apiUrl) {
      setSignInMessage('The API address is missing from the app configuration.');
      return;
    }

    // Let the user know the app is contacting the backend
    setSignInMessage('Finishing sign in...');

    try {
      // Send the authorization code PKCE verifier and redirect URI to Spring
      const response = await fetch(
        `${apiUrl.replace(/\/$/, '')}/auth/github`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json, application/problem+json',
          },
          body: JSON.stringify(authorization),
        }
      );

      // Convert the API's error response into a message for the screen
      if (!response.ok) {
        const problem = (await response.json().catch(() => null)) as
          | ProblemResponse
          | null;

        setSignInMessage(
          problem?.detail ??
            problem?.title ??
            `Sign in failed with status ${response.status}.`
        );
        return;
      }

      // Read the JWT and account details returned after successful sign in
      const result = (await response.json()) as SignInApiResponse;

      // Keep the response in memory and clear the progress/error message
      setSignInResult(result);
      setSignInMessage('');
    } catch {
      // This usually means the app couldn't connect to the API address
      setSignInMessage(
        'Could not reach the API. Check that Docker Compose is running.'
      );
    }
  }

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
        <GitHubSignInButton onAuthorization={handleGitHubAuthorization} />
        {/* Show the account name after sign in succeeds, or show progress/errors */}
        {signInResult ? (
          <Text>Signed in as {signInResult.user.displayName}.</Text>
        ) : signInMessage ? (
          <Text>{signInMessage}</Text>
        ) : null}
    
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
