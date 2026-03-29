/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GIGACHAT_AUTH_KEY: string | undefined;
  readonly VITE_GIGACHAT_SCOPE: string | undefined;
  readonly VITE_GIGACHAT_OAUTH_URL: string | undefined;
  readonly VITE_GIGACHAT_CHAT_URL: string | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
