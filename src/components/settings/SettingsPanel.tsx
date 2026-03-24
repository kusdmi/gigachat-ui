import React, { useEffect, useState } from 'react';
import Button from '../ui/Button';
import Toggle from '../ui/Toggle';
import Slider from '../ui/Slider';
import styles from './SettingsPanel.module.css';

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
  const [model, setModel] = useState('GigaChat');
  const [temperature, setTemperature] = useState(0.7);
  const [topP, setTopP] = useState(0.9);
  const [maxTokens, setMaxTokens] = useState(2048);
  const [systemPrompt, setSystemPrompt] = useState('Ты полезный ассистент.');
  const [darkTheme, setDarkTheme] = useState(initialTheme);

  useEffect(() => {
    setDarkTheme(initialTheme);
  }, [initialTheme]);

  const handleSave = () => {
    console.log({
      model,
      temperature,
      topP,
      maxTokens,
      systemPrompt,
      darkTheme,
    });
    onClose();
  };

  const handleReset = () => {
    setModel('GigaChat');
    setTemperature(0.7);
    setTopP(0.9);
    setMaxTokens(2048);
    setSystemPrompt('Ты полезный ассистент.');
    setDarkTheme(false);
    onThemeChange(false);
  };

  const handleThemeToggle = (isDark: boolean) => {
    setDarkTheme(isDark);
    onThemeChange(isDark);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Настройки</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Модель</label>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className={styles.select}
          >
            <option>GigaChat</option>
            <option>GigaChat-Plus</option>
            <option>GigaChat-Pro</option>
            <option>GigaChat-Max</option>
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Temperature: {temperature.toFixed(1)}</label>
          <Slider min={0} max={2} step={0.1} value={temperature} onChange={setTemperature} />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Top-P: {topP.toFixed(2)}</label>
          <Slider min={0} max={1} step={0.05} value={topP} onChange={setTopP} />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Max Tokens</label>
          <input
            type="number"
            value={maxTokens}
            onChange={(e) => setMaxTokens(Number(e.target.value))}
            min={1}
            max={4096}
            className={styles.input}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>System Prompt</label>
          <textarea
            rows={3}
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            className={styles.textarea}
          />
        </div>

        <div className={styles.field}>
          <Toggle checked={darkTheme} onChange={handleThemeToggle} label="Тёмная тема" />
        </div>

        <div className={styles.actions}>
          <Button variant="primary" onClick={handleSave}>
            Сохранить
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
