import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createOrganization } from '@/api';

export default function CreateOrgScreen() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function submit() {
    const cleanName = name.trim();
    if (!cleanName) { setError('Enter an organization name.'); return; }
    if (cleanName.length > 120) { setError('Organization names must be 120 characters or fewer.'); return; }
    setSaving(true); setError('');
    try {
      await createOrganization({ name: cleanName, description: description.trim() });
      router.replace('/(tabs)/orgs' as never);
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Could not create the organization.'); }
    finally { setSaving(false); }
  }

  return <SafeAreaView style={styles.screen}>
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Pressable accessibilityRole="button" onPress={() => router.back()}><Text style={styles.back}>‹  Back to Orgs</Text></Pressable>
        <Text style={styles.title}>Create an organization</Text>
        <Text style={styles.subtitle}>Add the organization details. You’ll be its owner.</Text>
        <Text style={styles.label}>Organization name *</Text>
        <TextInput accessibilityLabel="Organization name" autoCapitalize="words" maxLength={120} onChangeText={setName} placeholder="e.g. Quest Club" placeholderTextColor="#94a3b8" style={styles.input} value={name} />
        <Text style={styles.label}>Description</Text>
        <TextInput accessibilityLabel="Description" multiline maxLength={1000} onChangeText={setDescription} placeholder="What is this organization about?" placeholderTextColor="#94a3b8" style={[styles.input, styles.multiline]} value={description} />
        {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
        {error.toLowerCase().includes('sign in again') ? <Pressable accessibilityRole="button" onPress={() => router.replace('/log-in')}><Text style={styles.signIn}>Sign in again</Text></Pressable> : null}
        <Pressable accessibilityRole="button" disabled={saving} onPress={() => void submit()} style={({ pressed }) => [styles.saveButton, (pressed || saving) && styles.dimmed]}>
          {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveText}>Create organization</Text>}
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f8fafc' }, flex: { flex: 1 },
  content: { width: '100%', maxWidth: 640, alignSelf: 'center', padding: 24, gap: 14 },
  back: { color: '#2563eb', fontSize: 16, fontWeight: '600', marginBottom: 6 },
  title: { color: '#0f172a', fontSize: 28, fontWeight: '700' },
  subtitle: { color: '#64748b', fontSize: 15, lineHeight: 22, marginBottom: 6 },
  label: { color: '#334155', fontSize: 15, fontWeight: '600', marginTop: 4 },
  input: { minHeight: 48, borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 10, backgroundColor: '#fff', color: '#0f172a', fontSize: 16, paddingHorizontal: 14 },
  multiline: { minHeight: 110, textAlignVertical: 'top', paddingVertical: 12 },
  error: { color: '#b91c1c', backgroundColor: '#fef2f2', borderRadius: 10, padding: 12 },
  saveButton: { minHeight: 50, alignItems: 'center', justifyContent: 'center', borderRadius: 10, backgroundColor: '#2563eb', paddingHorizontal: 18, marginTop: 8 },
  saveText: { color: '#fff', fontSize: 16, fontWeight: '700' }, dimmed: { opacity: 0.72 },
  signIn: { color: '#2563eb', fontSize: 16, fontWeight: '700' },
});
