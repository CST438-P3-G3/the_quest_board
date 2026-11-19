import { Redirect } from 'expo-router';

export default function IndexRoute() {
  // Send the root route to the login screen
  return <Redirect href="/log-in" />;
}