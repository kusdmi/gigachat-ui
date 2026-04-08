import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { safeJsonParse, createSafeJsonLocalStorage } from './storage';

describe('safeJsonParse', () => {
  it('возвращает распарсенный объект для валидного JSON', () => {
    expect(safeJsonParse('{"a":1}', {})).toEqual({ a: 1 });
  });

  it('возвращает fallback при невалидном JSON', () => {
    const fb = { x: 0 };
    expect(safeJsonParse('{', fb)).toEqual(fb);
    expect(safeJsonParse('not json', fb)).toEqual(fb);
  });

  it('возвращает fallback при null или пустой строке', () => {
    expect(safeJsonParse(null, [])).toEqual([]);
    expect(safeJsonParse('', 'def')).toBe('def');
  });
});

describe('createSafeJsonLocalStorage + persist', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('setItem/getItem сохраняют валидные данные', () => {
    const storage = createSafeJsonLocalStorage();
    storage.setItem('k', '{"ok":true}');
    expect(storage.getItem('k')).toBe('{"ok":true}');
  });

  it('getItem возвращает null и удаляет ключ при битом JSON', () => {
    const storage = createSafeJsonLocalStorage();
    localStorage.setItem('bad', '{');
    expect(storage.getItem('bad')).toBeNull();
    expect(localStorage.getItem('bad')).toBeNull();
  });

  it('при изменении стора zustand пишет в localStorage', async () => {
    const setItem = vi.spyOn(Storage.prototype, 'setItem');
    const { useChatStore } = await import('../store/useChatStore');
    useChatStore.getState().createChat();
    expect(setItem).toHaveBeenCalled();
  });

  it('после setState в zustand в localStorage попадает сериализуемое состояние', async () => {
    const { useChatStore, defaultAppSettings } = await import(
      '../store/useChatStore'
    );
    useChatStore.setState({
      chats: [
        {
          id: 'id-1',
          title: 'Из storage',
          messages: [],
          createdAt: 1,
          updatedAt: 1,
        },
      ],
      activeChatId: 'id-1',
      settings: { ...defaultAppSettings },
      searchQuery: '',
      loadingChatId: null,
      abortController: null,
    });
    await Promise.resolve();
    const raw = localStorage.getItem('gigachat-ui-storage');
    expect(raw).toBeTruthy();
    const parsed = safeJsonParse(raw!, null as unknown);
    expect(parsed).toBeTruthy();
    expect(
      (parsed as { state?: { chats?: { title?: string }[] } }).state?.chats?.[0]
        ?.title
    ).toBe('Из storage');
  });
});
