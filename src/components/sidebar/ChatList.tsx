import React, { useMemo } from 'react';
import ChatItem from './ChatItem';
import styles from './ChatList.module.css';
import { useChatStore } from '../../store/useChatStore';

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString(undefined, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

interface ChatListProps {
  onClose?: () => void;
}

const ChatList: React.FC<ChatListProps> = ({ onClose }) => {
  const chats = useChatStore((s) => s.chats);
  const searchQuery = useChatStore((s) => s.searchQuery);
  const activeChatId = useChatStore((s) => s.activeChatId);
  const selectChat = useChatStore((s) => s.selectChat);
  const deleteChat = useChatStore((s) => s.deleteChat);
  const renameChat = useChatStore((s) => s.renameChat);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return chats;
    return chats.filter((c) => c.title.toLowerCase().includes(q));
  }, [chats, searchQuery]);

  const handleEdit = (id: string, currentTitle: string) => {
    const next = window.prompt('Название чата', currentTitle);
    if (next && next.trim()) renameChat(id, next.trim());
  };

  return (
    <div className={styles.list}>
      {filtered.map((chat) => (
        <ChatItem
          key={chat.id}
          title={chat.title}
          lastMessageDate={formatDate(chat.updatedAt)}
          isActive={activeChatId === chat.id}
          onClick={() => {
            selectChat(chat.id);
            onClose?.();
          }}
          onEdit={(e) => {
            e.stopPropagation();
            handleEdit(chat.id, chat.title);
          }}
          onDelete={(e) => {
            e.stopPropagation();
            if (window.confirm('Удалить этот чат?')) {
              deleteChat(chat.id);
            }
          }}
        />
      ))}
    </div>
  );
};

export default ChatList;
