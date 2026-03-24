import React, { useState, useEffect } from 'react';
import AuthForm from './components/auth/AuthForm';
import MainApp from './components/MainApp';
import './styles/theme.css';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkTheme ? 'dark' : 'light');
  }, [isDarkTheme]);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  return (
    <>
      {!isAuthenticated ? (
        <AuthForm onSuccess={handleLoginSuccess} />
      ) : (
        <MainApp onThemeChange={setIsDarkTheme} initialTheme={isDarkTheme} />
      )}
    </>
  );
};

export default App;
