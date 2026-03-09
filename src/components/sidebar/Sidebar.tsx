import React from 'react';
import Button from '../ui/Button';
import SearchInput from './SearchInput';
import ChatList from './ChatList';
import styles from './Sidebar.module.css';

interface SidebarProps {
  isOpen?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen = true }) => {
  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
      <div className={styles.header}>
        <Button variant="primary" size="sm" fullWidth>
          + Новый чат
        </Button>
      </div>
      <SearchInput />
      <ChatList />
    </aside>
  );
};

export default Sidebar;