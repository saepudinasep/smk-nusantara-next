'use server';

import { AuthError } from 'next-auth';

import { signIn, signOut } from '@/auth';
import { ROLE_HOME, safeRedirect } from '@/lib/access';
import { prisma } from '@/lib/prisma';

/** Dipakai oleh useActionState di form login. Mengembalikan pesan error, atau redirect saat sukses. */
export async function login(
  _prev: string | undefined,
  formData: FormData,
): Promise<string | undefined> {
  const username = String(formData.get('username') ?? '').trim();
  const password = String(formData.get('password') ?? '');
  const requestedCallback = String(formData.get('callbackUrl') ?? '').trim();
  const user = requestedCallback
    ? null
    : await prisma.user.findUnique({
        where: { username },
        select: { role: true },
      });
  const callbackUrl = requestedCallback
    ? safeRedirect(requestedCallback)
    : user
      ? ROLE_HOME[user.role]
      : ROLE_HOME.admin;

  try {
    await signIn('credentials', { username, password, redirectTo: callbackUrl });
  } catch (error) {
    if (error instanceof AuthError) {
      return error.type === 'CredentialsSignin'
        ? 'Username atau password salah. Silakan coba lagi.'
        : 'Something went wrong. Please try again.';
    }
    throw error; // redirect sukses dilempar sebagai error khusus Next.js, jangan ditelan
  }
}

export async function logout() {
  await signOut({ redirectTo: '/login' });
}
