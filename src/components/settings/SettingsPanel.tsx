import React from 'react';
import Button from '../ui/Button';
import Toggle from '../ui/Toggle';
import Slider from '../ui/Slider';
import styles from './SettingsPanel.module.css';
import { useChatStore } from '../../store/useChatStore';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onThemeChange: (isDark: boolean) => void;
  initialTheme: boolean;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  isOpen,
  onClose,
  onThemeChange,
  initialTheme,
}) => {
  const settings = useChatStore((s) => s.settings);
  const updateSettings = useChatStore((s) => s.updateSettings);
  const resetSettings = useChatStore((s) => s.resetSettings);

  const handleReset = () => {
    resetSettings();
    onThemeChange(false);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Настройки</h2>
          <button type="button" className={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Модель</label>
          <select
            value={settings.model}
            onChange={(e) => updateSettings({ model: e.target.value })}
            className={styles.select}
          >
            <option>GigaChat</option>
            <option>GigaChat-Plus</option>
            <option>GigaChat-Pro</option>
            <option>GigaChat-Max</option>
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>
            Temperature: {settings.temperature.toFixed(1)}
          </label>
          <Slider
            min={0}
            max={2}
            step={0.1}
            value={settings.temperature}
            onChange={(v) => updateSettings({ temperature: v })}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Top-P: {settings.topP.toFixed(2)}</label>
          <Slider
            min={0}
            max={1}
            step={0.05}
            value={settings.topP}
            onChange={(v) => updateSettings({ topP: v })}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Max Tokens</label>
          <input
            type="number"
            value={settings.maxTokens}
            onChange={(e) => updateSettings({ maxTokens: Number(e.target.value) })}
            min={1}
            max={4096}
            className={styles.input}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>System Prompt</label>
          <textarea
            rows={3}
            value={settings.systemPrompt}
            onChange={(e) => updateSettings({ systemPrompt: e.target.value })}
            className={styles.textarea}
          />
        </div>

        <div className={styles.field}>
          <Toggle
            checked={initialTheme}
            onChange={onThemeChange}
            label="Тёмная тема"
          />
        </div>

        <div className={styles.actions}>
          <Button variant="primary" onClick={onClose}>
            Готово
          </Button>
          <Button variant="secondary" onClick={handleReset}>
            Сбросить
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
