import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Sidebar from './Sidebar';
import { useChatStore, defaultAppSettings } from '../../store/useChatStore';

function seedChats() {
  useChatStore.setState({
    chats: [
      {
        id: 'chat-alpha',
        title: 'Alpha проект',
        messages: [],
        createdAt: 1,
        updatedAt: 1,
      },
      {
        id: 'chat-beta',
        title: 'Beta идеи',
        messages: [],
        createdAt: 2,
        updatedAt: 2,
      },
    ],
    activeChatId: 'chat-alpha',
    settings: { ...defaultAppSettings },
    searchQuery: '',
    loadingChatId: null,
    abortController: null,
  });
  localStorage.clear();
}

describe('Sidebar / поиск / удаление', () => {
  beforeEach(() => {
    useChatStore.setState({
      chats: [],
      activeChatId: null,
      settings: { ...defaultAppSettings },
      searchQuery: '',
      loadingChatId: null,
      abortController: null,
    });
    localStorage.clear();
  });

  afterEach(() => {
    useChatStore.setState({
      chats: [],
      activeChatId: null,
      settings: { ...defaultAppSettings },
      searchQuery: '',
      loadingChatId: null,
      abortController: null,
    });
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('поиск фильтрует список по названию', async () => {
    seedChats();
    const user = userEvent.setup();
    render(<Sidebar isOpen />);

    expect(screen.getByText('Alpha проект')).toBeInTheDocument();
    expect(screen.getByText('Beta идеи')).toBeInTheDocument();

    await user.type(screen.getByPlaceholderText('Поиск чатов...'), 'Beta');

    expect(screen.queryByText('Alpha проект')).not.toBeInTheDocument();
    expect(screen.getByText('Beta идеи')).toBeInTheDocument();
  });

  it('при пустом поиске отображаются все чаты', async () => {
    seedChats();
    const user = userEvent.setup();
    render(<Sidebar isOpen />);

    const input = screen.getByPlaceholderText('Поиск чатов...');
    await user.type(input, 'Alpha');
    await user.clear(input);

    expect(screen.getByText('Alpha проект')).toBeInTheDocument();
    expect(screen.getByText('Beta идеи')).toBeInTheDocument();
  });

  it('при нажатии «Удалить» вызывается подтверждение', async () => {
    seedChats();
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);
    const user = userEvent.setup();
    render(<Sidebar isOpen />);

    const row = screen.getByText('Alpha проект').closest('[role="button"]');
    expect(row).toBeTruthy();
    fireEvent.mouseEnter(row!);

    await user.click(screen.getByRole('button', { name: 'Удалить' }));

    expect(confirmSpy).toHaveBeenCalledWith('Удалить этот чат?');
    expect(screen.getByText('Alpha проект')).toBeInTheDocument();

    confirmSpy.mockReturnValue(true);
    fireEvent.mouseEnter(row!);
    await user.click(screen.getByRole('button', { name: 'Удалить' }));

    expect(screen.queryByText('Alpha проект')).not.toBeInTheDocument();
  });
});
