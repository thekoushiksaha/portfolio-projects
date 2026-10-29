import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const ACCESS_KEY = 'outspend_access_token';
const REFRESH_KEY = 'outspend_refresh_token';

async function getItem(key: string): Promise<string | null> {
  if (Platform.OS === 'web') {
    return globalThis.localStorage?.getItem(key) ?? null;
  }
  return SecureStore.getItemAsync(key);
}

async function setItem(key: string, value: string): Promise<void> {
  if (Platform.OS === 'web') {
    globalThis.localStorage?.setItem(key, value);
    return;
  }
  await SecureStore.setItemAsync(key, value);
}

async function removeItem(key: string): Promise<void> {
  if (Platform.OS === 'web') {
    globalThis.localStorage?.removeItem(key);
    return;
  }
  await SecureStore.deleteItemAsync(key);
}

export const tokenStorage = {
  getAccess: () => getItem(ACCESS_KEY),
  getRefresh: () => getItem(REFRESH_KEY),

  async save(accessToken: string, refreshToken: string): Promise<void> {
    await setItem(ACCESS_KEY, accessToken);
    await setItem(REFRESH_KEY, refreshToken);
  },

  async clear(): Promise<void> {
    await removeItem(ACCESS_KEY);
    await removeItem(REFRESH_KEY);
  },
};
