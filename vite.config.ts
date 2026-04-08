import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

const analyze = process.env.ANALYZE === '1' || process.env.ANALYZE === 'true';

/** Для GitHub Pages (репозиторий `https://user.github.io/REPO/`): задайте при сборке, например `GITHUB_PAGES_BASE=/gigachat-ui/` */
const ghBase = process.env.GITHUB_PAGES_BASE?.trim();
const base =
  ghBase && ghBase !== '/'
    ? ghBase.endsWith('/')
      ? ghBase
      : `${ghBase}/`
    : '/';

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [
    react(),
    analyze
      ? visualizer({
          filename: 'dist/stats.html',
          gzipSize: true,
          open: false,
        })
      : null,
  ].filter(Boolean),
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          if (
            id.includes('react-markdown') ||
            id.includes('remark') ||
            id.includes('rehype') ||
            id.includes('highlight.js') ||
            id.includes('mdast') ||
            id.includes('micromark') ||
            id.includes('unist') ||
            id.includes('hast') ||
            id.includes('property-information')
          ) {
            return 'markdown-highlight';
          }
          if (id.includes('react-dom') || id.includes('/react/')) {
            return 'react-vendor';
          }
          if (id.includes('zustand')) {
            return 'zustand';
          }
        },
      },
    },
  },
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
        /** /gigachat-oauth/api/v2/oauth → https://ngw.../api/v2/oauth */
        rewrite: (path) => path.replace(/^\/gigachat-oauth/, ''),
      },
    },
  },
  /** Как dev: прокси к API Сбера, иначе `npm run preview` даёт CORS / Failed to fetch. */
  preview: {
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
