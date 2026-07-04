/// <reference types="vitest/config" />
import path from 'node:path';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';

const dirname = fileURLToPath(new URL('.', import.meta.url));

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
      // The "storybook" project runs every story in a real headless Chromium
      // instance (via Playwright), which is CPU-heavy. Running it concurrently
      // with the jsdom "unit" project starves the event loop enough to cause
      // sporadic timeouts in unrelated async tests (e.g. React Query retries),
      // so file execution across projects is serialized instead of parallelized.
      fileParallelism: false,
      projects: [
        {
          extends: true,
          test: {
            name: 'unit',
            environment: 'jsdom',
            globals: true,
            setupFiles: ['./src/test/setup.ts'],
            css: true,
          },
        },
        {
          extends: true,
          plugins: [
            storybookTest({ configDir: path.join(dirname, '.storybook') }),
          ],
          test: {
            name: 'storybook',
            browser: {
              enabled: true,
              headless: true,
              provider: playwright({}),
              instances: [{ browser: 'chromium' }],
            },
          },
        },
      ],
    },
  };
});
