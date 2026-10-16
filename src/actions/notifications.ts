'use server';

import type { ActionResult } from '@/actions/result';
import { requireUser } from '@/lib/auth-guard';
import { prisma } from '@/lib/prisma';

export async function setNotificationRead(id: string, read: boolean): Promise<ActionResult> {
  const user = await requireUser();
  if (typeof id !== 'string' || !id || typeof read !== 'boolean') {
    return { ok: false, error: 'Invalid notification.' };
  }

  try {
    const result = await prisma.notification.updateMany({
      where: { id, userId: user.id },
      data: { readAt: read ? new Date() : null },
    });
    if (result.count === 0) return { ok: false, error: 'Notification not found.' };
    return { ok: true };
  } catch (error) {
    console.error(error);
    return { ok: false, error: 'Could not update notification. Please try again.' };
  }
}

export async function deleteNotification(id: string): Promise<ActionResult> {
  const user = await requireUser();
  if (typeof id !== 'string' || !id) return { ok: false, error: 'Invalid notification.' };

  try {
    const result = await prisma.notification.deleteMany({ where: { id, userId: user.id } });
    if (result.count === 0) return { ok: false, error: 'Notification not found.' };
    return { ok: true };
  } catch (error) {
    console.error(error);
    return { ok: false, error: 'Could not delete notification. Please try again.' };
  }
}

export async function markAllNotificationsRead(): Promise<ActionResult> {
  const user = await requireUser();

  try {
    await prisma.notification.updateMany({
      where: { userId: user.id, readAt: null },
      data: { readAt: new Date() },
    });
    return { ok: true };
  } catch (error) {
    console.error(error);
    return { ok: false, error: 'Could not update notifications. Please try again.' };
  }
}

export async function savePushSubscription(input: unknown): Promise<ActionResult> {
  const user = await requireUser();
  if (typeof input !== 'object' || input === null) {
    return { ok: false, error: 'Invalid browser subscription.' };
  }

  const endpoint = 'endpoint' in input ? input.endpoint : undefined;
  const keys = 'keys' in input ? input.keys : undefined;
  const p256dh =
    typeof keys === 'object' && keys !== null && 'p256dh' in keys ? keys.p256dh : undefined;
  const auth =
    typeof keys === 'object' && keys !== null && 'auth' in keys ? keys.auth : undefined;
  if (
    typeof endpoint !== 'string' ||
    endpoint.length > 2048 ||
    !endpoint.startsWith('https://') ||
    typeof p256dh !== 'string' ||
    p256dh.length > 512 ||
    typeof auth !== 'string' ||
    auth.length > 512
  ) {
    return { ok: false, error: 'Invalid browser subscription.' };
  }

  try {
    const existing = await prisma.pushSubscription.findUnique({
      where: { endpoint },
      select: { userId: true },
    });
    if (existing && existing.userId !== user.id) {
      return { ok: false, error: 'This browser subscription is already registered.' };
    }
    await prisma.pushSubscription.upsert({
      where: { endpoint },
      create: { userId: user.id, endpoint, p256dh, auth },
      update: { p256dh, auth },
    });
    return { ok: true };
  } catch (error) {
    console.error(error);
    return { ok: false, error: 'Could not enable browser notifications. Please try again.' };
  }
}

export async function removePushSubscription(endpoint: string): Promise<ActionResult> {
  const user = await requireUser();
  if (typeof endpoint !== 'string' || !endpoint.startsWith('https://')) {
    return { ok: false, error: 'Invalid browser subscription.' };
  }

  try {
    await prisma.pushSubscription.deleteMany({ where: { endpoint, userId: user.id } });
    return { ok: true };
  } catch (error) {
    console.error(error);
    return { ok: false, error: 'Could not disable browser notifications. Please try again.' };
  }
}
