import React, { useState } from 'react';
import styles from './ChatItem.module.css';

interface ChatItemProps {
  id: string;
  title: string;
  lastMessageDate: string;
  isActive: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onClick?: () => void;
}

const ChatItem: React.FC<ChatItemProps> = ({
  title,
  lastMessageDate,
  isActive,
  onEdit,
  onDelete,
  onClick
}) => {
  const [showActions, setShowActions] = useState(false);

  return (
    <div
      className={`${styles.item} ${isActive ? styles.active : ''}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      onClick={onClick}
    >
      <div className={styles.content}>
        <div className={styles.title}>{title}</div>
        <div className={styles.date}>{lastMessageDate}</div>
      </div>
      {showActions && (
        <div className={styles.actions}>
          <button onClick={onEdit} className={styles.editBtn}>✎</button>
          <button onClick={onDelete} className={styles.deleteBtn}>🗑</button>
        </div>
      )}
    </div>
  );
};

export default ChatItem;