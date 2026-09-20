/**
 * Nama cookie session dummy. Dipisah dari auth-context.tsx (client component)
 * supaya bisa diimpor dengan aman oleh middleware.ts (edge runtime).
 */
export const SESSION_COOKIE_NAME = 'smk_session';
