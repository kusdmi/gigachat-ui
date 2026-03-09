import React, { useState } from 'react';
import Sidebar from './sidebar/Sidebar';
import ChatWindow from './chat/ChatWindow';
import SettingsPanel from './settings/SettingsPanel';
import Button from './ui/Button';
import styles from './MainApp.module.css';

interface MainAppProps {
  onThemeChange: (isDark: boolean) => void;
  initialTheme: boolean;
}

const MainApp: React.FC<MainAppProps> = ({ onThemeChange, initialTheme }) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className={styles.app}>
      {/* Верхняя панель с кнопками (видна только на мобильных) */}
      <div className={styles.topBar}>
        <button
          className={styles.burger}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          ☰
        </button>
        <Button
          variant="secondary"
          size="md"
          onClick={() => setIsSettingsOpen(true)}
          className={styles.settingsButton}
        >
          ⚙️ Настройки
        </Button>
      </div>

      {/* Оверлей для мобильной боковой панели */}
      {isSidebarOpen && <div className={styles.overlay} onClick={closeSidebar} />}

      <Sidebar isOpen={isSidebarOpen} />

      <div className={styles.main}>
        <ChatWindow onOpenSettings={() => setIsSettingsOpen(true)} />
      </div>

      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onThemeChange={onThemeChange}
        initialTheme={initialTheme}
      />
    </div>
  );
};

export default MainApp;