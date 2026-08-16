import {readFileSync} from 'node:fs';
import { defineConfig } from 'vitest/config';
import { loadEnv } from 'vite';
import type { Plugin } from 'vite';
import { rolldown } from 'rolldown';
import { fileURLToPath } from 'node:url';

const aliases = {
  '@env': fileURLToPath(new URL('./src/env.ts', import.meta.url)),
  '@pages': fileURLToPath(new URL('./src/pages', import.meta.url)),
  '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
  '@transport': fileURLToPath(new URL('./src/transport', import.meta.url)),
  '@test-support': fileURLToPath(new URL('./src/test-support', import.meta.url)),
  crypto: fileURLToPath(new URL('./src/shims/empty.ts', import.meta.url))
};

const frameScript = (): Plugin => ({
  name: 'frame-script',
  enforce: 'pre',
  async resolveId(source, importer) {
    if (source.endsWith('.ts?frame')) {
      const resolved = await this.resolve(source.slice(0, -'?frame'.length), importer, {skipSelf: true});
      if (resolved !== null) {
        return '\0framejs' + resolved.id + '.js';
      }
    }
  },
  async load(id) {
    if (id.startsWith('\0framejs')) {
      const path = id.slice('\0framejs'.length, -'.js'.length);
      const bundle = await rolldown({input: path, resolve: {alias: aliases}, logLevel: 'silent'});
      const {output} = await bundle.generate({format: 'esm'});
      output[0].moduleIds
        .filter(module => !module.startsWith('\0'))
        .forEach(module => this.addWatchFile(module));
      return `export default ${JSON.stringify(output[0].code)};`;
    }
  }
});

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
      const path = id.slice('\0rawcss'.length, -'.js'.length);
      this.addWatchFile(path);
      return `export default ${JSON.stringify(readFileSync(path, 'utf8'))};`;
    }
  }
});
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

const runtimeEnv = (env: Record<string, string>): Plugin => {
  const body = `window.__env = ${JSON.stringify({
    tradeFeed: env.VITE_APP_TRADE_FEED ?? '',
    tradeProduct: env.VITE_APP_TRADE_PRODUCT ?? '',
    tradeHistory: env.VITE_APP_TRADE_HISTORY ?? '',
    aicDomain: env.VITE_APP_API_AIC ?? '',
    harvardDomain: env.VITE_APP_HARVARD_API ?? '',
    harvardAPIKey: env.VITE_APP_HARVARD_API_KEY ?? '',
    vamDomain: env.VITE_APP_VAM_API ?? ''
  }, null, 2)};\n`;
  let base = '/';
  return {
    name: 'runtime-env',
    configResolved(config) {
      base = config.base;
    },
    transformIndexHtml() {
      return [{tag: 'script', attrs: {src: `${base}env.js`}, injectTo: 'head'}];
    },
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        if (request.url?.split('?')[0].endsWith('/env.js')) {
          response.setHeader('content-type', 'text/javascript');
          response.end(body);
          return;
        }
        next();
      });
    },
    generateBundle() {
      this.emitFile({type: 'asset', fileName: 'env.js', source: body});
    }
  };
};

// https://vitejs.dev/config/
export default defineConfig(({mode}) => ({
  base: '/ChosenPicachu/',
  resolve: {
    alias: aliases
  },
  plugins: [rawCss(), frameScript(), runtimeEnv(loadEnv(mode, process.cwd())), react(), svgr({
    // svgr options: https://react-svgr.com/docs/options/
    svgrOptions: { exportType: 'default', ref: true, svgo: false, titleProp: true },
    include: '**/*.svg',
  })],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./test-setup.ts'],
  }
}));
