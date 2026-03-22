import React, { useState, useRef, useEffect } from 'react';
import Button from '../ui/Button';
import styles from './InputArea.module.css';

interface InputAreaProps {
  onSend: (text: string) => void;
  isLoading: boolean;
}

const InputArea: React.FC<InputAreaProps> = ({ onSend, isLoading }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isLoading) {
        handleSend();
      }
    }
  };

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    onSend(trimmed);
    setInput('');
  };

  const disabled = !input.trim() || isLoading;

  return (
    <div className={styles.container}>
      <div className={styles.actions}>
        <button type="button" className={styles.attachBtn} disabled={isLoading}>
          📎
        </button>
      </div>
      <textarea
        ref={textareaRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Введите сообщение..."
        rows={1}
        className={styles.textarea}
        disabled={isLoading}
      />
      <div className={styles.actions}>
        <Button onClick={handleSend} disabled={disabled} size="sm">
          ➤
        </Button>
        <Button variant="secondary" size="sm" disabled={isLoading}>
          ⏹
        </Button>
      </div>
    </div>
  );
};

export default InputArea;
