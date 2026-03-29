import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/gigachat-api': {
        target: 'https://gigachat.devices.sberbank.ru',
        changeOrigin: true,
        secure: false, 
        rewrite: (path) => path.replace(/^\/gigachat-api/, ''),
      },
      '/gigachat-oauth': {
        target: 'https://ngw.devices.sberbank.ru:9443',
        changeOrigin: true,
        secure: false,   
        rewrite: (path) => path.replace(/^\/gigachat-oauth/, ''),
      },
    },
  },
});