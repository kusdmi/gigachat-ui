import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { act } from '@testing-library/react';
import { useChatStore, defaultAppSettings } from './useChatStore';

vi.mock('../api/gigachat', () => ({
  hasGigaChatCredentials: vi.fn(() => true),
  chatCompletion: vi.fn(() =>
    Promise.resolve({ content: 'Ответ модели', model: 'GigaChat' })
  ),
}));

function resetStore() {
  useChatStore.setState({
    chats: [],
    activeChatId: null,
    settings: { ...defaultAppSettings },
    searchQuery: '',
    loadingChatId: null,
    abortController: null,
    sendError: null,
  });
  localStorage.clear();
}

describe('useChatStore (логика ADD_MESSAGE / CREATE_CHAT / DELETE_CHAT / RENAME_CHAT)', () => {
  beforeEach(() => {
    resetStore();
  });

  afterEach(() => {
    resetStore();
  });

  it('CREATE_CHAT: создаёт чат с уникальным id и добавляет в начало списка', () => {
    const id1 = useChatStore.getState().createChat();
    const id2 = useChatStore.getState().createChat();
    expect(id1).not.toBe(id2);
    const chats = useChatStore.getState().chats;
    expect(chats).toHaveLength(2);
    expect(chats[0].id).toBe(id2);
    expect(chats[1].id).toBe(id1);
  });

  it('ADD_MESSAGE: после sendMessage сообщений на 2 больше (user + assistant), user в конце до ответа не проверяем — итог: последнее — assistant', async () => {
    useChatStore.getState().createChat();
    const chatId = useChatStore.getState().activeChatId;
    expect(chatId).toBeTruthy();

    await act(async () => {
      await useChatStore.getState().sendMessage('Привет');
    });

    const chat = useChatStore.getState().chats.find((c) => c.id === chatId);
    expect(chat?.messages).toHaveLength(2);
    expect(chat?.messages[0].role).toBe('user');
    expect(chat?.messages[0].content).toBe('Привет');
    expect(chat?.messages[1].role).toBe('assistant');
    expect(chat?.messages[1].content).toBe('Ответ модели');
  });

  it('DELETE_CHAT: удаляет чат; при удалении активного activeChatId переключается', () => {
    const id1 = useChatStore.getState().createChat();
    const id2 = useChatStore.getState().createChat();
    useChatStore.getState().selectChat(id1);

    useChatStore.getState().deleteChat(id1);
    expect(useChatStore.getState().chats.some((c) => c.id === id1)).toBe(false);
    expect(useChatStore.getState().activeChatId).toBe(id2);
  });

  it('RENAME_CHAT: обновляет название по id', () => {
    const id = useChatStore.getState().createChat();
    useChatStore.getState().renameChat(id, 'Мой чат');
    expect(useChatStore.getState().chats.find((c) => c.id === id)?.title).toBe(
      'Мой чат'
    );
  });
});
