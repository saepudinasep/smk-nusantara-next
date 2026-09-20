'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';

import { useAuth, type SessionUser } from '@/contexts/auth-context';
import { ROLE_HOME_PATH, type UserRole } from '@/lib/dummy-users';

/**
 * Lapisan proteksi sisi client (pelengkap middleware.ts) sekaligus
 * penyedia data `user` yang sudah pasti ada & sesuai role ke children.
 */
export function ProtectedRoute({
  role,
  children,
}: {
  role: UserRole;
  children: (user: SessionUser) => React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.replace('/login');
      return;
    }

    if (user.role !== role) {
      router.replace(ROLE_HOME_PATH[user.role]);
    }
  }, [isLoading, user, role, router]);

  if (isLoading || !user || user.role !== role) {
    return (
      <div className='flex min-h-svh items-center justify-center text-sm text-muted-foreground'>
        Memuat...
      </div>
    );
  }

  return <>{children(user)}</>;
}
