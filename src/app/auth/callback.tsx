import { useEffect } from 'react';
import { router } from 'expo-router';

export default function GitHubCallbackRoute() {
  useEffect(() => {
    // Return to the existing screen so it can show the sign in result
    if (router.canGoBack()) {
      router.back();
    } else {
      // Use Home if the app opened directly to the callback with no history
      router.replace('/');
    }
  }, []);

  return null;
}