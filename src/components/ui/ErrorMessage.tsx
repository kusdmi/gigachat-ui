import React from 'react';
import Button from './Button';
import styles from './ErrorMessage.module.css';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onRetry,
  onDismiss,
}) => {
  return (
    <div className={styles.error}>
      <span className={styles.icon}>⚠️</span>
      <span className={styles.text}>{message}</span>
      <div className={styles.actions}>
        {onRetry ? (
          <Button type="button" variant="secondary" size="sm" onClick={onRetry}>
            Повторить
          </Button>
        ) : null}
        {onDismiss ? (
          <Button type="button" variant="secondary" size="sm" onClick={onDismiss}>
            Закрыть
          </Button>
        ) : null}
      </div>
    </div>
  );
};

export default ErrorMessage;
