import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { chatCompletion, hasGigaChatCredentials } from '../api/gigachat';
import { createSafeJsonLocalStorage } from '../utils/storage';
import type { Message } from '../types/message';
import type { AppSettings, ChatSession } from '../types/chat';

export const defaultAppSettings: AppSettings = {
  model: 'GigaChat',
  temperature: 0.7,
  topP: 0.9,
  maxTokens: 2048,
  systemPrompt: 'Ты полезный ассистент.',
};

function emptyChat(): ChatSession {
  const now = Date.now();
  return {
    id: crypto.randomUUID(),
    title: 'Новый чат',
    messages: [],
    createdAt: now,
    updatedAt: now,
  };
}

interface ChatStoreState {
  chats: ChatSession[];
  activeChatId: string | null;
  settings: AppSettings;
  searchQuery: string;
  loadingChatId: string | null;
  abortController: AbortController | null;
}

interface ChatStoreActions {
  setSearchQuery: (q: string) => void;
  updateSettings: (partial: Partial<AppSettings>) => void;
  resetSettings: () => void;
  createChat: () => string;
  deleteChat: (id: string) => void;
  selectChat: (id: string) => void;
  renameChat: (id: string, title: string) => void;
  sendMessage: (text: string) => Promise<void>;
  stopGeneration: () => void;
}

type ChatStore = ChatStoreState & ChatStoreActions;

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      chats: [],
      activeChatId: null,
      settings: { ...defaultAppSettings },
      searchQuery: '',
      loadingChatId: null,
      abortController: null,

      setSearchQuery: (q) => set({ searchQuery: q }),

      updateSettings: (partial) =>
        set((s) => ({
          settings: { ...s.settings, ...partial },
        })),

      resetSettings: () => set({ settings: { ...defaultAppSettings } }),

      createChat: () => {
        const chat = emptyChat();
        set((s) => ({
          chats: [chat, ...s.chats],
          activeChatId: chat.id,
        }));
        return chat.id;
      },

      deleteChat: (id) => {
        set((s) => {
          const chats = s.chats.filter((c) => c.id !== id);
          let activeChatId = s.activeChatId;
          if (activeChatId === id) {
            activeChatId = chats[0]?.id ?? null;
          }
          if (chats.length === 0) {
            const nc = emptyChat();
            return {
              chats: [nc],
              activeChatId: nc.id,
            };
          }
          return { chats, activeChatId };
        });
      },

      selectChat: (id) => set({ activeChatId: id }),

      renameChat: (id, title) =>
        set((s) => ({
          chats: s.chats.map((c) =>
            c.id === id ? { ...c, title, updatedAt: Date.now() } : c
          ),
        })),

      stopGeneration: () => {
        const { abortController } = get();
        abortController?.abort();
      },

      sendMessage: async (rawText: string) => {
        const text = rawText.trim();
        if (!text) return;

        const state = get();
        const chatId = state.activeChatId;
        if (!chatId) return;
        if (state.loadingChatId) return;

        const chat = state.chats.find((c) => c.id === chatId);
        if (!chat) return;

        const userMessage: Message = {
          id: crypto.randomUUID(),
          role: 'user',
          content: text,
          timestamp: Date.now(),
        };

        const newMessages = [...chat.messages, userMessage];
        const newTitle =
          chat.title === 'Новый чат' && chat.messages.length === 0
            ? text.slice(0, 48) + (text.length > 48 ? '…' : '')
            : chat.title;

        const abortController = new AbortController();

        set((s) => ({
          chats: s.chats.map((c) =>
            c.id === chatId
              ? {
                  ...c,
                  messages: newMessages,
                  title: newTitle,
                  updatedAt: Date.now(),
                }
              : c
          ),
          loadingChatId: chatId,
          abortController,
        }));

        const { settings } = get();

        const apiMessages: { role: 'system' | 'user' | 'assistant'; content: string }[] =
          [];
        if (settings.systemPrompt.trim()) {
          apiMessages.push({
            role: 'system',
            content: settings.systemPrompt.trim(),
          });
        }
        for (const m of newMessages) {
          apiMessages.push({ role: m.role, content: m.content });
        }

        const pushAssistant = (content: string) => {
          const assistantMessage: Message = {
            id: crypto.randomUUID(),
            role: 'assistant',
            content,
            timestamp: Date.now(),
          };
          set((s) => ({
            chats: s.chats.map((c) =>
              c.id === chatId
                ? {
                    ...c,
                    messages: [...c.messages, assistantMessage],
                    updatedAt: Date.now(),
                  }
                : c
            ),
            loadingChatId: null,
            abortController: null,
          }));
        };

        const clearLoading = () =>
          set({ loadingChatId: null, abortController: null });

        if (!hasGigaChatCredentials()) {
          pushAssistant(
            'Ошибка: не задан ключ авторизации. Создайте файл `.env` в корне проекта и добавьте `VITE_GIGACHAT_AUTH_KEY` (Authorization Basic из личного кабинета разработчика Сбера). Шаблон — в `.env.example`.'
          );
          return;
        }

        try {
          const { content } = await chatCompletion({
            model: settings.model,
            messages: apiMessages,
            temperature: settings.temperature,
            top_p: settings.topP,
            max_tokens: settings.maxTokens,
            signal: abortController.signal,
          });
          pushAssistant(content || '(пустой ответ)');
        } catch (err) {
          if (err instanceof DOMException && err.name === 'AbortError') {
            clearLoading();
            return;
          }
          const msg =
            err instanceof Error ? err.message : String(err);
          pushAssistant(`Ошибка запроса к GigaChat:\n\n${msg}`);
        }
      },
    }),
    {
      name: 'gigachat-ui-storage',
      storage: createJSONStorage(() => createSafeJsonLocalStorage()),
      partialize: (s) => ({
        chats: s.chats,
        activeChatId: s.activeChatId,
        settings: s.settings,
      }),
    }
  )
);

export function ensureChatExists(): void {
  const { chats, activeChatId, createChat } = useChatStore.getState();
  if (chats.length === 0) {
    createChat();
    return;
  }
  if (!activeChatId || !chats.some((c) => c.id === activeChatId)) {
    useChatStore.setState({ activeChatId: chats[0].id });
  }
}
