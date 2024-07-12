import { defineConfig } from 'vite';
import { createProxy } from 'vite-plugin-proxy';

export default defineConfig({
  plugins: [
    createProxy({
      // Proxy options
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    }),
  ],
});