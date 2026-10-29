import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { setSessionExpiredHandler } from '@/shared/api/client';
import { tokenStorage } from '@/shared/lib/tokenStorage';

import { authApi } from './api';
import type { AuthResponse, LoginInput, RegisterInput, User } from './types';

type AuthStatus = 'loading' | 'signedIn' | 'signedOut';

interface AuthContextValue {
  status: AuthStatus;
  user: User | null;
  signIn: (input: LoginInput) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (user: User) => void; // used after editing the profile
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // If the API client cannot renew the session, go back to the login screen.
    setSessionExpiredHandler(() => {
      setUser(null);
      setStatus('signedOut');
    });

    let cancelled = false;

    // On app start: if a session is saved, check it. This also renews an expired access token.
    (async () => {
      const token = await tokenStorage.getAccess();
      if (!token) {
        if (!cancelled) {
          setStatus('signedOut');
        }
        return;
      }
      try {
        const me = await authApi.me();
        if (!cancelled) {
          setUser(me);
          setStatus('signedIn');
        }
      } catch {
        if (!cancelled) {
          setStatus('signedOut');
        }
      }
    })();

    return () => {
      cancelled = true;
      setSessionExpiredHandler(null);
    };
  }, []);

  const startSession = useCallback(async (response: AuthResponse) => {
    await tokenStorage.save(response.accessToken, response.refreshToken);
    setUser(response.user);
    setStatus('signedIn');
  }, []);

  const signIn = useCallback(
    async (input: LoginInput) => {
      const response = await authApi.login({ email: input.email.trim(), password: input.password });
      await startSession(response);
    },
    [startSession],
  );

  const register = useCallback(
    async (input: RegisterInput) => {
      const response = await authApi.register({
        name: input.name.trim(),
        email: input.email.trim(),
        password: input.password,
      });
      await startSession(response);
    },
    [startSession],
  );

  const signOut = useCallback(async () => {
    const refreshToken = await tokenStorage.getRefresh();
    if (refreshToken) {
      try {
        await authApi.logout(refreshToken);
      } catch {
        // even if the server can't be reached, still sign out on this device
      }
    }
    await tokenStorage.clear();
    setUser(null);
    setStatus('signedOut');
  }, []);

  const value = useMemo(
    () => ({ status, user, signIn, register, signOut, updateUser: setUser }),
    [status, user, signIn, register, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}
