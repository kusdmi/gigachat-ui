import React, { useState } from 'react';
import styles from './ChatItem.module.css';

interface ChatItemProps {
  title: string;
  lastMessageDate: string;
  isActive: boolean;
  onEdit?: (e: React.MouseEvent) => void;
  onDelete?: (e: React.MouseEvent) => void;
  onClick?: () => void;
}

const ChatItem: React.FC<ChatItemProps> = ({
  title,
  lastMessageDate,
  isActive,
  onEdit,
  onDelete,
  onClick,
}) => {
  const [showActions, setShowActions] = useState(false);

  return (
    <div
      className={`${styles.item} ${isActive ? styles.active : ''}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
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
            onClick={onEdit}
            className={styles.editBtn}
            aria-label="Переименовать"
          >
            ✎
          </button>
          <button
            type="button"
            onClick={onDelete}
            className={styles.deleteBtn}
            aria-label="Удалить"
          >
            🗑
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatItem;
