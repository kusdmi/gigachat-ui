import React, { useState } from 'react';
import ChatItem from './ChatItem';
import styles from './ChatList.module.css';

// Моковые данные
const mockChats = [
  { id: '1', title: 'Обсуждение проекта', lastMessageDate: '12.03.2025' },
  { id: '2', title: 'Помощь с кодом на TypeScript', lastMessageDate: '11.03.2025' },
  { id: '3', title: 'Идеи для стартапа', lastMessageDate: '10.03.2025' },
  { id: '4', title: 'Перевод текста', lastMessageDate: '09.03.2025' },
  { id: '5', title: 'Рецепты на ужин', lastMessageDate: '08.03.2025' },
];

const ChatList: React.FC = () => {
  const [activeChat, setActiveChat] = useState('1');

  const handleEdit = (id: string) => {
    console.log('Edit chat', id);
  };

  const handleDelete = (id: string) => {
    console.log('Delete chat', id);
  };

  return (
    <div className={styles.list}>
      {mockChats.map(chat => (
        <ChatItem
          key={chat.id}
          id={chat.id}
          title={chat.title}
          lastMessageDate={chat.lastMessageDate}
          isActive={activeChat === chat.id}
          onClick={() => setActiveChat(chat.id)}
          onEdit={() => handleEdit(chat.id)}
          onDelete={() => handleDelete(chat.id)}
        />
      ))}
    </div>
  );
};

export default ChatList;