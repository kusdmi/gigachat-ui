import React, { type RefObject } from 'react';
import MessageBubble from './Message';
import TypingIndicator from './TypingIndicator';
import EmptyState from './EmptyState';
import styles from './MessageList.module.css';
import type { Message } from '../../types/message';

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  messagesEndRef: RefObject<HTMLDivElement | null>;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  isLoading,
  messagesEndRef,
}) => {
  return (
    <div className={styles.list}>
      {messages.length === 0 && !isLoading ? (
        <EmptyState />
      ) : (
        messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            variant={msg.role}
            content={msg.content}
            timestamp={msg.timestamp}
          />
        ))
      )}
      <TypingIndicator isVisible={isLoading} />
      <div ref={messagesEndRef} aria-hidden="true" />
    </div>
  );
};

export default MessageList;
