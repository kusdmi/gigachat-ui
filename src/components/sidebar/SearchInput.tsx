import React from 'react';
import styles from './SearchInput.module.css';

const SearchInput: React.FC = () => {
  return (
    <div className={styles.search}>
      <input 
        type="text" 
        placeholder="Поиск чатов..." 
        className={styles.input}
      />
      <span className={styles.icon}>🔍</span>
    </div>
  );
};

export default SearchInput;