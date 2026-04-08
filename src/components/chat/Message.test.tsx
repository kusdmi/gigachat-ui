import { describe, it, expect } from 'vitest';
import { Suspense } from 'react';
import { render, screen } from '@testing-library/react';
import Message from './Message';
import styles from './Message.module.css';

describe('Message', () => {
  it('variant=user: текст и класс пользователя', async () => {
    const { container } = render(
      <Suspense fallback={null}>
        <Message variant="user" content="Текст пользователя" />
      </Suspense>
    );
    expect(
      await screen.findByText('Текст пользователя')
    ).toBeInTheDocument();
    expect(container.querySelector(`.${styles.user}`)).toBeTruthy();
    expect(
      screen.queryByRole('button', { name: /копировать/i })
    ).not.toBeInTheDocument();
  });

  it('variant=assistant: текст, класс ассистента и кнопка «Копировать»', async () => {
    const { container } = render(
      <Suspense fallback={null}>
        <Message variant="assistant" content="Ответ **бота**" />
      </Suspense>
    );
    expect(await screen.findByText('GigaChat')).toBeInTheDocument();
    expect(container.querySelector(`.${styles.assistant}`)).toBeTruthy();
    expect(
      screen.getByRole('button', { name: /копировать сообщение/i })
    ).toBeInTheDocument();
    expect(await screen.findByText('бота')).toBeInTheDocument();
  });
});
