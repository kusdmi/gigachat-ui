import React, { useState } from 'react';
import Button from '../ui/Button';
import styles from './InputArea.module.css';

interface InputAreaProps {
  onSend: (text: string) => void;
  onStop?: () => void;
  isLoading: boolean;
}

const InputArea: React.FC<InputAreaProps> = ({ onSend, onStop, isLoading }) => {
  const [input, setInput] = useState('');

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    onSend(trimmed);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const sendDisabled = !input.trim() || isLoading;

  return (
    <div className={styles.container}>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Введите сообщение..."
        rows={2}
        className={styles.textarea}
        disabled={isLoading}
      />
      <div className={styles.actions}>
        {isLoading ? (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className={styles.actionButton}
            onClick={() => onStop?.()}
          >
            Стоп
          </Button>
        ) : (
          <Button
            type="button"
            onClick={handleSend}
            disabled={sendDisabled}
            size="sm"
            className={styles.actionButton}
          >
            Отправить
          </Button>
        )}
      </div>
    </div>
  );
};

export default InputArea;
