import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/gigachat-api': {
        target: 'https://gigachat.devices.sberbank.ru',
        changeOrigin: true,
        // В dev при ошибке «self-signed certificate in certificate chain» (корп. прокси / цепочка TLS)
        secure: false,
        // Иначе запрос уйдёт на .../gigachat-api/api/v1/... → 404
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
