import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { use_Auth } from '../../../context/AuthContext';

interface Household {
  id: string;
  name: string;
}

export default function HouseholdSelectionScreen() {
  const router = useRouter();
  const { user } = use_Auth();

  const [households, setHouseholds] = useState<Household[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch households the user is in, so they can select one and view the leaderboard for it.
  useEffect(() => {
    const fetchHouseholds = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          'http://10.0.2.2:8080/households/my-households',
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${user.token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Request failed: ${response.status}`);
        }

        const data: Household[] = await response.json();

        setHouseholds(data);

      } catch (err) {
        console.error('Error fetching households:', err);
        setError('Failed to load your households.');
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) {
      fetchHouseholds();
    }
  }, [user?.token]);

  // Navigate to leaderboard with selected household ID
  const householdSelection = (household: Household) => {
    router.push({
      pathname: '/leaderboard/[householdId]',
      params: {
        householdId: household.id,
      },
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.screen}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.message}>
          Loading your households...
        </Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.screen}>
        <Text style={styles.message}>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <Text style={styles.title}>
          Select a Household
        </Text>

        <Text style={styles.subtitle}>
          Choose a household to view its leaderboard.
        </Text>

        <FlatList
          data={households}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <Pressable
              style={styles.householdCard}
              onPress={() => householdSelection(item)}
            >
              <Text style={styles.householdName}>
                {item.name}
              </Text>

              <Text style={styles.arrow}>
                →
              </Text>
            </Pressable>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              You don't belong to any households yet. Try joining one!
            </Text>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  container: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 15,
    color: '#64748b',
    marginTop: 8,
    marginBottom: 24,
  },
  listContent: {
    paddingBottom: 24,
  },
  householdCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  householdName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#0f172a',
  },
  arrow: {
    fontSize: 22,
    color: '#2563eb',
  },
  message: {
    textAlign: 'center',
    marginTop: 20,
    color: '#64748b',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 30,
    color: '#64748b',
  },
});