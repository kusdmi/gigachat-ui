import React from 'react';
import MessageList from './MessageList';
import InputArea from './InputArea';
import Button from '../ui/Button';
import styles from './ChatWindow.module.css';

interface ChatWindowProps {
  onOpenSettings?: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ onOpenSettings }) => {
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
      <MessageList />
      <InputArea />
    </div>
  );
};

export default ChatWindow;