import React, { useState } from 'react';
import Button from '../ui/Button';
import ErrorMessage from '../ui/ErrorMessage';
import styles from './AuthForm.module.css';

interface AuthFormProps {
  onSuccess: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onSuccess }) => {
  const [credentials, setCredentials] = useState('');
  const [scope, setScope] = useState<'GIGACHAT_API_PERS' | 'GIGACHAT_API_B2B' | 'GIGACHAT_API_CORP'>('GIGACHAT_API_PERS');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!credentials.trim()) {
      setError('Поле не может быть пустым');
      return;
    }
    setError('');
    onSuccess();
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2 className={styles.title}>Авторизация GigaChat</h2>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="credentials">Credentials (Base64)</label>
          <input
            id="credentials"
            type="password"
            value={credentials}
            onChange={(e) => setCredentials(e.target.value)}
            placeholder="Введите Base64 строку"
            className={styles.input}
          />
        </div>

        <div className={styles.field}>
          <span className={styles.label}>Scope</span>
          <div className={styles.radioGroup}>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                value="GIGACHAT_API_PERS"
                checked={scope === 'GIGACHAT_API_PERS'}
                onChange={() => setScope('GIGACHAT_API_PERS')}
              />
              GIGACHAT_API_PERS
            </label>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                value="GIGACHAT_API_B2B"
                checked={scope === 'GIGACHAT_API_B2B'}
                onChange={() => setScope('GIGACHAT_API_B2B')}
              />
              GIGACHAT_API_B2B
            </label>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                value="GIGACHAT_API_CORP"
                checked={scope === 'GIGACHAT_API_CORP'}
                onChange={() => setScope('GIGACHAT_API_CORP')}
              />
              GIGACHAT_API_CORP
            </label>
          </div>
        </div>

        {error && <ErrorMessage message={error} />}

        <Button type="submit" variant="primary" fullWidth>
          Войти
        </Button>
      </form>
    </div>
  );
};

export default AuthForm;