import React, { useState, useEffect } from 'react';
import AuthForm from './components/auth/AuthForm';
import MainApp from './components/MainApp';
import './styles/theme.css';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  useEffect(() => {
    if (isDarkTheme) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDarkTheme]);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  return (
    <>
      {!isAuthenticated ? (
        <AuthForm onSuccess={handleLoginSuccess} />
      ) : (
        <MainApp 
          onThemeChange={setIsDarkTheme} 
          initialTheme={isDarkTheme} 
        />
      )}
    </>
  );
};

export default App;