import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';


export default defineConfig({
  base: "/",
  plugins: [react()],
  optimizeDeps: {
    include: ['animejs']
  },
  server: {
    proxy: {
      '/api': 'http://localhost:8080', //puerto del back
    },
  },
});