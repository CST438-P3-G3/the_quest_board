import { useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

//Defines a leaderboard entry to use for testing
interface LeaderboardEntry {
  userId: string;
  username: string;
  totalScore: number;
}

//Mock data, again for testing
const mockLeaderboard: LeaderboardEntry[] = [
  { userId: '1', username: 'Bunnuy', totalScore: 56 },
  { userId: '2', username: 'Bnuuy', totalScore: 48 },
  { userId: '3', username: 'Bun', totalScore: 47 },
  { userId: '4', username: 'Bunny', totalScore: 43 },
];

export default function LeaderboardScreen() {
  const [leaderboard] = useState<LeaderboardEntry[]>(mockLeaderboard);

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
    color: '#64748b',
    textAlign: 'center',
    marginTop: 10,
  },
});

/* Sends an HTTP request to spring backend. As to prioritize getting the UI working first, I used dummy data first.
const response = await fetch(
  'http://10.0.2.2//leaderboard/household-id',
  headers: {
      Authorization: `$Bearer {token}`
  },
);

if (!response.ok) {
  throw new Error(`Request failed: ${response.status}`);
}

const leaderboard = await response.json(); */