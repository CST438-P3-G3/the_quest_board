import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { getOrganizations, type Organization } from '@/api';

export default function OrgsScreen() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadOrganizations = useCallback(async () => {
    setLoading(true);
    setError('');
    try { setOrganizations(await getOrganizations()); }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Could not load organizations.'); }
    finally { setLoading(false); }
  }, []);
  useFocusEffect(useCallback(() => { void loadOrganizations(); }, [loadOrganizations]));

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} refreshControl={<RefreshControl refreshing={loading} onRefresh={() => void loadOrganizations()} />}>
        <View style={styles.headingRow}>
          <View style={styles.headingCopy}>
            <Text style={styles.title}>Organizations</Text>
            <Text style={styles.subtitle}>Groups you belong to on Quest Board.</Text>
          </View>
          <Pressable accessibilityRole="button" onPress={() => router.push('/create-org' as never)} style={({ pressed }) => [styles.createButton, pressed && styles.pressed]}>
            <Text style={styles.createButtonText}>+ Create</Text>
          </Pressable>
        </View>
        {loading && organizations.length === 0 ? <ActivityIndicator color="#2563eb" /> : null}
        {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
        {error.toLowerCase().includes('sign in again') ? <Pressable accessibilityRole="button" onPress={() => router.replace('/log-in')}><Text style={styles.signIn}>Sign in again</Text></Pressable> : null}
        {!loading && !error && organizations.length === 0 ? <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>No organizations yet</Text>
          <Text style={styles.emptyText}>Create an organization to start bringing your group together.</Text>
        </View> : null}
        <View style={styles.list}>{organizations.map((org) => <View key={org.id} style={styles.card}>
          <View style={styles.cardHeading}><Text style={styles.orgName}>{org.name}</Text><Text style={styles.role}>{org.role.toLowerCase()}</Text></View>
          {org.description ? <Text style={styles.description}>{org.description}</Text> : null}
        </View>)}</View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f8fafc' },
  content: { width: '100%', maxWidth: 680, alignSelf: 'center', padding: 24, gap: 18 },
  headingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  headingCopy: { flex: 1, gap: 5 },
  title: { color: '#0f172a', fontSize: 30, fontWeight: '700' },
  subtitle: { color: '#64748b', fontSize: 15 },
  createButton: { borderRadius: 10, backgroundColor: '#2563eb', paddingHorizontal: 16, paddingVertical: 12 },
  createButtonText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  pressed: { opacity: 0.78 }, list: { gap: 12 },
  card: { gap: 8, borderRadius: 14, backgroundColor: '#fff', padding: 18, borderWidth: 1, borderColor: '#e2e8f0' },
  cardHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  orgName: { flex: 1, color: '#0f172a', fontSize: 18, fontWeight: '700' },
  role: { color: '#1d4ed8', backgroundColor: '#eff6ff', overflow: 'hidden', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, fontSize: 12, fontWeight: '700' },
  description: { color: '#475569', fontSize: 15, lineHeight: 22 },
  emptyCard: { alignItems: 'center', gap: 8, borderRadius: 14, backgroundColor: '#fff', borderWidth: 1, borderColor: '#e2e8f0', padding: 26 },
  emptyTitle: { color: '#0f172a', fontSize: 18, fontWeight: '700' }, emptyText: { color: '#64748b', textAlign: 'center', lineHeight: 22 },
  error: { color: '#b91c1c', backgroundColor: '#fef2f2', borderRadius: 10, padding: 12 },
  signIn: { color: '#2563eb', fontSize: 16, fontWeight: '700' },
});
