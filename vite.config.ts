import {readFileSync} from 'node:fs';
import { defineConfig } from 'vitest/config';
import type { Plugin } from 'vite';

const rawCss = (): Plugin => ({
  name: 'raw-css',
  enforce: 'pre',
  async resolveId(source, importer) {
    if (source.endsWith('.css?raw')) {
      const resolved = await this.resolve(source.slice(0, -'?raw'.length), importer, {skipSelf: true});
      if (resolved !== null) {
        return '\0rawcss' + resolved.id + '.js';
      }
    }
  },
  load(id) {
    if (id.startsWith('\0rawcss')) {
      return `export default ${JSON.stringify(readFileSync(id.slice('\0rawcss'.length, -'.js'.length), 'utf8'))};`;
    }
  }
});
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/ChosenPicachu/',
  resolve: {
    alias: {
      '@pages': fileURLToPath(new URL('./src/pages', import.meta.url)),
      '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
      '@transport': fileURLToPath(new URL('./src/transport', import.meta.url)),
      '@test-support': fileURLToPath(new URL('./src/test-support', import.meta.url))
    }
  },
  plugins: [rawCss(), react(), svgr({
    // svgr options: https://react-svgr.com/docs/options/
    svgrOptions: { exportType: 'default', ref: true, svgo: false, titleProp: true },
    include: '**/*.svg',
  })],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./test-setup.ts'],
  }
});
