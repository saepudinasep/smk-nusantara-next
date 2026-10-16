import 'server-only';

import arcjet, { detectBot, shield } from '@arcjet/next';
import type { NextRequest } from 'next/server';

const client = process.env.ARCJET_KEY
  ? arcjet({
      key: process.env.ARCJET_KEY,
      rules: [
        shield({ mode: 'LIVE' }),
        detectBot({ mode: 'LIVE', allow: [] }),
      ],
    })
  : null;

let missingKeyWarningLogged = false;

export async function protectRequest(request: NextRequest): Promise<Response | null> {
  if (!client) {
    if (process.env.NODE_ENV === 'production') {
      return new Response('Bot protection is not configured.', { status: 503 });
    }
    if (!missingKeyWarningLogged) {
      console.error('ARCJET_KEY is missing; Arcjet protection is disabled in this environment.');
      missingKeyWarningLogged = true;
    }
    return null;
  }

  try {
    const decision = await client.protect(request);
    if (decision.isDenied()) {
      console.warn('Arcjet denied request:', {
        id: decision.id,
        reason: decision.reason.toString(),
      });
      return new Response('Forbidden', { status: 403 });
    }
    return null;
  } catch (error) {
    console.error('Arcjet request protection failed:', error);
    if (process.env.NODE_ENV === 'production') {
      return new Response('Request protection is temporarily unavailable.', { status: 503 });
    }
    return null;
  }
}
