import { router } from 'expo-router';
import { useState } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  GitHubSignInButton,
  type GitHubAuthorization,
} from '@/components/github-sign-in-button';

type SignInApiResponse = {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  user: {
    id: string;
    displayName: string;
    email: string | null;
  };
};

type ProblemResponse = {
  title?: string;
  detail?: string;
};

export default function SignInScreen() {
  const [mode, setMode] = useState<'signIn' | 'signUp'>('signIn');
  const [message, setMessage] = useState('');

  // Sends the GitHub authorization details to the hosted API
  async function handleGitHubAuthorization(
    authorization: GitHubAuthorization
  ) {
    setMessage('');

    // Make sure GitHub returned everything required by the API
    if (
      !authorization.code ||
      !authorization.codeVerifier ||
      !authorization.redirectUri
    ) {
      setMessage('GitHub did not return all the sign in information.');
      return;
    }

    // Use the hosted API for both web and Android
    const apiUrl =
      Platform.OS === 'web'
        ? process.env.EXPO_PUBLIC_WEB_API_URL
        : process.env.EXPO_PUBLIC_NATIVE_API_URL;

    if (!apiUrl) {
      setMessage('The API address is missing from the app configuration.');
      return;
    }

    setMessage(
      mode === 'signUp'
        ? 'Creating your account with GitHub...'
        : 'Signing in with GitHub...'
    );

    try {
      // Send the authorization code to Spring Boot.
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

      if (!response.ok) {
        const problem = (await response.json().catch(() => null)) as
          | ProblemResponse
          | null;

        setMessage(
          problem?.detail ??
            problem?.title ??
            `Sign in failed with status ${response.status}.`
        );
        return;
      }

      // Read the successful response from the API
      const result = (await response.json()) as SignInApiResponse;

      setMessage(`Welcome, ${result.user.displayName}.`);

      // Open the task screen after GitHub authentication succeeds
      router.replace('/home');
    } catch {
      setMessage(
        'Could not reach the API. Check your hosted API configuration.'
      );
    }
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to Quest Board</Text>

        <Text style={styles.subtitle}>
          Sign in to manage your tasks.
        </Text>

        <View style={styles.modeButtons}>
          <Pressable
            accessibilityRole="button"
            onPress={() => setMode('signIn')}
            style={[
              styles.modeButton,
              mode === 'signIn' && styles.activeModeButton,
            ]}
          >
            <Text
              style={[
                styles.modeButtonText,
                mode === 'signIn' && styles.activeModeButtonText,
              ]}
            >
              Sign In
            </Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            onPress={() => setMode('signUp')}
            style={[
              styles.modeButton,
              mode === 'signUp' && styles.activeModeButton,
            ]}
          >
            <Text
              style={[
                styles.modeButtonText,
                mode === 'signUp' && styles.activeModeButtonText,
              ]}
            >
              Sign Up
            </Text>
          </Pressable>
        </View>

        <GitHubSignInButton
          onAuthorization={handleGitHubAuthorization}
        />

        <Pressable
          accessibilityRole="button"
          disabled
          style={[styles.googleButton, styles.disabledButton]}
        >
          <Text style={styles.googleButtonText}>
            Continue with Google
          </Text>
        </Pressable>

        <Text style={styles.comingSoon}>
          Google sign in will be added later.
        </Text>

        {message ? <Text style={styles.message}>{message}</Text> : null}
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
    maxWidth: 560,
    alignSelf: 'center',
    padding: 24,
    gap: 18,
  },
  title: {
    color: '#0f172a',
    fontSize: 30,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    color: '#475569',
    fontSize: 16,
    textAlign: 'center',
  },
  modeButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  modeButton: {
    flex: 1,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    paddingVertical: 12,
  },
  activeModeButton: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  modeButtonText: {
    color: '#334155',
    fontSize: 16,
    fontWeight: '600',
  },
  activeModeButtonText: {
    color: '#ffffff',
  },
  googleButton: {
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    paddingVertical: 14,
  },
  googleButtonText: {
    color: '#334155',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.5,
  },
  comingSoon: {
    color: '#64748b',
    fontSize: 13,
    textAlign: 'center',
  },
  message: {
    color: '#334155',
    fontSize: 15,
    textAlign: 'center',
  },
});