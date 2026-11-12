import * as AuthSession from 'expo-auth-session';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

// Information the parent screen will need to send to the API
export type GitHubAuthorization = {
  code: string;
  codeVerifier: string;
  redirectUri: string;
};

type GitHubSignInButtonProps = {
  // Passes the authorization details to the screen that uses this button
  onAuthorization: (authorization: GitHubAuthorization) => void;
};

// Creates the app's callback URL using the "project3" scheme in app.json
const redirectUri = AuthSession.makeRedirectUri({
  scheme: 'project3',
  path: 'auth/callback',
});

// GitHub's endpoint where the app opens the sign in and authorization page
const discovery = {
  authorizationEndpoint: 'https://github.com/login/oauth/authorize',
};

export function GitHubSignInButton({
  onAuthorization,
}: GitHubSignInButtonProps) {
  const [message, setMessage] = useState('');

  // The client ID is public and can be included in the mobile app
  // The GitHub client secret must stay on the API server
  const clientId = process.env.EXPO_PUBLIC_GITHUB_CLIENT_ID;

  // Prepares GitHub's authorization request
  // PKCE creates a verifier and challenge to protect the authorization code
  // The user:email scope lets the API request the user's email from GitHub
  const [request, , promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: clientId ?? '',
      redirectUri,
      responseType: AuthSession.ResponseType.Code,
      scopes: ['user:email'],
      usePKCE: true,
    },
    discovery
  );

  // Opens GitHub in the browser and handles the result after the user returns
  async function startSignIn() {
    setMessage('');

    try {
      const result = await promptAsync();

      // If the user cancels or closes the sign in page stop here
      if (result.type !== 'success') {
        return;
      }

      // GitHub returns a one time authorization code
      const code = result.params.code;

      // The verifier pairs with the challenge created for this request
      const codeVerifier = request?.codeVerifier;

      // Both values are required by the API to exchange the code securely
      if (!code || !codeVerifier) {
        setMessage('GitHub did not return the information needed to sign in.');
        return;
      }

      // Let the parent screen send these values to the backend
      onAuthorization({
        code,
        codeVerifier,
        redirectUri,
      });
    } catch {
      // Show a simple message if opening or completing sign in fails
      setMessage('Could not start GitHub sign-in. Please try again.');
    }
  }

  return (
    <View>
      <Pressable
        accessibilityRole="button"
        // Keep the button unavailable until the client ID and request are ready
        disabled={!clientId || !request}
        onPress={startSignIn}
        style={({ pressed }) => [
          styles.button,
          (!clientId || !request) && styles.disabledButton,
          pressed && styles.pressedButton,
        ]}
      >
        <Text style={styles.buttonText}>Continue with GitHub</Text>
      </Pressable>

      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#24292f',
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.5,
  },
  pressedButton: {
    opacity: 0.8,
  },
  message: {
    color: '#b91c1c',
    fontSize: 14,
    marginTop: 10,
  },
});