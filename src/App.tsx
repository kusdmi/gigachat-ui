import React, { lazy, Suspense, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthForm from './components/auth/AuthForm';
import RootRedirect from './routes/RootRedirect';
import './styles/theme.css';

const MainApp = lazy(() => import('./components/MainApp'));

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
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<RootRedirect />} />
            <Route
              path="/chat/:chatId"
              element={
                <Suspense
                  fallback={<div aria-busy="true">Загрузка приложения…</div>}
                >
                  <MainApp
                    onThemeChange={setIsDarkTheme}
                    initialTheme={isDarkTheme}
                  />
                </Suspense>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      )}
    </>
  );
};

export default App;
