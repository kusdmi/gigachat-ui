import React, { useCallback, useEffect, useRef } from 'react';
import MessageList from './MessageList';
import InputArea from './InputArea';
import Button from '../ui/Button';
import { ErrorBoundary } from '../ErrorBoundary';
import styles from './ChatWindow.module.css';
import { useChatStore } from '../../store/useChatStore';

interface ChatWindowProps {
  onOpenSettings?: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ onOpenSettings }) => {
  const messages = useChatStore((s) => {
    const id = s.activeChatId;
    if (!id) return [];
    return s.chats.find((c) => c.id === id)?.messages ?? [];
  });
  const isLoading = useChatStore((s) => {
    const id = s.activeChatId;
    return id !== null && s.loadingChatId === id;
  });
  const activeTitle = useChatStore((s) => {
    const id = s.activeChatId;
    if (!id) return 'Чат';
    return s.chats.find((c) => c.id === id)?.title ?? 'Чат';
  });
  const sendMessage = useChatStore((s) => s.sendMessage);
  const stopGeneration = useChatStore((s) => s.stopGeneration);
  const sendError = useChatStore((s) => s.sendError);
  const retryCompletion = useChatStore((s) => s.retryCompletion);
  const clearSendError = useChatStore((s) => s.clearSendError);

  const handleSend = useCallback(
    (text: string) => {
      void sendMessage(text);
    },
    [sendMessage]
  );

  const handleStop = useCallback(() => {
    stopGeneration();
  }, [stopGeneration]);

  const handleRetry = useCallback(() => {
    void retryCompletion();
  }, [retryCompletion]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className={styles.window}>
      <div className={styles.header}>
        <h2 className={styles.title}>{activeTitle}</h2>
        {onOpenSettings && (
          <Button
            variant="secondary"
            size="sm"
            onClick={onOpenSettings}
            className={styles.desktopSettingsButton}
          >
            ⚙️ Настройки
          </Button>
        )}
      </div>
      <ErrorBoundary>
        <MessageList
          messages={messages}
          isLoading={isLoading}
          messagesEndRef={messagesEndRef}
        />
      </ErrorBoundary>
      <InputArea
        onSend={handleSend}
        onStop={handleStop}
        isLoading={isLoading}
        sendError={sendError}
        onRetry={sendError ? handleRetry : undefined}
        onDismissError={clearSendError}
      />
    </div>
  );
};

export default ChatWindow;
