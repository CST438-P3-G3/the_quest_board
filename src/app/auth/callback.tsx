import { useEffect } from 'react';
import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';

export default function GitHubCallbackRoute() {
  useEffect(() => {
    // Complete the GitHub sign in popup only in the browser
    // This prevents Expo from calling browser code during server rendering
    if (typeof window !== 'undefined') {
    WebBrowser.maybeCompleteAuthSession();
    }
    // Return to the existing screen so it can show the sign in result
    if (router.canGoBack()) {
      router.back();
    } else {
      // Use Home if the app opened directly to the callback with no history
      router.replace('/(tabs)/home');
    }
  }, []);

  return null;
}