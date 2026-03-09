import React from 'react';
import Message from './Message';
import TypingIndicator from './TypingIndicator';
import styles from './MessageList.module.css';

// Моковые сообщения
const mockMessages = [
  { role: 'user', content: 'Привет, как дела?' },
  { role: 'assistant', content: 'Привет! Я GigaChat. Чем могу помочь?' },
  { role: 'user', content: 'Расскажи про React и TypeScript' },
  { role: 'assistant', content: 'React и TypeScript отлично сочетаются. Вот пример компонента:\n\n```tsx\ninterface Props {\n  name: string;\n}\n\nconst Greeting: React.FC<Props> = ({ name }) => <div>Hello, {name}</div>;\n```' },
  { role: 'user', content: 'А как использовать markdown?' },
  { role: 'assistant', content: '**Markdown** позволяет делать *курсив*, списки и код.' },
];

const MessageList: React.FC = () => {
  return (
    <div className={styles.list}>
      {mockMessages.map((msg, index) => (
        <Message
          key={index}
          role={msg.role as 'user' | 'assistant'}
          content={msg.content}
        />
      ))}
      <TypingIndicator isVisible={true} />
    </div>
  );
};

export default MessageList;