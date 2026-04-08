/**
 * Безопасный разбор JSON из localStorage (невалидная строка → fallback).
 */
export function safeJsonParse<T>(raw: string | null, fallback: T): T {
  if (raw == null || raw === '') {
    return fallback;
  }
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/**
 * Обёртка над localStorage для zustand/persist: «битый» JSON удаляется, приложение не падает.
 */
export function createSafeJsonLocalStorage(): Storage {
  return {
    get length() {
      return localStorage.length;
    },
    clear: () => localStorage.clear(),
    key: (index: number) => localStorage.key(index),
    getItem: (name: string) => {
      const raw = localStorage.getItem(name);
      if (raw == null) return null;
      try {
        JSON.parse(raw);
        return raw;
      } catch {
        localStorage.removeItem(name);
        return null;
      }
    },
    setItem: (name: string, value: string) => {
      localStorage.setItem(name, value);
    },
    removeItem: (name: string) => {
      localStorage.removeItem(name);
    },
  } as Storage;
}
