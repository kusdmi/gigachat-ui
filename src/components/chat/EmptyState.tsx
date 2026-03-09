import React from 'react';
import styles from './EmptyState.module.css';

const EmptyState: React.FC = () => {
  return (
    <div className={styles.empty}>
      <div className={styles.icon}>💬</div>
      <p className={styles.text}>Начните новый диалог</p>
    </div>
  );
};

export default EmptyState;