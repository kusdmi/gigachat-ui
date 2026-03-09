import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import styles from './Message.module.css';

interface MessageProps {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

const Message: React.FC<MessageProps> = ({ role, content }) => {
  const [showCopy, setShowCopy] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    // можно добавить уведомление
  };

  return (
    <div
      className={`${styles.message} ${styles[role]}`}
      onMouseEnter={() => setShowCopy(true)}
      onMouseLeave={() => setShowCopy(false)}
    >
      {role === 'assistant' && (
        <div className={styles.avatar}>🤖</div>
      )}
      <div className={styles.bubble}>
        <div className={styles.header}>
          <span className={styles.name}>
            {role === 'user' ? 'Вы' : 'GigaChat'}
          </span>
          {showCopy && (
            <button className={styles.copyBtn} onClick={handleCopy}>
              📋
            </button>
          )}
        </div>
        <div className={styles.text}>
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default Message;