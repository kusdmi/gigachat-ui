import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Message from './Message';
import styles from './Message.module.css';

describe('Message', () => {
  it('variant=user: текст и класс пользователя', () => {
    const { container } = render(
      <Message variant="user" content="Текст пользователя" />
    );
    expect(screen.getByText('Текст пользователя')).toBeInTheDocument();
    expect(container.querySelector(`.${styles.user}`)).toBeTruthy();
    expect(
      screen.queryByRole('button', { name: /копировать/i })
    ).not.toBeInTheDocument();
  });

  it('variant=assistant: текст, класс ассистента и кнопка «Копировать»', () => {
    const { container } = render(
      <Message variant="assistant" content="Ответ **бота**" />
    );
    expect(screen.getByText('GigaChat')).toBeInTheDocument();
    expect(container.querySelector(`.${styles.assistant}`)).toBeTruthy();
    expect(
      screen.getByRole('button', { name: /копировать сообщение/i })
    ).toBeInTheDocument();
  });
});
