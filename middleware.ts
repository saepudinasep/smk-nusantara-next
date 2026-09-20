import { NextResponse, type NextRequest } from 'next/server';

import { ROLE_HOME_PATH, type UserRole } from '@/lib/dummy-users';
import { SESSION_COOKIE_NAME } from '@/lib/session';

type Session = { role?: UserRole };

function parseSession(raw: string | undefined): Session | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Session;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = parseSession(request.cookies.get(SESSION_COOKIE_NAME)?.value);

  const isDashboardRoute = pathname.startsWith('/dashboard');
  const isLoginRoute = pathname === '/login';

  // Belum login tapi mengakses dashboard -> lempar ke halaman login
  if (isDashboardRoute && !session?.role) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  if (isDashboardRoute && session?.role) {
    const home = ROLE_HOME_PATH[session.role];

    // /dashboard polos -> arahkan ke dashboard sesuai role
    if (pathname === '/dashboard') {
      return NextResponse.redirect(new URL(home, request.url));
    }

    // Cegah lintas-role, misal siswa membuka /dashboard/admin
    const isAdminRoute = pathname.startsWith('/dashboard/admin');
    const isTeacherRoute = pathname.startsWith('/dashboard/teacher');
    const isStudentRoute = pathname.startsWith('/dashboard/student');

    const forbidden =
      (isAdminRoute && session.role !== 'admin') ||
      (isTeacherRoute && session.role !== 'teacher') ||
      (isStudentRoute && session.role !== 'student');

    if (forbidden) {
      return NextResponse.redirect(new URL(home, request.url));
    }
  }

  // Sudah login tapi membuka /login -> arahkan langsung ke dashboard-nya
  if (isLoginRoute && session?.role) {
    return NextResponse.redirect(new URL(ROLE_HOME_PATH[session.role], request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
};
