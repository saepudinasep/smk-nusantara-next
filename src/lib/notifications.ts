import 'server-only';

import Pusher from 'pusher';
import webpush from 'web-push';

import type { NotificationType } from '@/lib/notification-types';
import { prisma } from '@/lib/prisma';

export type NewNotification = {
  type: NotificationType;
  title: string;
  message: string;
  userId: string;
};

const pusherConfig = {
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
};

const pusher =
  pusherConfig.appId && pusherConfig.key && pusherConfig.secret && pusherConfig.cluster
    ? new Pusher({
        appId: pusherConfig.appId,
        key: pusherConfig.key,
        secret: pusherConfig.secret,
        cluster: pusherConfig.cluster,
      })
    : null;

const vapidPublicKey = process.env.VAPID_PUBLIC_KEY;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
const vapidSubject = process.env.VAPID_SUBJECT;
const webPushReady = Boolean(vapidPublicKey && vapidPrivateKey && vapidSubject);

if (vapidPublicKey && vapidPrivateKey && vapidSubject) {
  webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);
}

export function getWebPushPublicKey() {
  if (!vapidPublicKey || !vapidPrivateKey || !vapidSubject) return null;
  return vapidPublicKey;
}

export function getPusherClientConfig() {
  if (!pusher || !pusherConfig.key || !pusherConfig.cluster) return null;
  return { key: pusherConfig.key, cluster: pusherConfig.cluster };
}

export function authorizeNotificationChannel(socketId: string, channelName: string) {
  if (!pusher) throw new Error('Pusher is not configured.');
  return pusher.authorizeChannel(socketId, channelName);
}

export async function createNotifications(notifications: NewNotification[]) {
  let created: {
    id: string;
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    createdAt: Date;
  }[];
  try {
    created = await Promise.all(
      notifications.map(({ userId, ...data }) =>
        prisma.notification.create({
          data: { ...data, userId },
          select: {
            id: true,
            userId: true,
            type: true,
            title: true,
            message: true,
            createdAt: true,
          },
        }),
      ),
    );
  } catch (error) {
    console.error('Failed to save notifications:', error);
    return;
  }

  if (!pusher) {
    if (created.length > 0) {
      console.error('Pusher is not configured; notifications were saved but not broadcast.');
    }
  } else {
    const results = await Promise.allSettled(
      created.map(({ userId, ...notification }) =>
        pusher.trigger(`private-notifications-${userId}`, 'notification:new', {
          ...notification,
          createdAt: notification.createdAt.toISOString(),
          read: false,
        }),
      ),
    );
    for (const result of results) {
      if (result.status === 'rejected') {
        console.error('Failed to broadcast a notification through Pusher:', result.reason);
      }
    }
  }

  if (!webPushReady) return;
  let subscriptions: { endpoint: string; p256dh: string; auth: string; userId: string }[];
  try {
    subscriptions = await prisma.pushSubscription.findMany({
      where: { userId: { in: notifications.map(({ userId }) => userId) } },
      select: { endpoint: true, p256dh: true, auth: true, userId: true },
    });
  } catch (error) {
    console.error('Failed to load browser push subscriptions:', error);
    return;
  }
  const pushResults = await Promise.allSettled(
    subscriptions.flatMap((subscription) =>
      notifications
        .filter((notification) => notification.userId === subscription.userId)
        .map(async (notification) => {
          try {
            await webpush.sendNotification(
              {
                endpoint: subscription.endpoint,
                keys: { p256dh: subscription.p256dh, auth: subscription.auth },
              },
              JSON.stringify({
                title: notification.title,
                body: notification.message,
                url: '/notifications',
              }),
            );
          } catch (error) {
            const statusCode =
              typeof error === 'object' && error !== null && 'statusCode' in error
                ? error.statusCode
                : undefined;
            if (statusCode === 404 || statusCode === 410) {
              await prisma.pushSubscription.deleteMany({
                where: { endpoint: subscription.endpoint },
              });
              return;
            }
            throw error;
          }
        }),
    ),
  );
  for (const result of pushResults) {
    if (result.status === 'rejected') {
      console.error('Failed to send a browser push notification:', result.reason);
    }
  }
}
