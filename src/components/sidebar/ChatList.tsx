import React, { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
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

  const onSelect = useCallback(
    (id: string) => {
      selectChat(id);
      navigate(`/chat/${id}`);
      onClose?.();
    },
    [selectChat, navigate, onClose]
  );

  const onRename = useCallback(
    (id: string, currentTitle: string) => {
      const next = window.prompt('Название чата', currentTitle);
      if (next && next.trim()) renameChat(id, next.trim());
    },
    [renameChat]
  );

  const onDelete = useCallback(
    (id: string) => {
      if (window.confirm('Удалить этот чат?')) {
        deleteChat(id);
      }
    },
    [deleteChat]
  );

  return (
    <div className={styles.list}>
      {filtered.map((chat) => (
        <ChatItem
          key={chat.id}
          chatId={chat.id}
          title={chat.title}
          lastMessageDate={formatDate(chat.updatedAt)}
          isActive={activeChatId === chat.id}
          onSelect={onSelect}
          onRename={onRename}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default ChatList;
