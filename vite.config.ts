/// <reference types="vitest/config" />
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

function src(subpath: string) {
  return fileURLToPath(new URL(`./src/${subpath}`, import.meta.url));
}

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@api': src('api'),
      '@components': src('components'),
      '@context': src('context'),
      '@mutations': src('mutations'),
      '@pages': src('pages'),
      '@queries': src('queries'),
      '@routes': src('routes'),
      '@store': src('store'),
      '@test': src('test'),
      '@apptypes': src('types'),
      '@utils': src('utils'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    css: true,
  },
});
