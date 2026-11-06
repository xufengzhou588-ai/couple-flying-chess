import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  root: 'prototypes/date-night',
  base: process.env.VITE_INTEGRATED_PREVIEW === 'true' ? '/games/' : './',
  plugins: [react()],
  css: { postcss: { plugins: [] } },
  server: { host: '127.0.0.1', port: 5180, strictPort: true },
  build: { outDir: '../../build/date-night-prototype', emptyOutDir: true },
});
