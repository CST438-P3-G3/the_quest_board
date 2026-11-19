import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

let accessToken: string | null = null;
let accessTokenLoaded = false;
const ACCESS_TOKEN_KEY = 'quest-board-access-token';

export type Organization = {
  id: string;
  name: string;
  description: string;
  websiteUrl: string | null;
  role: string;
  createdAt: string;
};

function apiBaseUrl() {
  const value = Platform.OS === 'web'
    ? process.env.EXPO_PUBLIC_WEB_API_URL
    : process.env.EXPO_PUBLIC_NATIVE_API_URL;
  if (!value) throw new Error('The API address is missing from app configuration.');
  return value.replace(/\/$/, '');
}

export async function setAccessToken(token: string) {
  accessToken = token;
  accessTokenLoaded = true;
  if (Platform.OS !== 'web') await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token);
}

async function getAccessToken() {
  if (!accessTokenLoaded) {
    accessToken = Platform.OS === 'web' ? null : await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
    accessTokenLoaded = true;
  }
  return accessToken;
}

async function clearAccessToken() {
  accessToken = null;
  accessTokenLoaded = true;
  if (Platform.OS !== 'web') await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = await getAccessToken();
  if (!token) throw new Error('Please sign in again to continue.');
  const response = await fetch(`${apiBaseUrl()}${path}`, {
    ...init,
    headers: {
      Accept: 'application/json, application/problem+json',
      Authorization: `Bearer ${token}`,
      ...(init.body ? { 'Content-Type': 'application/json' } : {}),
      ...init.headers,
    },
  });
  if (response.status === 401) {
    await clearAccessToken();
    throw new Error('Your session expired. Please sign in again.');
  }
  if (!response.ok) {
    const problem = await response.json().catch(() => null) as { detail?: string; title?: string } | null;
    throw new Error(problem?.detail ?? problem?.title ?? `Request failed (${response.status}).`);
  }
  return response.json() as Promise<T>;
}

export function getOrganizations() { return request<Organization[]>('/organizations'); }

export function createOrganization(values: { name: string; description: string; websiteUrl: string | null }) {
  return request<Organization>('/organizations', { method: 'POST', body: JSON.stringify(values) });
}
