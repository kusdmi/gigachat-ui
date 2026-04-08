import React from 'react';
import styles from './SearchInput.module.css';
import { useChatStore } from '../../store/useChatStore';

const SearchInput: React.FC = () => {
  const searchQuery = useChatStore((s) => s.searchQuery);
  const setSearchQuery = useChatStore((s) => s.setSearchQuery);

  return (
    <div className={styles.search}>
      <input
        type="text"
        placeholder="Поиск чатов..."
        className={styles.input}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <span className={styles.icon}>🔍</span>
    </div>
  );
};

export default SearchInput;
