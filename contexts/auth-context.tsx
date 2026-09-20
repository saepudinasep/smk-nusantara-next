'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';

import { findDummyUser, type DummyUser } from '@/lib/dummy-users';
import { SESSION_COOKIE_NAME } from '@/lib/session';

export type SessionUser = Omit<DummyUser, 'password'>;

export { SESSION_COOKIE_NAME };

type LoginResult = { success: true; user: SessionUser } | { success: false; message: string };

type AuthContextValue = {
  user: SessionUser | null;
  /** true selama sesi awal masih dibaca dari cookie (hindari flicker) */
  isLoading: boolean;
  login: (username: string, password: string) => LoginResult;
  logout: () => void;
};

const AuthContext = React.createContext<AuthContextValue | null>(null);

function readSessionCookie(): SessionUser | null {
  if (typeof document === 'undefined') return null;

  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${SESSION_COOKIE_NAME}=`));

  if (!match) return null;

  try {
    const raw = match.slice(SESSION_COOKIE_NAME.length + 1);
    return JSON.parse(decodeURIComponent(raw)) as SessionUser;
  } catch {
    return null;
  }
}

function writeSessionCookie(user: SessionUser) {
  const maxAgeSeconds = 60 * 60 * 8; // 8 jam
  document.cookie = `${SESSION_COOKIE_NAME}=${encodeURIComponent(
    JSON.stringify(user),
  )}; path=/; max-age=${maxAgeSeconds}; samesite=lax`;
}

function clearSessionCookie() {
  document.cookie = `${SESSION_COOKIE_NAME}=; path=/; max-age=0; samesite=lax`;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<SessionUser | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const router = useRouter();

  React.useEffect(() => {
    // Sinkronisasi state React dengan cookie (sumber eksternal) saat mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUser(readSessionCookie());
    setIsLoading(false);
  }, []);

  const login = React.useCallback((username: string, password: string): LoginResult => {
    const account = findDummyUser(username, password);

    if (!account) {
      return { success: false, message: 'Username atau password salah.' };
    }

    const sessionUser: SessionUser = {
      username: account.username,
      role: account.role,
      name: account.name,
      email: account.email,
      meta: account.meta,
    };
    writeSessionCookie(sessionUser);
    setUser(sessionUser);
    return { success: true, user: sessionUser };
  }, []);

  const logout = React.useCallback(() => {
    clearSessionCookie();
    setUser(null);
    router.push('/login');
    router.refresh();
  }, [router]);

  const value = React.useMemo(
    () => ({ user, isLoading, login, logout }),
    [user, isLoading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth harus dipakai di dalam <AuthProvider>');
  }
  return ctx;
}
