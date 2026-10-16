'use client';

import * as React from 'react';
import Pusher from 'pusher-js';
import {
  BellIcon,
  BellRingIcon,
  CalendarDaysIcon,
  CheckCheckIcon,
  CheckIcon,
  ClipboardCheckIcon,
  InfoIcon,
  MailOpenIcon,
  SchoolIcon,
  ShieldCheckIcon,
  Trash2Icon,
  type LucideIcon,
} from 'lucide-react';

import {
  deleteNotification,
  markAllNotificationsRead,
  removePushSubscription,
  savePushSubscription,
  setNotificationRead,
} from '@/actions/notifications';
import { StatCards } from '@/components/stat-cards';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatDateTime, type AppNotification, type NotificationType } from '@/lib/notification-types';

const typeIcon: Record<NotificationType, LucideIcon> = {
  schedule: CalendarDaysIcon,
  score: ClipboardCheckIcon,
  class: SchoolIcon,
  account: ShieldCheckIcon,
  system: InfoIcon,
};

type Filter = 'all' | 'unread';

type NotificationsProps = {
  initialItems: AppNotification[];
  userId: string;
  pusherConfig: { key: string; cluster: string } | null;
  vapidPublicKey: string | null;
};

function decodeVapidKey(base64Key: string) {
  const padding = '='.repeat((4 - (base64Key.length % 4)) % 4);
  const base64 = (base64Key + padding).replace(/-/g, '+').replace(/_/g, '/');
  return Uint8Array.from(window.atob(base64), (char) => char.charCodeAt(0));
}

export function Notifications({
  initialItems,
  userId,
  pusherConfig,
  vapidPublicKey,
}: NotificationsProps) {
  const [items, setItems] = React.useState<AppNotification[]>(initialItems);
  const [filter, setFilter] = React.useState<Filter>('all');
  const [busy, setBusy] = React.useState<{ id: string; action: 'read' | 'delete' } | null>(null);
  const [markingAll, setMarkingAll] = React.useState(false);
  const [actionError, setActionError] = React.useState('');
  const [realtimeError, setRealtimeError] = React.useState('');
  const [pushState, setPushState] = React.useState<
    'checking' | 'enabled' | 'disabled' | 'denied' | 'unsupported'
  >('checking');
  const [pushBusy, setPushBusy] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    async function checkPushState() {
      if (
        !('Notification' in window) ||
        !('serviceWorker' in navigator) ||
        !('PushManager' in window)
      ) {
        if (!cancelled) setPushState('unsupported');
        return;
      }
      if (Notification.permission === 'denied') {
        if (!cancelled) setPushState('denied');
        return;
      }
      const registration = await navigator.serviceWorker.getRegistration('/');
      const subscription = await registration?.pushManager.getSubscription();
      if (!cancelled) setPushState(subscription ? 'enabled' : 'disabled');
    }
    void checkPushState().catch(() => {
      if (!cancelled) setPushState('unsupported');
    });
    return () => {
      cancelled = true;
    };
  }, [vapidPublicKey]);

  const toggleBrowserNotifications = async () => {
    setPushBusy(true);
    setActionError('');
    try {
      if (pushState === 'enabled') {
        const registration = await navigator.serviceWorker.getRegistration('/');
        const subscription = await registration?.pushManager.getSubscription();
        if (subscription) {
          const result = await removePushSubscription(subscription.endpoint);
          if (!result.ok) {
            setActionError(result.error);
            return;
          }
          await subscription.unsubscribe();
        }
        setPushState('disabled');
        return;
      }

      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        setPushState(permission === 'denied' ? 'denied' : 'disabled');
        return;
      }
      if (!vapidPublicKey) {
        setPushState('disabled');
        setActionError('Browser push notifications are not configured on the server.');
        return;
      }
      const registration = await navigator.serviceWorker.register('/sw.js');
      const subscription =
        (await registration.pushManager.getSubscription()) ??
        (await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: decodeVapidKey(vapidPublicKey),
        }));
      const result = await savePushSubscription(subscription.toJSON());
      if (!result.ok) {
        await subscription.unsubscribe();
        setActionError(result.error);
        return;
      }
      setPushState('enabled');
    } catch (error) {
      console.error('Browser push notification setup failed:', error);
      setActionError('Could not configure browser notifications. Please try again.');
    } finally {
      setPushBusy(false);
    }
  };

  React.useEffect(() => {
    if (!pusherConfig) return;

    const pusher = new Pusher(pusherConfig.key, {
      cluster: pusherConfig.cluster,
      channelAuthorization: { endpoint: '/api/pusher/auth', transport: 'ajax' },
    });
    const channel = pusher.subscribe(`private-notifications-${userId}`);
    channel.bind('notification:new', (notification: AppNotification) => {
      setItems((current) =>
        current.some((item) => item.id === notification.id) ? current : [notification, ...current],
      );
    });
    channel.bind('pusher:subscription_succeeded', () => setRealtimeError(''));
    channel.bind('pusher:subscription_error', () =>
      setRealtimeError('Could not connect to real-time notifications. Check Pusher configuration.'),
    );

    return () => {
      channel.unbind_all();
      pusher.unsubscribe(`private-notifications-${userId}`);
      pusher.disconnect();
    };
  }, [pusherConfig, userId]);

  const total = items.length;
  const unread = items.filter((n) => !n.read).length;
  const scheduleItems = items.filter((n) => n.type === 'schedule');
  const visible = filter === 'unread' ? items.filter((n) => !n.read) : items;

  const toggleRead = async (id: string) => {
    setBusy({ id, action: 'read' });
    setActionError('');
    const notification = items.find((item) => item.id === id);
    if (!notification) return setBusy(null);
    try {
      const result = await setNotificationRead(id, !notification.read);
      if (!result.ok) {
        setActionError(result.error);
        return;
      }
      setItems((list) =>
        list.map((n) => (n.id === id ? { ...n, read: !notification.read } : n)),
      );
    } catch {
      setActionError('Could not update notification. Please try again.');
    } finally {
      setBusy(null);
    }
  };
  const remove = async (id: string) => {
    setBusy({ id, action: 'delete' });
    setActionError('');
    try {
      const result = await deleteNotification(id);
      if (!result.ok) {
        setActionError(result.error);
        return;
      }
      setItems((list) => list.filter((n) => n.id !== id));
    } catch {
      setActionError('Could not delete notification. Please try again.');
    } finally {
      setBusy(null);
    }
  };
  const markAllRead = async () => {
    setMarkingAll(true);
    setActionError('');
    try {
      const result = await markAllNotificationsRead();
      if (!result.ok) {
        setActionError(result.error);
        return;
      }
      setItems((list) => list.map((n) => ({ ...n, read: true })));
    } catch {
      setActionError('Could not update notifications. Please try again.');
    } finally {
      setMarkingAll(false);
    }
  };

  return (
    <div className='flex flex-col gap-4 md:gap-6'>
      <StatCards
        items={[
          {
            label: 'All Notifications',
            value: total,
            icon: BellIcon,
            badge: 'Inbox',
            title: 'Notifications received',
            note: 'Newest first',
          },
          {
            label: 'Unread',
            value: unread,
            icon: MailOpenIcon,
            badge: total ? `${Math.round((unread / total) * 100)}%` : '0%',
            title: unread === 0 ? 'You are all caught up' : 'Waiting for you',
            note: 'Click a notification to mark it as read',
          },
          {
            label: 'Schedule Updates',
            value: scheduleItems.length,
            icon: CalendarDaysIcon,
            badge: `${scheduleItems.filter((n) => !n.read).length} unread`,
            title: 'Schedule related notifications',
            note: 'Finalized, updated and new sessions',
          },
        ]}
      />

      <div className='flex flex-wrap items-center justify-between gap-3'>
        <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)}>
          <TabsList>
            <TabsTrigger value='all'>All ({total})</TabsTrigger>
            <TabsTrigger value='unread'>Unread ({unread})</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className='flex flex-wrap gap-2'>
          {pushState !== 'unsupported' && (
            <Button
              variant='outline'
              disabled={
                pushBusy ||
                pushState === 'checking' ||
                pushState === 'denied'
              }
              onClick={toggleBrowserNotifications}
            >
              {pushBusy ? (
                <Spinner />
              ) : pushState === 'enabled' ? (
                <BellRingIcon />
              ) : (
                <BellIcon />
              )}
              {pushState === 'enabled'
                ? 'Disable browser notifications'
                : 'Enable browser notifications'}
            </Button>
          )}
          <Button variant='outline' disabled={unread === 0 || markingAll} onClick={markAllRead}>
            {markingAll ? <Spinner /> : <CheckCheckIcon />}
            Mark all as read
          </Button>
        </div>
      </div>

      {pushState === 'denied' && (
        <p role='status' className='text-sm text-muted-foreground'>
          Browser notifications are blocked. Allow notifications for this site in your browser
          settings, then reload this page.
        </p>
      )}
      {pushState === 'unsupported' && (
        <p role='status' className='text-sm text-muted-foreground'>
          Browser push notifications are unavailable in this browser. Use a supported browser over
          HTTPS (localhost is supported for development).
        </p>
      )}
      {!vapidPublicKey && pushState !== 'unsupported' && (
        <p role='status' className='text-sm text-muted-foreground'>
          Add VAPID keys to the server environment to deliver browser notifications after
          permission is granted.
        </p>
      )}
      {actionError && (
        <p role='alert' className='text-sm text-destructive'>
          {actionError}
        </p>
      )}
      {!pusherConfig && (
        <p role='status' className='text-sm text-muted-foreground'>
          Real-time notifications are unavailable until Pusher is configured.
        </p>
      )}
      {realtimeError && (
        <p role='status' className='text-sm text-muted-foreground'>
          {realtimeError}
        </p>
      )}

      <Card>
        <CardContent className='p-0'>
          {visible.length === 0 ? (
            <div className='flex h-40 flex-col items-center justify-center gap-2 text-sm text-muted-foreground'>
              <BellIcon className='size-6' />
              {filter === 'unread' ? 'No unread notifications.' : 'No notifications.'}
            </div>
          ) : (
            <ul className='divide-y'>
              {visible.map((n) => {
                const Icon = typeIcon[n.type];
                return (
                  <li
                    key={n.id}
                    className={`flex items-start gap-3 px-4 py-3 ${n.read ? '' : 'bg-muted/40'}`}
                  >
                    <div className='mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg border bg-background'>
                      <Icon className='size-4' />
                    </div>
                    <div className='min-w-0 flex-1'>
                      <div className='flex items-center gap-2'>
                        {!n.read && (
                          <span
                            className='size-2 shrink-0 rounded-full bg-primary'
                            aria-label='Unread'
                          />
                        )}
                        <p
                          className={`truncate text-sm ${n.read ? 'font-normal' : 'font-semibold'}`}
                        >
                          {n.title}
                        </p>
                      </div>
                      <p className='text-sm text-muted-foreground'>{n.message}</p>
                      <p className='mt-1 text-xs text-muted-foreground tabular-nums'>
                        {formatDateTime(n.createdAt)}
                      </p>
                    </div>
                    <div className='flex shrink-0 gap-1'>
                      <Button
                        variant='ghost'
                        size='icon-sm'
                        disabled={busy?.id === n.id}
                        onClick={() => toggleRead(n.id)}
                        aria-label={n.read ? 'Mark as unread' : 'Mark as read'}
                        title={n.read ? 'Mark as unread' : 'Mark as read'}
                      >
                        {busy?.id === n.id && busy.action === 'read' ? (
                          <Spinner />
                        ) : n.read ? (
                          <MailOpenIcon />
                        ) : (
                          <CheckIcon />
                        )}
                      </Button>
                      <Button
                        variant='ghost'
                        size='icon-sm'
                        disabled={busy?.id === n.id}
                        onClick={() => remove(n.id)}
                        aria-label='Delete notification'
                        title='Delete'
                      >
                        {busy?.id === n.id && busy.action === 'delete' ? (
                          <Spinner />
                        ) : (
                          <Trash2Icon />
                        )}
                      </Button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
