import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import SearchInput from './SearchInput';
import ChatList from './ChatList';
import styles from './Sidebar.module.css';
import { useChatStore } from '../../store/useChatStore';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen = true, onClose }) => {
  const navigate = useNavigate();
  const createChat = useChatStore((s) => s.createChat);

  const handleNewChat = useCallback(() => {
    const id = createChat();
    navigate(`/chat/${id}`);
    onClose?.();
  }, [createChat, navigate, onClose]);

  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
      <div className={styles.header}>
        <Button variant="primary" size="sm" fullWidth onClick={handleNewChat}>
          + Новый чат
        </Button>
      </div>
      <SearchInput />
      <ChatList onClose={onClose} />
    </aside>
  );
};

export default Sidebar;
