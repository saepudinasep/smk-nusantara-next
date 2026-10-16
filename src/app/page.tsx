import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import { ROLE_HOME } from '@/lib/access';

export default async function Home() {
  const session = await auth();
  if (!session?.user) redirect('/login');
  if (session.user.mustChangePassword) redirect('/account');
  redirect(ROLE_HOME[session.user.role]);
}
