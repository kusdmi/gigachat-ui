import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
import styles from './Message.module.css';

const MessageMarkdownBodies = lazy(() => import('./MessageMarkdownBodies'));

interface MessageProps {
  variant: 'user' | 'assistant';
  content: string;
  timestamp?: number;
}

const formatTime = (ts: number) =>
  new Date(ts).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

const Message: React.FC<MessageProps> = ({ variant, content, timestamp }) => {
  const [isCopied, setIsCopied] = useState(false);
  const copyTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current !== null) {
        window.clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setIsCopied(true);
      if (copyTimeoutRef.current !== null) {
        window.clearTimeout(copyTimeoutRef.current);
      }
      copyTimeoutRef.current = window.setTimeout(() => {
        setIsCopied(false);
        copyTimeoutRef.current = null;
      }, 2000);
    } catch {
      setIsCopied(false);
    }
  };

  return (
    <div className={`${styles.message} ${styles[variant]}`}>
      {variant === 'assistant' && <div className={styles.avatar}>🤖</div>}
      <div className={styles.bubble}>
        <div className={styles.header}>
          <span className={styles.name}>
            {variant === 'user' ? 'Вы' : 'GigaChat'}
            {timestamp !== undefined && (
              <span className={styles.time}> · {formatTime(timestamp)}</span>
            )}
          </span>
          {variant === 'assistant' && (
            <button
              type="button"
              className={`${styles.copyBtn} ${isCopied ? styles.copyBtnCopied : ''}`}
              onClick={handleCopy}
              aria-label="Копировать сообщение"
            >
              {isCopied ? 'Скопировано' : 'Копировать'}
            </button>
          )}
        </div>
        <div className={styles.text}>
          <Suspense fallback={<span className={styles.markdownFallback}>Загрузка форматирования…</span>}>
            <MessageMarkdownBodies variant={variant} content={content} />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default Message;
