import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  preview: {
    port: 4173,
    strictPort: false,
    open: true,
  },
  server: {
    port: 5173,
    strictPort: false,
    open: true,
  },
});
