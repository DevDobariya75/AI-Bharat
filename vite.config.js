import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/', // S3 static hosting root
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          aws: ['amazon-cognito-identity-js', 'axios']
        }
      }
    }
  },
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      '/__proxy/alzheimer-predictor': {
        target: 'https://51v3g9h9g5.execute-api.ap-south-1.amazonaws.com',
        changeOrigin: true,
        secure: true,
        rewrite: () => '/prod/alzheimer-predictor'
      },
      '/api': {
        target: 'https://51v3g9h9g5.execute-api.ap-south-1.amazonaws.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, '/prod')
      }
    }
  },
  define: {
    global: 'globalThis'
  }
});