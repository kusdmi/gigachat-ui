export type MessageRole = 'user' | 'assistant';

/** Тип сообщения: id, role, content, timestamp */
export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
}
