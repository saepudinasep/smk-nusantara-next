import { auth } from '@/auth';
import { authorizeNotificationChannel } from '@/lib/notifications';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) return new Response('Unauthorized', { status: 401 });

  const formData = await request.formData();
  const socketId = formData.get('socket_id');
  const channelName = formData.get('channel_name');

  if (
    typeof socketId !== 'string' ||
    typeof channelName !== 'string' ||
    channelName !== `private-notifications-${session.user.id}`
  ) {
    return new Response('Forbidden', { status: 403 });
  }

  try {
    return Response.json(authorizeNotificationChannel(socketId, channelName));
  } catch (error) {
    console.error('Pusher channel authorization failed:', error);
    return new Response('Pusher is not configured.', { status: 503 });
  }
}
