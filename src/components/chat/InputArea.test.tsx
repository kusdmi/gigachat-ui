import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import InputArea from './InputArea';

describe('InputArea', () => {
  it('при непустом вводе и клике «Отправить» вызывает onSend с текстом', async () => {
    const onSend = vi.fn();
    const user = userEvent.setup();
    render(<InputArea onSend={onSend} isLoading={false} />);

    await user.type(screen.getByRole('textbox'), 'Привет мир');
    await user.click(screen.getByRole('button', { name: 'Отправить' }));

    expect(onSend).toHaveBeenCalledTimes(1);
    expect(onSend).toHaveBeenCalledWith('Привет мир');
  });

  it('при Enter без Shift вызывает onSend при непустом вводе', async () => {
    const onSend = vi.fn();
    const user = userEvent.setup();
    render(<InputArea onSend={onSend} isLoading={false} />);

    const box = screen.getByRole('textbox');
    await user.type(box, 'Тест{Enter}');

    expect(onSend).toHaveBeenCalledWith('Тест');
  });

  it('кнопка «Отправить» disabled при пустом поле', () => {
    render(<InputArea onSend={() => undefined} isLoading={false} />);
    expect(screen.getByRole('button', { name: 'Отправить' })).toBeDisabled();
  });
});
