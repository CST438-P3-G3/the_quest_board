import { router } from 'expo-router';
import { useEffect, useState } from 'react'
import { ActivityIndicator, Alert, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/context/auth-context'


// Describes the account information that will eventually
// come from the GET /user/me endpoint
type ProfileData = {
  id: string;
  displayName: string;
  username: string;
  email: string;
  accountType: string;
};


// Profile screen for issue #4
export default function ProfileScreen() {
  // Reads the saved JWT from the shared authentication context
  const { accessToken, signIn, signOut } = useAuth()

  // Stores the profile returned by the backend
  const [profile, setProfile] = useState<ProfileData | null>(null)

  // Controls the loading state while the API request is running
  const [isLoading, setIsLoading] = useState(true)

  // Stores an error message when the profile cannot be loaded
  const [message, setMessage] = useState('')

  // Controls whether the edit form is visible
  const [isEditing, setIsEditing] = useState(false)

  // Stores the display name being edited
  const [editDisplayName, setEditDisplayName] = useState('')

  // Shows whether the update request is running
  const [isSaving, setIsSaving] = useState(false)

  // Stores messages related to profile updates
  const [editMessage, setEditMessage] = useState('')

  // Shows whether the account deletion request is running
  const [isDeleting, setIsDeleting] = useState(false)

  // Loads the signed in user's profile from the backend
  useEffect(() => {
    // Do not request profile data when the user is signed out
    if (!accessToken) {
      return
    }

    // Prevents state updates if the screen is no longer active
    let isScreenActive = true

    async function loadProfile() {
      try {
        // Selects the correct API URL for the current platform
        const apiUrl =
          Platform.OS === 'web'
            ? process.env.EXPO_PUBLIC_WEB_API_URL
            : process.env.EXPO_PUBLIC_NATIVE_API_URL

        // Stops the request if the API URL is missing
        if (!apiUrl) {
          throw new Error('The API address is missing')
        }

        // Requests the signed in user's account information
        const response = await fetch(
          `${apiUrl.replace(/\/$/, '')}/user/me`,
          {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${accessToken}`
            }
          }
        )

        // Treats unsuccessful responses as errors
        if (!response.ok) {
          throw new Error(
            `Profile request failed with status ${response.status}`
          )
        }

        // Converts the API response into profile data
        const result = (await response.json()) as ProfileData

        // Updates the screen only while it is still active
        if (isScreenActive) {
          setProfile(result)
        }
      } catch {
        // Shows a user friendly message when loading fails
        if (isScreenActive) {
          setMessage('Could not load your profile information.')
        }
      } finally {
        // Removes the loading indicator after the request finishes
        if (isScreenActive) {
          setIsLoading(false)
        }
      }
    }

    loadProfile()

    // Marks the screen as inactive when it unmounts
    return () => {
      isScreenActive = false
    }
  }, [accessToken])

  // Sends the updated display name to PATCH /user/me
  async function saveProfile() {
    if (!accessToken || !profile) {
      return
    }

    const cleanedDisplayName = editDisplayName.trim()

    // Prevents an empty display name from being submitted
    if (!cleanedDisplayName) {
      setEditMessage('Display name cannot be empty.')
      return
    }

    setIsSaving(true)
    setEditMessage('')

    try {
      // Selects the correct API URL for the current platform
      const apiUrl =
        Platform.OS === 'web'
          ? process.env.EXPO_PUBLIC_WEB_API_URL
          : process.env.EXPO_PUBLIC_NATIVE_API_URL

      if (!apiUrl) {
        throw new Error('The API address is missing')
      }

      // Sends the updated profile information to the backend
      const response = await fetch(
        `${apiUrl.replace(/\/$/, '')}/user/me`,
        {
          method: 'PATCH',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
          },
          body: JSON.stringify({
            displayName: cleanedDisplayName
          })
        }
      )

      if (!response.ok) {
        throw new Error('Profile update failed')
      }

      // Reads the updated profile returned by the backend
      const updatedProfile = (await response.json()) as ProfileData

      // Updates the profile screen
      setProfile(updatedProfile)
      setEditDisplayName(updatedProfile.displayName)
      setIsEditing(false)

      // Updates the shared authentication user information
      await signIn(accessToken, {
        id: updatedProfile.id,
        displayName: updatedProfile.displayName,
        email: updatedProfile.email
      })
    } catch {
      setEditMessage('Could not update your profile.')
    } finally {
      setIsSaving(false)
    }
  }

  // Sends the account deletion request to DELETE /users/me
  async function performDeleteAccount() {
    if (!accessToken) {
      return
    }

    setIsDeleting(true)
    setMessage('')

    try {
      // Selects the correct API URL for the current platform
      const apiUrl =
        Platform.OS === 'web'
          ? process.env.EXPO_PUBLIC_WEB_API_URL
          : process.env.EXPO_PUBLIC_NATIVE_API_URL

      if (!apiUrl) {
        throw new Error('The API address is missing')
      }

      // Deletes the signed in user's account
      const response = await fetch(
        `${apiUrl.replace(/\/$/, '')}/users/me`,
        {
          method: 'DELETE',
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${accessToken}`
          }
        }
      )

      if (!response.ok) {
        throw new Error('Account deletion failed')
      }

      // Clears the saved JWT and user information
      await signOut()

      // Returns the user to the sign in screen
      router.replace('/log-in')
    } catch {
      setMessage('Could not delete your account.')
    } finally {
      setIsDeleting(false)
    }
  }

  // Shows a confirmation before the destructive action
  function confirmDeleteAccount() {
    const confirmationMessage =
      'This permanently deletes your account information. This action cannot be undone.'

    // Uses the browser confirmation dialog on web
    if (Platform.OS === 'web') {
      const confirmed = window.confirm(confirmationMessage)

      if (confirmed) {
        void performDeleteAccount()
      }

      return
    }

    // Uses the native confirmation dialog on Android and iOS
    Alert.alert(
      'Delete account',
      confirmationMessage,
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            void performDeleteAccount()
          }
        }
      ],
      {
        cancelable: true
      }
    )
  }

  // Shows a sign in prompt when there is no saved token
  if (!accessToken) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>You are signed out</Text>

          <Text style={styles.emptyMessage}>
            Sign in to view your profile information.
          </Text>

          <Pressable
            accessibilityRole="button"
            onPress={() => router.replace('/log-in')}
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.pressedButton
            ]}
          >
            <Text style={styles.primaryButtonText}>Go to Sign In</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    )
  }

  // Shows a loading state while the profile request is running
  if (isLoading) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.emptyState}>
          <ActivityIndicator size="large" color="#2563eb" />

          <Text style={styles.emptyMessage}>
            Loading your profile...
          </Text>
        </View>
      </SafeAreaView>
    )
  }

  // Shows an error state when profile data could not be loaded
  if (!profile) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Profile unavailable</Text>

          <Text style={styles.emptyMessage}>
            {message || 'Your profile information could not be loaded.'}
          </Text>
        </View>
      </SafeAreaView>
    )
  }

  // Shows the profile information returned by the backend
  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>My Profile</Text>

        <Text style={styles.subtitle}>
          View the account information connected to your Quest Board account.
        </Text>

        {/* Displays the user's profile summary */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {profile.displayName.charAt(0).toUpperCase()}
            </Text>
          </View>

          <Text style={styles.displayName}>
            {profile.displayName}
          </Text>

          {/* Opens the display name editing form */}
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              setEditDisplayName(profile.displayName)
              setEditMessage('')
              setIsEditing(true)
            }}
            style={({ pressed }) => [
              styles.editButton,
              pressed && styles.pressedButton
            ]}
          >
            <Text style={styles.editButtonText}>Edit profile</Text>
          </Pressable>
        </View>

        {/* Displays the profile editing form */}
        {isEditing && (
          <View style={styles.editCard}>
            <Text style={styles.sectionTitle}>
              Edit profile
            </Text>

            <TextInput
              accessibilityLabel="Display name"
              autoFocus
              onChangeText={setEditDisplayName}
              placeholder="Display name"
              placeholderTextColor="#64748b"
              style={styles.input}
              value={editDisplayName}
            />

            {editMessage ? (
              <Text style={styles.errorMessage}>
                {editMessage}
              </Text>
            ) : null}

            <View style={styles.editActions}>
              <Pressable
                accessibilityRole="button"
                disabled={isSaving}
                onPress={() => {
                  setIsEditing(false)
                  setEditMessage('')
                }}
                style={styles.cancelButton}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                disabled={isSaving}
                onPress={saveProfile}
                style={({ pressed }) => [
                  styles.saveButton,
                  isSaving && styles.disabledButton,
                  pressed && styles.pressedButton
                ]}
              >
                <Text style={styles.saveButtonText}>
                  {isSaving ? 'Saving...' : 'Save'}
                </Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* Displays the user's account information */}
        <View style={styles.informationCard}>
          <Text style={styles.sectionTitle}>
            Account information
          </Text>

          {/* Displays the user's display name */}
          <View style={styles.informationRow}>
            <Text style={styles.label}>Display name</Text>
            <Text style={styles.value}>{profile.displayName}</Text>
          </View>

          <View style={styles.divider} />

          {/* Displays the user's verified email */}
          <View style={styles.informationRow}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{profile.email}</Text>
          </View>

          <View style={styles.divider} />

          {/* Displays the user's account type */}
          <View style={styles.informationRow}>
            <Text style={styles.label}>Account type</Text>
            <Text style={styles.value}>{profile.accountType}</Text>
          </View>
        </View>

        {/* Displays the destructive account action */}
        <View style={styles.dangerCard}>
          <Text style={styles.dangerTitle}>
            Delete account
          </Text>

          <Text style={styles.dangerMessage}>
            Deleting your account permanently removes your Quest Board account.
          </Text>

          <Pressable
            accessibilityRole="button"
            disabled={isDeleting}
            onPress={confirmDeleteAccount}
            style={({ pressed }) => [
              styles.deleteButton,
              isDeleting && styles.disabledButton,
              pressed && styles.pressedButton
            ]}
          >
            <Text style={styles.deleteButtonText}>
              {isDeleting ? 'Deleting...' : 'Delete my account'}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

// Styles used by the profile screen
const styles = StyleSheet.create({
  // Main screen container
  screen: {
    flex: 1,
    backgroundColor: '#f8fafc'
  },

  // Adds space below the web navigation bar
  // Keeps the original spacing on Android and iOS
  content: {
    width: '100%',
    maxWidth: 640,
    alignSelf: 'center',
    padding: 24,
    paddingTop: Platform.OS === 'web' ? 80 : 24,
    gap: 18
  },

  // Main screen heading
  title: {
    color: '#0f172a',
    fontSize: 32,
    fontWeight: '700'
  },

  // Supporting text below the heading
  subtitle: {
    color: '#475569',
    fontSize: 16,
    lineHeight: 24
  },

  // Card containing the profile summary
  profileCard: {
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: '#ffffff',
    padding: 24
  },

  // Circular profile avatar
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2563eb',
    marginBottom: 14
  },

  // Letter displayed inside the avatar
  avatarText: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: '700'
  },

  // User's display name in the profile summary
  displayName: {
    color: '#0f172a',
    fontSize: 22,
    fontWeight: '700'
  },

  // Card containing the account information
  informationCard: {
    borderRadius: 16,
    backgroundColor: '#ffffff',
    padding: 20
  },

  // Account information section heading
  sectionTitle: {
    color: '#0f172a',
    fontSize: 19,
    fontWeight: '700',
    marginBottom: 16
  },

  // Individual account information row
  informationRow: {
    gap: 6,
    paddingVertical: 10
  },

  // Account field label
  label: {
    color: '#64748b',
    fontSize: 14
  },

  // Account field value
  value: {
    color: '#0f172a',
    fontSize: 16,
    fontWeight: '600'
  },

  // Divider between account fields
  divider: {
    height: 1,
    backgroundColor: '#e2e8f0'
  },

  // Layout used for signed out and error states
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    padding: 24
  },

  // Heading used for signed out and error states
  emptyTitle: {
    color: '#0f172a',
    fontSize: 26,
    fontWeight: '700'
  },

  // Message used for signed out and error states
  emptyMessage: {
    color: '#475569',
    fontSize: 16,
    textAlign: 'center'
  },

  // Sign in button
  primaryButton: {
    borderRadius: 10,
    backgroundColor: '#2563eb',
    paddingHorizontal: 20,
    paddingVertical: 14
  },

  // Sign in button text
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600'
  },

  // Button pressed appearance
  pressedButton: {
    opacity: 0.75
  },

  // Card containing the edit form
  editCard: {
    borderRadius: 16,
    backgroundColor: '#ffffff',
    padding: 20,
    gap: 14
  },

  // Text field used to edit the display name
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    backgroundColor: '#ffffff',
    color: '#0f172a',
    fontSize: 16,
    paddingHorizontal: 14
  },

  // Layout for the edit buttons
  editActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10
  },

  // Button used to open editing mode
  editButton: {
    marginTop: 14,
    borderRadius: 8,
    backgroundColor: '#e2e8f0',
    paddingHorizontal: 16,
    paddingVertical: 10
  },

  // Text inside the edit button
  editButtonText: {
    color: '#334155',
    fontSize: 14,
    fontWeight: '600'
  },

  // Cancel button
  cancelButton: {
    borderRadius: 8,
    backgroundColor: '#e2e8f0',
    paddingHorizontal: 16,
    paddingVertical: 12
  },

  // Text inside the cancel button
  cancelButtonText: {
    color: '#334155',
    fontSize: 15,
    fontWeight: '600'
  },

  // Save button
  saveButton: {
    borderRadius: 8,
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    paddingVertical: 12
  },

  // Text inside the save button
  saveButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600'
  },

  // Disabled button appearance
  disabledButton: {
    opacity: 0.5
  },

  // Error message shown during profile editing
  errorMessage: {
    color: '#b91c1c',
    fontSize: 14
  },

  // Card containing the destructive account action
  dangerCard: {
    borderRadius: 16,
    backgroundColor: '#fff1f2',
    borderWidth: 1,
    borderColor: '#fecdd3',
    padding: 20,
    gap: 12
  },

  // Delete section heading
  dangerTitle: {
    color: '#991b1b',
    fontSize: 19,
    fontWeight: '700'
  },

  // Delete section explanation
  dangerMessage: {
    color: '#7f1d1d',
    fontSize: 15,
    lineHeight: 22
  },

  // Delete account button
  deleteButton: {
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#dc2626',
    paddingVertical: 12
  },

  // Delete account button text
  deleteButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700'
  },

})