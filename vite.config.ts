/// <reference types="vitest/config" />
import { fileURLToPath, URL } from 'node:url';
import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

function src(subpath: string) {
  return fileURLToPath(new URL(`./src/${subpath}`, import.meta.url));
}

function cspConnectSrcPlugin(apiBaseUrl: string): Plugin {
  let apiOrigin = '';
  try {
    apiOrigin = apiBaseUrl ? new URL(apiBaseUrl).origin : '';
  } catch {
    apiOrigin = '';
  }
  const connectSrc = apiOrigin ? `'self' ${apiOrigin}` : `'self'`;

  return {
    name: 'csp-connect-src',
    transformIndexHtml(html) {
      return html.replace("connect-src 'self';", `connect-src ${connectSrc};`);
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react(), tailwindcss(), cspConnectSrcPlugin(env.VITE_API_BASE_URL)],
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
  };
});
