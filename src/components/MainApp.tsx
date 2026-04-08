import React, { Suspense, lazy, useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ChatWindow from './chat/ChatWindow';
import Button from './ui/Button';
import styles from './MainApp.module.css';
import { ensureChatExists, useChatStore } from '../store/useChatStore';

const Sidebar = lazy(() => import('./sidebar/Sidebar'));
const SettingsPanel = lazy(() => import('./settings/SettingsPanel'));

interface MainAppProps {
  onThemeChange: (isDark: boolean) => void;
  initialTheme: boolean;
}

const MainApp: React.FC<MainAppProps> = ({ onThemeChange, initialTheme }) => {
  const { chatId } = useParams<{ chatId: string }>();
  const navigate = useNavigate();
  const selectChat = useChatStore((s) => s.selectChat);
  const activeChatId = useChatStore((s) => s.activeChatId);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const closeSidebar = useCallback(() => setIsSidebarOpen(false), []);
  const openSettings = useCallback(() => setIsSettingsOpen(true), []);

  useEffect(() => {
    ensureChatExists();
  }, []);

  useEffect(() => {
    if (!chatId) return;
    const { chats } = useChatStore.getState();
    const exists = chats.some((c) => c.id === chatId);
    if (exists) {
      selectChat(chatId);
    } else {
      const fallback = useChatStore.getState().activeChatId;
      if (fallback) navigate(`/chat/${fallback}`, { replace: true });
    }
  }, [chatId, navigate, selectChat]);

  useEffect(() => {
    if (!activeChatId || !chatId) return;
    if (activeChatId !== chatId) {
      navigate(`/chat/${activeChatId}`, { replace: true });
    }
  }, [activeChatId, chatId, navigate]);

  return (
    <div className={styles.app}>
      <div className={styles.topBar}>
        <button
          type="button"
          className={styles.burger}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          ☰
        </button>
        <Button
          variant="secondary"
          size="md"
          onClick={openSettings}
          className={styles.settingsButton}
        >
          ⚙️ Настройки
        </Button>
      </div>

      {isSidebarOpen && <div className={styles.overlay} onClick={closeSidebar} />}

      <div className={styles.body}>
        <Suspense
          fallback={<div className={styles.lazyFallback}>Загрузка боковой панели…</div>}
        >
          <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
        </Suspense>

        <div className={styles.main}>
          <ChatWindow onOpenSettings={openSettings} />
        </div>
      </div>

      {isSettingsOpen ? (
        <Suspense
          fallback={
            <div className={styles.lazyFallback}>Загрузка настроек…</div>
          }
        >
          <SettingsPanel
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
            onThemeChange={onThemeChange}
            initialTheme={initialTheme}
          />
        </Suspense>
      ) : null}
    </div>
  );
};

export default MainApp;
