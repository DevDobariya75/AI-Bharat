import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/__proxy/alzheimer-predictor': {
        target: 'https://51v3g9h9g5.execute-api.ap-south-1.amazonaws.com',
        changeOrigin: true,
        secure: true,
        rewrite: () => '/prod/alzheimer-predictor'
      }
    }
  },
  define: {
    global: 'globalThis'
  }
});