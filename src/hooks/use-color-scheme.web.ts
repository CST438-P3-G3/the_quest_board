import { useSyncExternalStore } from 'react'
import { useColorScheme as useRNColorScheme } from 'react-native'

// Provides the browser color scheme without setting state inside an effect
export function useColorScheme() {
  const colorScheme = useRNColorScheme()

  // Returns false during server rendering and true after hydration
  const hasHydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )

  // Uses light mode until the browser finishes hydration
  if (!hasHydrated) {
    return 'light'
  }

  return colorScheme
}