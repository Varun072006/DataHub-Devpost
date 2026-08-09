import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 5179,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true
      }
    }
  }
});
