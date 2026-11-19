import * as SecureStore from 'expo-secure-store'
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { Platform } from 'react-native'

// Stores the signed in user's public account information
export type AuthUser = {
  id: string
  displayName: string
  email: string | null
}

type AuthContextValue = {
  accessToken: string | null
  user: AuthUser | null
  isLoading: boolean
  signIn: (accessToken: string, user: AuthUser) => Promise<void>
  signOut: () => Promise<void>
}

const ACCESS_TOKEN_KEY = 'quest_board_access_token'
const USER_KEY = 'quest_board_user'

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

// Saves a value securely on Android and iOS
// Uses browser storage when running on web
async function saveValue(key: string, value: string) {
  if (Platform.OS === 'web') {
    window.localStorage.setItem(key, value)
    return
  }

  await SecureStore.setItemAsync(key, value)
}

// Reads a saved value from the device or browser
async function readValue(key: string) {
  if (Platform.OS === 'web') {
    return window.localStorage.getItem(key)
  }

  return SecureStore.getItemAsync(key)
}

// Removes a saved value from the device or browser
async function deleteValue(key: string) {
  if (Platform.OS === 'web') {
    window.localStorage.removeItem(key)
    return
  }

  await SecureStore.deleteItemAsync(key)
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Restores the previous sign in when the app opens
  useEffect(() => {
    async function restoreSession() {
      try {
        const savedToken = await readValue(ACCESS_TOKEN_KEY)
        const savedUser = await readValue(USER_KEY)

        setAccessToken(savedToken)
        setUser(savedUser ? JSON.parse(savedUser) : null)
      } finally {
        setIsLoading(false)
      }
    }

    restoreSession()
  }, [])

  // Saves the token and user after successful sign in
  async function signIn(nextToken: string, nextUser: AuthUser) {
    await saveValue(ACCESS_TOKEN_KEY, nextToken)
    await saveValue(USER_KEY, JSON.stringify(nextUser))

    setAccessToken(nextToken)
    setUser(nextUser)
  }

  // Clears the token and user after sign out or account deletion
  async function signOut() {
    await deleteValue(ACCESS_TOKEN_KEY)
    await deleteValue(USER_KEY)

    setAccessToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        user,
        isLoading,
        signIn,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }

  return context
}