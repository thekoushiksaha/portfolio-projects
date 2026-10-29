import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SystemUI from 'expo-system-ui';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { Appearance, Platform, useColorScheme, View } from 'react-native';

import { darkColors, lightColors, type ThemeColors } from './palettes';

export type ThemePreference = 'system' | 'light' | 'dark';
export type ResolvedScheme = 'light' | 'dark';

const STORAGE_KEY = 'outspend_theme_preference';

interface ThemeContextValue {
  colors: ThemeColors;
  scheme: ResolvedScheme;
  preference: ThemePreference;
  ready: boolean;
  setPreference: (preference: ThemePreference) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function isPreference(value: string | null): value is ThemePreference {
  return value === 'system' || value === 'light' || value === 'dark';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>('system');
  const [ready, setReady] = useState(false);

  // 1. Load persisted preference on mount
  useEffect(() => {
    let isMounted = true;

    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (isMounted && isPreference(stored)) {
          setPreferenceState(stored);
        }
      })
      .catch(() => {
        // Fallback to system preference on failure
      })
      .finally(() => {
        if (isMounted) {
          setReady(true);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Resolve scheme and active palette
  const scheme: ResolvedScheme = useMemo(() => {
    if (preference === 'system') {
      return systemScheme === 'dark' ? 'dark' : 'light';
    }
    return preference;
  }, [preference, systemScheme]);

  const colors = useMemo(() => (scheme === 'dark' ? darkColors : lightColors), [scheme]);

  // 3. Synchronize native OS UI & background
  useEffect(() => {
    if (Platform.OS === 'web') return;

    if (typeof Appearance.setColorScheme === 'function') {
      try {
        // Use 'unspecified' to revert to system settings without passing null/undefined
        const targetScheme = preference === 'system' ? 'unspecified' : preference;
        Appearance.setColorScheme(targetScheme as any);
      } catch {
        // Guard against unsupported platforms or native runtime issues
      }
    }

    SystemUI.setBackgroundColorAsync(colors.background).catch(() => {});
  }, [preference, colors.background]);

  // 4. Update preference handler
  const setPreference = useCallback((next: ThemePreference) => {
    setPreferenceState(next);
    AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {});
  }, []);

  const value = useMemo(
    () => ({ colors, scheme, preference, ready, setPreference }),
    [colors, scheme, preference, ready, setPreference],
  );

  return (
    <ThemeContext.Provider value={value}>
      {!ready ? <View style={{ flex: 1, backgroundColor: colors.background }} /> : children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used inside ThemeProvider');
  }
  return context;
}
