import type { VercelRequest, VercelResponse } from '@vercel/node';

const UPSTREAM = 'https://ngw.devices.sberbank.ru:9443/api/v2/oauth';

function bodyForUpstream(req: VercelRequest): string | undefined {
  if (req.method === 'GET' || req.method === 'HEAD') return undefined;
  if (typeof req.body === 'string') return req.body;
  if (req.body && typeof req.body === 'object' && !Buffer.isBuffer(req.body)) {
    return new URLSearchParams(req.body as Record<string, string>).toString();
  }
  if (Buffer.isBuffer(req.body)) return req.body.toString('utf8');
  return undefined;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).setHeader('Allow', 'POST').end('Method Not Allowed');
    return;
  }

  const body = bodyForUpstream(req);
  const rq = req.headers['rquid'];
  const rqUid = Array.isArray(rq) ? rq[0] : rq;

  const r = await fetch(UPSTREAM, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
      ...(req.headers.authorization
        ? { Authorization: Array.isArray(req.headers.authorization) ? req.headers.authorization[0] : req.headers.authorization }
        : {}),
      ...(rqUid ? { RqUID: rqUid } : {}),
    },
    body,
  });

  const text = await r.text();
  res.status(r.status);
  const ct = r.headers.get('content-type');
  if (ct) res.setHeader('Content-Type', ct);
  res.end(text);
}
