import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import styles from './Message.module.css';

interface MessageProps {
  variant: 'user' | 'assistant';
  content: string;
  timestamp?: number;
}

const formatTime = (ts: number) =>
  new Date(ts).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

const Message: React.FC<MessageProps> = ({ variant, content, timestamp }) => {
  const [showCopy, setShowCopy] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
  };

  return (
    <div
      className={`${styles.message} ${styles[variant]}`}
      onMouseEnter={() => setShowCopy(true)}
      onMouseLeave={() => setShowCopy(false)}
    >
      {variant === 'assistant' && (
        <div className={styles.avatar}>🤖</div>
      )}
      <div className={styles.bubble}>
        <div className={styles.header}>
          <span className={styles.name}>
            {variant === 'user' ? 'Вы' : 'GigaChat'}
            {timestamp !== undefined && (
              <span className={styles.time}> · {formatTime(timestamp)}</span>
            )}
          </span>
          {showCopy && (
            <button type="button" className={styles.copyBtn} onClick={handleCopy}>
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
