import React, { useState, useRef, useEffect } from 'react';
import Button from '../ui/Button';
import styles from './InputArea.module.css';

const InputArea: React.FC = () => {
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
      if (input.trim()) {
        handleSend();
      }
    }
  };

  const handleSend = () => {
    console.log('Send:', input);
    setInput('');
  };

  return (
    <div className={styles.container}>
      <div className={styles.actions}>
        <button className={styles.attachBtn}>📎</button>
      </div>
      <textarea
        ref={textareaRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Введите сообщение..."
        rows={1}
        className={styles.textarea}
      />
      <div className={styles.actions}>
        <Button
          onClick={handleSend}
          disabled={!input.trim()}
          size="sm"
        >
          ➤
        </Button>
        <Button variant="secondary" size="sm">
          ⏹
        </Button>
      </div>
    </div>
  );
};

export default InputArea;