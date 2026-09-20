import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { ROLE_HOME_PATH, type UserRole } from '@/lib/dummy-users';
import { SESSION_COOKIE_NAME } from '@/lib/session';

function parseRole(raw: string | undefined): UserRole | null {
  if (!raw) return null;
  try {
    const session = JSON.parse(raw) as { role?: UserRole };
    return session.role ?? null;
  } catch {
    return null;
  }
}

// Halaman ini hanya jaring pengaman; middleware.ts sudah menangani redirect
// ini lebih dulu di edge. Berguna kalau /dashboard diakses tanpa lewat middleware.
export default async function DashboardIndexPage() {
  const cookieStore = await cookies();
  const role = parseRole(cookieStore.get(SESSION_COOKIE_NAME)?.value);

  if (!role) {
    redirect('/login');
  }

  redirect(ROLE_HOME_PATH[role]);
}
