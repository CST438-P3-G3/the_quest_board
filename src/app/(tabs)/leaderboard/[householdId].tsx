import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { use_Auth } from '../../../../context/AuthContext';
import { useLocalSearchParams } from 'expo-router';


interface LeaderboardEntry {
  userId: string;
  username: string;
  totalScore: number;
}

interface LeaderboardResponse {
  householdId: string;
  leaderboard: LeaderboardEntry[];
}

export default function LeaderboardScreen() {
  const { user } = use_Auth();

  // Retrieve the household ID from the URL
  const { householdId } = useLocalSearchParams<{
    householdId: string;
  }>();

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch leaderboard for the selected household
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `http://10.0.2.2:8080/leaderboard/${householdId}`,
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

        const data: LeaderboardResponse = await response.json();

        // Sort members by score, highest first
        const sortedLeaderboard = [...data.leaderboard].sort(
          (a, b) => b.totalScore - a.totalScore
        );

        setLeaderboard(sortedLeaderboard);

      } catch (err) {
        console.error('Error fetching leaderboard:', err);
        setError('Failed to load leaderboard. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    // Fetch only when household ID and authentication token are available
    if (householdId && user?.token) {
      fetchLeaderboard();
    } else {
      setLoading(false);
    }

  }, [householdId, user?.token]);

  // Loading state
  if (loading) {
    return (
      <SafeAreaView style={styles.screen}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.message}>
          Loading leaderboard...
        </Text>
      </SafeAreaView>
    );
  }

  // Error state
  if (error) {
    return (
      <SafeAreaView style={styles.screen}>
        <Text style={styles.message}>
          {error}
        </Text>
      </SafeAreaView>
    );
  }

  // No household or authentication
  if (!householdId || !user?.token) {
    return (
      <SafeAreaView style={styles.screen}>
        <Text style={styles.message}>
          Unable to load leaderboard. Missing household or authentication.
        </Text>
      </SafeAreaView>
    );
  }

  const topThree = leaderboard.slice(0, 3);
  const remainingMembers = leaderboard.slice(3);

  return (
    <SafeAreaView style={styles.screen}>
      <FlatList
        data={remainingMembers}
        keyExtractor={(item) => item.userId}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View>
            <Text style={styles.title}>Leaderboard</Text>

            <Text style={styles.subtitle}>
              See how your household is doing!
            </Text>

            {/* Top three podium */}
            <View style={styles.podium}>

              {/* Second place */}
              <View style={styles.podiumColumn}>
                <Text style={styles.medal}>🥈</Text>

                <Text style={styles.podiumName}>
                  {topThree[1]?.username ?? '-'}
                </Text>

                <Text style={styles.podiumScore}>
                  {topThree[1]?.totalScore ?? 0} pts
                </Text>

                <View style={[styles.podiumBlock, styles.secondPlace]}>
                  <Text style={styles.podiumRank}>2</Text>
                </View>
              </View>

              {/* First place */}
              <View style={styles.podiumColumn}>
                <Text style={styles.medal}>🥇</Text>

                <Text style={styles.podiumName}>
                  {topThree[0]?.username ?? '-'}
                </Text>

                <Text style={styles.podiumScore}>
                  {topThree[0]?.totalScore ?? 0} pts
                </Text>

                <View style={[styles.podiumBlock, styles.firstPlace]}>
                  <Text style={styles.podiumRank}>1</Text>
                </View>
              </View>

              {/* Third place */}
              <View style={styles.podiumColumn}>
                <Text style={styles.medal}>🥉</Text>

                <Text style={styles.podiumName}>
                  {topThree[2]?.username ?? '-'}
                </Text>

                <Text style={styles.podiumScore}>
                  {topThree[2]?.totalScore ?? 0} pts
                </Text>

                <View style={[styles.podiumBlock, styles.thirdPlace]}>
                  <Text style={styles.podiumRank}>3</Text>
                </View>
              </View>

            </View>

            <Text style={styles.sectionTitle}>
              All rankings
            </Text>
          </View>
        }

        renderItem={({ item, index }) => (
          <View style={styles.memberRow}>
            <Text style={styles.memberRank}>
              #{index + 4}
            </Text>

            <Text style={styles.memberName}>
              {item.username}
            </Text>

            <Text style={styles.memberScore}>
              {item.totalScore} pts
            </Text>
          </View>
        )}

        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No additional household members.
          </Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  listContent: {
    padding: 24,
    paddingBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 15,
    color: '#64748b',
    marginTop: 6,
  },

  // Podium
  podium: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 10,
    marginTop: 40,
    marginBottom: 40,
  },
  podiumColumn: {
    flex: 1,
    alignItems: 'center',
  },
  medal: {
    fontSize: 32,
    marginBottom: 8,
  },
  podiumName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
    textAlign: 'center',
  },
  podiumScore: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
    marginBottom: 10,
  },
  podiumBlock: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  firstPlace: {
    height: 130,
    backgroundColor: '#facc15',
  },
  secondPlace: {
    height: 95,
    backgroundColor: '#cbd5e1',
  },
  thirdPlace: {
    height: 75,
    backgroundColor: '#d6a17a',
  },
  podiumRank: {
    fontSize: 32,
    fontWeight: '700',
    color: '#ffffff',
  },

  // Remaining leaderboard
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 16,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 18,
    marginBottom: 12,
  },
  memberRank: {
    width: 40,
    fontSize: 16,
    fontWeight: '700',
    color: '#64748b',
  },
  memberName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
  },
  memberScore: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2563eb',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 10,
    color: '#64748b'
  },
  message: {
    textAlign: 'center',
    marginTop: 20,
    color: '#64748b',
  },
});