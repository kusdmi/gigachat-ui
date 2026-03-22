import React, { useCallback, useEffect, useRef } from 'react';
import MessageList from './MessageList';
import InputArea from './InputArea';
import Button from '../ui/Button';
import styles from './ChatWindow.module.css';
import type { ChatMessage } from '../../types/chat';

interface ChatWindowProps {
  onOpenSettings?: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ onOpenSettings }) => {
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const replyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const awaitingAssistantRef = useRef(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    return () => {
      if (replyTimeoutRef.current !== null) {
        clearTimeout(replyTimeoutRef.current);
      }
    };
  }, []);

  const handleSend = useCallback((content: string) => {
    const trimmed = content.trim();
    if (!trimmed || awaitingAssistantRef.current) return;
    awaitingAssistantRef.current = true;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: trimmed,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    if (replyTimeoutRef.current !== null) {
      clearTimeout(replyTimeoutRef.current);
    }

    const delayMs = 1000 + Math.random() * 1000;
    replyTimeoutRef.current = window.setTimeout(() => {
      replyTimeoutRef.current = null;
      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content:
          'Это демо-ответ. Вы написали: «' +
          trimmed +
          '». В реальном приложении здесь был бы ответ модели.',
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
      awaitingAssistantRef.current = false;
    }, delayMs);
  }, []);

  return (
    <div className={styles.window}>
      <div className={styles.header}>
        <h2 className={styles.title}>Текущий чат: Обсуждение проекта</h2>
        {/* Кнопка настроек видна только на десктопе */}
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
      <InputArea onSend={handleSend} isLoading={isLoading} />
    </div>
  );
};

export default ChatWindow;
