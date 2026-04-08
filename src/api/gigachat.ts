/** Клиент GigaChat REST API (OAuth + chat/completions). В dev используйте прокси Vite, см. vite.config.ts */

export interface GigaChatApiMessage {
  role: 'system' | 'user' | 'assistant' | 'function';
  content: string;
}

export interface ChatCompletionParams {
  model: string;
  messages: GigaChatApiMessage[];
  temperature?: number;
  top_p?: number;
  max_tokens?: number;
  stream?: boolean;
  signal?: AbortSignal;
}

export interface ChatCompletionResult {
  content: string;
  model?: string;
}

let tokenCache: { token: string; expiresAtMs: number } | null = null;

function normalizeAuthKey(raw: string | undefined): string {
  let key = raw?.trim() ?? '';
  if (key.toLowerCase().startsWith('basic ')) {
    key = key.slice(6).trim();
  }
  return key;
}

/** Прямые URL хостов Сбера — нужны в продакшене (GitHub Pages и т.д.), где нет dev-прокси Vite. */
const PROD_OAUTH_URL = 'https://ngw.devices.sberbank.ru:9443/api/v2/oauth';
const PROD_CHAT_URL =
  'https://gigachat.devices.sberbank.ru/api/v1/chat/completions';

function oauthUrl(): string {
  const fromEnv = import.meta.env.VITE_GIGACHAT_OAUTH_URL?.trim();
  if (fromEnv) return fromEnv;
  if (import.meta.env.DEV) return '/gigachat-oauth/api/v2/oauth';
  return PROD_OAUTH_URL;
}

function chatUrl(): string {
  const fromEnv = import.meta.env.VITE_GIGACHAT_CHAT_URL?.trim();
  if (fromEnv) return fromEnv;
  if (import.meta.env.DEV) return '/gigachat-api/api/v1/chat/completions';
  return PROD_CHAT_URL;
}

export function hasGigaChatCredentials(): boolean {
  return Boolean(normalizeAuthKey(import.meta.env.VITE_GIGACHAT_AUTH_KEY));
}

export async function getAccessToken(signal?: AbortSignal): Promise<string> {
  const authKey = normalizeAuthKey(import.meta.env.VITE_GIGACHAT_AUTH_KEY);
  if (!authKey) {
    throw new Error('Не задан VITE_GIGACHAT_AUTH_KEY в .env');
  }

  const now = Date.now();
  if (tokenCache && now < tokenCache.expiresAtMs - 60_000) {
    return tokenCache.token;
  }

  const scope = import.meta.env.VITE_GIGACHAT_SCOPE?.trim() || 'GIGACHAT_API_PERS';
  const rqUid = crypto.randomUUID();

  const res = await fetch(oauthUrl(), {
    method: 'POST',
    signal,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
      Authorization: `Basic ${authKey}`,
      RqUID: rqUid,
    },
    body: new URLSearchParams({ scope }).toString(),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`OAuth ${res.status}: ${errText.slice(0, 200)}`);
  }

  const data = (await res.json()) as {
    access_token: string;
    expires_at?: number;
    expires_in?: number;
  };

  const expiresAtMs = data.expires_at
    ? data.expires_at * 1000
    : now + (data.expires_in ?? 1700) * 1000;

  tokenCache = { token: data.access_token, expiresAtMs };
  return data.access_token;
}

export async function chatCompletion(params: ChatCompletionParams): Promise<ChatCompletionResult> {
  const token = await getAccessToken(params.signal);

  const body: Record<string, unknown> = {
    model: params.model,
    messages: params.messages,
    stream: params.stream ?? false,
  };
  if (params.temperature !== undefined) body.temperature = params.temperature;
  if (params.top_p !== undefined) body.top_p = params.top_p;
  if (params.max_tokens !== undefined) body.max_tokens = params.max_tokens;

  const res = await fetch(chatUrl(), {
    method: 'POST',
    signal: params.signal,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`GigaChat ${res.status}: ${errText.slice(0, 400)}`);
  }

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string; role?: string } }>;
    model?: string;
  };

  const content = data.choices?.[0]?.message?.content ?? '';
  return { content, model: data.model };
}
