import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import { AppSidebar } from '@/components/app-sidebar';
import { Notifications } from '@/components/notifications';
import { SiteHeader } from '@/components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { prisma } from '@/lib/prisma';
import { getPusherClientConfig, getWebPushPublicKey } from '@/lib/notifications';

export const metadata: Metadata = { title: 'Notifications' };

export default async function Page() {
  const session = await auth();
  if (!session?.user) redirect('/login');
  const notifications = await prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
  });
  const pusherConfig = getPusherClientConfig();
  const vapidPublicKey = getWebPushPublicKey();
  const items = notifications.map((notification) => ({
    id: notification.id,
    type: notification.type,
    title: notification.title,
    message: notification.message,
    createdAt: notification.createdAt.toISOString(),
    read: notification.readAt !== null,
  }));

  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': 'calc(var(--spacing) * 72)',
          '--header-height': 'calc(var(--spacing) * 12)',
        } as React.CSSProperties
      }
    >
      <AppSidebar variant='inset' />
      <SidebarInset>
        <SiteHeader />
        <div className='flex flex-1 flex-col'>
          <div className='@container/main flex flex-1 flex-col gap-2'>
            <div className='px-4 py-4 md:py-6 lg:px-6'>
              <Notifications
                initialItems={items}
                userId={session.user.id}
                pusherConfig={pusherConfig}
                vapidPublicKey={vapidPublicKey}
              />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
