import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


// Describes the account information that will eventually
// come from the GET /user/me endpoint
type ProfileData = {
    displayName: string;
    username: string;
    email: string;
    accountType: string;
};




// Later, this object can be replaced with data returned from:
// GET /user/me

const mockProfile: ProfileData = {
    displayName: 'Carlos User',
    username: '@carlos',
    email: 'carlos@example.com',
    accountType: 'Family member',
};

// Profile screen for issue #4
export default function ProfileScreen() {
    // This will eventually be replaced by the application's real authentication state
    const [isSignedIn, setIsSignedIn] = useState(true);

    // The user cannot view profile information while signed out.
    if (!isSignedIn) {
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
                            pressed && styles.pressedButton,
                        ]}
                    >
                        <Text style={styles.primaryButtonText}>Go to Sign In</Text>
                    </Pressable>
                </View>
            </SafeAreaView>
        );
    }

    
    // Signed in UI state
    // Displays temporary profile information in a scrollable layout
    return (
        <SafeAreaView style={styles.screen}>
            <ScrollView contentContainerStyle={styles.content}>
                {/* Main screen heading */}
                <Text style={styles.title}>My Profile</Text>

                {/* Short explanation below the heading */}
                <Text style={styles.subtitle}>
                    View the account information connected to your Quest Board account.
                </Text>

                {/* Profile summary card */}
                <View style={styles.profileCard}>
                    {/*
            The first character of the display name is used
            as a temporary profile avatar
          */}
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>
                            {mockProfile.displayName.charAt(0)}
                        </Text>
                    </View>

                    {/* User's display name */}
                    <Text style={styles.displayName}>
                        {mockProfile.displayName}
                    </Text>

                    {/* User's username */}
                    <Text style={styles.username}>
                        {mockProfile.username}
                    </Text>
                </View>

                {/* Detailed account information card */}
                <View style={styles.informationCard}>
                    <Text style={styles.sectionTitle}>
                        Account information
                    </Text>

                    {/* Display name row */}
                    <View style={styles.informationRow}>
                        <Text style={styles.label}>Display name</Text>
                        <Text style={styles.value}>
                            {mockProfile.displayName}
                        </Text>
                    </View>

                    <View style={styles.divider} />

                    {/* Username row */}
                    <View style={styles.informationRow}>
                        <Text style={styles.label}>Username</Text>
                        <Text style={styles.value}>
                            {mockProfile.username}
                        </Text>
                    </View>

                    <View style={styles.divider} />

                    {/* Email row */}
                    <View style={styles.informationRow}>
                        <Text style={styles.label}>Email</Text>
                        <Text style={styles.value}>
                            {mockProfile.email}
                        </Text>
                    </View>

                    <View style={styles.divider} />

                    {/* Account type row */}
                    <View style={styles.informationRow}>
                        <Text style={styles.label}>Account type</Text>
                        <Text style={styles.value}>
                            {mockProfile.accountType}
                        </Text>
                    </View>
                </View>

                {/*
          This button is only for testing the signed out UI.
          It will eventually be replaced with real sign out logic.
        */}
                <Pressable
                    accessibilityRole="button"
                    onPress={() => setIsSignedIn(false)}
                    style={({ pressed }) => [
                        styles.signOutButton,
                        pressed && styles.pressedButton,
                    ]}
                >
                    <Text style={styles.signOutButtonText}>
                        Preview Signed-Out State
                    </Text>
                </Pressable>
            </ScrollView>
        </SafeAreaView>
    );
}


// Styles for the profile screen
// These styles use React Native's StyleSheet API so the screen
// works across Android, iOS, and web
const styles = StyleSheet.create({

    // Full screen background container
    screen: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },

    // Main scrollable content container
    content: {
        width: '100%',
        maxWidth: 640,
        alignSelf: 'center',
        padding: 24,
        gap: 18,
    },

    // Main page title
    title: {
        color: '#0f172a',
        fontSize: 32,
        fontWeight: '700',
    },

    // Supporting text below the title
    subtitle: {
        color: '#475569',
        fontSize: 16,
        lineHeight: 24,
    },

    // Card containing the profile avatar and summary
    profileCard: {
        alignItems: 'center',
        borderRadius: 16,
        backgroundColor: '#ffffff',
        padding: 24,
    },

    // Circular profile avatar
    avatar: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#2563eb',
        marginBottom: 14,
    },

    // Letter displayed inside the avatar
    avatarText: {
        color: '#ffffff',
        fontSize: 32,
        fontWeight: '700',
    },

    // User's display name in the profile summary
    displayName: {
        color: '#0f172a',
        fontSize: 22,
        fontWeight: '700',
    },

    // User's username in the profile summary
    username: {
        color: '#64748b',
        fontSize: 16,
        marginTop: 4,
    },

    // Card containing detailed account fields
    informationCard: {
        borderRadius: 16,
        backgroundColor: '#ffffff',
        padding: 20,
    },

    // Heading for the account information section    
    sectionTitle: {
        color: '#0f172a',
        fontSize: 19,
        fontWeight: '700',
        marginBottom: 16,
    },

    // Individual account information row
    informationRow: {
        gap: 6,
        paddingVertical: 10,
    },

    // Label for an account field
    label: {
        color: '#64748b',
        fontSize: 14,
    },

    //  Value displayed for an account field
    value: {
        color: '#0f172a',
        fontSize: 16,
        fontWeight: '600',
    },

    // Horizontal divider between account fields
    divider: {
        height: 1,
        backgroundColor: '#e2e8f0',
    },

    // Button shown on the signed out screen
    primaryButton: {
        borderRadius: 10,
        backgroundColor: '#2563eb',
        paddingHorizontal: 20,
        paddingVertical: 14,
    },


    // Text inside the primary button
    primaryButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
    
    // Temporary button used to preview the signed out state
    signOutButton: {
        alignItems: 'center',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#dc2626',
        paddingVertical: 14,
    },

    
    // Text inside the preview button
    signOutButtonText: {
        color: '#dc2626',
        fontSize: 15,
        fontWeight: '600',
    },

    
    // Slightly fades buttons while they are being pressed
    pressedButton: {
        opacity: 0.75,
    },

    
    // Layout for the signed out message
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        padding: 24,
    },

    
    // Signed out screen heading
    emptyTitle: {
        color: '#0f172a',
        fontSize: 26,
        fontWeight: '700',
    },

    
    // Signed out screen explanation
    emptyMessage: {
        color: '#475569',
        fontSize: 16,
        textAlign: 'center',
    },
});