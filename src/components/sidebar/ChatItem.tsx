import React, { memo, useCallback, useState } from 'react';
import styles from './ChatItem.module.css';

export interface ChatItemProps {
  chatId: string;
  title: string;
  lastMessageDate: string;
  isActive: boolean;
  onSelect: (id: string) => void;
  onRename: (id: string, currentTitle: string) => void;
  onDelete: (id: string) => void;
}

function ChatItemInner({
  chatId,
  title,
  lastMessageDate,
  isActive,
  onSelect,
  onRename,
  onDelete,
}: ChatItemProps) {
  const [showActions, setShowActions] = useState(false);

  const handleClick = useCallback(() => {
    onSelect(chatId);
  }, [onSelect, chatId]);

  const handleEdit = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onRename(chatId, title);
    },
    [onRename, chatId, title]
  );

  const handleDeleteClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onDelete(chatId);
    },
    [onDelete, chatId]
  );

  return (
    <div
      className={`${styles.item} ${isActive ? styles.active : ''}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      role="button"
      tabIndex={0}
    >
      <div className={styles.content}>
        <div className={styles.title}>{title}</div>
        <div className={styles.date}>{lastMessageDate}</div>
      </div>
      {showActions && (
        <div className={styles.actions}>
          <button
            type="button"
            onClick={handleEdit}
            className={styles.editBtn}
            aria-label="Переименовать"
          >
            ✎
          </button>
          <button
            type="button"
            onClick={handleDeleteClick}
            className={styles.deleteBtn}
            aria-label="Удалить"
          >
            🗑
          </button>
        </div>
      )}
    </div>
  );
}

const ChatItem = memo(ChatItemInner);
export default ChatItem;
