import {mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {execSync} from 'node:child_process';
import {relative} from 'node:path';
import {defineConfig} from 'vitest/config';
import type {Plugin} from 'vite';
import {loadEnv} from 'vite';
import {rolldown} from 'rolldown';
import {fileURLToPath} from 'node:url';
import {usersServerScript} from './src/components/Users/resource/usersServer.ts';
import {practiceDrawings, squeezed} from './src/pages/Practice/practiceDrawings.ts';
import {browserslistToTargets, transform} from 'lightningcss';
import browserslist from 'browserslist';
import react from '@vitejs/plugin-react';
import {reactRouter} from '@react-router/dev/vite';
import svgr from 'vite-plugin-svgr';
import {has} from '@ryandur/sand';

const aliases = {
  '@env': fileURLToPath(new URL('./src/env.ts', import.meta.url)),
  '@pages': fileURLToPath(new URL('./src/pages', import.meta.url)),
  '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
  '@transport': fileURLToPath(new URL('./src/transport', import.meta.url)),
  '@__test_support': fileURLToPath(new URL('./src/__test_support', import.meta.url))
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
      // the frame is bundled outside Vite, which is what fills in import.meta.env, and it runs only in the browser
      const bundle = await rolldown({input: path, resolve: {alias: aliases}, transform: {define: {'import.meta.env.SSR': 'false'}}, logLevel: 'silent'});
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

const builtCommit = (): string => {
  try {
    return process.env.GITHUB_SHA ?? execSync('git rev-parse HEAD', {encoding: 'utf8'}).trim();
  } catch {
    return 'main';
  }
};

const sample = (): Plugin => {
  const commit = builtCommit();
  let root = process.cwd();
  return {
    name: 'sample',
    enforce: 'pre',
    configResolved(config) {
      root = config.root;
    },
    async resolveId(source, importer) {
      if (source.endsWith('?sample')) {
        const resolved = await this.resolve(source.slice(0, -'?sample'.length), importer, {skipSelf: true});
        if (resolved !== null) {
          return '\0sample' + resolved.id + '.js';
        }
      }
    },
    load(id) {
      if (id.startsWith('\0sample')) {
        const file = id.slice('\0sample'.length, -'.js'.length);
        this.addWatchFile(file);
        const path = relative(root, file);
        return `export default ${JSON.stringify({
          text: readFileSync(file, 'utf8'),
          path,
          url: `https://github.com/RyanDur/ChosenPicachu/blob/${commit}/${path}`
        })};`;
      }
    }
  };
};

const frameCss = (): Plugin => ({
  name: 'frame-css',
  enforce: 'pre',
  async resolveId(source, importer) {
    if (source.endsWith('.css?frame')) {
      const resolved = await this.resolve(source.slice(0, -'?frame'.length), importer, {skipSelf: true});
      if (resolved !== null) {
        return '\0framecss' + resolved.id + '.js';
      }
    }
  },
  load(id) {
    if (id.startsWith('\0framecss')) {
      const path = id.slice('\0framecss'.length, -'.js'.length);
      this.addWatchFile(path);
      const {code} = transform({filename: path, code: readFileSync(path), targets: browserslistToTargets(browserslist())});
      return `export default ${JSON.stringify(code.toString())};`;
    }
  }
});

// a drawing loaded as an image cannot read the page's style sheets, so its frames are written as files carrying the site's own
const drawings = (): Plugin => {
  const at = (path: string): string => fileURLToPath(new URL(path, import.meta.url));
  const siteSheets = ['./src/styles/reset.css', './src/styles/colors.css', './src/styles/spacing.css', './src/styles/typography.css',
    './src/styles/drawing.css'].map(at);
  const drawn = Object.entries(practiceDrawings).map(([name, {sheet, frames}]) => ({name, sheet: at(`./${sheet}`), frames}));
  const sheets = [...siteSheets, ...drawn.map(({sheet}) => sheet)];
  const folder = at('./src/pages/Practice/drawings/');
  const draw = (): void => {
    mkdirSync(folder, {recursive: true});
    drawn.forEach(({name, sheet, frames}) => {
      const {wide, stacked} = frames(squeezed([...siteSheets, sheet].map(read => readFileSync(read, 'utf8')).join('')));
      writeFileSync(`${folder}${name}-wide.svg`, wide.svg);
      writeFileSync(`${folder}${name}-stacked.svg`, stacked.svg);
    });
  };
  return {
    name: 'drawings',
    buildStart: draw,
    configureServer(server) {
      server.watcher.add(sheets);
      server.watcher.on('change', changed => {
        if (sheets.includes(changed)) draw();
      });
    }
  };
};

const usersServerPlugin = (): Plugin => {
  const worker = fileURLToPath(new URL('./backend/users/worker.ts', import.meta.url));
  const script = usersServerScript;
  const built = async (): Promise<string> => {
    const bundle = await rolldown({input: worker, resolve: {alias: aliases}, logLevel: 'silent'});
    const {output} = await bundle.generate({format: 'iife'});
    return output[0].code;
  };
  return {
    name: 'users-server',
    configureServer(server) {
      server.middlewares.use(async (request, response, next) => {
        if ((request.url ?? '').split('?')[0].endsWith(`/${script}`)) {
          response.setHeader('content-type', 'text/javascript');
          response.end(await built());
          return;
        }
        next();
      });
    },
    async generateBundle() {
      if (this.environment.name === 'client') this.emitFile({type: 'asset', fileName: script, source: await built()});
    }
  };
};

const runtimeEnv = (env: Record<string, string>): Plugin => {
  const values = {
    tradeFeed: env.VITE_APP_TRADE_FEED ?? '',
    tradeProduct: env.VITE_APP_TRADE_PRODUCT ?? '',
    tradeHistory: env.VITE_APP_TRADE_HISTORY ?? '',
    aicDomain: env.VITE_APP_API_AIC ?? '',
    aicPictures: env.VITE_APP_AIC_PICTURES ?? '',
    harvardDomain: env.VITE_APP_HARVARD_API ?? '',
    harvardAPIKey: env.VITE_APP_HARVARD_API_KEY ?? '',
    vamDomain: env.VITE_APP_VAM_API ?? '',
    vamPictures: env.VITE_APP_VAM_PICTURES ?? '',
    clevelandDomain: env.VITE_APP_CLEVELAND_API ?? '',
    usersDomain: env.VITE_APP_USERS_API ?? '',
    feedbackToken: env.VITE_APP_FEEDBACK_TOKEN ?? '',
    feedbackEndpoint: env.VITE_APP_FEEDBACK_ENDPOINT ?? 'https://api.github.com/graphql'
  };
  const body = `window.__env = ${JSON.stringify(values, null, 2)};\n`;
  return {
    name: 'runtime-env',
    config: () => ({define: {__BUILT_ENV__: JSON.stringify(values)}}),
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        if ((request.url ?? '').split('?')[0].endsWith('/env.js')) {
          response.setHeader('content-type', 'text/javascript');
          response.end(body);
          return;
        }
        next();
      });
    },
    generateBundle() {
      if (this.environment.name === 'client') this.emitFile({type: 'asset', fileName: 'env.js', source: body});
    }
  };
};

// https://vitejs.dev/config/
export default defineConfig(({mode}) => ({
  base: '/ChosenPicachu/',
  resolve: {
    alias: aliases
  },
  build: {
    cssCodeSplit: false
  },
  plugins: [drawings(), rawCss(), sample(), frameCss(), frameScript(), usersServerPlugin(), runtimeEnv(loadEnv(mode, process.cwd())), has(process.env.VITEST) ? react() : reactRouter(), svgr({
    // svgr options: https://react-svgr.com/docs/options/
    svgrOptions: {exportType: 'default', ref: true, svgo: false, titleProp: true},
    include: '**/*.svg'
  })],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./test-setup.ts'],
    slowTestThreshold: 200
  }
}));
