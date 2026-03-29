import React, { useEffect, useRef } from 'react';
import MessageList from './MessageList';
import InputArea from './InputArea';
import Button from '../ui/Button';
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
      <MessageList
        messages={messages}
        isLoading={isLoading}
        messagesEndRef={messagesEndRef}
      />
      <InputArea
        onSend={sendMessage}
        onStop={stopGeneration}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ChatWindow;
