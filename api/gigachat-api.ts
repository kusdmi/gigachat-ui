import type { VercelRequest, VercelResponse } from '@vercel/node';

const UPSTREAM = 'https://gigachat.devices.sberbank.ru/api/v1/chat/completions';

function bodyForUpstream(req: VercelRequest): string | undefined {
  if (req.method === 'GET' || req.method === 'HEAD') return undefined;
  if (typeof req.body === 'string') return req.body;
  if (req.body && typeof req.body === 'object' && !Buffer.isBuffer(req.body)) {
    return JSON.stringify(req.body);
  }
  if (Buffer.isBuffer(req.body)) return req.body.toString('utf8');
  return undefined;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).setHeader('Allow', 'POST').end('Method Not Allowed');
    return;
  }

  const auth = req.headers.authorization;
  const authVal = Array.isArray(auth) ? auth[0] : auth;

  const r = await fetch(UPSTREAM, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(authVal ? { Authorization: authVal } : {}),
    },
    body: bodyForUpstream(req),
  });

  const text = await r.text();
  res.status(r.status);
  const ct = r.headers.get('content-type');
  if (ct) res.setHeader('Content-Type', ct);
  res.end(text);
}
